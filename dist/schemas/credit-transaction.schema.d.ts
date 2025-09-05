import { Document } from 'mongoose';
export declare enum TransactionType {
    ADD = "add",
    DEDUCT = "deduct",
    REFUND = "refund",
    BONUS = "bonus",
    ADJUSTMENT = "adjustment"
}
export declare enum TransactionStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    REVERSED = "reversed"
}
export declare class CreditTransaction extends Document {
    userId: string;
    userEmail: string;
    type: TransactionType;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    status: TransactionStatus;
    description: string;
    reference?: string;
    adminId: string;
    adminUsername: string;
    notes?: string;
}
export declare const CreditTransactionSchema: import("mongoose").Schema<CreditTransaction, import("mongoose").Model<CreditTransaction, any, any, any, Document<unknown, any, CreditTransaction, any, {}> & CreditTransaction & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CreditTransaction, Document<unknown, {}, import("mongoose").FlatRecord<CreditTransaction>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<CreditTransaction> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
