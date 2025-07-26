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
exports.updateApplicationStatus = exports.applicationfill = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const applicationfill = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const jobId = req.params.id;
    //    @ts-ignore
    const userId = req.userId;
    try {
        // Check if the job exists
        const job = yield prisma.job.findUnique({
            where: { id: jobId },
            include: { applications: true }
        });
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        // Check if the user has already applied for this job
        const existingApplication = yield prisma.application.findFirst({
            where: {
                jobId: jobId,
                userId: userId
            }
        });
        if (existingApplication) {
            return res.status(400).json({ error: "You have already applied for this job" });
        }
        const { answer, usedOnsiteResume = false } = req.body;
        const resumeUrl = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        const newApplication = yield prisma.application.create({
            data: {
                jobId: jobId,
                userId: userId,
                answer: answer,
                resumeUrl: usedOnsiteResume ? null : resumeUrl || null,
                usedOnsiteResume: usedOnsiteResume
            }
        });
        res.status(201).json({ message: "Application submitted successfully", application: newApplication });
    }
    catch (error) {
        console.error("Error submitting application:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.applicationfill = applicationfill;
const updateApplicationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        const updatedApplication = yield prisma.application.update({
            where: { id: applicationId },
            data: { status }
        });
        res.status(200).json({
            message: "Application status updated successfully",
            application: updatedApplication
        });
    }
    catch (error) {
        console.error("Error updating application status:", error);
        res.status(500).json({
            error: "Error updating application status"
        });
    }
});
exports.updateApplicationStatus = updateApplicationStatus;
