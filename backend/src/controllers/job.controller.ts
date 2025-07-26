
import {JobType, PrismaClient, Role} from "@prisma/client"
import { Request, Response } from "express"
import { z} from "zod"



const prisma = new PrismaClient()

const createJobSchema = z.object({
    title: z.string().min(3).trim(),
    description: z.string().min(10),    
    department: z.string().min(3),
    location: z.string().min(3),
    salary: z.string().trim(),
    isActive : z.boolean(),
    jobType: z.string().min(3).trim(),
    requireResume: z.boolean(), 
    customFields: z
    .array(
      z.object({
        fieldName: z.string().min(3).trim(),
        fieldValue: z.string().min(3).trim(),
      })
    )
    .optional(),
})

const createJob = async(req : Request, res: Response) => {
    
    const data = createJobSchema.safeParse(req.body);

    if(!data.success){
        res.status(400).json({
            message : "Incorrect inputs"
        })
        return
    }

    try {

        const existedJob = await prisma.job.findFirst({
            where: {
                title: data.data?.title,
                department: data.data?.department,
                location: data.data?.location
            }
        })

        if(existedJob){
            res.status(411).json({
                message : "Job already existed with same title, department and location"
            })
            return
        }

        const jobTypeInput = data.data.jobType.toUpperCase() as JobType;

         if (!["FULL_TIME","PART_TIME","CONTRACT","INTERN","FREELANCE"].includes(jobTypeInput)) {
           return res.status(400).json({ message: "Invalid role provided" });
} 
        // @ts-ignore
         const userId = req.userId as string;

        const job = await prisma.job.create({
            data : {
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
        })

        res.status(201).json({
            message : "Job created successfully",
            job
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message : "Internal server error"
        })
    }

}

const getallActiveJob=async(req : Request ,  res : Response)=>{
       
    try {
         const jobs = await prisma.job.findMany({
            where: {
                isActive: true
            },
            orderBy : {
                createdAt: "desc"
            }
         })

        if(jobs.length === 0){
            res.status(404).json({  
                message : "No active jobs found"
            })
        }

            res.status(200).json({
                jobs
            })

    } catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            message : "error on getting jobs"
        })
    }
}

const getJobById = async(req: Request, res: Response) => {
    try {
        const jobId = req.params.id;

        const job = await prisma.job.findUnique({
            where: {
                id: jobId
            }
        })

        if(!job){
            res.status(404).json({
              error: "Job not found"
            })
        }
        res.status(200).json({
            job
        })
    

    } catch (error) {
         res.status(500).json({ error: "Error fetching job" });
    }
}

const toggleJobActivity =async(req: Request, res: Response)=>{
    try {
         const jobId = req.params.id;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const updatedJob = await prisma.job.update({
        where : { id: jobId },
        data: {
            isActive: !job.isActive
        }
    })

    res.status(200).json({
        message: `Job is now ${updatedJob.isActive ? "active" : "inactive"}`,
        job: updatedJob
    })

    } catch (error) {
    console.error("Error toggling job status:", error);
    res.status(500).json({ message: "Error toggling job status" });
    }
}

const applicationCount = async(req: Request, res: Response) => {
    try {
        
        const jobId = req.params.id;

        const job = await prisma.job.findUnique({
            where : { id : jobId},
            include:{
                _count:{
                    select: { applications: true}
                }
            },
            
        })

        res.status(200).json({  
            applicationCount: job?._count.applications || 0

        })


    } catch (error) {
        console.error("Error fetching application count:", error);
        res.status(500).json({ message: "Error fetching application count" });
        
    }
}

const getJobApplications = async(req: Request, res: Response) => {
    try {
        
        const jobId = req.params.id;

        const job = await prisma.job.findUnique({
            where : {
                id : jobId
            }
        })

       if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const applications = await prisma.application.findMany({
        where : {jobId},
        include:{
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                job: {
                    select: {
                        title: true,
                        department: true
                    }
                }
            
        }
    })

    const enrichedApplications = await Promise.all(
        applications.map(async (application)=>{
            let resume = null;

            if((application as any).usedOnsiteResume){
                resume = await prisma.resume.findUnique({
                    where: {userId: application.userId},
                })
            }


            return {
                ...application,
                resume
            }

        })
    )

    res.status(200).json({
        jobId,
        totalApplications: applications.length,
        applications : enrichedApplications
    })

    } catch (error) {
        console.error("Error fetching job applications:", error);
        res.status(500).json({ message: "Error fetching job applications" });
        
    }
}


export {
    createJob,
    getallActiveJob,
    getJobById,
    toggleJobActivity,
    applicationCount,
    getJobApplications


}