import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DocumentPreview from "./document-preview";

var config;

const DocumentForm = () => {
  const [isAdvancedVisible, setAdvancedVisible] = useState(false);
  const [templateId, setTemplateId] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [newInputs, setNewInputs] = useState({});
  const [loader, setLoader] = useState(false);
  const [responseId, setResponseId] = useState();
  const [avail_words, setAvailWords] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loader2, setLoader2] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    language: "",
    creativity_level: " ",
    variants: " ",
    availableWords: "",
  });
  const [submittedData, setSubmittedData] = useState(null);
  const navigate = useNavigate();

  const toggleAdvancedSettings = (event) => {
    setAdvancedVisible(!isAdvancedVisible);
    event.preventDefault();
  };
  useEffect(() => {
    config = window.chatbaseConfig;
    newForm();
  }, []);

  const newForm = () => {
    setLoader(true);
    axios
      .get(
        `${config.web_url}/api/template-embedding/get-template-data?${config.token}`
      )
      .then(function (res) {
        if (res.data) {
          setLanguages(res.data.data.languages);
          setNewInputs(res.data.data.template.inputs);
          setAvailWords(res.data.data.available_words);
          setTemplateId(res.data.data.template.template_id);
          console.log(res.data.data);
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
          navigate(`/document-preview`);
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

  return (
    <div className="container">
      <h1>Create AI Document</h1>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleFormSubmit}>
            <div className="form-group mb-3">
              {loader ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <>
                  {Object.values(newInputs).map((input, index) => (
                    <div key={index} className="form-group mb-3">
                      {input.icon && (
                        <div className="input-icon">
                          <i className={input.icon}></i>
                        </div>
                      )}
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
                {/* Advanced settings fields */}
                <div className="form-group mb-3">
                  <label>Creativity level</label>
                  <div className="row btn-group-toggle" data-toggle="buttons">
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
                            formData.creativity_level === level ? "active" : ""
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
                <div className="form-group variant-block mb-2">
                  <label>Variants</label>
                  <div className="row btn-group-toggle">
                    {/* Variants options */}
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
                            checked={formData.variants === variant.toString()}
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
      {responseId && <DocumentPreview responseId={responseId} />}
    </div>
  );
};

export default DocumentForm;
