import express from "express";
import { changeUserPassword, changeUserStatus, checkEmail, deleteUser, forgotUserPassword, getUserById, getUsers, loginUser, registerUser, resetPassword, updateUser } from "../controllers/userController.js";
import { authAdmin, authMiddleware, authorize } from "../middlewares/authorize.js";


const UserRouter=express.Router()

// ------------------------------
// PUBLIC ROUTES
// ------------------------------

// @route   POST/api/users/register
// @desc    Register new user
UserRouter.post("/register", registerUser)

// @route   POST/api/users/login
// @desc    Authenticate user
UserRouter.post("/login", loginUser)


// @desc    Send reset-password link to user's email 
// @route   POST /api/users/forgotPassword
UserRouter.post("/forgotPassword", forgotUserPassword);

// @desc     reset-password 
// @route   POST /api/users/resetPassword
UserRouter.post("/resetPassword/:token",resetPassword)

// @route GET/api/users/check-email/:email
// desc Check email duplicates
UserRouter.get('/check-email/:email', checkEmail)


// ------------------------------
// PROTECTED ROUTES
// ------------------------------

// @route   GET/api/users/
// @desc   GET all users
UserRouter.get("/", getUsers)

// @route   GET/api/users/:id
// @desc   GET single users
UserRouter.get("/:id", getUserById)

// @route   PUT/api/users/update/:id
// @desc   update user
UserRouter.put("/update/:id",authMiddleware,authorize("admin"), updateUser)

// @route   DELETE/api/users/delete/:id
// @desc   delete user
UserRouter.delete("/delete/:id",authMiddleware,authorize("admin"), deleteUser)

// @route   PATCH /api/users/status/:id
// @desc    Change user active/deactivated status
UserRouter.patch("/status/:id",authMiddleware,authorize("admin"), changeUserStatus);

// @route   PATCH /api/users/password/:id
// @desc    Change user password-needs both oldPassword and newPassword
UserRouter.patch("/password/:id",authMiddleware, changeUserPassword);





export default UserRouter