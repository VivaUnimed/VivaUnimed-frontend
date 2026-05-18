import { Navigate, Route, Routes } from 'react-router';
import Login from '../pages/Login';
import RedirectIfAuthenticated from '../components/RedirectIfAuthenticated';
import PrivateRoutes from '../components/PrivateRoutes';
import PrivateLayout from '../components/layouts/PrivateLayout';
import AdminDashboard from '../pages/AdminDashboard';
import Professionals from '../pages/Professionals';
import Specialties from '../pages/Specialties';
import Vacancies from '../pages/Vacancies';
import Patients from '../pages/Patients';
import WeeklySchedule from '../pages/WeeklySchedule';
import CreateProfessional from '../pages/CreateProfessional';
import NoShowRegistration from '../pages/NoShowRegistration';
import CreatePatient from '../pages/CreatePatient';
import PatientDetails from '../pages/PatientDetails';
import EditPatient from '../pages/EditPatient';

export const RoutesApp = () => {
  return (
    <Routes>
      {/* --- Rotas Públicas --- */}
      <Route element={<RedirectIfAuthenticated />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* --- Rotas Privadas --- */}
      <Route element={<PrivateRoutes />}>
        <Route element={<PrivateLayout />}>
          <Route path="/" element={<AdminDashboard/>} />
          <Route path="/professionals" element={<Professionals />} />
          <Route path="/professionals/new" element={<CreateProfessional />} />
          <Route path="/specialties" element={<Specialties />} />
          <Route path="/weeklySchedule" element={<WeeklySchedule/>} />
          <Route path="/vacancies" element={<Vacancies/>} />
          <Route path="/vacancies/new" element={<NoShowRegistration/>} />
          <Route path="/patients" element={<Patients/>} />
          <Route path="/patients/new" element={<CreatePatient />} />
          <Route path="/patients/:patientId/edit" element={<EditPatient />} />
          <Route path="/patients/:patientId" element={<PatientDetails />} />
          <Route path="/settings" element={<div/>} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
