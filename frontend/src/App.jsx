
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './Pages/Auth/Login'
import AdminDashboard from './Pages/Admin/AdminDashboard'
import StaffDashboard from './Pages/Staff/StaffDashboard'
import DoctorDashboard from './Pages/Doctor/DoctorDashboard'
import PatientDashboard from './Pages/Patient/PatientDashboard'
import ProtectedRoutes from './Routes/ProtectedRoutes'
import { useAuth } from './Context/AuthContext'

import DeptMaster from './Pages/Settings/DepartmentMaster'
import SettingsPage from './Pages/Settings/SettingsControl'
import SpeczMaster from './Pages/Settings/SpecializationMaster'

import { Toaster } from 'react-hot-toast'
import ChangeUserStatus from './Pages/Settings/ChangeUserStatus'



import HospStaff from './Pages/Admin/UserManagement/HospStaffPage'
import HospStaffReg from './Pages/Admin/UserManagement/hospStaffRegister'
import AppointmentManagement from './Pages/Common/AppointmentManagement/Appointment'
import AppointmentCreate from './Pages/Common/AppointmentManagement/AppointmentCreate'
import PatientManagement from './Pages/Common/patientManagement/patientManagement'
import PaymentManagement from './Pages/Common/PaymentManagement/Payment'
import SuccessPage from './Pages/Common/PaymentManagement/Success'
import CancelPage from './Pages/Common/PaymentManagement/Cancel'
import PatientCreate from './Pages/Common/patientManagement/patientCreate'
import BloodBankManagement from './Pages/Common/BloodBankManagement/bloodBankManagement'
import CreateDonation from './Pages/Common/BloodBankManagement/Donation/createDonation'
import CreateRequest from './Pages/Common/BloodBankManagement/Requests/createRequest'
import BloodStockAdj from './Pages/Settings/BloodStockAdj'
import ChangeUserPassword from './Pages/Common/Profile/ChangeUserPassword'
import ForgotPassword from './Pages/Auth/ForgotPassword'
import ResetPassword from './Pages/Auth/ResetPassword'

