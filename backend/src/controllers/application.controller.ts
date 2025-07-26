
import {PrismaClient} from "@prisma/client"
import { Request, Response } from "express"
import { z} from "zod"



const prisma = new PrismaClient()



const  applicationfill = async(req: Request, res: Response) => {

    const jobId = req.params.id;

    //    @ts-ignore
    const userId = req.userId ;

    try {
        // Check if the job exists
        const job = await prisma.job.findUnique({
            where: { id: jobId },
            include: { applications: true }
        });

        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }

        // Check if the user has already applied for this job
        const existingApplication = await prisma.application.findFirst({
            where: {
                jobId: jobId,
                userId: userId
            }
        });

        if (existingApplication) {
            return res.status(400).json({ error: "You have already applied for this job" });
        }

        // Create a new application 

        const {answer} = req.body

        const resumeUrl = req.file?.path; // Assuming you are using multer for file uploads

        
        const newApplication = await prisma.application.create({
            data: {
                jobId: jobId,
                userId: userId,
                answer: answer,
                resumeUrl: resumeUrl || null // Store the resume URL if provided
            }
        });

        res.status(201).json({ message: "Application submitted successfully", application: newApplication });

    } catch (error) {
        console.error("Error submitting application:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export { applicationfill };