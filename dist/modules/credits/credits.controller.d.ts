import { CreditsService } from './credits.service';
import { TransactionType } from '../../schemas/credit-transaction.schema';
export declare class CreditsController {
    private creditsService;
    constructor(creditsService: CreditsService);
    getStats(): Promise<{
        totalCreditsIssued: number;
        totalCreditsUsed: number;
        totalActiveBalance: number;
        totalTransactions: number;
        recentTransactions: import("../../schemas/credit-transaction.schema").CreditTransaction[];
    }>;
    getTransactions(page?: string, limit?: string, userId?: string, type?: TransactionType): Promise<{
        transactions: import("../../schemas/credit-transaction.schema").CreditTransaction[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getUserCreditHistory(userId: string, page?: string, limit?: string): Promise<{
        transactions: import("../../schemas/credit-transaction.schema").CreditTransaction[];
        total: number;
        page: number;
        totalPages: number;
        currentBalance: number;
    }>;
    addCredits(body: any, req: any): Promise<{
        success: boolean;
        transaction?: import("../../schemas/credit-transaction.schema").CreditTransaction;
        error?: string;
    }>;
    deductCredits(body: any, req: any): Promise<{
        success: boolean;
        transaction?: import("../../schemas/credit-transaction.schema").CreditTransaction;
        error?: string;
    }>;
    refundCredits(body: any, req: any): Promise<{
        success: boolean;
        transaction?: import("../../schemas/credit-transaction.schema").CreditTransaction;
        error?: string;
    }>;
    bonusCredits(body: any, req: any): Promise<{
        success: boolean;
        transaction?: import("../../schemas/credit-transaction.schema").CreditTransaction;
        error?: string;
    }>;
    bulkAddCredits(body: any, req: any): Promise<{
        success: boolean;
        completed: number;
        failed: number;
        errors: string[];
    }>;
}
