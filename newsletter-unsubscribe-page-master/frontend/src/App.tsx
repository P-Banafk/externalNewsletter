import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/unsubscribe" replace />} />
      <Route path="/unsubscribe" element={<Home />} />
    </Routes>
  );
}

export default App;
