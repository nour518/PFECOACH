import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"

import Home from "./pages/Home"
import Register from "./pages/Register"
import Test from "./pages/Test"
import Result from "./pages/Result" // Utilise une majuscule et le bon dossier
import SignUp from "./components/SignUp";  // Assurez-vous que le chemin est correct

import Contact from "./pages/Contact"
import Diagnostic from "./pages/Diagnostic"
import PlanAction from "./components/PlanAction"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Demo from "./pages/Demo"
import Signup from "./pages/Signup";
import Login from './pages/Login';

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
        { path: "signup", element: <SignUp /> },

        { path: "contact", element: <Contact /> },
        { path: "diagnostic", element: <Diagnostic /> },
        { path: "planaction", element: <PlanAction /> },
        { path: "demo", element: <Demo /> },
       { path:"/signup",element:<Signup /> },
       { path:"/login",element:<Login/> },

      ],
    },
  ])

  return <RouterProvider router={router} />
}

export default App

