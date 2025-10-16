import express from "express";
import { createDept, deleteDept, getDept, getDeptById, updateDept,  } from "../controllers/deptMasterController.js";


const DeptMasterRouter = express.Router()

// @route   POST/api/deptMaster/create
// @desc    create new dept
DeptMasterRouter.post("/create", createDept)


// @route   GET/api/deptMaster/
// @desc   GET all dept
DeptMasterRouter.get("/", getDept)

// @route   GET/api/deptMaster/:id
// @desc   GET single dept
DeptMasterRouter.get("/:id", getDeptById)

// @route   PUT/api/deptMaster/update/:id
// @desc   update dept
DeptMasterRouter.put("/update/:id", updateDept)

// @route   DELETE/api/deptMaster/delete/:id
// @desc   delete dept
DeptMasterRouter.delete("/delete/:id", deleteDept)


export default DeptMasterRouter