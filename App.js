import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DocumentForm from "./component/document-form";
import DocumentPreview from "./component/document-preview";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DocumentForm />} />
        <Route path="/document-preview" element={<DocumentPreview />} />
      </Routes>
    </Router>
  );
}

export default App;
