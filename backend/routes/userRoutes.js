import express from "express";
import app from "../app.js";
import { changeUserPassword, changeUserStatus, deleteUser, getCurrentUser, getUserById, getUsers, loginUser, registerUser, updateUser } from "../controllers/UserController.js";


const UserRouter=express.Router()
// @route   POST/api/users/register
// @desc    Register new user
UserRouter.post("/register", registerUser)

// @route   POST/api/users/login
// @desc    Authenticate user
UserRouter.post("/login", loginUser)

// @route   GET/api/users/
// @desc   GET all users
UserRouter.get("/", getUsers)

// @route   GET/api/users/:id
// @desc   GET single users
UserRouter.get("/:id", getUserById)

// @route   PUT/api/users/update/:id
// @desc   update user
UserRouter.put("/update/:id", updateUser)

// @route   DELETE/api/users/delete/:id
// @desc   delete user
UserRouter.delete("/delete/:id", deleteUser)

// @route   PATCH /api/users/status/:id
// @desc    Change user active/inactive status
UserRouter.patch("/status/:id", changeUserStatus);

// @route   PATCH /api/users/password/:id
// @desc    Change user password
UserRouter.patch("/password/:id", changeUserPassword);

// @route   GET /api/users/me
// @desc    Get current logged-in user profile
UserRouter.get("/me", getCurrentUser);

export default UserRouter