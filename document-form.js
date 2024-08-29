import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

var config;

const DocumentForm = () => {
  const [isAdvancedVisible, setAdvancedVisible] = useState(false);
  const [documentData, setDocumentData] = useState({});
  const [documentInputs, setDocumentInputs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState("");
  const [content, setContent] = useState();
  const [allData, setAllData] = useState();
  const [templateId, setTemplateId] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [newInputs, setNewInputs] = useState({});
  const [loader, setLoader] = useState(false);
  const [icons, setIcons] = useState();
  const [responseId, setResponseId] = useState("");
  const [avail_words, setAvailWords] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loader2, setLoader2] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    language: "",
    creativity_level: "optimal",
    custom_creativity_level: "",
    variants: "1",
    availableWords: "",
  });
  const [submittedData, setSubmittedData] = useState(null);

  const toggleAdvancedSettings = (event) => {
    setAdvancedVisible(!isAdvancedVisible);
    event.preventDefault();
  };

  const newForm = () => {
    setLoader(true);
    axios
      .get(
        `${config.web_url}/api/template-embedding/get-template-data?token=${config.token}`
      )
      .then(function (res) {
        if (res.data) {
          setLanguages(res.data.data.languages);
          setNewInputs(res.data.data.template.inputs);
          setAvailWords(res.data.data.available_words);
          setTemplateId(res.data.data.template.template_id);
        } else {
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoader2(true);
    const newLoad = new FormData();

    newLoad.append("type", templateId);
    Object.values(newInputs).forEach((input) => {
      const fieldName = `${templateId}_${input.key}`;
      newLoad.append(fieldName, formData[input.key] || "");
    });
    newLoad.append("language", formData.language);
    newLoad.append("variants", formData.variants);
    newLoad.append("creativity_level", formData.creativity_level);
    if (formData.creativity_level === "custom") {
      newLoad.append(
        "custom_creativity_level",
        formData.custom_creativity_level || ""
      );
    }
    newLoad.append("available_words", formData.availableWords);
    newLoad.append("token", `${config.token}`);

    axios
      .post(
        `${config.web_url}/api/template-embedding/create-document`,
        newLoad,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        if (res.data) {
          setSubmittedData(formData);
          setResponseId(res.data.data.id);
          filledDocument(res.data.data.id);
        }
      })
      .catch((error) => {
        console.error("There was an error submitting the form!", error);
      })
      .finally(() => {
        setIsSubmitting(false);
        setLoader2(false);
      });
  };
  useEffect(() => {
    config = window.chatbaseConfig;
    newForm();
  }, []);

  const filledDocument = (id) => {
    axios
      .get(
        `${config.web_url}/api/template-embedding/get-document/${id}?token=${config.token}`
      )
      .then((res) => {
        if (res.data && !res.data.errors) {
          setDocumentData(res.data.data.settings);
          setDocumentInputs(res.data.data.inputs);
          setContent(res.data.data.content);
          setAllData(res.data.data.template_name);
          setIcons(res.data.data.template_icon);
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
    setResponseId("");
  };

  if (error) {
    return <div>{error}</div>;
  }
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(content).then(
      () => {
        setCopySuccess("Content copied to clipboard!");
        setTimeout(() => setCopySuccess(""), 3000);
      },
      (err) => {
        console.error("Failed to copy text: ", err);
      }
    );
  };
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "script",
    "align",
    "direction",
    "color",
    "background",
    "font",
    "size",
  ];
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ align: ["right", "center", "justify"] }],
      [{ direction: "rtl" }, { direction: "" }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ script: "sub" }, { script: "super" }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
    ],
  };
  return (
    <>
      {responseId !== "" ? (
        <div className="container">
          <h1>Your AI Document</h1>
          <div className="card">
            <div className="card-body">
              <div id="quill_container">
                <label>Content</label>
                <ReactQuill
                  theme="snow"
                  value={content}
                  formats={formats}
                  modules={modules}
                  disabled
                />
                <button
                  onClick={handleCopyToClipboard}
                  className="btn btn-block btn-outline-primary w-100 mt-2"
                >
                  <i className="fa-solid fa-copy"></i>
                  Copy to Clipboard
                </button>
                {copySuccess && (
                  <div
                    className="bg-secondary text-white p-1 mt-1 rounded mx-auto"
                    style={{ maxWidth: "300px", textAlign: "center" }}
                  >
                    {copySuccess}
                  </div>
                )}
              </div>
              <label>Type</label>
              <div
                className="card border-0"
                style={{ background: "#f0fdfa", color: "#14b8a6" }}
              >
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div className="">
                    <i className={icons}></i>
                    <content>{allData}</content>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={handleGenerateWorksheet}
                  >
                    <i className="fa fa-plus-circle" aria-hidden="true"></i>
                    Generate AI Worksheet
                  </button>
                </div>
              </div>
              {documentInputs.map((input, index) => {
                const { key, value, icon } = input;

                return (
                  ![
                    "templateId",
                    "language",
                    "creativity_level",
                    "variants",
                    "max_words_per_variant",
                    "available_words",
                    "type",
                  ].includes(key) && (
                    <div className="form-group mb-3" key={index}>
                      <label>
                        {icon && <i className={icon + " input-icon"}></i>}
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
                );
              })}

              <div className="form-group mb-3">
                <label>Language</label>
                <input
                  type="text"
                  className="form-control"
                  value={documentData.language}
                  disabled
                />
              </div>
              <div className="row">
                <div className="col-12 col-lg-6">
                  <div className="form-group mb-3">
                    <label>Creativity Level</label>
                    <div className="row btn-group-toggle" data-toggle="buttons">
                      {[
                        "none",
                        "low",
                        "optimal",
                        "high",
                        "maximum",
                        "custom",
                      ].map(
                        (level) =>
                          documentData.creativity_level === level && (
                            <div className="col-12" key={level}>
                              <label
                                className={`btn btn-light btn-block w-100 ${
                                  documentData.creativity_level === level
                                    ? "active"
                                    : ""
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="creativity_level"
                                  value={level}
                                  className="btn-check"
                                  checked={
                                    documentData.creativity_level === level
                                  }
                                  disabled
                                />
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                              </label>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-6">
                  <div className="form-group variant-block mb-2">
                    <label>Variants</label>
                    <div className="row btn-group-toggle">
                      {[1, 2, 3].map(
                        (variant) =>
                          documentData.variants === variant && (
                            <div className="col-12" key={variant}>
                              <label
                                className={`btn btn-light btn-block w-100 ${
                                  documentData.variants === variant
                                    ? "active"
                                    : ""
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
                          )
                      )}
                    </div>
                  </div>
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
      ) : (
        <div className="container">
          <h1>Create AI Document</h1>
          {/* <i className="fa fa-user"></i> */}
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleFormSubmit}>
                <div className="form-group mb-3">
                  {loader ? (
                    <div className="spinner-border text-center" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <>
                      {Object.values(newInputs).map((input, index) => (
                        <div key={index} className="form-group mb-3">
                          {input.icon && <i className={input.icon}></i>}
                          <label className="ms-2 mt-2">{input.label}</label>
                          {input.type === "text" && (
                            <input
                              type="text"
                              className="form-control"
                              placeholder={input.placeholder}
                              onChange={handleInputChange}
                              value={formData[input.key] || ""}
                              name={input.key}
                              required
                            />
                          )}
                          {input.type === "textarea" && (
                            <textarea
                              className="form-control"
                              placeholder={input.placeholder}
                              onChange={handleInputChange}
                              value={formData[input.key] || ""}
                              name={input.key}
                              required
                            ></textarea>
                          )}
                          {input.help && (
                            <small className="ms-2 mt-2">{input.help}</small>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
                <div className="form-group mb-3">
                  <label className="ms-2">Language</label>
                  <select
                    id="language"
                    name="language"
                    className="form-control custom-select"
                    onChange={handleInputChange}
                    value={formData.language}
                  >
                    {languages.map((language, index) => (
                      <option key={index} value={language}>
                        {language}
                      </option>
                    ))}
                  </select>
                  <small>
                    Tell the AI to give you the answer in the above language.
                  </small>
                </div>
                <button
                  onClick={toggleAdvancedSettings}
                  className="btn btn-secondary w-100"
                >
                  Advanced settings
                </button>
                {isAdvancedVisible && (
                  <>
                    <div className="form-group mb-3">
                      <label>Creativity level</label>
                      <div
                        className="row btn-group-toggle"
                        data-toggle="buttons"
                      >
                        {[
                          "none",
                          "low",
                          "optimal",
                          "high",
                          "maximum",
                          "custom",
                        ].map((level) => (
                          <div className="col-12 col-lg-4" key={level}>
                            <label
                              className={`btn btn-light btn-block w-100 ${
                                formData.creativity_level === level
                                  ? "active"
                                  : ""
                              }`}
                            >
                              <input
                                type="radio"
                                name="creativity_level"
                                value={level}
                                className="btn-check"
                                onChange={handleInputChange}
                                checked={formData.creativity_level === level}
                              />
                              {level.charAt(0).toUpperCase() + level.slice(1)}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    {formData.creativity_level === "custom" && (
                      <div className="mt-3">
                        <label>Custom Creativity Level</label>
                        <input
                          type="number"
                          name="custom_creativity_level"
                          value={formData.custom_creativity_level || ""}
                          min="0"
                          max="2"
                          step="0.01"
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder=""
                        />
                      </div>
                    )}
                    <div className="form-group variant-block mb-2">
                      <label>Variants</label>
                      <div className="row btn-group-toggle">
                        {[1, 2, 3].map((variant) => (
                          <div className="col-12 col-lg-4" key={variant}>
                            <label
                              className={`btn btn-light btn-block w-100 ${
                                formData.variants === variant.toString()
                                  ? "active"
                                  : ""
                              }`}
                            >
                              <input
                                type="radio"
                                name="variants"
                                value={variant.toString()}
                                className="btn-check"
                                onChange={handleInputChange}
                                checked={
                                  formData.variants === variant.toString()
                                }
                              />
                              {variant} variant{variant > 1 ? "s" : ""}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Maximum words per variant</label>
                      <div className="input-group">
                        <input
                          type="number"
                          min="1"
                          max={avail_words}
                          id="availableWords"
                          name="availableWords"
                          className="form-control"
                          onChange={handleInputChange}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">
                            {avail_words} words available this month
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <button
                  className="btn btn-primary mt-2 mb-2 w-100"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {loader2 && (
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
                  {!loader2 && "Create"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentForm;
