import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscription, SubscriptionStatus } from '../../schemas/subscription.schema';
import { User } from '../../schemas/user.schema';

export interface SubscriptionWithUser {
  _id: string;
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
  createdAt: Date;
  updatedAt: Date;
  userEmail?: string;
  userId?: string;
}

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel('Subscription') private subscriptionModel: Model<Subscription>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async getAllSubscriptions(
    page = 1,
    limit = 10,
    search = '',
    filters: {
      status?: SubscriptionStatus;
      stripe_sub_id?: string;
      stripe_user_id?: string;
      sub_name?: string;
      rate_limit_period?: string;
      rate_limit?: { min?: number; max?: number };
      total_request_limit?: { min?: number; max?: number };
      stripe_plan_id?: string;
      stripe_product_id?: string;
      stripe_meter_id?: string;
      usage_count?: { min?: number; max?: number };
      expires_in?: { start?: string; end?: string };
      starts_in?: { start?: string; end?: string };
      createdAt?: { start?: string; end?: string };
    } = {},
    sort: { field?: string; order?: 'asc' | 'desc' } = { field: 'createdAt', order: 'desc' }
  ): Promise<{
    subscriptions: SubscriptionWithUser[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const query: any = {};

    // Global search across all text fields
    if (search) {
      query.$or = [
        { stripe_sub_id: { $regex: search, $options: 'i' } },
        { stripe_user_id: { $regex: search, $options: 'i' } },
        { sub_name: { $regex: search, $options: 'i' } },
        { rate_limit_period: { $regex: search, $options: 'i' } },
        { stripe_plan_id: { $regex: search, $options: 'i' } },
        { stripe_product_id: { $regex: search, $options: 'i' } },
        { stripe_meter_id: { $regex: search, $options: 'i' } }
      ];
    }

    // Specific field filters
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.stripe_sub_id) {
      query.stripe_sub_id = { $regex: filters.stripe_sub_id, $options: 'i' };
    }
    if (filters.stripe_user_id) {
      query.stripe_user_id = { $regex: filters.stripe_user_id, $options: 'i' };
    }
    if (filters.sub_name) {
      query.sub_name = { $regex: filters.sub_name, $options: 'i' };
    }
    if (filters.rate_limit_period) {
      query.rate_limit_period = { $regex: filters.rate_limit_period, $options: 'i' };
    }
    if (filters.rate_limit) {
      if (filters.rate_limit.min !== undefined || filters.rate_limit.max !== undefined) {
        query.rate_limit = {};
        if (filters.rate_limit.min !== undefined) query.rate_limit.$gte = filters.rate_limit.min;
        if (filters.rate_limit.max !== undefined) query.rate_limit.$lte = filters.rate_limit.max;
      }
    }
    if (filters.total_request_limit) {
      if (filters.total_request_limit.min !== undefined || filters.total_request_limit.max !== undefined) {
        query.total_request_limit = {};
        if (filters.total_request_limit.min !== undefined) query.total_request_limit.$gte = filters.total_request_limit.min;
        if (filters.total_request_limit.max !== undefined) query.total_request_limit.$lte = filters.total_request_limit.max;
      }
    }
    if (filters.stripe_plan_id) {
      query.stripe_plan_id = { $regex: filters.stripe_plan_id, $options: 'i' };
    }
    if (filters.stripe_product_id) {
      query.stripe_product_id = { $regex: filters.stripe_product_id, $options: 'i' };
    }
    if (filters.stripe_meter_id) {
      query.stripe_meter_id = { $regex: filters.stripe_meter_id, $options: 'i' };
    }
    if (filters.usage_count) {
      if (filters.usage_count.min !== undefined || filters.usage_count.max !== undefined) {
        query.usage_count = {};
        if (filters.usage_count.min !== undefined) query.usage_count.$gte = filters.usage_count.min;
        if (filters.usage_count.max !== undefined) query.usage_count.$lte = filters.usage_count.max;
      }
    }
    if (filters.expires_in) {
      if (filters.expires_in.start || filters.expires_in.end) {
        query.expires_in = {};
        if (filters.expires_in.start) query.expires_in.$gte = new Date(filters.expires_in.start);
        if (filters.expires_in.end) query.expires_in.$lte = new Date(filters.expires_in.end);
      }
    }
    if (filters.starts_in) {
      if (filters.starts_in.start || filters.starts_in.end) {
        query.starts_in = {};
        if (filters.starts_in.start) query.starts_in.$gte = new Date(filters.starts_in.start);
        if (filters.starts_in.end) query.starts_in.$lte = new Date(filters.starts_in.end);
      }
    }
    if (filters.createdAt) {
      if (filters.createdAt.start || filters.createdAt.end) {
        query.createdAt = {};
        if (filters.createdAt.start) query.createdAt.$gte = new Date(filters.createdAt.start);
        if (filters.createdAt.end) query.createdAt.$lte = new Date(filters.createdAt.end);
      }
    }

    // Build sort object
    const sortObject: any = {};
    if (sort.field) {
      sortObject[sort.field] = sort.order === 'asc' ? 1 : -1;
    } else {
      sortObject.createdAt = -1;
    }

    const [subscriptions, total] = await Promise.all([
      this.subscriptionModel
        .find(query)
        .sort(sortObject)
        .skip(skip)
        .limit(limit)
        .lean(),
      this.subscriptionModel.countDocuments(query),
    ]);

    const subscriptionsWithUsers = await this.enrichSubscriptionsWithUserData(subscriptions);

    return {
      subscriptions: subscriptionsWithUsers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getSubscriptionById(id: string): Promise<SubscriptionWithUser | null> {
    const subscription = await this.subscriptionModel.findById(id).lean();
    if (!subscription) return null;

    const enriched = await this.enrichSubscriptionsWithUserData([subscription]);
    return enriched[0] || null;
  }

  async getSubscriptionStats(): Promise<{
    totalSubscriptions: number;
    activeSubscriptions: number;
    trialingSubscriptions: number;
    canceledSubscriptions: number;
    totalUsage: number;
    averageUsage: number;
    statusBreakdown: { [key: string]: number };
    planBreakdown: { [key: string]: number };
    recentSubscriptions: SubscriptionWithUser[];
  }> {
    const [subscriptions, recentSubs] = await Promise.all([
      this.subscriptionModel.find().lean(),
      this.getRecentSubscriptions(10),
    ]);

    const totalSubscriptions = subscriptions.length;
    const activeSubscriptions = subscriptions.filter(sub => sub.status === SubscriptionStatus.ACTIVE).length;
    const trialingSubscriptions = subscriptions.filter(sub => sub.status === SubscriptionStatus.TRIALING).length;
    const canceledSubscriptions = subscriptions.filter(sub => sub.status === SubscriptionStatus.CANCELED).length;
    const totalUsage = subscriptions.reduce((sum, sub) => sum + (sub.usage_count || 0), 0);
    const averageUsage = totalSubscriptions > 0 ? totalUsage / totalSubscriptions : 0;

    const statusBreakdown = subscriptions.reduce((acc, sub) => {
      acc[sub.status] = (acc[sub.status] || 0) + 1;
      return acc;
    }, {});

    const planBreakdown = subscriptions.reduce((acc, sub) => {
      acc[sub.sub_name] = (acc[sub.sub_name] || 0) + 1;
      return acc;
    }, {});

    return {
      totalSubscriptions,
      activeSubscriptions,
      trialingSubscriptions,
      canceledSubscriptions,
      totalUsage,
      averageUsage: parseFloat(averageUsage.toFixed(2)),
      statusBreakdown,
      planBreakdown,
      recentSubscriptions: recentSubs,
    };
  }

  async updateSubscriptionStatus(id: string, status: SubscriptionStatus): Promise<boolean> {
    const result = await this.subscriptionModel.updateOne(
      { _id: id },
      { status, updatedAt: new Date() }
    );
    return result.modifiedCount > 0;
  }

  async getSubscriptionsByUser(userId: string): Promise<SubscriptionWithUser[]> {
    const user = await this.userModel.findById(userId).lean();
    if (!user) return [];

    const subscriptions = await this.subscriptionModel
      .find({ stripe_user_id: user.stripe_id })
      .sort({ createdAt: -1 })
      .lean();

    return this.enrichSubscriptionsWithUserData(subscriptions);
  }

  async getExpiringSubscriptions(daysFromNow = 7): Promise<SubscriptionWithUser[]> {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + daysFromNow);

    const subscriptions = await this.subscriptionModel
      .find({
        expires_in: { $lte: expirationDate },
        status: { $in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING] }
      })
      .sort({ expires_in: 1 })
      .lean();

    return this.enrichSubscriptionsWithUserData(subscriptions);
  }

  private async getRecentSubscriptions(limit = 10): Promise<SubscriptionWithUser[]> {
    const subscriptions = await this.subscriptionModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return this.enrichSubscriptionsWithUserData(subscriptions);
  }

  private async enrichSubscriptionsWithUserData(subscriptions: any[]): Promise<SubscriptionWithUser[]> {
    const stripeUserIds = [...new Set(subscriptions.map(s => s.stripe_user_id))];
    const users = await this.userModel.find({ stripe_id: { $in: stripeUserIds } }).lean();
    const userMap = users.reduce((acc, user) => {
      acc[user.stripe_id] = { email: user.email, id: user._id.toString() };
      return acc;
    }, {});

    return subscriptions.map(sub => ({
      ...sub,
      _id: sub._id.toString(),
      userEmail: userMap[sub.stripe_user_id]?.email || 'Unknown',
      userId: userMap[sub.stripe_user_id]?.id || null,
    }));
  }
}