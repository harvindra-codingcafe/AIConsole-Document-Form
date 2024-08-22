import React, { useState, useEffect } from "react";
import axios from "axios";

function DocumentForm() {
  const [isAdvancedVisible, setAdvancedVisible] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [newInputs, setNewInputs] = useState({});
  const [selectedInput, setSelectedInput] = useState(null);
  const [avail_words, setAvailWords] = useState();

  const toggleAdvancedSettings = (event) => {
    setAdvancedVisible(!isAdvancedVisible);
    event.preventDefault();
  };

  useEffect(() => {
    const newForm = () => {
      axios
        .get(
          "https://aiconsole.movingwords.it/api/template-embedding/get-template-data?token=tJ9jwv%2BK2zdteWdttoG5B4TmSZKyPJ0CG0OOXAmDm6x566RCs3Ab0KwNebkmNUGZ"
        )
        .then(function (res) {
          if (res.data) {
            setLanguages(res.data.data.languages);
            setNewInputs(res.data.data.template.settings.inputs);
            setAvailWords(res.data.data.available_words);
          }
        });
    };
    newForm();
  }, []);

  const handleSelectChange = (e) => {
    const selectedKey = e.target.value;
    const input = Object.values(newInputs).find(
      (input) => input.key === selectedKey
    );
    setSelectedInput(input || null);
  };

  return (
    <div className="container">
      <h1>Create AI Document</h1>
      <div className="card">
        <div className="card-body">
          <form>
            <div className="form-group mb-3">
              <label className="ms-2 mt-2">Type</label>
              <select
                id="type"
                name="Type"
                class="form-control selectpicker_doc"
                onChange={handleSelectChange}
              >
                <option value="">Select a type</option>
                {Object.values(newInputs).map((input, index) => (
                  <option key={index} value={input.key}>
                    {input.key}
                  </option>
                ))}
              </select>
              {selectedInput && (
                <div className="form-group mb-3">
                  {/* {selectedInput.icon && (
                    <div className="input-icon">
                      <i className={selectedInput.icon}></i>
                    </div>
                  )} */}
                  <label className="ms-2 mt-2">
                    {selectedInput.translations.english.name}{" "}
                  </label>
                  {selectedInput.type === "input" && (
                    <input
                      type="text"
                      className="form-control"
                      placeholder={
                        selectedInput.translations.english.placeholder
                      }
                    />
                  )}
                  {selectedInput.type === "textarea" && (
                    <textarea
                      className="form-control"
                      placeholder={
                        selectedInput.translations.english.placeholder
                      }
                    ></textarea>
                  )}
                  {selectedInput.type === "textarea" &&
                  selectedInput.type === "input" ? (
                    <>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={
                          selectedInput.translations.english.placeholder
                        }
                      />
                      <textarea
                        className="form-control"
                        placeholder={
                          selectedInput.translations.english.placeholder
                        }
                      ></textarea>
                    </>
                  ) : (
                    ""
                  )}
                  {selectedInput.translations.english.help && (
                    <small className="form-text text-muted">
                      {selectedInput.translations.english.help}{" "}
                    </small>
                  )}
                </div>
              )}
            </div>
            <div className="form-group mb-3">
              <label className="ms-2">Language</label>
              <select
                id="language"
                name="language"
                className="form-control custom-select"
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
                      <label class="btn btn-light btn-block w-100">
                        <input
                          type="radio"
                          name="creativity_level"
                          value="none"
                          class="btn-check"
                        />
                        None (the most factual){" "}
                      </label>
                    </div>
                    <div class="col-12 col-lg-4">
                      <label class="btn btn-light btn-block w-100">
                        <input
                          type="radio"
                          name="creativity_level"
                          value="low"
                          class="btn-check"
                        />
                        Low (highly factual){" "}
                      </label>
                    </div>
                    <div class="col-12 col-lg-4">
                      <label class="btn btn-light btn-block w-100">
                        <input
                          type="radio"
                          name="creativity_level"
                          value="optimal"
                          class="btn-check"
                        />
                        Optimal{" "}
                      </label>
                    </div>
                    <div class="col-12 col-lg-4">
                      <label class="btn btn-light btn-block mt-2 w-100">
                        <input
                          type="radio"
                          name="creativity_level"
                          value="high"
                          class="btn-check"
                        />
                        High (highly creative){" "}
                      </label>
                    </div>
                    <div class="col-12 col-lg-4">
                      <label class="btn btn-light btn-block mt-2 w-100">
                        <input
                          type="radio"
                          name="creativity_level"
                          value="maximum"
                          class="btn-check"
                        />
                        Maximum (the most creative){" "}
                      </label>
                    </div>
                    <div class="col-12 col-lg-4">
                      <label class="btn btn-light btn-block mt-2 w-100">
                        <input
                          type="radio"
                          name="creativity_level"
                          value="custom"
                          class="btn-check"
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
                          checked=""
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
                          checked=""
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
                          checked=""
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
                      max=""
                      id="max_words_per_variant"
                      name="max_words_per_variant"
                      class="form-control"
                      value=""
                    />
                    <div class="input-group-append">
                      <span class="input-group-text">
                        {" "}
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
