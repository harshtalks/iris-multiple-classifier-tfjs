const Train = ({ lossRef, accRef, confusionRef }) => {
  return (
    <>
      <section>
        <p className="section-head">Training Process</p>
        <div className="with-cols">
          <div>
            <h4>Loss</h4>
            <div ref={lossRef} className="canvases" id="lossCanvas"></div>
          </div>
          <div>
            <h4>Accuracy</h4>
            <div ref={accRef} className="canvases" id="accuracyCanvas"></div>
          </div>
          <div>
            <h4>Confusion Matrix (on validation set)</h4>
            <div ref={confusionRef} id="confusion-matrix"></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Train;
