import { Model } from 'mongoose';
import { AdminDocument } from '../../schemas/admin.schema';
export declare class AdminSeeder {
    private adminModel;
    constructor(adminModel: Model<AdminDocument>);
    seed(): Promise<void>;
    clear(): Promise<void>;
}
