import { Routes, Route } from "react-router-dom"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./ProtectedRoute"

function App() {

  return (
    <>
    <Routes>
      <Route path="/"  element={<Register/>}/>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>

    
    </>
  )
}

export default App
