import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom"

import Home from "./pages/Home"
import Register from "./pages/Register"
import Test from "./pages/Test" // Renommé
import Result from "./pages/Result" // Renommé
import Contact from "./pages/Contact"
import Diagnostic from "./pages/Diagnostic"
import Demo from "./pages/Demo"
import Signup from "./pages/Signup"
<<<<<<< HEAD
import Login from "./pages/Login"
import CoachDashboard from "./pages/CoachDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import TestManagement from "./pages/TestManagement"
=======
import Login from './pages/Login'
import UserDashboard from './pages/UserDashboard'
>>>>>>> 873df53fabf76eacd26c160c16e45582903d1b80
import PlanAction from "./components/PlanAction"
import Subscription from "./pages/Subscription" // Nouvelle page d'abonnement
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

import "./styles.css"

// Composant Layout qui inclut Navbar et Footer
function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

// Composant pour protéger les routes qui nécessitent une authentification
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('user') !== null
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function App() {
  // Création du routeur avec la nouvelle API de React Router
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "register", element: <Register /> },
        { path: "test", element: <Test /> }, // Mise à jour
        { path: "result", element: <Result /> }, // Mise à jour
        { path: "contact", element: <Contact /> },
        { path: "diagnostic", element: <Diagnostic /> },
        { path: "planaction", element: <PlanAction /> },
        { path: "subscription", element: <Subscription /> }, // Nouvelle route
        { path: "demo", element: <Demo /> },
        { path: "signup", element: <Signup /> },
        { path: "login", element: <Login /> },
<<<<<<< HEAD
        { path: "coach-dashboard", element: <CoachDashboard /> },
        { path: "admin-dashboard", element: <AdminDashboard /> },
        { path: "test-management", element: <TestManagement /> },
=======
        { 
          path: "dashboard", 
          element: <ProtectedRoute><UserDashboard /></ProtectedRoute> 
        },
>>>>>>> 873df53fabf76eacd26c160c16e45582903d1b80
      ],
    },
  ])

  return <RouterProvider router={router} />
}

export default App
