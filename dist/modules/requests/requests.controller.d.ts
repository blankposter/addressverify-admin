import { RequestsService } from './requests.service';
export declare class RequestsController {
    private requestsService;
    constructor(requestsService: RequestsService);
    getStats(): Promise<{
        totalRequests: number;
        failedRequests: number;
        successRate: number;
        averageResponseTime: number;
        totalCost: number;
        requestsByStatus: {
            [key: string]: number;
        };
        recentFailures: import("./requests.service").RequestWithUser[];
    }>;
    getFailedRequests(page?: string, limit?: string, statusCode?: string, endpoint?: string, userId?: string): Promise<{
        requests: import("./requests.service").RequestWithUser[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getAllRequests(page?: string, limit?: string, statusCode?: string, endpoint?: string, userId?: string): Promise<{
        requests: import("./requests.service").RequestWithUser[];
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
    getErrorsTimeline(hours?: string): Promise<{
        timestamp: Date;
        errorCount: number;
    }[]>;
}
