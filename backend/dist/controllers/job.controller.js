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
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationCount = exports.toggleJobActivity = exports.getJobById = exports.getallActiveJob = exports.createJob = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const createJobSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).trim(),
    description: zod_1.z.string().min(10),
    department: zod_1.z.string().min(3),
    location: zod_1.z.string().min(3),
    salary: zod_1.z.string().trim(),
    isActive: zod_1.z.boolean(),
    jobType: zod_1.z.string().min(3).trim(),
    requireResume: zod_1.z.boolean(),
    customFields: zod_1.z
        .array(zod_1.z.object({
        fieldName: zod_1.z.string().min(3).trim(),
        fieldValue: zod_1.z.string().min(3).trim(),
    }))
        .optional(),
});
const createJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const data = createJobSchema.safeParse(req.body);
    if (!data.success) {
        res.status(400).json({
            message: "Incorrect inputs"
        });
        return;
    }
    try {
        const existedJob = yield prisma.job.findFirst({
            where: {
                title: (_a = data.data) === null || _a === void 0 ? void 0 : _a.title,
                department: (_b = data.data) === null || _b === void 0 ? void 0 : _b.department,
                location: (_c = data.data) === null || _c === void 0 ? void 0 : _c.location
            }
        });
        if (existedJob) {
            res.status(411).json({
                message: "Job already existed with same title, department and location"
            });
            return;
        }
        const jobTypeInput = data.data.jobType.toUpperCase();
        if (!["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN", "FREELANCE"].includes(jobTypeInput)) {
            return res.status(400).json({ message: "Invalid role provided" });
        }
        // @ts-ignore
        const userId = req.userId;
        const job = yield prisma.job.create({
            data: {
                ownerId: userId,
                title: data.data.title,
                description: data.data.description,
                department: data.data.department,
                location: data.data.location,
                salary: data.data.salary,
                isActive: data.data.isActive,
                jobType: jobTypeInput,
                requireResume: data.data.requireResume,
                customFields: data.data.customFields || []
            }
        });
        res.status(201).json({
            message: "Job created successfully",
            job
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});
exports.createJob = createJob;
const getallActiveJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobs = yield prisma.job.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        if (jobs.length === 0) {
            res.status(404).json({
                message: "No active jobs found"
            });
        }
        res.status(200).json({
            jobs
        });
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            message: "error on getting jobs"
        });
    }
});
exports.getallActiveJob = getallActiveJob;
const getJobById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobId = req.params.id;
        const job = yield prisma.job.findUnique({
            where: {
                id: jobId
            }
        });
        if (!job) {
            res.status(404).json({
                error: "Job not found"
            });
        }
        res.status(200).json({
            job
        });
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching job" });
    }
});
exports.getJobById = getJobById;
const toggleJobActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobId = req.params.id;
        const job = yield prisma.job.findUnique({ where: { id: jobId } });
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        const updatedJob = yield prisma.job.update({
            where: { id: jobId },
            data: {
                isActive: !job.isActive
            }
        });
        res.status(200).json({
            message: `Job is now ${updatedJob.isActive ? "active" : "inactive"}`,
            job: updatedJob
        });
    }
    catch (error) {
        console.error("Error toggling job status:", error);
        res.status(500).json({ message: "Error toggling job status" });
    }
});
exports.toggleJobActivity = toggleJobActivity;
const applicationCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobId = req.params.id;
        const job = yield prisma.job.findUnique({
            where: { id: jobId },
            include: {
                _count: {
                    select: { applications: true }
                }
            },
        });
        res.status(200).json({
            applicationCount: (job === null || job === void 0 ? void 0 : job._count.applications) || 0
        });
    }
    catch (error) {
        console.error("Error fetching application count:", error);
        res.status(500).json({ message: "Error fetching application count" });
    }
});
exports.applicationCount = applicationCount;
