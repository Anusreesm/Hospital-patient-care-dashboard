import express from "express";
import { createDept, deleteDept, getDept, getDeptById, updateDept,  } from "../controllers/deptMasterController.js";
import { authMiddleware, authorize } from "../middlewares/authorize.js";


const DeptMasterRouter = express.Router()

// @route   POST/api/deptMaster/create
// @desc    create new dept
DeptMasterRouter.post("/create",authMiddleware,authorize("admin"), createDept)


// @route   GET/api/deptMaster/
// @desc   GET all dept
DeptMasterRouter.get("/",authMiddleware, getDept)

// @route   GET/api/deptMaster/:id
// @desc   GET single dept
DeptMasterRouter.get("/:id",authMiddleware, getDeptById)

// @route   PUT/api/deptMaster/update/:id
// @desc   update dept
DeptMasterRouter.put("/update/:id",authMiddleware,authorize("admin"), updateDept)

// @route   DELETE/api/deptMaster/delete/:id
// @desc   delete dept
DeptMasterRouter.delete("/delete/:id",authMiddleware,authorize("admin"), deleteDept)


export default DeptMasterRouter