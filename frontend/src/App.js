import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"
import Home from "./pages/Home"
import Register from "./pages/Register"
import Test from "./pages/Test"
import Contact from "./pages/Contact"
import Diagnostic from "./pages/Diagnostic"
import PlanAction from "./components/PlanAction"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Demo from "./pages/Demo"

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
        { path: "contact", element: <Contact /> },
        { path: "diagnostic", element: <Diagnostic /> },
        { path: "planaction", element: <PlanAction /> },
        { path: "demo", element: <Demo /> },
      ],
    },
  ])

  return <RouterProvider router={router} />
}

export default App

