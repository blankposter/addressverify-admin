"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let RequestsService = class RequestsService {
    requestModel;
    userModel;
    constructor(requestModel, userModel) {
        this.requestModel = requestModel;
        this.userModel = userModel;
    }
    async getRequestStats() {
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
    async getFailedRequests(page = 1, limit = 10, statusCode, endpoint, userId) {
        const skip = (page - 1) * limit;
        const query = { status_code: { $gte: 400 } };
        if (statusCode)
            query.status_code = statusCode;
        if (endpoint)
            query.endpoint = { $regex: endpoint, $options: 'i' };
        if (userId)
            query.user_id = userId;
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
    async getAllRequests(page = 1, limit = 10, statusCode, endpoint, userId) {
        const skip = (page - 1) * limit;
        const query = {};
        if (statusCode)
            query.status_code = statusCode;
        if (endpoint)
            query.endpoint = { $regex: endpoint, $options: 'i' };
        if (userId)
            query.user_id = userId;
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
    async getRequestsByEndpoint() {
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
        return Object.entries(endpointStats).map(([endpoint, stats]) => ({
            endpoint,
            totalRequests: stats.total,
            failedRequests: stats.failed,
            successRate: parseFloat(((stats.total - stats.failed) / stats.total * 100).toFixed(2)),
            averageResponseTime: parseFloat((stats.responseTimeSum / stats.total).toFixed(2)),
        }));
    }
    async getErrorsByTimeRange(hours = 24) {
        const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
        const errors = await this.requestModel.find({
            status_code: { $gte: 400 },
            date: { $gte: startTime }
        }).lean();
        const hourlyErrors = errors.reduce((acc, req) => {
            const hour = new Date(req.date);
            hour.setMinutes(0, 0, 0);
            const hourKey = hour.toISOString();
            acc[hourKey] = (acc[hourKey] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(hourlyErrors).map(([timestamp, count]) => ({
            timestamp: new Date(timestamp),
            errorCount: count,
        })).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }
    async getRecentFailedRequests(limit = 10) {
        const requests = await this.requestModel
            .find({ status_code: { $gte: 400 } })
            .sort({ date: -1 })
            .limit(limit)
            .lean();
        return this.enrichRequestsWithUserData(requests);
    }
    async enrichRequestsWithUserData(requests) {
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
    getStatusCategory(statusCode) {
        if (statusCode >= 200 && statusCode < 300)
            return '2xx Success';
        if (statusCode >= 300 && statusCode < 400)
            return '3xx Redirect';
        if (statusCode >= 400 && statusCode < 500)
            return '4xx Client Error';
        if (statusCode >= 500)
            return '5xx Server Error';
        return 'Other';
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Request')),
    __param(1, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], RequestsService);
//# sourceMappingURL=requests.service.js.map