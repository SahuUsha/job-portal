import express from "express"
import cors from "cors"
import { createUser, getResume, signInUser, upsertResume } from "./controllers/userControllers";
import { applicationCount, createJob, getallActiveJob, getJobApplications, getJobById, toggleJobActivity } from "./controllers/job.controller";
import { authMiddleware } from "./middlewares/auth.middleware";
import { get } from "http";
import upload from "./utils/upload";
import { applicationfill, updateApplicationStatus } from "./controllers/application.controller";


const app = express()
app.use(express.json());
app.use(cors())


app.post("/signup",createUser)
app.post("/signin",signInUser)
app.post("/create-job",authMiddleware, createJob )
app.get("/getAllActiveJob", authMiddleware, getallActiveJob)
app.get("/job/:id",authMiddleware,getJobById)
app.patch("/job/toggle/:id",authMiddleware,toggleJobActivity )
app.get("/job/application-count/:id",authMiddleware, applicationCount)

app.post("/apply/:id", authMiddleware, upload.single("resume"), applicationfill)
app.get("/job/:id/applications", authMiddleware, getJobApplications)
app.patch("/application/:id" , authMiddleware, updateApplicationStatus)
app.get("/resume/profile", authMiddleware, getResume)
app.post("/resume/upsert",authMiddleware,upsertResume)


app.listen(5000)