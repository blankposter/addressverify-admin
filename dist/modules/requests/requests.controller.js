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
exports.RequestsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const requests_service_1 = require("./requests.service");
let RequestsController = class RequestsController {
    requestsService;
    constructor(requestsService) {
        this.requestsService = requestsService;
    }
    async getStats() {
        return this.requestsService.getRequestStats();
    }
    async getFailedRequests(page = '1', limit = '10', statusCode, endpoint, userId) {
        return this.requestsService.getFailedRequests(parseInt(page), parseInt(limit), statusCode ? parseInt(statusCode) : undefined, endpoint, userId);
    }
    async getAllRequests(page = '1', limit = '10', statusCode, endpoint, userId) {
        return this.requestsService.getAllRequests(parseInt(page), parseInt(limit), statusCode ? parseInt(statusCode) : undefined, endpoint, userId);
    }
    async getRequestsByEndpoint() {
        return this.requestsService.getRequestsByEndpoint();
    }
    async getErrorsTimeline(hours = '24') {
        return this.requestsService.getErrorsByTimeRange(parseInt(hours));
    }
};
exports.RequestsController = RequestsController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('failed'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('statusCode')),
    __param(3, (0, common_1.Query)('endpoint')),
    __param(4, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getFailedRequests", null);
__decorate([
    (0, common_1.Get)('all'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('statusCode')),
    __param(3, (0, common_1.Query)('endpoint')),
    __param(4, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getAllRequests", null);
__decorate([
    (0, common_1.Get)('by-endpoint'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getRequestsByEndpoint", null);
__decorate([
    (0, common_1.Get)('errors-timeline'),
    __param(0, (0, common_1.Query)('hours')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getErrorsTimeline", null);
exports.RequestsController = RequestsController = __decorate([
    (0, common_1.Controller)('api/admin/requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [requests_service_1.RequestsService])
], RequestsController);
//# sourceMappingURL=requests.controller.js.map