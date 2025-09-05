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
exports.CreditsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const credits_service_1 = require("./credits.service");
const credit_transaction_schema_1 = require("../../schemas/credit-transaction.schema");
let CreditsController = class CreditsController {
    creditsService;
    constructor(creditsService) {
        this.creditsService = creditsService;
    }
    async getStats() {
        return this.creditsService.getCreditStats();
    }
    async getTransactions(page = '1', limit = '10', userId, type) {
        return this.creditsService.getTransactions(parseInt(page), parseInt(limit), userId, type);
    }
    async getUserCreditHistory(userId, page = '1', limit = '10') {
        return this.creditsService.getUserCreditHistory(userId, parseInt(page), parseInt(limit));
    }
    async addCredits(body, req) {
        const operation = {
            userId: body.userId,
            amount: body.amount,
            type: credit_transaction_schema_1.TransactionType.ADD,
            description: body.description || `Admin credit addition`,
            adminId: req.user.sub,
            adminUsername: req.user.username,
            notes: body.notes,
            reference: body.reference,
        };
        return this.creditsService.addCredits(operation);
    }
    async deductCredits(body, req) {
        const operation = {
            userId: body.userId,
            amount: body.amount,
            type: credit_transaction_schema_1.TransactionType.DEDUCT,
            description: body.description || `Admin credit deduction`,
            adminId: req.user.sub,
            adminUsername: req.user.username,
            notes: body.notes,
            reference: body.reference,
        };
        return this.creditsService.deductCredits(operation);
    }
    async refundCredits(body, req) {
        const operation = {
            userId: body.userId,
            amount: body.amount,
            type: credit_transaction_schema_1.TransactionType.REFUND,
            description: body.description || `Admin credit refund`,
            adminId: req.user.sub,
            adminUsername: req.user.username,
            notes: body.notes,
            reference: body.reference,
        };
        return this.creditsService.addCredits(operation);
    }
    async bonusCredits(body, req) {
        const operation = {
            userId: body.userId,
            amount: body.amount,
            type: credit_transaction_schema_1.TransactionType.BONUS,
            description: body.description || `Admin bonus credits`,
            adminId: req.user.sub,
            adminUsername: req.user.username,
            notes: body.notes,
            reference: body.reference,
        };
        return this.creditsService.addCredits(operation);
    }
    async bulkAddCredits(body, req) {
        return this.creditsService.bulkAddCredits({
            userIds: body.userIds,
            amount: body.amount,
            description: body.description || `Bulk credit addition`,
            adminId: req.user.sub,
            adminUsername: req.user.username,
            notes: body.notes,
        });
    }
};
exports.CreditsController = CreditsController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CreditsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('transactions'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('userId')),
    __param(3, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], CreditsController.prototype, "getTransactions", null);
__decorate([
    (0, common_1.Get)('user/:userId/history'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CreditsController.prototype, "getUserCreditHistory", null);
__decorate([
    (0, common_1.Post)('add'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CreditsController.prototype, "addCredits", null);
__decorate([
    (0, common_1.Post)('deduct'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CreditsController.prototype, "deductCredits", null);
__decorate([
    (0, common_1.Post)('refund'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CreditsController.prototype, "refundCredits", null);
__decorate([
    (0, common_1.Post)('bonus'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CreditsController.prototype, "bonusCredits", null);
__decorate([
    (0, common_1.Post)('bulk-add'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CreditsController.prototype, "bulkAddCredits", null);
exports.CreditsController = CreditsController = __decorate([
    (0, common_1.Controller)('api/admin/credits'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [credits_service_1.CreditsService])
], CreditsController);
//# sourceMappingURL=credits.controller.js.map