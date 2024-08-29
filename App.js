import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DocumentForm from "./component/document-form";
import DocumentPreview from "./component/document-preview";

function App() {
  return (
    <div className="App">
    <DocumentPreview />
  </div>
  );
}

export default App;
