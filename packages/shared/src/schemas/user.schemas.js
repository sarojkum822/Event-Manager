"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../types");
exports.createUserSchema = zod_1.z.object({
    firebaseUid: zod_1.z.string().min(1),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().min(10).max(15),
    name: zod_1.z.string().min(2).max(100),
    role: zod_1.z.nativeEnum(types_1.UserRole),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100).optional(),
    avatar: zod_1.z.string().url().optional(),
});
