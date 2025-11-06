"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDomainService = void 0;
const common_1 = require("@nestjs/common");
let UserDomainService = class UserDomainService {
    validateNewUser(user) {
        if (!user.email)
            throw new Error('Email required');
        if (!user.name || user.name.length < 2)
            throw new Error('Name too short');
    }
};
exports.UserDomainService = UserDomainService;
exports.UserDomainService = UserDomainService = __decorate([
    (0, common_1.Injectable)()
], UserDomainService);
