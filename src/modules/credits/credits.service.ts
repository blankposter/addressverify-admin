import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { CreditTransaction, TransactionType, TransactionStatus } from '../../schemas/credit-transaction.schema';

export interface CreditOperationDto {
  userId: string;
  amount: number;
  type: TransactionType;
  description: string;
  adminId: string;
  adminUsername: string;
  notes?: string;
  reference?: string;
}

@Injectable()
export class CreditsService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('CreditTransaction') private transactionModel: Model<CreditTransaction>,
  ) {}

  async getCreditStats(): Promise<{
    totalCreditsIssued: number;
    totalCreditsUsed: number;
    totalActiveBalance: number;
    totalTransactions: number;
    recentTransactions: CreditTransaction[];
  }> {
    const [transactions, users] = await Promise.all([
      this.transactionModel.find().sort({ createdAt: -1 }).lean(),
      this.userModel.find().lean(),
    ]);

    const totalCreditsIssued = transactions
      .filter(t => ['add', 'refund', 'bonus'].includes(t.type))
      .reduce((sum, t) => sum + t.amount, 0);

    const totalCreditsUsed = transactions
      .filter(t => t.type === 'deduct')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalActiveBalance = users.reduce((sum, u) => sum + (u.limitation || 0), 0);

    const recentTransactions = transactions.slice(0, 10);

    return {
      totalCreditsIssued,
      totalCreditsUsed,
      totalActiveBalance,
      totalTransactions: transactions.length,
      recentTransactions,
    };
  }

  async getTransactions(
    page = 1,
    limit = 10,
    userId?: string,
    type?: TransactionType
  ): Promise<{
    transactions: CreditTransaction[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (userId) query.userId = userId;
    if (type) query.type = type;

    const [transactions, total] = await Promise.all([
      this.transactionModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.transactionModel.countDocuments(query),
    ]);

    return {
      transactions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async addCredits(operation: CreditOperationDto): Promise<{
    success: boolean;
    transaction?: CreditTransaction;
    error?: string;
  }> {
    const session = await this.userModel.db.startSession();
    session.startTransaction();

    try {
      const user = await this.userModel.findById(operation.userId).session(session);
      if (!user) {
        throw new Error('User not found');
      }

      const balanceBefore = user.limitation || 0;
      const balanceAfter = balanceBefore + operation.amount;

      // Update user balance
      await this.userModel.updateOne(
        { _id: operation.userId },
        { limitation: balanceAfter }
      ).session(session);

      // Create transaction record
      const transaction = new this.transactionModel({
        userId: operation.userId,
        userEmail: user.email,
        type: operation.type,
        amount: operation.amount,
        balanceBefore,
        balanceAfter,
        status: TransactionStatus.COMPLETED,
        description: operation.description,
        reference: operation.reference,
        adminId: operation.adminId,
        adminUsername: operation.adminUsername,
        notes: operation.notes,
      });

      await transaction.save({ session });
      await session.commitTransaction();

      return { success: true, transaction };
    } catch (error) {
      await session.abortTransaction();
      return { success: false, error: error.message };
    } finally {
      session.endSession();
    }
  }

  async deductCredits(operation: CreditOperationDto): Promise<{
    success: boolean;
    transaction?: CreditTransaction;
    error?: string;
  }> {
    const session = await this.userModel.db.startSession();
    session.startTransaction();

    try {
      const user = await this.userModel.findById(operation.userId).session(session);
      if (!user) {
        throw new Error('User not found');
      }

      const balanceBefore = user.limitation || 0;
      
      if (balanceBefore < operation.amount) {
        throw new Error('Insufficient credits');
      }

      const balanceAfter = balanceBefore - operation.amount;

      // Update user balance
      await this.userModel.updateOne(
        { _id: operation.userId },
        { limitation: balanceAfter }
      ).session(session);

      // Create transaction record
      const transaction = new this.transactionModel({
        userId: operation.userId,
        userEmail: user.email,
        type: operation.type,
        amount: operation.amount,
        balanceBefore,
        balanceAfter,
        status: TransactionStatus.COMPLETED,
        description: operation.description,
        reference: operation.reference,
        adminId: operation.adminId,
        adminUsername: operation.adminUsername,
        notes: operation.notes,
      });

      await transaction.save({ session });
      await session.commitTransaction();

      return { success: true, transaction };
    } catch (error) {
      await session.abortTransaction();
      return { success: false, error: error.message };
    } finally {
      session.endSession();
    }
  }

  async getUserCreditHistory(userId: string, page = 1, limit = 10): Promise<{
    transactions: CreditTransaction[];
    total: number;
    page: number;
    totalPages: number;
    currentBalance: number;
  }> {
    const skip = (page - 1) * limit;

    const [transactions, total, user] = await Promise.all([
      this.transactionModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.transactionModel.countDocuments({ userId }),
      this.userModel.findById(userId).lean(),
    ]);

    return {
      transactions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      currentBalance: user?.limitation || 0,
    };
  }

  async bulkAddCredits(operations: {
    userIds: string[];
    amount: number;
    description: string;
    adminId: string;
    adminUsername: string;
    notes?: string;
  }): Promise<{
    success: boolean;
    completed: number;
    failed: number;
    errors: string[];
  }> {
    let completed = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const userId of operations.userIds) {
      const result = await this.addCredits({
        userId,
        amount: operations.amount,
        type: TransactionType.ADD,
        description: operations.description,
        adminId: operations.adminId,
        adminUsername: operations.adminUsername,
        notes: operations.notes,
      });

      if (result.success) {
        completed++;
      } else {
        failed++;
        errors.push(`User ${userId}: ${result.error}`);
      }
    }

    return {
      success: failed === 0,
      completed,
      failed,
      errors,
    };
  }
}