import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getAllUsers(page?: string, limit?: string, search?: string): Promise<{
        users: import("./users.service").UserWithSubscriptions[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getStats(): Promise<{
        totalSubscriptions: number;
        activeSubscriptions: number;
        canceledSubscriptions: number;
        totalUsers: number;
        totalRevenue: number;
    }>;
    getUserById(id: string): Promise<import("./users.service").UserWithSubscriptions | null>;
    updateUserStatus(id: string, status: string): Promise<{
        success: boolean;
    }>;
    updateUserLimitation(id: string, limitation: number): Promise<{
        success: boolean;
    }>;
}
