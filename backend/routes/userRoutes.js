import express from "express";
import { changeUserPassword, changeUserStatus, checkEmail, deleteUser, forgotUserPassword, getUserById, getUsers, loginUser, registerUser, updateUser } from "../controllers/userController.js";





const UserRouter=express.Router()
// @route   POST/api/users/register
// @desc    Register new user
//authorize("admin", "doctor", "staff", "patient")
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
// @desc    Change user active/deactivated status
UserRouter.patch("/status/:id", changeUserStatus);

// @route   PATCH /api/users/password/:id
// @desc    Change user password-needs both oldPassword and newPassword
UserRouter.patch("/password/:id", changeUserPassword);

// @route   PATCH /api/users/forgotPassword/:id
// @desc    Change user password-only needs newPassword, used in forgot password flow
UserRouter.patch("/forgotPassword/:id", forgotUserPassword);


// @route GET/api/users/check-email/:email
// desc Check email duplicates
UserRouter.get('/check-email/:email', checkEmail)



export default UserRouter