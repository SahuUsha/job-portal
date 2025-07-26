import express from "express"
import cors from "cors"
import { createUser, signInUser } from "./controllers/userControllers";
import { applicationCount, createJob, getallActiveJob, getJobById, toggleJobActivity } from "./controllers/job.controller";
import { authMiddleware } from "./middlewares/auth.middleware";
import { get } from "http";
import upload from "./utils/upload";
import { applicationfill } from "./controllers/application.controller";


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

app.listen(5000)