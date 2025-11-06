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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../database/user.schema");
const user_mapper_1 = require("../mappers/user.mapper");
let UserRepository = class UserRepository {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(user) {
        const created = await this.userModel.create(user);
        return user_mapper_1.UserMapper.toDomain(created.toObject());
    }
    async update(id, patch) {
        const updated = await this.userModel
            .findByIdAndUpdate(id, patch, { new: true })
            .lean();
        return user_mapper_1.UserMapper.toDomain(updated);
    }
    async findById(id) {
        const found = await this.userModel.findById(id).lean();
        return user_mapper_1.UserMapper.toDomain(found);
    }
    async findByEmail(email) {
        const found = await this.userModel.findOne({ email }).lean();
        return user_mapper_1.UserMapper.toDomain(found);
    }
    async findAll(filter = {}) {
        const rows = await this.userModel.find(filter).lean();
        return rows.map((r) => user_mapper_1.UserMapper.toDomain(r));
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.UserModel.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserRepository);
