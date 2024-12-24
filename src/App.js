import '@fortawesome/fontawesome-free/css/all.min.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Loading from './components/Loading';
import Layout from './Pages/Layout';
import SignIn from './Pages/SignIn';
import Registration from './Pages/Registration';
import Dashboard from './Pages/Dashboard';
import Goals from './Pages/Goals';
import SWOTAnalysis from './Pages/SWOTAnalysis';
import DailyTracker from './Pages/DailyTracker';
import Courses from './Pages/Courses';
import Settings from './Pages/Settings';
import PersonalInformation from './Pages/PersonalInformation';
import ProfessionalInformation from './Pages/ProfessionalInformation';
import GlobalInformation from './Pages/GlobalInformation';
import Documents from './Pages/Documents';
import "./App.css";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<SignIn />} />
              <Route path="registration" element={<Registration />} />
              <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="dashboard/personal-information" element={<PrivateRoute><PersonalInformation /></PrivateRoute>} />
              <Route path="dashboard/professional-information" element={<PrivateRoute><ProfessionalInformation /></PrivateRoute>} />
              <Route path="dashboard/global-information" element={<PrivateRoute><GlobalInformation /></PrivateRoute>} />
              <Route path="dashboard/documents" element={<PrivateRoute><Documents /></PrivateRoute>} />
              <Route path="dashboard/goals" element={<PrivateRoute><Goals /></PrivateRoute>} />
              <Route path="dashboard/swot" element={<PrivateRoute><SWOTAnalysis /></PrivateRoute>} />
              <Route path="dashboard/habits" element={<PrivateRoute><DailyTracker /></PrivateRoute>} />
              <Route path="dashboard/courses" element={<PrivateRoute><Courses /></PrivateRoute>} />
              <Route path="dashboard/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
