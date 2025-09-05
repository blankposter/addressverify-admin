import { Document } from 'mongoose';
export declare class Request extends Document {
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
}
export declare const RequestSchema: import("mongoose").Schema<Request, import("mongoose").Model<Request, any, any, any, Document<unknown, any, Request, any, {}> & Request & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Request, Document<unknown, {}, import("mongoose").FlatRecord<Request>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Request> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
