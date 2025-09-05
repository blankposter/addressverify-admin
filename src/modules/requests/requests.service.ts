import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel('Request') private requestModel: Model<Request>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async getRequestStats(): Promise<{
    totalRequests: number;
    failedRequests: number;
    successRate: number;
    averageResponseTime: number;
    totalCost: number;
    requestsByStatus: { [key: string]: number };
    recentFailures: RequestWithUser[];
  }> {
    const [requests, recentFailures] = await Promise.all([
      this.requestModel.find().lean(),
      this.getRecentFailedRequests(10),
    ]);

    const totalRequests = requests.length;
    const failedRequests = requests.filter(r => r.status_code >= 400).length;
    const successRate = totalRequests > 0 ? ((totalRequests - failedRequests) / totalRequests) * 100 : 0;
    const averageResponseTime = totalRequests > 0 
      ? requests.reduce((sum, r) => sum + r.response_time, 0) / totalRequests 
      : 0;
    const totalCost = requests.reduce((sum, r) => sum + (r.cost || 0), 0);

    const requestsByStatus = requests.reduce((acc, req) => {
      const statusCategory = this.getStatusCategory(req.status_code);
      acc[statusCategory] = (acc[statusCategory] || 0) + 1;
      return acc;
    }, {});

    return {
      totalRequests,
      failedRequests,
      successRate: parseFloat(successRate.toFixed(2)),
      averageResponseTime: parseFloat(averageResponseTime.toFixed(2)),
      totalCost,
      requestsByStatus,
      recentFailures,
    };
  }

  async getFailedRequests(
    page = 1,
    limit = 10,
    statusCode?: number,
    endpoint?: string,
    userId?: string
  ): Promise<{
    requests: RequestWithUser[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const query: any = { status_code: { $gte: 400 } };

    if (statusCode) query.status_code = statusCode;
    if (endpoint) query.endpoint = { $regex: endpoint, $options: 'i' };
    if (userId) query.user_id = userId;

    const [requests, total] = await Promise.all([
      this.requestModel
        .find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.requestModel.countDocuments(query),
    ]);

    const requestsWithUsers = await this.enrichRequestsWithUserData(requests);

    return {
      requests: requestsWithUsers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllRequests(
    page = 1,
    limit = 10,
    search = '',
    filters: {
      endpoint?: string;
      user_id?: string;
      stripe_user_id?: string;
      ip?: string;
      user_agent?: string;
      status_code?: number;
      status_code_range?: { min?: number; max?: number };
      subscription_id?: string;
      cost?: { min?: number; max?: number };
      response_time?: { min?: number; max?: number };
      date?: { start?: string; end?: string };
      createdAt?: { start?: string; end?: string };
    } = {},
    sort: { field?: string; order?: 'asc' | 'desc' } = { field: 'date', order: 'desc' }
  ): Promise<{
    requests: RequestWithUser[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const query: any = {};

    // Global search across all text fields
    if (search) {
      query.$or = [
        { endpoint: { $regex: search, $options: 'i' } },
        { user_id: { $regex: search, $options: 'i' } },
        { stripe_user_id: { $regex: search, $options: 'i' } },
        { ip: { $regex: search, $options: 'i' } },
        { user_agent: { $regex: search, $options: 'i' } },
        { subscription_id: { $regex: search, $options: 'i' } },
        { response_data: { $regex: search, $options: 'i' } },
        { input_data: { $regex: search, $options: 'i' } }
      ];
    }

    // Specific field filters
    if (filters.endpoint) {
      query.endpoint = { $regex: filters.endpoint, $options: 'i' };
    }
    if (filters.user_id) {
      query.user_id = filters.user_id;
    }
    if (filters.stripe_user_id) {
      query.stripe_user_id = { $regex: filters.stripe_user_id, $options: 'i' };
    }
    if (filters.ip) {
      query.ip = { $regex: filters.ip, $options: 'i' };
    }
    if (filters.user_agent) {
      query.user_agent = { $regex: filters.user_agent, $options: 'i' };
    }
    if (filters.status_code) {
      query.status_code = filters.status_code;
    }
    if (filters.status_code_range) {
      if (filters.status_code_range.min !== undefined || filters.status_code_range.max !== undefined) {
        query.status_code = {};
        if (filters.status_code_range.min !== undefined) query.status_code.$gte = filters.status_code_range.min;
        if (filters.status_code_range.max !== undefined) query.status_code.$lte = filters.status_code_range.max;
      }
    }
    if (filters.subscription_id) {
      query.subscription_id = { $regex: filters.subscription_id, $options: 'i' };
    }
    if (filters.cost) {
      if (filters.cost.min !== undefined || filters.cost.max !== undefined) {
        query.cost = {};
        if (filters.cost.min !== undefined) query.cost.$gte = filters.cost.min;
        if (filters.cost.max !== undefined) query.cost.$lte = filters.cost.max;
      }
    }
    if (filters.response_time) {
      if (filters.response_time.min !== undefined || filters.response_time.max !== undefined) {
        query.response_time = {};
        if (filters.response_time.min !== undefined) query.response_time.$gte = filters.response_time.min;
        if (filters.response_time.max !== undefined) query.response_time.$lte = filters.response_time.max;
      }
    }
    if (filters.date) {
      if (filters.date.start || filters.date.end) {
        query.date = {};
        if (filters.date.start) query.date.$gte = new Date(filters.date.start);
        if (filters.date.end) query.date.$lte = new Date(filters.date.end);
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
      sortObject.date = -1;
    }

    const [requests, total] = await Promise.all([
      this.requestModel
        .find(query)
        .sort(sortObject)
        .skip(skip)
        .limit(limit)
        .lean(),
      this.requestModel.countDocuments(query),
    ]);

    const requestsWithUsers = await this.enrichRequestsWithUserData(requests);

    return {
      requests: requestsWithUsers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getRequestsByEndpoint(): Promise<{
    endpoint: string;
    totalRequests: number;
    failedRequests: number;
    successRate: number;
    averageResponseTime: number;
  }[]> {
    const requests = await this.requestModel.find().lean();
    
    const endpointStats = requests.reduce((acc, req) => {
      if (!acc[req.endpoint]) {
        acc[req.endpoint] = {
          total: 0,
          failed: 0,
          responseTimeSum: 0
        };
      }
      
      acc[req.endpoint].total++;
      acc[req.endpoint].responseTimeSum += req.response_time;
      
      if (req.status_code >= 400) {
        acc[req.endpoint].failed++;
      }
      
      return acc;
    }, {});

    return Object.entries(endpointStats).map(([endpoint, stats]: [string, any]) => ({
      endpoint,
      totalRequests: stats.total,
      failedRequests: stats.failed,
      successRate: parseFloat(((stats.total - stats.failed) / stats.total * 100).toFixed(2)),
      averageResponseTime: parseFloat((stats.responseTimeSum / stats.total).toFixed(2)),
    }));
  }

  async getErrorsByTimeRange(hours = 24): Promise<{
    timestamp: Date;
    errorCount: number;
  }[]> {
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const errors = await this.requestModel.find({
      status_code: { $gte: 400 },
      date: { $gte: startTime }
    }).lean();

    // Group by hour
    const hourlyErrors = errors.reduce((acc, req) => {
      const hour = new Date(req.date);
      hour.setMinutes(0, 0, 0);
      const hourKey = hour.toISOString();
      
      acc[hourKey] = (acc[hourKey] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(hourlyErrors).map(([timestamp, count]) => ({
      timestamp: new Date(timestamp),
      errorCount: count as number,
    })).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  private async getRecentFailedRequests(limit = 10): Promise<RequestWithUser[]> {
    const requests = await this.requestModel
      .find({ status_code: { $gte: 400 } })
      .sort({ date: -1 })
      .limit(limit)
      .lean();

    return this.enrichRequestsWithUserData(requests);
  }

  private async enrichRequestsWithUserData(requests: any[]): Promise<RequestWithUser[]> {
    const userIds = [...new Set(requests.map(r => r.user_id))];
    const users = await this.userModel.find({ _id: { $in: userIds } }).lean();
    const userMap = users.reduce((acc, user) => {
      acc[user._id.toString()] = user.email;
      return acc;
    }, {});

    return requests.map(req => ({
      ...req,
      _id: req._id.toString(),
      userEmail: userMap[req.user_id] || 'Unknown',
    }));
  }

  private getStatusCategory(statusCode: number): string {
    if (statusCode >= 200 && statusCode < 300) return '2xx Success';
    if (statusCode >= 300 && statusCode < 400) return '3xx Redirect';
    if (statusCode >= 400 && statusCode < 500) return '4xx Client Error';
    if (statusCode >= 500) return '5xx Server Error';
    return 'Other';
  }
}