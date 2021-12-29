const Test = ({
  sepalLength,
  sepalWidth,
  petalLength,
  petalWidth,
  petalLengthRef,
  petalLengthIncRef,
  petalLengthDecRef,
  petalWidthRef,
  petalWidthIncRef,
  petalWidthDecRef,
  sepalLengthRef,
  sepalLengthIncRef,
  sepalLengthDecRef,
  sepalWidthRef,
  sepalWidthDecRef,
  sepalWidthIncRef,
  winnerRef,
  logitsRef,
  tableRef
}) => {
  return (
    <>
      <section>
        <p className="section-head">Test Examples</p>
        <div id="evaluate">
          <table id="evaluate-table">
            <tr>
              <th>Petal Length</th>
              <th>Petal Width</th>
              <th>Sepal Length</th>
              <th>Sepal Width</th>
              <th>True Class</th>
              <th>Predicted Class</th>
              <th>Class Probabilities</th>
            </tr>
            <tbody ref={tableRef} id="evaluate-body">
              <tr>
                <td>
                  <input
                    type="text"
                    id="petal-length"
                    ref={petalLengthRef}
                    value="5.1"
                  />
                  <button ref={petalLengthIncRef} id="petal-length-inc">
                    +
                  </button>
                  <button ref={petalLengthDecRef} id="petal-length-dec">
                    -
                  </button>
                </td>
                <td>
                  <input
                    value="3.5"
                    ref={petalWidthRef}
                    type="text"
                    id="petal-width"
                  />
                  <button ref={petalWidthIncRef} id="petal-width-inc">
                    +
                  </button>
                  <button ref={petalWidthDecRef} id="petal-width-dec">
                    -
                  </button>
                </td>
                <td>
                  <input
                    value="1.4"
                    ref={sepalLengthRef}
                    type="text"
                    id="sepal-length"
                  />
                  <button ref={sepalLengthIncRef} id="sepal-length-inc">
                    +
                  </button>
                  <button ref={sepalLengthDecRef} id="sepal-length-dec">
                    -
                  </button>
                </td>
                <td>
                  <input
                    value="0.2"
                    ref={sepalWidthRef}
                    type="text"
                    id="sepal-width"
                  />
                  <button ref={sepalWidthIncRef} id="sepal-width-inc">
                    +
                  </button>
                  <button ref={sepalWidthDecRef} id="sepal-width-dec">
                    -
                  </button>
                </td>
                <td></td>
                <td ref={winnerRef} id="winner"></td>
                <td ref={logitsRef} id="logits"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div>
        <div className="horizontal-section">
          <div id="horizontal-section"></div>
        </div>
      </div>
    </>
  );
};

export default Test;
