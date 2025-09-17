import express from "express";


const DocDeptRouter = express.Router()

DocDeptRouter.get('/', getDocDept)


export default DocDeptRouter