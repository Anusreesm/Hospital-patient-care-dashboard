import express from "express";
import { createDept, deleteDept, getDept, getDeptById, updateDept,  } from "../controllers/deptMasterController.js";


const DeptMasterRouter = express.Router()

// @route   POST/api/deptMater/create
// @desc    create new dept
DeptMasterRouter.post("/create", createDept)


// @route   GET/api/deptMater/
// @desc   GET all dept
DeptMasterRouter.get("/", getDept)

// @route   GET/api/deptMater/:id
// @desc   GET single dept
DeptMasterRouter.get("/:id", getDeptById)

// @route   PUT/api/deptMater/update/:id
// @desc   update dept
DeptMasterRouter.put("/update/:id", updateDept)

// @route   DELETE/api/deptMater/delete/:id
// @desc   delete dept
DeptMasterRouter.delete("/delete/:id", deleteDept)


export default DeptMasterRouter