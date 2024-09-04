import React, { useEffect } from "react";
import DocumentForm from "./component/document-form";
const styles = `@import url(https://aiconsole.movingwords.it/themes/default/assets/css/libraries/fontawesome-iconpicker.min.css?v=1200);`;

function App() {
  useEffect(() => {
    // Create a script element
    const script = document.createElement("script");
    script.src =
      "https://aiconsole.movingwords.it/themes/default/assets/js/libraries/fontawesome-all.min.js?v=1200";
    script.async = true;

    // Append the script to the document head
    document.head.appendChild(script);

    // Clean up the script when the component unmounts
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  return (
    <>
      <style>{styles}</style>
      <DocumentForm />
    </>
  );
}

export default App;
