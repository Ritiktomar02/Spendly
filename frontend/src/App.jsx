import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { getStoredUser, logoutUser } from "./services/authService.js";

function App() {
  // Logged-in user (null when logged out), restored from localStorage on page load
  const [user, setUser] = useState(() => getStoredUser());

  function handleLogin(loggedInUser) {
    setUser(loggedInUser);
  }

  function handleLogout() {
    logoutUser();
    setUser(null);
  }

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} onLogout={handleLogout} />

        {/* Main content area grows to fill available space */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* Logged-in users are sent to the landing page instead of login/register */}
            <Route
              path="/login"
              element={user ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/" replace /> : <RegisterPage />}
            />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            {/* Profile is for logged-in users only; others go to login */}
            <Route
              path="/profile"
              element={
                user ? (
                  <ProfilePage user={user} />
                ) : (
                  // Remember where the user was going so login can send them back
                  <Navigate to="/login" replace state={{ from: "/profile" }} />
                )
              }
            />

            {/* Catch-all: redirect unknown routes to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
