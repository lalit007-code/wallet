import express from "express";
import { test } from "../controller/auth.controller.js";

const router = express.Router();

router.get("/test", test);

export default router;
