import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { Subscription } from '../../schemas/subscription.schema';
export interface UserWithSubscriptions {
    _id: string;
    email: string;
    stripe_id: string;
    role: string;
    status: string;
    provider: string;
    emailVerified: boolean;
    last_login: Date;
    limitation: number;
    budgetAlert: number;
    createdAt: Date;
    subscriptions: Subscription[];
    totalSpent: number;
    activeSubsCount: number;
}
export declare class UsersService {
    private userModel;
    private subscriptionModel;
    constructor(userModel: Model<User>, subscriptionModel: Model<Subscription>);
    getAllUsers(page?: number, limit?: number, search?: string): Promise<{
        users: UserWithSubscriptions[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getUserById(id: string): Promise<UserWithSubscriptions | null>;
    updateUserStatus(id: string, status: string): Promise<boolean>;
    updateUserLimitation(id: string, limitation: number): Promise<boolean>;
    getSubscriptionStats(): Promise<{
        totalSubscriptions: number;
        activeSubscriptions: number;
        canceledSubscriptions: number;
        totalUsers: number;
        totalRevenue: number;
    }>;
}
