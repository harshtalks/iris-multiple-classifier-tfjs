const Controls = ({
  setEpoch,
  setLearningRate,
  epoch,
  learningRate,
  trainFromScatch,
  loadRef,
  removeRef,
  saveRef,
  loadPretrainedModelButtonRef,
  localModelStatusRef
}) => {
  return (
    <>
      <section>
        <p className="section-head">Controls</p>
        <div className="region">
          <h3>Train Model</h3>
          <div className="create-model">
            <div className="input-div">
              <label className="input-label">Train Epochs:</label>
              <input
                type="number"
                id="train-epochs"
                value={epoch}
                onChange={(e) => setEpoch(e.target.value)}
              />
            </div>
            <div className="input-div">
              <span className="input-label">Learning Rate:</span>
              <input
                type="number"
                id="learning-rate"
                value={learningRate}
                onChange={(e) => setLearningRate(e.target.value)}
              />
            </div>
            <button ref={trainFromScatch} id="train-from-scratch">
              Train Model from Scratch
            </button>
          </div>
        </div>

        <div className="region">
          <h3>Save/Load Model</h3>
          <div className="load-save-section">
            <button
              ref={loadPretrainedModelButtonRef}
              id="load--pretrained-remote"
            >
              Load Hosted pretrained model
            </button>
          </div>
          <div className="load-save-section">
            <button ref={loadRef} id="load-local" disabled="true">
              Load Locally-Saved Model
            </button>
            <button ref={saveRef} id="save-local" disabled="true">
              Save Model Locally
            </button>
            <button ref={removeRef} id="remove-local" disabled="true">
              Remove Model Locally
            </button>
            <span ref={localModelStatusRef} id="local-model-status">
              Status unavailable.
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

export default Controls;
