import express from "express"
import UserRouter from "./routes/userRoutes.js"
import cors from "cors"
import PatientRouter from "./routes/patientRoutes.js"
import StaffRouter from "./routes/staffRoutes.js"
import RegistrationRouter from "./routes/registrationRoutes.js"
import HospitalStaffRouter from "./routes/hospitalStaffRoutes.js"
import DocDeptRouter from "./routes/docDeptRoutes.js"
import AppointmentRouter from "./routes/appointmentRoutes.js"
import PaymentRouter from "./routes/paymentRoutes.js"
import BloodBankRouter from "./routes/bloodBankRoutes.js"
import BloodBankReqRouter from "./routes/bloodBankReqRoute.js"
import NotificationRouter from "./routes/notificationRoutes.js"
import FeedbackRouter from "./routes/feedbackRoutes.js"
import ChatRouter from "./routes/chatRoutes.js"
import EmailLogRouter from "./routes/emailLogsRoute.js"

const app = express()
// middlewares
app.use(express.json())
app.use(cors())

app.use('/api/user', UserRouter)
app.use('/api/patient', PatientRouter)
app.use('/api/registration', RegistrationRouter)
app.use('/api/hospStaff', HospitalStaffRouter)
app.use('/api/staff', StaffRouter)
app.use('/api/docDept', DocDeptRouter)
app.use('/api/appointment', AppointmentRouter )
app.use('/api/payment', PaymentRouter )
app.use('/api/bloodBank', BloodBankRouter )
app.use('/api/bloodBankReq', BloodBankReqRouter )
app.use('/api/notification', NotificationRouter )
app.use('/api/feedback', FeedbackRouter )
app.use('/api/chat', ChatRouter )
app.use('/api/emailLog', EmailLogRouter )



export default app