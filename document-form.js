import React, { useState, useEffect } from "react";
import axios from "axios";

function DocumentForm() {
  const [isAdvancedVisible, setAdvancedVisible] = useState(false);
  const [templateId, setTemplateId] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [newInputs, setNewInputs] = useState({});
  // const [selectedInput, setSelectedInput] = useState(null);
  const [avail_words, setAvailWords] = useState();
  const [formData, setFormData] = useState({
    type: "",
    language: "",
    creativity_level: " ",
    variants: " ",
    max_words_per_variant: "",
  });

  const toggleAdvancedSettings = (event) => {
    setAdvancedVisible(!isAdvancedVisible);
    event.preventDefault();
  };

  useEffect(() => {
    const newForm = () => {
      axios
        .get(
          `https://aiconsole.movingwords.it/api/template-embedding/get-template-data?token=tJ9jwv%2BK2zdteWdttoG5B4TmSZKyPJ0CG0OOXAmDm6x566RCs3Ab0KwNebkmNUGZ`
        )
        .then(function (res) {
          if (res.data) {
            setLanguages(res.data.data.languages);
            setNewInputs(res.data.data.template.inputs);
            setAvailWords(res.data.data.available_words);
            setTemplateId(res.data.data.template.template_id);
            console.log(res.data.data);
          }
        });
    };
    newForm();
  }, []);

  // const handleSelectChange = (e) => {
  //   const selectedKey = e.target.value;
  //   const input = Object.values(newInputs).find(
  //     (input) => input.key === selectedKey
  //   );
  //   setSelectedInput(input || null);
  //   setFormData({ ...formData, type: selectedKey });
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newLoad = new FormData();

    newLoad.append("type", templateId);
    Object.values(newInputs).forEach((input) => {
      const fieldName = `${templateId}_${input.key}`;
      newLoad.append(fieldName, formData[input.key] || "");
    });
    newLoad.append("language", formData.language);
    newLoad.append("variants", formData.variants);
    newLoad.append("creativity_level", formData.creativity_level);
    newLoad.append("available_words", formData.max_words_per_variant);
    newLoad.append(
      "token",
      `tJ9jwv%2BK2zdteWdttoG5B4TmSZKyPJ0CG0OOXAmDm6x566RCs3Ab0KwNebkmNUGZ`
    );

    axios
      .post(
        `https://aiconsole.movingwords.it/api/template-embedding/create-document`,
        newLoad,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        if (res.data) {
          window.location.href = res.data.id;
        }
      })
      .catch((error) => {
        console.error("There was an error submitting the form!", error);
      });
  };
  return (
    <div className="container">
      <h1>Create AI Document</h1>
      <div className="card">
        <div className="card-body">
          <form onSubmit={(e) => handleFormSubmit(e, formData)}>
            <div className="form-group mb-3">
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
                    />
                  )}
                  {input.type === "textarea" && (
                    <textarea
                      className="form-control"
                      placeholder={input.placeholder}
                      onChange={handleInputChange}
                      // value={formData[input.key] || ""}
                      name={input.key}
                    ></textarea>
                  )}
                  {input.help && (
                    <small className="ms-2 mt-2">{input.help}</small>
                  )}
                </div>
              ))}
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
                <option value="">Select Language</option>
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
                  <div class="row btn-group-toggle" data-toggle="buttons">
                    <div class="col-12 col-lg-4">
                      <label
                        className={`btn btn-light btn-block w-100 ${
                          formData.variants === "none" ? "active" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="creativity_level"
                          value="none"
                          class=""
                          onChange={handleInputChange}
                          checked={formData.variants === "none"}
                        />
                        None (the most factual){" "}
                      </label>
                    </div>
                    <div class="col-12 col-lg-4">
                      <label
                        class={`btn btn-light btn-block w-100 ${
                          formData.variants === "low" ? "active" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="creativity_level"
                          value="low"
                          class=""
                          onChange={handleInputChange}
                          checked={formData.variants === "low"}
                        />
                        Low (highly factual){" "}
                      </label>
                    </div>
                    <div class="col-12 col-lg-4">
                      <label
                        class={`btn btn-light btn-block w-100 ${
                          formData.variants === "optimal" ? "active" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="creativity_level"
                          value="optimal"
                          class=""
                          onChange={handleInputChange}
                          checked={formData.variants === "optimal"}
                        />
                        Optimal{" "}
                      </label>
                    </div>
                    <div class="col-12 col-lg-4">
                      <label
                        class={`btn btn-light btn-block w-100 ${
                          formData.variants === "high" ? "active" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="creativity_level"
                          value="high"
                          class=""
                          onChange={handleInputChange}
                          checked={formData.variants === "high"}
                        />
                        High (highly creative){" "}
                      </label>
                    </div>
                    <div class="col-12 col-lg-4">
                      <label
                        class={`btn btn-light btn-block w-100 ${
                          formData.variants === "maximum" ? "active" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="creativity_level"
                          value="maximum"
                          class=""
                          onChange={handleInputChange}
                          checked={formData.variants === "maximum"}
                        />
                        Maximum (the most creative){" "}
                      </label>
                    </div>
                    <div class="col-12 col-lg-4">
                      <label
                        class={`btn btn-light btn-block w-100 ${
                          formData.variants === "custom" ? "active" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="creativity_level"
                          value="custom"
                          class=""
                          onChange={handleInputChange}
                          checked={formData.variants === "custom"}
                        />
                        Custom{" "}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-group variant-block mb-2">
                  <label>Variants</label>
                  <div className="row btn-group-toggle">
                    <div className="col-12 col-lg-4">
                      <label className="btn btn-light btn-block w-100">
                        <input
                          type="radio"
                          name="variants"
                          value="1"
                          class="btn-check"
                          onChange={handleInputChange}
                          checked={formData.variants === "1"}
                        />
                        1 variant
                      </label>
                    </div>
                    <div className="col-12 col-lg-4">
                      <label className="btn btn-light btn-block w-100">
                        <input
                          type="radio"
                          name="variants"
                          value="2"
                          class="btn-check"
                          onChange={handleInputChange}
                          checked={formData.variants === "2"}
                        />
                        2 variant
                      </label>
                    </div>
                    <div className="col-12 col-lg-4">
                      <label className="btn btn-light btn-block w-100">
                        <input
                          type="radio"
                          name="variants"
                          value="3"
                          class="btn-check"
                          onChange={handleInputChange}
                          checked={formData.variants === "3"}
                        />
                        3 variant
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label> Maximum words per variant</label>
                  <div class="input-group">
                    <input
                      type="number"
                      min="1"
                      max={avail_words}
                      id="max_words_per_variant"
                      name="max_words_per_variant"
                      class="form-control"
                      onChange={handleInputChange}
                    />
                    <div class="input-group-append">
                      <span class="input-group-text">
                        words available this month
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
            <button className="btn btn-primary mt-2 mb-2 w-100">Create</button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default DocumentForm;
