
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


        const {answer, usedOnsiteResume = false } = req.body

        const resumeUrl = req.file?.path; 

        
        const newApplication = await prisma.application.create({
            data: {
                jobId: jobId,
                userId: userId,
                answer: answer,
               resumeUrl: usedOnsiteResume ? null : resumeUrl || null,
               usedOnsiteResume: usedOnsiteResume
            }
        });

        res.status(201).json({ message: "Application submitted successfully", application: newApplication });

    } catch (error) {
        console.error("Error submitting application:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const updateApplicationStatus =async(req : Request , res : Response)=>{
    try {
      const {status} = req.body;

      const applicationId = req.params.id;

      const updatedApplication = await prisma.application.update({
        where: { id : applicationId} ,
        data: {status}
      })
  
      

      res.status(200).json({
        message: "Application status updated successfully",
        application: updatedApplication
      })
        
    } catch (error) {
        console.error("Error updating application status:", error);

        res.status(500).json({
            error: "Error updating application status"
        })
    }

}
export { 
    applicationfill,
    updateApplicationStatus

 };


