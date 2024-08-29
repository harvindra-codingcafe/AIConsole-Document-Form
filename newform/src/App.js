import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DocumentForm from "./component/document-form";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DocumentForm />} />
      </Routes>
    </Router>
  );
}

export default App;
