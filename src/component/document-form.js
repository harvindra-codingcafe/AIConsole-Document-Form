import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../component/documentform.css";
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
  const [translationData, setTranslationData] = useState({
    translations: {},
  });
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
  const [creativityNewLevel, setCreativityNewLevel] = useState({});
  const [variantid, setVariantId] = useState([]);
  const [newVariants, setNewVariats] = useState();
  const [newData, setNewData] = useState();
  const [activeVariantId, setActiveVariantId] = useState("");
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
          setTranslationData(res.data.data.translations);
          const creativityLevels = res.data.data.translations.creativity_levels;
          // Convert object to an array of key-value pairs
          const creativityLevelsArray = Object.entries(creativityLevels);
          setCreativityNewLevel(creativityLevelsArray);
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
          setActiveVariantId(res.data.data.document_id);
          setVariantId(res.data.data.variant_ids);
          setNewVariats(res.data.data.settings.variants);
          setNewData(res.data.data);
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
  const handleGenerateWorksheet = (event) => {
    event.preventDefault();
    setResponseId("");
    window.location.reload();
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
  const handleVariantClick = (variantId) => {
    setActiveVariantId(variantId);
    filledDocument(variantId);
  };

  return (
    <>
      {responseId !== "" ? (
        <div className="container1">
          <div className="2">
            <div className="newcardbody">
              <div className="formbottom">
                <div id="quill_container">
                  <i class="fas fa-robot"></i>
                  {"  "}
                  <label>{translationData?.content || "Content"}</label>
                  <ReactQuill
                    theme="snow"
                    value={content}
                    formats={formats}
                    modules={modules}
                    disabled
                  />
                </div>
              </div>
              <div className="formbottom">
                <button onClick={handleCopyToClipboard} className="btn2">
                  <i class="fa fa-copy"></i>{" "}
                  {translationData.copy_to_clipboard || "Copy to clipboard"}
                </button>
                {copySuccess && (
                  <div
                    className="responsecopy"
                    style={{
                      maxWidth: "300px",
                      textAlign: "center",
                    }}
                  >
                    {copySuccess}
                  </div>
                )}
              </div>
              {variantid.length >= 2 ? (
                <div className="formbottom">
                  <span style={{ marginRight: "10px" }}>
                    <i class="fa fa-list-ol" aria-hidden="true"></i>
                  </span>
                  <label className="variants">Variants ({newVariants})</label>
                  <div className="formvariant">
                    {variantid

                      .map((variant, index) => ({ variant, index }))
                      .filter(({ variant }) => variant !== activeVariantId)

                      .map(({ variant, index }) => (
                        <div key={variant} className="variantform">
                          <div className="">
                            <i className="fas fa-file-alt"></i>{" "}
                          </div>

                          <p
                            className="variants"
                            onClick={() => handleVariantClick(variant)}
                            style={{
                              cursor: "pointer",
                              color: "blue",
                            }}
                          >
                            {newData.template_name} {variant} - v{index + 1}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                ""
              )}
              <div className="formbottom">
                <span style={{ marginRight: "10px" }}>
                  <i class="fa fa-tasks"></i>
                </span>
                <label>{translationData?.type || "Type"}</label>
                <div
                  className="2 border-0"
                  style={{ background: "#f0fdfa", color: "#14b8a6" }}
                >
                  <div
                    className="newcardbody1"
                    style={{ backgroundColor: "#f0f9ff", color: "#0ea5e9" }}
                  >
                    <div className="" style={{ fontSize: "16px" }}>
                      <i className={icons}></i>
                      <content>{allData}</content>
                    </div>
                    <button
                      className="newbtn5"
                      onClick={handleGenerateWorksheet}
                    >
                      <i
                        className="fa fa-plus-circle"
                        style={{ marginRight: "5px" }}
                        aria-hidden="true"
                      ></i>
                      {translationData.generate_document}
                    </button>
                  </div>
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
                      <div className="headcard">
                        <div className="newcardbody newval">{value}</div>
                      </div>
                    </div>
                  )
                );
              })}

              <div className="formbottom">
                <span style={{ marginRight: "10px" }}>
                  <i class="fa fa-language"></i>
                </span>
                <label>{translationData?.language || "Language"}</label>
                <div className="newcardbody newval">
                  {documentData.language}
                </div>
              </div>
              <div className="newoneside">
                <div className="newcolums">
                  <div className="formbottom">
                    <span style={{ marginRight: "10px" }}>
                      <i class="fa fa-lightbulb-o"></i>
                    </span>
                    <label>
                      {translationData?.creativity_level || "Creativity level"}
                    </label>
                    <div className="newoneside" data-toggle="buttons">
                      {creativityNewLevel.map(([key, value]) => {
                        const displayValue =
                          typeof value === "string" ? value : String(value);

                        return (
                          documentData.creativity_level === key && (
                            <div className="newcolums2" key={key}>
                              <label
                                className={`crelevel ${
                                  documentData.creativity_level === key
                                    ? "active"
                                    : ""
                                }`}
                              >
                                <div className="newcardbody newval">
                                  {displayValue.charAt(0).toUpperCase() +
                                    displayValue.slice(1)}
                                </div>
                              </label>
                            </div>
                          )
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="newcolums">
                  <div className="formbottom variants">
                    <span style={{ marginRight: "10px" }}>
                      <i class="fa fa-list-ol"></i>
                    </span>
                    <label>{translationData?.variant || "Variant"}</label>
                    <div className="newoneside ">
                      {[1, 2, 3].map(
                        (variant) =>
                          documentData.variants === variant && (
                            <div className="newcolums2" key={variant}>
                              <label
                                className={`crelevel ${
                                  documentData.variants === variant
                                    ? "active"
                                    : ""
                                }`}
                              >
                                <div className="newcardbody newval">
                                  {variant}{" "}
                                  {translationData?.variants || "variants"}
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
                <label>
                  <span style={{ marginRight: "10px" }}>
                    <i class="fa fa-keyboard" aria-hidden="true"></i>
                  </span>
                  {translationData?.max_words_per_variant ||
                    "Maximum words per variant"}
                </label>
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
          <div className="2">
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
                          <label className="newone">{input.label}</label>
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
                            <small className="newone">{input.help}</small>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
                <div className="formbottom">
                  <label className="">
                    <span style={{ marginRight: "10px" }}>
                      <i class="fa fa-language"></i>
                    </span>
                    {translationData?.language || "Language"}
                  </label>
                  <select
                    id="language"
                    name="language"
                    className="actcont2 custom-select lang2"
                    onChange={handleInputChange}
                    value={formData.language}
                  >
                    {languages.map((language, index) => (
                      <option key={index} value={language}>
                        {language}
                      </option>
                    ))}
                  </select>
                  <small className="langhelp">
                    {translationData.language_help}
                  </small>
                </div>
                <button onClick={toggleAdvancedSettings} className="Advancebtn">
                  <span style={{ marginRight: "10px" }}>
                    <i class="fas fa-user-tie"></i>
                  </span>
                  {translationData.advanced_setting}
                </button>
                {isAdvancedVisible && (
                  <>
                    <div className="formbottom">
                      <span style={{ marginRight: "10px" }}>
                        {" "}
                        <i class="fa fa-lightbulb" aria-hidden="true"></i>
                      </span>

                      <label className="">
                        {translationData?.creativity_level ||
                          "Creativity level"}
                      </label>
                      <div className="optinal">
                        {creativityNewLevel.map(([key, value]) => {
                          const displayValue =
                            typeof value === "string" ? value : String(value);

                          return (
                            <div className="optional" key={key}>
                              <label
                                htmlFor={`${key}__creativity_level`}
                                className={`btn3 ${
                                  formData.creativity_level === key
                                    ? "active"
                                    : ""
                                }`}
                              >
                                {displayValue.charAt(0).toUpperCase() +
                                  displayValue.slice(1)}
                              </label>
                              <input
                                type="radio"
                                id={`${key}__creativity_level`}
                                name="creativity_level"
                                value={key}
                                className="btncheck"
                                onChange={handleInputChange}
                                checked={formData.creativity_level === key}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {formData.creativity_level === "custom" && (
                      <div className="formbottom">
                        <span style={{ marginRight: "10px" }}>
                          <span style={{ marginRight: "10px" }}>
                            <i class="fas fa-hat-wizard"></i>
                          </span>
                        </span>
                        <label>
                          {translationData?.custom_creativity ||
                            "Creativity level"}
                        </label>
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
                        <small className="newtop">
                          {translationData.custom_creativity_help ||
                            "0 is the most factual. 2 is the highest amount of creativity."}
                        </small>
                      </div>
                    )}
                    <div className="formbottom">
                      <span style={{ marginRight: "10px" }}>
                        <i class="fa fa-list-ol"></i>
                      </span>
                      <label>{translationData?.variant || "Variant"}</label>
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
                              {variant}{" "}
                              {translationData?.variants || "variants"}
                            </label>
                            <input
                              type="radio"
                              id={`${index}_variants`}
                              name="variants"
                              value={variant.toString()}
                              className="btncheck"
                              onChange={handleInputChange}
                              checked={formData.variants === variant.toString()}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="formbottom">
                      <span style={{ marginRight: "10px" }}>
                        <i class="fa fa-keyboard" aria-hidden="true"></i>
                      </span>
                      <label>
                        {translationData?.max_words_per_variant ||
                          "Maximum words per variant"}
                      </label>
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
                            {translationData?.words_available_this_month ||
                              "words available this month"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <button
                  className="btn4 langhelp"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {loader2 && (
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
                  {!loader2 && (translationData?.create || "Create")}
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
