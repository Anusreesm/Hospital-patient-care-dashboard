import express from "express";
import app from "../app.js";
import { getUsers, login } from "../controllers/UserController.js";

const UserRouter=express.Router()

UserRouter.get('/',getUsers)
// UserRouter.get('/login',login)

export default UserRouter