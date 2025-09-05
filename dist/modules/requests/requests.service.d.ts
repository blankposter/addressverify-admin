import { Model } from 'mongoose';
import { Request } from '../../schemas/request.schema';
import { User } from '../../schemas/user.schema';
export interface RequestWithUser {
    _id: string;
    endpoint: string;
    user_id: string;
    stripe_user_id: string;
    ip: string;
    user_agent: string;
    response_time: number;
    status_code: number;
    subscription_id: string;
    cost: number;
    response_data?: string;
    input_data?: string;
    date: Date;
    createdAt: Date;
    userEmail?: string;
}
export declare class RequestsService {
    private requestModel;
    private userModel;
    constructor(requestModel: Model<Request>, userModel: Model<User>);
    getRequestStats(): Promise<{
        totalRequests: number;
        failedRequests: number;
        successRate: number;
        averageResponseTime: number;
        totalCost: number;
        requestsByStatus: {
            [key: string]: number;
        };
        recentFailures: RequestWithUser[];
    }>;
    getFailedRequests(page?: number, limit?: number, statusCode?: number, endpoint?: string, userId?: string): Promise<{
        requests: RequestWithUser[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getAllRequests(page?: number, limit?: number, statusCode?: number, endpoint?: string, userId?: string): Promise<{
        requests: RequestWithUser[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getRequestsByEndpoint(): Promise<{
        endpoint: string;
        totalRequests: number;
        failedRequests: number;
        successRate: number;
        averageResponseTime: number;
    }[]>;
    getErrorsByTimeRange(hours?: number): Promise<{
        timestamp: Date;
        errorCount: number;
    }[]>;
    private getRecentFailedRequests;
    private enrichRequestsWithUserData;
    private getStatusCategory;
}
