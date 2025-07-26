import {PrismaClient, Role} from "@prisma/client"
import { Request, Response } from "express"
import { z} from "zod"
import { comparedPassword, hashPassword } from "../utils/hash"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config"


const prisma = new PrismaClient()

const UserSchema = z.object({
    name: z.string().min(3).trim(),
    password: z.string().trim(),
    email : z.string().trim(),
    role : z.string().trim()
})

    
const SignInSchema = z.object({
    password: z.string().trim(),
    email : z.string().trim(),
    role : z.string().trim()
})


const createUser =async(req:Request, res: Response)=>{

    const data = UserSchema.safeParse(req.body);

    

    if(!data.success){
        res.json({
            message : "Incorrect inputs"
        })
       return
    }
  const roleInput = data.data.role;

  // ✅ Validate role safely as string
 if (!["USER", "ADMIN"].includes(roleInput.toUpperCase())) {
  return res.status(400).json({ message: "Invalid role provided" });
}

const role = roleInput.toUpperCase() as Role;

    try {
        const existedUser = await prisma.user.findFirst({
            where: {
                email : data.data?.email,
                name : data.data?.name,
                role : role
                
            }
        })

        if(existedUser){
        res.status(411).json({
            message : "User already existed with same username"
        })
        return
     }
  
     const hashedPassword =await hashPassword(data.data?.password)


     const user = await prisma.user.create({
        data:{
            name: data.data?.name,
            password: hashedPassword,
            email : data.data?.email,
            role: role as Role
        }
     })

     res.status(200).json({
        user : user,
        message : "User created successfully"

     })
        
    } catch (error) {
        console.log( "error: ",error)
       res.status(400).json({
            message : "error on creating user "
        })
        
    }
}



const signInUser=async(req : Request , res : Response)=>{

    const data = SignInSchema.safeParse(req.body)

    if(!data.success){
        res.json({
            message : "Incorrect inputs"
        });
        return 
    }

    try {
      
        const roleInput = data.data.role;

// Ensure it matches the enum values
if (!["USER", "ADMIN"].includes(roleInput.toUpperCase())) {
  return res.status(400).json({ message: "Invalid role provided" });
}

const role = roleInput.toUpperCase() as Role;


        const user = await prisma.user.findFirst({
            where  : {
                email : data.data?.email,
                role : role
            }
        })

         if(!user){
         res.status(404).json({
             message: "user not found"
         })
         return
     }

       const validPassword =  await comparedPassword(data.data?.password ,user.password)

       if(!validPassword){
        res.status(400).json({
            message : "Password is incorrect"
        })
        return
       }


       const userId = user?.id;
       const token = jwt.sign({userId : userId}, JWT_SECRET as string)
        
      if(!token){
         res.status(401).json({
             message: "error on creating token"
         })
      }

      res.status(200).json({
        token : token
     })

    } catch (error) {
         res.status(500).json({
        message : "error on signing"
    })
    }
      
}

const upsertResume = async(req: Request , res : Response)=>{

    // @ts-ignore
   const userId = req.userId as string;
   const {content} = req.body;

   if (!content || typeof content !== "object") {
    return res.status(400).json({ message: "Invalid resume content provided" });
  }


    try {

       
      const resume = await prisma.resume.upsert({
      where: { userId },
      update: { content },
      create: { userId, content }
    });

       res.status(200).json({
        message: "Resume upserted successfully",
        resume
       })
        
    } catch (error) {
        console.error("Error upserting resume:", error);
        res.status(500).json({
            message: "Error upserting resume",  
        
    })

}
}

const getResume = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId as string;

  try {
    const resume = await prisma.resume.findUnique({
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
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({
      message: "Error fetching resume",
    });
  }
};

const getAdminDashboard = async(req: Request, res: Response)=>{
    
    // @ts-ignore
    const userId = req.userId ;
    try {
        const job = await prisma.job.findMany({
            where:{
                ownerId: userId
            },
            include:{
                _count:{
                    select:{
                        applications: true
                    }
                }
            }
        })
 
        const stats = job.map(job=>({
            id : job.id,
            titlle : job.title,
            isActive : job.isActive,
            applicationCount: job._count.applications
        }))

        res.status(200).json({
            stats
        })
    } catch (error) {
        res.status(500).json({
            message: "Error fetching admin dashboard"
    })

}
}
export {
    createUser,
    signInUser,
    upsertResume,
    getAdminDashboard,
    getResume
}