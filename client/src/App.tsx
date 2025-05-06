import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navbar } from "./components/Layout/Navbar";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { DashboardPage } from "../src/components/Layout/DashboardPage"; // Updated import name
import { ThemeProviderWrapper } from './context/ThemeContext';

const App = () => (
  <ThemeProviderWrapper>
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} /> {/* Updated component name */}
          </Route>
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </ThemeProviderWrapper>
);

export default App;