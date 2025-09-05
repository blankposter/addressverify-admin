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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditTransactionSchema = exports.CreditTransaction = exports.TransactionStatus = exports.TransactionType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var TransactionType;
(function (TransactionType) {
    TransactionType["ADD"] = "add";
    TransactionType["DEDUCT"] = "deduct";
    TransactionType["REFUND"] = "refund";
    TransactionType["BONUS"] = "bonus";
    TransactionType["ADJUSTMENT"] = "adjustment";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["COMPLETED"] = "completed";
    TransactionStatus["FAILED"] = "failed";
    TransactionStatus["REVERSED"] = "reversed";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
let CreditTransaction = class CreditTransaction extends mongoose_2.Document {
    userId;
    userEmail;
    type;
    amount;
    balanceBefore;
    balanceAfter;
    status;
    description;
    reference;
    adminId;
    adminUsername;
    notes;
};
exports.CreditTransaction = CreditTransaction;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CreditTransaction.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CreditTransaction.prototype, "userEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: Object.values(TransactionType), required: true }),
    __metadata("design:type", String)
], CreditTransaction.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], CreditTransaction.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], CreditTransaction.prototype, "balanceBefore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], CreditTransaction.prototype, "balanceAfter", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: Object.values(TransactionStatus), default: TransactionStatus.COMPLETED }),
    __metadata("design:type", String)
], CreditTransaction.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CreditTransaction.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CreditTransaction.prototype, "reference", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CreditTransaction.prototype, "adminId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CreditTransaction.prototype, "adminUsername", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CreditTransaction.prototype, "notes", void 0);
exports.CreditTransaction = CreditTransaction = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], CreditTransaction);
exports.CreditTransactionSchema = mongoose_1.SchemaFactory.createForClass(CreditTransaction);
//# sourceMappingURL=credit-transaction.schema.js.map