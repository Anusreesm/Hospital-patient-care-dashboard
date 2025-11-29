import express from "express"
import UserRouter from "./routes/userRoutes.js"
import bodyParser from "body-parser";
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

import PatientAddressRouter from "./routes/addressesRoutes.js"
import BloodBankDonorRouter from "./routes/bloodBankDonorRoute.js";


const app = express()
// middlewares
app.use(
  cors({
    origin: [
      "https://hospital-patient-care-dashboard.vercel.app" //  live frontend
    ],
    methods: ["GET","POST","DELETE","PATCH","PUT"],
    credentials: true
  })
);



app.use(express.json());


app.use('/api/users', UserRouter)
app.use('/api/patient', PatientRouter)
app.use('/api/patientAddress', PatientAddressRouter)
app.use('/api/registration', RegistrationRouter)
app.use('/api/hospStaff', HospitalStaffRouter)
app.use('/api/deptMaster', DeptMasterRouter)
app.use('/api/specializationMaster', SpecializationMasterRouter)
app.use('/api/appointment', AppointmentRouter )
app.use('/api/payment', PaymentRouter )
app.use('/api/bloodBank', BloodBankMasterRouter )
app.use('/api/bloodBankReq', BloodBankReqRouter )
app.use('/api/bloodBankDonor',BloodBankDonorRouter)
app.use('/api/notification', NotificationRouter )
app.use('/api/feedback', FeedbackRouter )
app.use('/api/chat', ChatRouter )
app.use('/api/emailLog', EmailLogRouter )



export default app