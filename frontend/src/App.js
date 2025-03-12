import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"

import Home from "./pages/Home"
import Register from "./pages/Register"
import Test from "./pages/Test"
import Result from "./pages/Result"
import Contact from "./pages/Contact"
import Diagnostic from "./pages/Diagnostic"
import Demo from "./pages/Demo"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import CoachDashboard from "./pages/CoachDashboard"
import PlanAction from "./components/PlanAction"
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
        { path: "test", element: <Test /> },
        { path: "result", element: <Result /> },
        { path: "contact", element: <Contact /> },
        { path: "diagnostic", element: <Diagnostic /> },
        { path: "planaction", element: <PlanAction /> },
        { path: "demo", element: <Demo /> },
        { path: "signup", element: <Signup /> },
        { path: "login", element: <Login /> },
        { path: "coach-dashboard", element: <CoachDashboard /> },
      ],
    },
  ])

  return <RouterProvider router={router} />
}

export default App

