import express from "express"
import UserRouter from "./routes/userRoutes.js"
import cors from "cors"
import PatientRouter from "./routes/patientRoutes.js"
import RegistrationRouter from "./routes/registrationRoutes.js"
import HospitalStaffRouter from "./routes/hospitalStaffRoutes.js"
import AppointmentRouter from "./routes/appointmentRoutes.js"
import PaymentRouter from "./routes/paymentRoutes.js"
import BloodBankReqRouter from "./routes/bloodBankReqRoute.js"
import NotificationRouter from "./routes/notificationRoutes.js"
import FeedbackRouter from "./routes/feedbackRoutes.js"
import ChatRouter from "./routes/chatRoutes.js"
import EmailLogRouter from "./routes/emailLogsRoute.js"
import SpecializationMasterRouter from "./routes/specializationMasterRoutes.js"
import DeptMasterRouter from "./routes/deptMasterRoutes.js"
import BloodBankMasterRouter from "./routes/bloodBankMasterRoutes.js"

const app = express()
// middlewares
app.use(express.json())
app.use(cors())

app.use('/api/users', UserRouter)
app.use('/api/patient', PatientRouter)
app.use('/api/registration', RegistrationRouter)
app.use('/api/hospStaff', HospitalStaffRouter)
app.use('/api/deptMater', DeptMasterRouter)
app.use('/api/specializationMaster', SpecializationMasterRouter)
app.use('/api/appointment', AppointmentRouter )
app.use('/api/payment', PaymentRouter )
app.use('/api/bloodBankMaster', BloodBankMasterRouter )
app.use('/api/bloodBankReq', BloodBankReqRouter )
app.use('/api/notification', NotificationRouter )
app.use('/api/feedback', FeedbackRouter )
app.use('/api/chat', ChatRouter )
app.use('/api/emailLog', EmailLogRouter )



export default app