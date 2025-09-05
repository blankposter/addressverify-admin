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
exports.EnterprisePackageSchema = exports.EnterprisePackage = exports.PackageType = exports.PackageStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var PackageStatus;
(function (PackageStatus) {
    PackageStatus["ACTIVE"] = "active";
    PackageStatus["INACTIVE"] = "inactive";
    PackageStatus["DRAFT"] = "draft";
})(PackageStatus || (exports.PackageStatus = PackageStatus = {}));
var PackageType;
(function (PackageType) {
    PackageType["STANDARD"] = "standard";
    PackageType["PREMIUM"] = "premium";
    PackageType["ENTERPRISE"] = "enterprise";
    PackageType["CUSTOM"] = "custom";
})(PackageType || (exports.PackageType = PackageType = {}));
let EnterprisePackage = class EnterprisePackage extends mongoose_2.Document {
    name;
    description;
    type;
    status;
    monthlyPrice;
    yearlyPrice;
    features;
    includedServices;
    setupFee;
    isCustom;
    customerId;
    customerEmail;
    createdBy;
    createdByUsername;
    notes;
    validFrom;
    validUntil;
};
exports.EnterprisePackage = EnterprisePackage;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EnterprisePackage.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EnterprisePackage.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: Object.values(PackageType), default: PackageType.STANDARD }),
    __metadata("design:type", String)
], EnterprisePackage.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: Object.values(PackageStatus), default: PackageStatus.DRAFT }),
    __metadata("design:type", String)
], EnterprisePackage.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], EnterprisePackage.prototype, "monthlyPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], EnterprisePackage.prototype, "yearlyPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Object }),
    __metadata("design:type", Object)
], EnterprisePackage.prototype, "features", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], EnterprisePackage.prototype, "includedServices", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], EnterprisePackage.prototype, "setupFee", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], EnterprisePackage.prototype, "isCustom", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], EnterprisePackage.prototype, "customerId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], EnterprisePackage.prototype, "customerEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EnterprisePackage.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EnterprisePackage.prototype, "createdByUsername", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], EnterprisePackage.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], EnterprisePackage.prototype, "validFrom", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], EnterprisePackage.prototype, "validUntil", void 0);
exports.EnterprisePackage = EnterprisePackage = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], EnterprisePackage);
exports.EnterprisePackageSchema = mongoose_1.SchemaFactory.createForClass(EnterprisePackage);
//# sourceMappingURL=enterprise-package.schema.js.map