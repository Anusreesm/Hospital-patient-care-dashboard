
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

const App = () => {
  const { token, userRole } = useAuth();
  return (

    <BrowserRouter>
      {/* Toaster should be here */}
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <Routes>
        {/* if token exist redirect to their dashboard else go back to login */}
        <Route path="/login" element={
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



        {/* Admin dashboard and admin only */}

        <Route path="/admin" element={
          <ProtectedRoutes allowedRoles={['admin']}  >
            <AdminDashboard />
          </ProtectedRoutes>
        } />

        {/* hospital staff register */}
        <Route
          path="/admin/staff"
          element={
            <ProtectedRoutes allowedRoles={['admin']}>
              <HospStaff />
            </ProtectedRoutes>
          }
        />

        {/* hospital staff register */}
        <Route
          path="/admin/staff/register"
          element={
            <ProtectedRoutes allowedRoles={['admin']}>
              <HospStaffReg />
            </ProtectedRoutes>
          }
        />
        {/* settings */}
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoutes allowedRoles={['admin']}>
              <SettingsPage />
            </ProtectedRoutes>
          }
        />

        {/* department */}
        <Route
          path="/admin/settings/dept"
          element={
            <ProtectedRoutes allowedRoles={['admin']}>
              <DeptMaster />
            </ProtectedRoutes>
          }
        />

        {/* Specialization master */}
        <Route
          path="/admin/settings/specz"
          element={
            <ProtectedRoutes allowedRoles={['admin']}>
              <SpeczMaster />
            </ProtectedRoutes>
          }
        />


        {/* change user status */}
        <Route
          path="/admin/settings/changeUserStatus"
          element={
            <ProtectedRoutes allowedRoles={['admin']}>
              <ChangeUserStatus />
            </ProtectedRoutes>
          }
        />


        {/* Staff dashboard */}


        <Route path="/staff" element={
          <ProtectedRoutes allowedRoles={['admin', 'staff']}>
            <StaffDashboard />
          </ProtectedRoutes>
        } />




        {/* Doctor dashboard */}


        <Route path="/doctor" element={
          <ProtectedRoutes allowedRoles={['admin', 'doctor']}>
            <DoctorDashboard />
          </ProtectedRoutes>
        } />



        {/* patient dashboard */}


        <Route path="/patient" element={
          <ProtectedRoutes allowedRoles={['admin', 'patient']}>
            <PatientDashboard />
          </ProtectedRoutes>
        } />


        {/* both admin and staff */}

        <Route path='/patientManagement' element={
          <ProtectedRoutes allowedRoles={['admin', 'staff']}>
            <PatientManagement />
          </ProtectedRoutes>
        }
        />
        {/* common */}
        <Route path='/appointmentManagement' element={
          <ProtectedRoutes allowedRoles={['admin', 'staff', 'doctor', 'patient']}>
            <AppointmentManagement />
          </ProtectedRoutes>
        }
        />
        {/* appointment booking */}
        <Route
          path="/:userRole/appointment/create"
          element={
            <ProtectedRoutes allowedRoles={['admin', 'staff', 'patient']}>
              <AppointmentCreate />
            </ProtectedRoutes>
          }
        />
        {/* payment booking */}
         <Route
          path="/:userRole/payment/create"
          element={
            <ProtectedRoutes allowedRoles={['admin', 'staff', 'patient']}>
              <PaymentManagement />
            </ProtectedRoutes>
          }
        />

      </Routes>
    </BrowserRouter>


  )
}

export default App
