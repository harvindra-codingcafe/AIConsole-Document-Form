import React, { useState } from "react";

function DocumentForm() {
  const [isAdvancedVisible, setAdvancedVisible] = useState(false);

  const toggleAdvancedSettings = (event) => {
    setAdvancedVisible(!isAdvancedVisible);
    event.preventDefault();
  };

  return (
    <div className="container">
      <h1>Create AI Document</h1>
      <div className="card">
        <div className="card-body">
          <form>
            <div className="form-group mb-3">
              <label className="ms-2">Name</label>
              <input
                className="form-control"
                type="text"
                name="title"
                value=""
                placeholder="Enter your Title"
              />
            </div>
            <div className="form-group mb-3">
              <label className="ms-2 mt-2">Type</label>
              <select
                id="type"
                name="type"
                class="form-control selectpicker_doc"
              >
                <option id="Summarize">Summarize</option>

                <option id="Quote generator">Quote generator</option>

                <option id="Test Template">Test Template</option>

                <option id="Explain">Explain like I am 5</option>

                <option id="Song lyrics">Song lyrics</option>

                <option id="Joke generator">Joke generator</option>
              </select>
            </div>
            <div className="form-group mb-3">
              <label className="ms-2 mt-2">Text to Summarize</label>
              <textarea
                className="form-control"
                name="text"
                value=""
                placeholder="Text to summarize"
              />
            </div>
            <div className="form-group mb-3">
              <label className="ms-2 mt-2">Language</label>
              <select
                id="type"
                name="type"
                class="form-control selectpicker_doc"
              >
                <option id="Auto">Auto</option>

                <option id="Summarize">English</option>

                <option id="Quote generator">French</option>

                <option id="Test Template">Spanish</option>

                <option id="Explain">Hindi</option>

                <option id="Song lyrics">Urdu</option>

                <option id="Joke generator">Jargon</option>
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
                      <label class="btn btn-light btn-block">
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
                      <label class="btn btn-light btn-block">
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
                      <label class="btn btn-light btn-block active focus">
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
                      <label class="btn btn-light btn-block">
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
                      <label class="btn btn-light btn-block">
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
                      <label class="btn btn-light btn-block">
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
                <div className="form-group variant-block">
                  <label>Variants</label>
                  <div className="row btn-group-toggle">
                    <div className="col-12 col-lg-4">
                      <label className="btn btn-light btn-block">
                        1 variant
                      </label>
                    </div>
                    <div className="col-12 col-lg-4">
                      <label className="btn btn-light btn-block">
                        2 variant
                      </label>
                    </div>
                    <div className="col-12 col-lg-4">
                      <label className="btn btn-light btn-block">
                        3 variant
                      </label>
                    </div>
                  </div>
                </div>
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
              </>
            )}
          </form>
          <button className="btn btn-primary mt-2 mb-2 w-100">Create</button>
        </div>
      </div>
    </div>
  );
}

export default DocumentForm;
