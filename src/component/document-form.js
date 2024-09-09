import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../component/documentform.css";
import { type } from "@testing-library/user-event/dist/type";
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
  const [response, setResponse] = useState(false);

  const toggleAdvancedSettings = (event) => {
    setAdvancedVisible(!isAdvancedVisible);
    event.preventDefault();
  };

  const newForm = () => {
    setLoader(true);
    axios
      .get(
        `${config?.web_url}/api/template-embedding/get-template-data?token=${config?.token}`
      )
      .then(function (res) {
        if (res.data) {
          setLanguages(res.data.data.languages);
          setNewInputs(res.data.data.template.inputs);
          setAvailWords(res.data.data.available_words);
          setTemplateId(res.data.data.template.template_id);
          setResponse(false);
        } else {
        }
      })
      .catch(function (error) {
        setResponse(true);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("hi", name, value);
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
    newLoad.append("token", `${config?.token}`);

    axios
      .post(
        `${config?.web_url}/api/template-embedding/create-document`,
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
    config = window.aiDocumentConfig;
    newForm();
  }, []);

  const filledDocument = (id) => {
    axios
      .get(
        `${config?.web_url}/api/template-embedding/get-document/${id}?token=${config?.token}`
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
        <div className="container1">
          <div className="headcard">
            <div className="newcardbody">
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
                  className="btn2 w-100 mt-2 mb-3"
                >
                  <i className="fa-solid fa-copy"></i>
                  Copy to Clipboard
                </button>
                {copySuccess && (
                  <div
                    className="bg-secondary text-white p-1 mt-1 rounded mx-auto"
                    style={{
                      maxWidth: "300px",
                      textAlign: "center",
                    }}
                  >
                    {copySuccess}
                  </div>
                )}
              </div>
              <label>Type</label>
              <div
                className="headcard border-0"
                style={{ background: "#f0fdfa", color: "#14b8a6" }}
              >
                <div
                  className="newcardbody1 d-flex align-items-center justify-content-between"
                  style={{ backgroundColor: "#f0f9ff", color: "#0ea5e9" }}
                >
                  <div className="" style={{ fontSize: "14px" }}>
                    <i className={icons}></i>
                    <content>{allData}</content>
                  </div>
                  <button className="newbtn5" onClick={handleGenerateWorksheet}>
                    <i
                      className="fa fa-plus-circle"
                      style={{ marginRight: "5px" }}
                      aria-hidden="true"
                    ></i>
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
                    <div className="formbottom" key={index}>
                      <label>
                        {icon && <i className={icon + " input-icon"}></i>}
                        {key.replace(`${documentData.templateId}_`, "")}
                      </label>
                      <div className="headcard  w-100">
                        <div className="newcardbody newval">{value}</div>
                      </div>
                    </div>
                  )
                );
              })}

              <div className="formbottom">
                <label>Language</label>
                <div className="newcardbody newval">
                  {documentData.language}
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-lg-6">
                  <div className="formbottom">
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
                                className={`w-100 ${
                                  documentData.creativity_level === level
                                    ? "active"
                                    : ""
                                }`}
                              >
                                <div className="newcardbody newval">
                                  {level.charAt(0).toUpperCase() +
                                    level.slice(1)}
                                </div>
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
                                className={`w-100 ${
                                  documentData.variants === variant
                                    ? "active"
                                    : ""
                                }`}
                              >
                                <div className="newcardbody newval">
                                  {variant} variant{variant > 1 ? "s" : ""}
                                </div>
                              </label>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="newmaxword">
                <label>Maximum words per variant</label>
                <div className="newcardbody newval1">
                  {documentData.max_words_per_variant}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : !response ? (
        <div className="container1">
          {/* <i className="fa fa-user"></i> */}
          <div className="headcard">
            <div className="newcardbody">
              <form onSubmit={handleFormSubmit}>
                <div className="formbottom">
                  {loader ? (
                    <div className="spinner-border text-center" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <>
                      {Object.values(newInputs).map((input, index) => (
                        <div key={index} className="formbottom">
                          {input.icon && <i className={input.icon}></i>}
                          <label className="ms-2 mt-2">{input.label}</label>
                          {input.type === "text" && (
                            <input
                              type="text"
                              className="actcont"
                              placeholder={input.placeholder}
                              onChange={handleInputChange}
                              value={formData[input.key] || ""}
                              name={input.key}
                              required
                            />
                          )}
                          {input.type === "textarea" && (
                            <textarea
                              className="actcont"
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
                <div className="formbottom">
                  <label className="ms-2">Language</label>
                  <select
                    id="language"
                    name="language"
                    className="actcont custom-select mb-2"
                    onChange={handleInputChange}
                    value={formData.language}
                  >
                    {languages.map((language, index) => (
                      <option key={index} value={language}>
                        {language}
                      </option>
                    ))}
                  </select>
                  <small className="mt-2">
                    Tell the AI to give you the answer in the above language.
                  </small>
                  <i class="fa-solid fa-user-tie"></i>
                </div>
                <button onClick={toggleAdvancedSettings} className="Advancebtn">
                  Advanced settings
                </button>
                {isAdvancedVisible && (
                  <>
                    <div className="formbottom">
                      <label className="">Creativity level</label>
                      <div className="optinal" data-toggle="buttons">
                        {[
                          "none",
                          "low",
                          "optimal",
                          "high",
                          "maximum",
                          "custom",
                        ].map((level, index) => (
                          <div className="optional" key={level}>
                            <label
                              htmlFor={`${index}__creativity_level`}
                              className={`btn3 mb-2 ${
                                formData.creativity_level === level
                                  ? "active"
                                  : ""
                              }`}
                            >
                              <input
                                type="radio"
                                id={`${index}__creativity_level`}
                                name="creativity_level"
                                value={level}
                                className="btncheck"
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
                          className="actcont"
                          placeholder=""
                        />
                        <small className="mt-1">
                          0 is the most factual. 2 is the highest amount of
                          creativity.
                        </small>
                      </div>
                    )}
                    <div className="mb-2">
                      <label>Variants</label>
                      <div className="optinal">
                        {[1, 2, 3].map((variant, index) => (
                          <div className="optional" key={variant}>
                            <label
                              htmlFor={`${index}_variants`}
                              className={`btn3 ${
                                formData.variants === variant.toString()
                                  ? "active"
                                  : ""
                              }`}
                            >
                              <input
                                type="radio"
                                id={`${index}_variants`}
                                name="variants"
                                value={variant.toString()}
                                className="btncheck"
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
                    <div className="">
                      <label>Maximum words per variant</label>
                      <div className="inpgrp">
                        <input
                          type="number"
                          min="1"
                          max={avail_words}
                          id="availableWords"
                          name="availableWords"
                          className="actcont"
                          onChange={handleInputChange}
                        />
                        <div className="input-group-append">
                          <span className="availableword">
                            {avail_words} words available this month
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <button
                  className="btn4 mt-2 mb-2 w-100"
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
      ) : (
        ""
      )}
    </>
  );
};

export default DocumentForm;
