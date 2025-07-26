"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResume = exports.getAdminDashboard = exports.upsertResume = exports.signInUser = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const hash_1 = require("../utils/hash");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const prisma = new client_1.PrismaClient();
const UserSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).trim(),
    password: zod_1.z.string().trim(),
    email: zod_1.z.string().trim(),
    role: zod_1.z.string().trim()
});
const SignInSchema = zod_1.z.object({
    password: zod_1.z.string().trim(),
    email: zod_1.z.string().trim(),
    role: zod_1.z.string().trim()
});
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const data = UserSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Incorrect inputs"
        });
        return;
    }
    const roleInput = data.data.role;
    // ✅ Validate role safely as string
    if (!["USER", "ADMIN"].includes(roleInput.toUpperCase())) {
        return res.status(400).json({ message: "Invalid role provided" });
    }
    const role = roleInput.toUpperCase();
    try {
        const existedUser = yield prisma.user.findFirst({
            where: {
                email: (_a = data.data) === null || _a === void 0 ? void 0 : _a.email,
                name: (_b = data.data) === null || _b === void 0 ? void 0 : _b.name,
                role: role
            }
        });
        if (existedUser) {
            res.status(411).json({
                message: "User already existed with same username"
            });
            return;
        }
        const hashedPassword = yield (0, hash_1.hashPassword)((_c = data.data) === null || _c === void 0 ? void 0 : _c.password);
        const user = yield prisma.user.create({
            data: {
                name: (_d = data.data) === null || _d === void 0 ? void 0 : _d.name,
                password: hashedPassword,
                email: (_e = data.data) === null || _e === void 0 ? void 0 : _e.email,
                role: role
            }
        });
        res.status(200).json({
            user: user,
            message: "User created successfully"
        });
    }
    catch (error) {
        console.log("error: ", error);
        res.status(400).json({
            message: "error on creating user "
        });
    }
});
exports.createUser = createUser;
const signInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const data = SignInSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Incorrect inputs"
        });
        return;
    }
    try {
        const roleInput = data.data.role;
        // Ensure it matches the enum values
        if (!["USER", "ADMIN"].includes(roleInput.toUpperCase())) {
            return res.status(400).json({ message: "Invalid role provided" });
        }
        const role = roleInput.toUpperCase();
        const user = yield prisma.user.findFirst({
            where: {
                email: (_a = data.data) === null || _a === void 0 ? void 0 : _a.email,
                role: role
            }
        });
        if (!user) {
            res.status(404).json({
                message: "user not found"
            });
            return;
        }
        const validPassword = yield (0, hash_1.comparedPassword)((_b = data.data) === null || _b === void 0 ? void 0 : _b.password, user.password);
        if (!validPassword) {
            res.status(400).json({
                message: "Password is incorrect"
            });
            return;
        }
        const userId = user === null || user === void 0 ? void 0 : user.id;
        const token = jsonwebtoken_1.default.sign({ userId: userId }, config_1.JWT_SECRET);
        if (!token) {
            res.status(401).json({
                message: "error on creating token"
            });
        }
        res.status(200).json({
            token: token
        });
    }
    catch (error) {
        res.status(500).json({
            message: "error on signing"
        });
    }
});
exports.signInUser = signInUser;
const upsertResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userId = req.userId;
    const { content } = req.body;
    if (!content || typeof content !== "object") {
        return res.status(400).json({ message: "Invalid resume content provided" });
    }
    try {
        const resume = yield prisma.resume.upsert({
            where: { userId },
            update: { content },
            create: { userId, content }
        });
        res.status(200).json({
            message: "Resume upserted successfully",
            resume
        });
    }
    catch (error) {
        console.error("Error upserting resume:", error);
        res.status(500).json({
            message: "Error upserting resume",
        });
    }
});
exports.upsertResume = upsertResume;
const getResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userId = req.userId;
    try {
        const resume = yield prisma.resume.findUnique({
            where: { userId },
        });
        if (!resume) {
            return res.status(404).json({
                message: "Resume not found",
            });
        }
        res.status(200).json({
            message: "Resume fetched successfully",
            resume,
        });
    }
    catch (error) {
        console.error("Error fetching resume:", error);
        res.status(500).json({
            message: "Error fetching resume",
        });
    }
});
exports.getResume = getResume;
const getAdminDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userId = req.userId;
    try {
        const job = yield prisma.job.findMany({
            where: {
                ownerId: userId
            },
            include: {
                _count: {
                    select: {
                        applications: true
                    }
                }
            }
        });
        const stats = job.map(job => ({
            id: job.id,
            titlle: job.title,
            isActive: job.isActive,
            applicationCount: job._count.applications
        }));
        res.status(200).json({
            stats
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching admin dashboard"
        });
    }
});
exports.getAdminDashboard = getAdminDashboard;
