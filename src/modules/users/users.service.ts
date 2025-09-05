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

  async getAllUsers(page = 1, limit = 10, search = ''): Promise<{
    users: UserWithSubscriptions[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const searchQuery = search 
      ? { 
          $or: [
            { email: { $regex: search, $options: 'i' } },
            { stripe_id: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const [users, total] = await Promise.all([
      this.userModel
        .find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.userModel.countDocuments(searchQuery),
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