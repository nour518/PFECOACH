import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";

import Home from "./pages/Home";

import Test from "./pages/Test"; // Renommé
import Result from "./pages/Result"; // Renommé
import Contact from "./pages/Contact";
import Diagnostic from "./pages/Diagnostic";
import Demo from "./pages/Demo";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CoachDashboard from "./pages/CoachDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import UserDashboard from './pages/UserDashboard';
import PlanAction from "./components/PlanAction";

import Navbar from "./components/Navbar";

import Footer from "./components/Footer";
import './pages/home.css';


// Composant Layout qui inclut Navbar et Footer
function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
function RoleBasedRedirect() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "coach") return <Navigate to="/coach-dashboard" replace />;
  if (user.role === "admin") return <Navigate to="/admin-dashboard" replace />;
  return <Navigate to="/user-dashboard" replace />;
}

// Composant pour protéger les routes qui nécessitent une authentification
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("user") !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  // Création du routeur avec la nouvelle API de React Router
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },

        { path: "result", element: <Result /> }, // Mise à jour
        { path: "contact", element: <Contact /> },
        { path: "diagnostic", element: <Diagnostic /> },
        { path: "planaction", element: <PlanAction /> },
   
        { path: "demo", element: <Demo /> },
        { path: "signup", element: <Signup /> },
        { path: "login", element: <Login /> },
        { path: "admin-dashboard", element: <AdminDashboard /> },
 
        { path: "user-dashboard", 
          element: (
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "coach-dashboard/sadek",
          element: (
            <ProtectedRoute>
              <CoachDashboard coachName="Sadek" /> {/* Affichage spécifique pour ce coach */}
            </ProtectedRoute>
          ),
        },
        
        
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