const App = () => {
  const { token, userRole } = useAuth();
  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <BrowserRouter>
        {/* Toaster should be here */}
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
        {/* =======================
            PUBLIC ROUTES (NO SIDEBAR)
        ======================== */}
        {!token && (
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        )}

        {/* =======================
            AUTHENTICATED ROUTES (WITH SIDEBAR)
        ======================== */}
        {token && (
          <div className="sm:ml-64">
            <Routes>
              {/* if token exist redirect to their dashboard else go back to login */}
              <Route path="/" element={
                token ? (
                  userRole === 'admin' ? (
                    <Navigate to='/admin' />
                  ) : userRole === 'staff' ? (
                    <Navigate to='/staff' />
                  ) : userRole === 'doctor' ? (
                    <Navigate to='/doctor' />
                  ) : userRole === 'patient' ? (
                    <Navigate to='/patient' />
                  ) : (
                    <Login />
                  )


                ) : (
                  <Login />
                )
              } />


              {/* =============================================
                ADMIN ROUTES
        ============================================== */}

              {/* ---------------------------------------------
            ADMIN DASHBOARD
        ---------------------------------------------- */}

              <Route path="/admin" element={
                <ProtectedRoutes allowedRoles={['admin']}  >
                  <AdminDashboard />
                </ProtectedRoutes>
              } />

              {/* ========== USER MANAGEMENT ========== */}

              {/* ---------------------------------------------
            HOSPITAL STAFF LIST
        ---------------------------------------------- */}
              <Route
                path="/admin/staff"
                element={
                  <ProtectedRoutes allowedRoles={['admin']}>
                    <HospStaff />
                  </ProtectedRoutes>
                }
              />

              {/* ---------------------------------------------
            HOSPITAL STAFF REGISTRATION
        ---------------------------------------------- */}
              <Route
                path="/admin/staff/register"
                element={
                  <ProtectedRoutes allowedRoles={['admin']}>
                    <HospStaffReg />
                  </ProtectedRoutes>
                }
              />
              {/* ========== SETTINGS ========== */}

              {/* ---------------------------------------------
            SETTINGS HOME
        ---------------------------------------------- */}
              <Route
                path="/:userRole/settings"
                element={
                  <ProtectedRoutes allowedRoles={['admin', 'staff', 'doctor', 'patient']}>
                    <SettingsPage />
                  </ProtectedRoutes>
                }
              />


              {/* ---------------------------------------------
            DEPARTMENT MASTER
        ---------------------------------------------- */}
              <Route
                path="/admin/settings/dept"
                element={
                  <ProtectedRoutes allowedRoles={['admin']}>
                    <DeptMaster />
                  </ProtectedRoutes>
                }
              />

              {/* ---------------------------------------------
            SPECIALIZATION MASTER
        ---------------------------------------------- */}
              <Route
                path="/admin/settings/specz"
                element={
                  <ProtectedRoutes allowedRoles={['admin']}>
                    <SpeczMaster />
                  </ProtectedRoutes>
                }
              />


              {/* ---------------------------------------------
            CHANGE USER STATUS
        ---------------------------------------------- */}
              <Route
                path="/admin/settings/changeUserStatus"
                element={
                  <ProtectedRoutes allowedRoles={['admin']}>
                    <ChangeUserStatus />
                  </ProtectedRoutes>
                }
              />


              {/* COMMON FOR WEVERY USER */}
              {/* ---------------------------------------------
            CHANGE PASSWORD
        ---------------------------------------------- */}
              <Route
                path="/:userRole/settings/changeUserPassword"
                element={
                  <ProtectedRoutes allowedRoles={['admin', 'staff', 'doctor', 'patient']}>
                    <ChangeUserPassword />
                  </ProtectedRoutes>
                }
              />


              {/* ---------------------------------------------
            Physical Inventory Update (Blood Bank)
        ---------------------------------------------- */}
              <Route
                path="/admin/settings/bloodStockAdj"
                element={
                  <ProtectedRoutes allowedRoles={['admin']}>
                    <BloodStockAdj />
                  </ProtectedRoutes>
                }
              />


              {/* =============================================
                STAFF ROUTES
        ============================================== */}

              {/* ---------------------------------------------
            STAFF DASHBOARD
        ---------------------------------------------- */}


              <Route path="/staff" element={
                <ProtectedRoutes allowedRoles={['admin', 'staff']}>
                  <StaffDashboard />
                </ProtectedRoutes>
              } />

              {/* =============================================
                DOCTOR ROUTES
        ============================================== */}

              {/* ---------------------------------------------
            DOCTOR DASHBOARD
        ---------------------------------------------- */}

              <Route path="/doctor" element={
                <ProtectedRoutes allowedRoles={['admin', 'doctor']}>
                  <DoctorDashboard />
                </ProtectedRoutes>
              } />



              {/* =============================================
                PATIENT ROUTES
        ============================================== */}

              {/* ---------------------------------------------
            PATIENT DASHBOARD
        ---------------------------------------------- */}


              <Route path="/patient" element={
                <ProtectedRoutes allowedRoles={['admin', 'patient']}>
                  <PatientDashboard />
                </ProtectedRoutes>
              } />


              {/* =============================================
                ADMIN , STAFF ,DOCTOR- ROUTES
        ============================================== */}


              {/* ========== PATIENT MANAGEMENT ========== */}


              {/* ---------------------------------------------
            PATIENT LIST PAGE
        ---------------------------------------------- */}

              <Route path='/patientManagement' element={
                <ProtectedRoutes allowedRoles={['admin', 'staff', 'doctor']}>
                  <PatientManagement />
                </ProtectedRoutes>
              }
              />
              {/* ---------------------------------------------
            PATIENT CREATE PAGE
        ---------------------------------------------- */}
              <Route
                path="/:userRole/patient/create"
                element={
                  <ProtectedRoutes allowedRoles={['admin', 'staff', 'doctor']}>
                    <PatientCreate />
                  </ProtectedRoutes>
                }
              />

              {/* ========== BLOOD BANK MANAGEMENT ========== */}

              {/* ---------------------------------------------
            BLOOD BANK MAIN PAGE
        ---------------------------------------------- */}
              <Route path='/bloodBankManagement' element={
                <ProtectedRoutes allowedRoles={['admin', 'staff', 'doctor']}>
                  <BloodBankManagement />
                </ProtectedRoutes>
              }
              />

              {/* ---------------------------------------------
            BLOOD BANK DONATION CREATION
        ---------------------------------------------- */}
              <Route path='/:userRole/bloodBankManagement/createDonation' element={
                <ProtectedRoutes allowedRoles={['admin', 'staff', 'doctor']}>
                  <CreateDonation />
                </ProtectedRoutes>
              }
              />

              {/* ---------------------------------------------
            BLOOD BANK REQUEST CREATION
        ---------------------------------------------- */}
              <Route path='/:userRole/bloodBankManagement/createRequest' element={
                <ProtectedRoutes allowedRoles={['admin', 'staff', 'doctor']}>
                  <CreateRequest />
                </ProtectedRoutes>
              }
              />


              {/* ===================================================
                ADMIN , STAFF ,DOCTOR,PATIENT(COMMON)- ROUTES
        =======================================================*/}





              {/* ========== APPOINTMENT MANAGEMENT ========== */}

              {/* ---------------------------------------------
            APPOINTMENT LIST PAGE
        ---------------------------------------------- */}
              <Route path='/appointmentManagement' element={
                <ProtectedRoutes allowedRoles={['admin', 'staff', 'doctor', 'patient']}>
                  <AppointmentManagement />
                </ProtectedRoutes>
              }
              />
              {/* ---------------------------------------------
            APPOINTMENT CREATE PAGE(BOOKING)
        ---------------------------------------------- */}

              <Route
                path="/:userRole/appointment/create"
                element={
                  <ProtectedRoutes allowedRoles={['admin', 'staff', 'patient']}>
                    <AppointmentCreate />
                  </ProtectedRoutes>
                }
              />

              {/* ========== PAYMENT MANAGEMENT ========== */}

              {/* ---------------------------------------------
            PAYMENT CREATE PAGE
        ---------------------------------------------- */}
              <Route
                path="/:userRole/payment/create"
                element={
                  <ProtectedRoutes allowedRoles={['admin', 'staff', 'patient']}>
                    <PaymentManagement />
                  </ProtectedRoutes>
                }
              />
              {/* ---------------------------------------------
            PAYMENT SUCCESS / CANCEL
        ---------------------------------------------- */}
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/cancel" element={<CancelPage />} />
            </Routes>
          </div>
        )}
      </BrowserRouter>

    </div>
  )
}

export default App
