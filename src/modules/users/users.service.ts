import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Subscription') private subscriptionModel: Model<Subscription>,
  ) {}

  async getAllUsers(
    page = 1, 
    limit = 10, 
    search = '',
    filters: {
      email?: string;
      status?: string;
      role?: string;
      provider?: string;
      emailVerified?: boolean;
      hasSeenWelcome?: boolean;
      stripe_id?: string;
      limitation?: { min?: number; max?: number };
      budgetAlert?: { min?: number; max?: number };
      createdAt?: { start?: string; end?: string };
      last_login?: { start?: string; end?: string };
    } = {},
    sort: { field?: string; order?: 'asc' | 'desc' } = { field: 'createdAt', order: 'desc' }
  ): Promise<{
    users: UserWithSubscriptions[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const query: any = {};

    // Global search across all text fields
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { stripe_id: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } },
        { provider: { $regex: search, $options: 'i' } }
      ];
    }

    // Specific field filters
    if (filters.email) {
      query.email = { $regex: filters.email, $options: 'i' };
    }
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.role) {
      query.role = filters.role;
    }
    if (filters.provider) {
      query.provider = filters.provider;
    }
    if (filters.emailVerified !== undefined) {
      query.emailVerified = filters.emailVerified;
    }
    if (filters.hasSeenWelcome !== undefined) {
      query.hasSeenWelcome = filters.hasSeenWelcome;
    }
    if (filters.stripe_id) {
      query.stripe_id = { $regex: filters.stripe_id, $options: 'i' };
    }
    if (filters.limitation) {
      if (filters.limitation.min !== undefined || filters.limitation.max !== undefined) {
        query.limitation = {};
        if (filters.limitation.min !== undefined) query.limitation.$gte = filters.limitation.min;
        if (filters.limitation.max !== undefined) query.limitation.$lte = filters.limitation.max;
      }
    }
    if (filters.budgetAlert) {
      if (filters.budgetAlert.min !== undefined || filters.budgetAlert.max !== undefined) {
        query.budgetAlert = {};
        if (filters.budgetAlert.min !== undefined) query.budgetAlert.$gte = filters.budgetAlert.min;
        if (filters.budgetAlert.max !== undefined) query.budgetAlert.$lte = filters.budgetAlert.max;
      }
    }
    if (filters.createdAt) {
      if (filters.createdAt.start || filters.createdAt.end) {
        query.createdAt = {};
        if (filters.createdAt.start) query.createdAt.$gte = new Date(filters.createdAt.start);
        if (filters.createdAt.end) query.createdAt.$lte = new Date(filters.createdAt.end);
      }
    }
    if (filters.last_login) {
      if (filters.last_login.start || filters.last_login.end) {
        query.last_login = {};
        if (filters.last_login.start) query.last_login.$gte = new Date(filters.last_login.start);
        if (filters.last_login.end) query.last_login.$lte = new Date(filters.last_login.end);
      }
    }

    // Build sort object
    const sortObject: any = {};
    if (sort.field) {
      sortObject[sort.field] = sort.order === 'asc' ? 1 : -1;
    } else {
      sortObject.createdAt = -1;
    }

    const [users, total] = await Promise.all([
      this.userModel
        .find(query)
        .sort(sortObject)
        .skip(skip)
        .limit(limit)
        .lean(),
      this.userModel.countDocuments(query),
    ]);

    const usersWithSubscriptions = await Promise.all(
      users.map(async (user) => {
        const subscriptions = await this.subscriptionModel
          .find({ stripe_user_id: user.stripe_id })
          .sort({ createdAt: -1 })
          .lean();

        return {
          ...user,
          _id: user._id.toString(),
          createdAt: (user as any).createdAt || new Date(),
          subscriptions,
          totalSpent: subscriptions.reduce((sum, sub) => sum + (sub.usage_count || 0) * 0.01, 0),
          activeSubsCount: subscriptions.filter(sub => sub.status === 'active').length,
        };
      })
    );

    return {
      users: usersWithSubscriptions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserById(id: string): Promise<UserWithSubscriptions | null> {
    const user = await this.userModel.findById(id).lean();
    if (!user) return null;

    const subscriptions = await this.subscriptionModel
      .find({ stripe_user_id: user.stripe_id })
      .sort({ createdAt: -1 })
      .lean();

    return {
      ...user,
      _id: user._id.toString(),
      createdAt: (user as any).createdAt || new Date(),
      subscriptions,
      totalSpent: subscriptions.reduce((sum, sub) => sum + (sub.usage_count || 0) * 0.01, 0),
      activeSubsCount: subscriptions.filter(sub => sub.status === 'active').length,
    };
  }

  async updateUserStatus(id: string, status: string): Promise<boolean> {
    const result = await this.userModel.updateOne(
      { _id: id },
      { status }
    );
    return result.modifiedCount > 0;
  }

  async updateUserLimitation(id: string, limitation: number): Promise<boolean> {
    const result = await this.userModel.updateOne(
      { _id: id },
      { limitation }
    );
    return result.modifiedCount > 0;
  }

  async getSubscriptionStats(): Promise<{
    totalSubscriptions: number;
    activeSubscriptions: number;
    canceledSubscriptions: number;
    totalUsers: number;
    totalRevenue: number;
  }> {
    const [subscriptions, users] = await Promise.all([
      this.subscriptionModel.find().lean(),
      this.userModel.countDocuments(),
    ]);

    const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
    const canceledSubscriptions = subscriptions.filter(sub => sub.status === 'canceled').length;
    const totalRevenue = subscriptions.reduce((sum, sub) => sum + (sub.usage_count || 0) * 0.01, 0);

    return {
      totalSubscriptions: subscriptions.length,
      activeSubscriptions,
      canceledSubscriptions,
      totalUsers: users,
      totalRevenue,
    };
  }
}