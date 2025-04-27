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
import SocialAuthCallback from './components/SocialAuthCallback';
import MyScoreCard from './Pages/MySpace/MyScoreCard';
import FrameOfMind from './Pages/MySpace/FrameOfMind';
import SkillMatrix from './Pages/MySpace/SkillMatrix';
import MyCoach from './Pages/MySpace/MyCoach';
import IAmCoach from './Pages/MySpace/IAmCoach';
import MyActivities from './Pages/MySpace/MyActivities';
import MyAccomplishments from './Pages/MySpace/MyAccomplishments';
import ProgressReport from './Pages/MySpace/ProgressReport';
import Posts from './Pages/MyWork/Posts';
import Groups from './Pages/MyWork/Groups';
import Jobs from './Pages/MyWork/Jobs';
import MyConnections from './Pages/MyWork/MyConnections';
import Messenger from './Pages/MyWork/Messenger';
import MyResume from './Pages/MyWork/MyResume';
import MyOwnSite from './Pages/MyWork/MyOwnSite';
import Email from './Pages/MyWork/Email';
import Whiteboard from './Pages/Tools/Whiteboard';
import Assessment from './Pages/Tools/Assessment';
import PlannerTimesheet from './Pages/Tools/PlannerTimesheet';
import RewardsRecognition from './Pages/Tools/RewardsRecognition';
import Survey from './Pages/Tools/Survey';
import EverydayNotes from './Pages/Tools/EverydayNotes';
import Cibil from './Pages/Tools/Cibil';
import "./App.css";
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';

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
      <BrowserRouter basename="/">
        <AuthProvider>
          <ThemeProvider>
            <AppProvider>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<SignIn />} />
                  <Route path="registration" element={<Registration />} />
                  <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path="dashboard/my-space">
                    <Route path="my-score-card" element={<PrivateRoute><MyScoreCard /></PrivateRoute>} />
                    <Route path="frame-of-mind" element={<PrivateRoute><FrameOfMind /></PrivateRoute>} />
                    <Route path="skill-matrix" element={<PrivateRoute><SkillMatrix /></PrivateRoute>} />
                    <Route path="my-coach" element={<PrivateRoute><MyCoach /></PrivateRoute>} />
                    <Route path="i-am-coach" element={<PrivateRoute><IAmCoach /></PrivateRoute>} />
                    <Route path="activities" element={<PrivateRoute><MyActivities /></PrivateRoute>} />
                    <Route path="accomplishments" element={<PrivateRoute><MyAccomplishments /></PrivateRoute>} />
                    <Route path="progress-report" element={<PrivateRoute><ProgressReport /></PrivateRoute>} />
                  </Route>
                  <Route path="dashboard/my-work">
                    <Route path="posts" element={<PrivateRoute><Posts /></PrivateRoute>} />
                    <Route path="groups" element={<PrivateRoute><Groups /></PrivateRoute>} />
                    <Route path="jobs" element={<PrivateRoute><Jobs /></PrivateRoute>} />
                    <Route path="connections" element={<PrivateRoute><MyConnections /></PrivateRoute>} />
                    <Route path="messenger" element={<PrivateRoute><Messenger /></PrivateRoute>} />
                    <Route path="resume" element={<PrivateRoute><MyResume /></PrivateRoute>} />
                    <Route path="own-site" element={<PrivateRoute><MyOwnSite /></PrivateRoute>} />
                    <Route path="email" element={<PrivateRoute><Email /></PrivateRoute>} />
                  </Route>
                  <Route path="dashboard/tools">
                    <Route path="whiteboard" element={<PrivateRoute><Whiteboard /></PrivateRoute>} />
                    <Route path="assessment" element={<PrivateRoute><Assessment /></PrivateRoute>} />
                    <Route path="planner-timesheet" element={<PrivateRoute><PlannerTimesheet /></PrivateRoute>} />
                    <Route path="rewards-recognition" element={<PrivateRoute><RewardsRecognition /></PrivateRoute>} />
                    <Route path="survey" element={<PrivateRoute><Survey /></PrivateRoute>} />
                    <Route path="everyday-notes" element={<PrivateRoute><EverydayNotes /></PrivateRoute>} />
                    <Route path="cibil" element={<PrivateRoute><Cibil /></PrivateRoute>} />
                  </Route>
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
                <Route path="/auth/google/callback" element={<SocialAuthCallback />} />
                <Route path="/auth/facebook/callback" element={<SocialAuthCallback />} />
                <Route path="/auth/linkedin/callback" element={<SocialAuthCallback />} />
              </Routes>
            </AppProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
