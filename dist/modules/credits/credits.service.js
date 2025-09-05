"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const credit_transaction_schema_1 = require("../../schemas/credit-transaction.schema");
let CreditsService = class CreditsService {
    userModel;
    transactionModel;
    constructor(userModel, transactionModel) {
        this.userModel = userModel;
        this.transactionModel = transactionModel;
    }
    async getCreditStats() {
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
    async getTransactions(page = 1, limit = 10, userId, type) {
        const skip = (page - 1) * limit;
        const query = {};
        if (userId)
            query.userId = userId;
        if (type)
            query.type = type;
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
    async addCredits(operation) {
        const session = await this.userModel.db.startSession();
        session.startTransaction();
        try {
            const user = await this.userModel.findById(operation.userId).session(session);
            if (!user) {
                throw new Error('User not found');
            }
            const balanceBefore = user.limitation || 0;
            const balanceAfter = balanceBefore + operation.amount;
            await this.userModel.updateOne({ _id: operation.userId }, { limitation: balanceAfter }).session(session);
            const transaction = new this.transactionModel({
                userId: operation.userId,
                userEmail: user.email,
                type: operation.type,
                amount: operation.amount,
                balanceBefore,
                balanceAfter,
                status: credit_transaction_schema_1.TransactionStatus.COMPLETED,
                description: operation.description,
                reference: operation.reference,
                adminId: operation.adminId,
                adminUsername: operation.adminUsername,
                notes: operation.notes,
            });
            await transaction.save({ session });
            await session.commitTransaction();
            return { success: true, transaction };
        }
        catch (error) {
            await session.abortTransaction();
            return { success: false, error: error.message };
        }
        finally {
            session.endSession();
        }
    }
    async deductCredits(operation) {
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
            await this.userModel.updateOne({ _id: operation.userId }, { limitation: balanceAfter }).session(session);
            const transaction = new this.transactionModel({
                userId: operation.userId,
                userEmail: user.email,
                type: operation.type,
                amount: operation.amount,
                balanceBefore,
                balanceAfter,
                status: credit_transaction_schema_1.TransactionStatus.COMPLETED,
                description: operation.description,
                reference: operation.reference,
                adminId: operation.adminId,
                adminUsername: operation.adminUsername,
                notes: operation.notes,
            });
            await transaction.save({ session });
            await session.commitTransaction();
            return { success: true, transaction };
        }
        catch (error) {
            await session.abortTransaction();
            return { success: false, error: error.message };
        }
        finally {
            session.endSession();
        }
    }
    async getUserCreditHistory(userId, page = 1, limit = 10) {
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
    async bulkAddCredits(operations) {
        let completed = 0;
        let failed = 0;
        const errors = [];
        for (const userId of operations.userIds) {
            const result = await this.addCredits({
                userId,
                amount: operations.amount,
                type: credit_transaction_schema_1.TransactionType.ADD,
                description: operations.description,
                adminId: operations.adminId,
                adminUsername: operations.adminUsername,
                notes: operations.notes,
            });
            if (result.success) {
                completed++;
            }
            else {
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
};
exports.CreditsService = CreditsService;
exports.CreditsService = CreditsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __param(1, (0, mongoose_1.InjectModel)('CreditTransaction')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CreditsService);
//# sourceMappingURL=credits.service.js.map