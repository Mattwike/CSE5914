import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./Screens/Home";
import Login from "./Screens/Login";
import CreateAccount from "./Screens/CreateAccount";
import Verify from './Screens/Verify';
import Dashboard from "./Screens/Dashboard";
import EventsPage from "./Screens/EventsPage";
import GroupsPage from "./Screens/GroupsPage";
import Profile from "./Screens/Profile";
import Settings from "./Screens/Settings";
import Chat from './Screens/Chat'
import EventDetail from './Screens/EventDetail'
import GroupDetail from './Screens/GroupDetail'
import { TopNav } from './components/layout'

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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/groups/:id" element={<GroupDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
