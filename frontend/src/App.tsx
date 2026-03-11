import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Screens/Home";
import Login from "./Screens/Login";
import CreateAccount from "./Screens/CreateAccount";
import Verify from './Screens/Verify';
import Dashboard from "./Screens/Dashboard";
import EventsPage from "./Screens/EventsPage";
import Profile from "./Screens/Profile";
import Settings from "./Screens/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
