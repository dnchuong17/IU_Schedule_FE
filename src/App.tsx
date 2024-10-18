import WorkflowList from "./pages/WorkflowList"
import { BrowserRouter as Router } from "react-router-dom"
import { Route, Routes } from "react-router-dom"

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/admin/WorkflowList"
            element={<WorkflowList />}
          />
        </Routes>
      </Router>
    </>
  )
}

export default App
