"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
const user_entity_1 = require("../../domain/entities/user.entity");
class UserMapper {
    static toDomain(raw) {
        if (!raw)
            return null;
        return new user_entity_1.User(raw._id?.toString() ?? raw.id, raw.name, raw.email, raw.passwordHash, raw.createdAt, raw.updatedAt);
    }
    static toResponse(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };
    }
}
exports.UserMapper = UserMapper;
