import { Document } from 'mongoose';
export declare enum SubscriptionStatus {
    ACTIVE = "active",
    TRIALING = "trialing",
    CANCELED = "canceled",
    UNPAID = "unpaid",
    PAUSED = "paused",
    ENDED = "ended",
    INCOMPLETE = "incomplete"
}
export declare class Subscription extends Document {
    stripe_sub_id: string;
    stripe_user_id: string;
    sub_name: string;
    rate_limit_period: string;
    rate_limit: number;
    total_request_limit: number;
    stripe_plan_id: string;
    stripe_product_id: string;
    stripe_meter_id: string;
    expires_in: Date;
    starts_in: Date;
    status: SubscriptionStatus;
    usage_count: number;
}
export declare const SubscriptionSchema: import("mongoose").Schema<Subscription, import("mongoose").Model<Subscription, any, any, any, Document<unknown, any, Subscription, any, {}> & Subscription & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Subscription, Document<unknown, {}, import("mongoose").FlatRecord<Subscription>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Subscription> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
