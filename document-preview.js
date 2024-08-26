import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

var config;

const DocumentPreview = (responseId) => {
  const navigate = useNavigate();
  const [documentData, setDocumentData] = useState(null);
  const [documentInputs, setDocumentInputs] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState();

  useEffect(() => {
    config = window.chatbaseConfig;
    if (responseId) {
      filledDocument(responseId);
    }
  }, [responseId]);

  const filledDocument = (id) => {
    axios
      .get(
        `${config.web_url}/api/template-embedding/get-document/${id}?${config.token}`
      )
      .then((res) => {
        if (res.data && !res.data.errors) {
          setDocumentData(res.data.data.settings);
          setDocumentInputs(res.data.data.input);
          setContent(res.data.data.content);
        } else {
          setError(res.data.data.errors.title);
        }
      })
      .catch((err) => {
        setError("An error occurred while fetching the document.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGenerateWorksheet = () => {
    navigate("/");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(content).then(
      () => {
        alert("Content copied to clipboard!");
      },
      (err) => {
        console.error("Failed to copy text: ", err);
      }
    );
  };

  return (
    <div className="container">
      <h1>Your AI Document</h1>
      <div className="card">
        <div className="card-body">
          <h4>Form Fields:</h4>
          <div className="quill">
            <label>Content</label>
            <ReactQuill theme="snow" value={content} />
            <button
              onClick={handleCopyToClipboard}
              className="btn btn-primary mt-3"
            >
              Copy to Clipboard
            </button>
          </div>
          <div className="my-4">
            <button
              className="btn btn-primary"
              onClick={handleGenerateWorksheet} // Handle button click
            >
              Generate AI Worksheet
            </button>
          </div>
          {Object.entries(documentInputs).map(
            ([key, value]) =>
              ![
                "templateId",
                "language",
                "creativity_level",
                "variants",
                "max_words_per_variant",
                "available_words",
                "type",
              ].includes(key) && (
                <div className="form-group mb-3" key={key}>
                  <label>
                    {key.replace(`${documentData.templateId}_`, "")}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={value}
                    disabled
                  />
                </div>
              )
          )}

          <div className="form-group mb-3">
            <label>Language</label>
            <input
              type="text"
              className="form-control"
              value={documentData.language}
              disabled
            />
          </div>

          <div className="form-group mb-3">
            <label>Creativity Level</label>
            <div className="row btn-group-toggle" data-toggle="buttons">
              {["none", "low", "optimal", "high", "maximum", "custom"].map(
                (level) => (
                  <div className="col-12 col-lg-4" key={level}>
                    <label
                      className={`btn btn-light btn-block w-100 ${
                        documentData.creativity_level === level ? "active" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="creativity_level"
                        value={level}
                        className="btn-check"
                        checked={documentData.creativity_level === level}
                        disabled
                      />
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </label>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="form-group variant-block mb-2">
            <label>Variants</label>
            <div className="row btn-group-toggle">
              {[1, 2, 3].map((variant) => (
                <div className="col-12 col-lg-4" key={variant}>
                  <label
                    className={`btn btn-light btn-block w-100 ${
                      documentData.variants === variant ? "active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="variants"
                      value={variant}
                      className="btn-check"
                      checked={documentData.variants === variant}
                      disabled
                    />
                    {variant} variant{variant > 1 ? "s" : ""}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Maximum words per variant</label>
            <input
              type="text"
              className="form-control"
              value={documentData.max_words_per_variant}
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
