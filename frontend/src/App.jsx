
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './Pages/Auth/Login'
import AdminDashboard from './Pages/Admin/AdminDashboard'
import StaffDashboard from './Pages/Staff/StaffDashboard'
import DoctorDashboard from './Pages/Doctor/DoctorDashboard'
import PatientDashboard from './Pages/Patient/PatientDashboard'
import ProtectedRoutes from './Routes/ProtectedRoutes'
import { useAuth } from './Context/AuthContext'
import HospStaffReg from './Pages/Admin/hospStaffRegister'

const App = () => {
  const {token,userRole} =useAuth();
  return (

    <BrowserRouter>
      <Routes>
       {/* if token exist redirect to their dashboard else go back to login */}
           <Route path="/login" element={
          token?(
            userRole ==='admin'?(
              <Navigate to='/admin'/>
            ): userRole ==='staff' ?(
              <Navigate to ='/staff'/>
            ): userRole ==='doctor' ?(
              <Navigate to ='/doctor'/>
            ): userRole ==='patient'?(
              <Navigate to ='/patient'/>
            ):(
              <Login/>
            )


          ):(
          <Login />
          )
        } />
      


      {/* Admin dashboard  */}
    
        <Route path="/admin" element={
          <ProtectedRoutes allowedRoles={['admin']}  >
            <AdminDashboard />
            <HospStaffReg/>
          </ProtectedRoutes>
        } />
      

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

      </Routes>
    </BrowserRouter>


  )
}

export default App
