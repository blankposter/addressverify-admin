import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { CreditTransaction, TransactionType } from '../../schemas/credit-transaction.schema';
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
export declare class CreditsService {
    private userModel;
    private transactionModel;
    constructor(userModel: Model<User>, transactionModel: Model<CreditTransaction>);
    getCreditStats(): Promise<{
        totalCreditsIssued: number;
        totalCreditsUsed: number;
        totalActiveBalance: number;
        totalTransactions: number;
        recentTransactions: CreditTransaction[];
    }>;
    getTransactions(page?: number, limit?: number, userId?: string, type?: TransactionType): Promise<{
        transactions: CreditTransaction[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    addCredits(operation: CreditOperationDto): Promise<{
        success: boolean;
        transaction?: CreditTransaction;
        error?: string;
    }>;
    deductCredits(operation: CreditOperationDto): Promise<{
        success: boolean;
        transaction?: CreditTransaction;
        error?: string;
    }>;
    getUserCreditHistory(userId: string, page?: number, limit?: number): Promise<{
        transactions: CreditTransaction[];
        total: number;
        page: number;
        totalPages: number;
        currentBalance: number;
    }>;
    bulkAddCredits(operations: {
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
    }>;
}
