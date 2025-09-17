import Login from "./components/Login";
import Signup from "./components/SiginUp";
import Home from "./components/Home";
import { Navigate } from "react-router-dom";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./components/Profile";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route path="/profile" element={<Profile/>} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
