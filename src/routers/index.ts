import { Router } from "express";
import { authRouter } from "./auth.router";
import { profileRouter } from "./profile.router";


const mainRouter = Router();

    mainRouter.use("/user", authRouter);
    mainRouter.use("/profile", profileRouter)

export default mainRouter;