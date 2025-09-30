
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './Pages/Auth/Login'
import RegisterPatient from './Pages/Auth/Register'
import AdminDashboard from './Pages/Admin/AdminDashboard'
import StaffDashboard from './Pages/Staff/StaffDashboard'
import DoctorDashboard from './Pages/Doctor/DoctorDashboard'
import PatientDashboard from './Pages/Patient/PatientDashboard'
import ProtectedRoutes from './Routes/ProtectedRoutes'

const App = () => {


  return (

    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPatient />} />
      </Routes>

      {/* Admin dashboard  */}
      <Routes>
        <Route path="/admin" element={
          <ProtectedRoutes allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoutes>
        } />
      </Routes>

      {/* Staff dashboard */}
      <Routes>
        <ProtectedRoutes allowedRoles={['admin','staff']}>
          <Route path="/staff" element={<StaffDashboard />} />
        </ProtectedRoutes>
      </Routes>

      {/* Doctor dashboard */}
      <Routes>
        <ProtectedRoutes allowedRoles={['admin','doctor']}>
          <Route path="/doctor" element={<DoctorDashboard />} />
        </ProtectedRoutes>
      </Routes>

      {/* patient dashboard */}
      <Routes>
        <ProtectedRoutes allowedRoles={['admin','patient']}>
          <Route path="/patient" element={<PatientDashboard />} />
        </ProtectedRoutes>
      </Routes>
    </BrowserRouter>


  )
}

export default App
