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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let UsersService = class UsersService {
    userModel;
    subscriptionModel;
    constructor(userModel, subscriptionModel) {
        this.userModel = userModel;
        this.subscriptionModel = subscriptionModel;
    }
    async getAllUsers(page = 1, limit = 10, search = '') {
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
        const usersWithSubscriptions = await Promise.all(users.map(async (user) => {
            const subscriptions = await this.subscriptionModel
                .find({ stripe_user_id: user.stripe_id })
                .sort({ createdAt: -1 })
                .lean();
            return {
                ...user,
                _id: user._id.toString(),
                createdAt: user.createdAt || new Date(),
                subscriptions,
                totalSpent: subscriptions.reduce((sum, sub) => sum + (sub.usage_count || 0) * 0.01, 0),
                activeSubsCount: subscriptions.filter(sub => sub.status === 'active').length,
            };
        }));
        return {
            users: usersWithSubscriptions,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getUserById(id) {
        const user = await this.userModel.findById(id).lean();
        if (!user)
            return null;
        const subscriptions = await this.subscriptionModel
            .find({ stripe_user_id: user.stripe_id })
            .sort({ createdAt: -1 })
            .lean();
        return {
            ...user,
            _id: user._id.toString(),
            createdAt: user.createdAt || new Date(),
            subscriptions,
            totalSpent: subscriptions.reduce((sum, sub) => sum + (sub.usage_count || 0) * 0.01, 0),
            activeSubsCount: subscriptions.filter(sub => sub.status === 'active').length,
        };
    }
    async updateUserStatus(id, status) {
        const result = await this.userModel.updateOne({ _id: id }, { status });
        return result.modifiedCount > 0;
    }
    async updateUserLimitation(id, limitation) {
        const result = await this.userModel.updateOne({ _id: id }, { limitation });
        return result.modifiedCount > 0;
    }
    async getSubscriptionStats() {
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __param(1, (0, mongoose_1.InjectModel)('Subscription')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map