import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./Screens/Home";
import Login from "./Screens/Login";
import CreateAccount from "./Screens/CreateAccount";
import Verify from './Screens/Verify';
import Dashboard from "./Screens/Dashboard";
import EventsPage from "./Screens/EventsPage";
import CreateEvent from './Screens/CreateEvent'
import GroupsPage from "./Screens/GroupsPage";
import CreateGroup from './Screens/CreateGroup'
import Profile from "./Screens/Profile";
import PublicProfile from "./Screens/PublicProfile";
import Settings from "./Screens/Settings";
import Chat from './Screens/Chat'
import EventDetail from './Screens/EventDetail'
import GroupDetail from './Screens/GroupDetail'
import { TopNav } from './components/layout'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

function AppRoutes() {
  const location = useLocation()
  const hideTop = location.pathname === '/login' || location.pathname === '/create-account'

  return (
    <>
      {!hideTop && <TopNav />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
        <Route path="/events/create" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
        <Route path="/events/:id" element={<ProtectedRoute><EventDetail /></ProtectedRoute>} />
        <Route path="/groups" element={<ProtectedRoute><GroupsPage /></ProtectedRoute>} />
        <Route path="/groups/create" element={<ProtectedRoute><CreateGroup /></ProtectedRoute>} />
        <Route path="/groups/:id" element={<ProtectedRoute><GroupDetail /></ProtectedRoute>} />
        <Route path="/profile/:username" element={<PublicProfile />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
