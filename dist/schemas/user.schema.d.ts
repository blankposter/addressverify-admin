import { Document } from 'mongoose';
export declare class User extends Document {
    email: string;
    password?: string;
    stripe_id: string;
    active_subs: string[];
    default_payment_method?: string;
    payment_methods?: string[];
    apiKey: string;
    last_login: Date;
    role: string;
    status: string;
    provider: string;
    emailVerified: boolean;
    hasSeenWelcome: boolean;
    limitation: number;
    budgetAlert: number;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
