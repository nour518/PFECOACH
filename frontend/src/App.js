import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"

import Home from "./pages/Home"
import Register from "./pages/Register"
import Test from "./pages/Test" // Renommé
import Result from "./pages/Result" // Renommé
import Contact from "./pages/Contact"
import Diagnostic from "./pages/Diagnostic"
import Demo from "./pages/Demo"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import CoachDashboard from "./pages/CoachDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import TestManagement from "./pages/TestManagement"
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

function App() {
  // Création du routeur avec la nouvelle API de React Router v7
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
        { path: "coach-dashboard", element: <CoachDashboard /> },
        { path: "admin-dashboard", element: <AdminDashboard /> },
        { path: "test-management", element: <TestManagement /> },
      ],
    },
  ])

  return <RouterProvider router={router} />
}

export default App

