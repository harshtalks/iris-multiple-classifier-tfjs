import "./styles.css";
import "./main.css";
import { useEffect, useState, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import * as loader from "./js/loader";

import * as data from "./js/data";

import Home from "./components/Home";
import Controls from "./components/Controls";
import Status from "./components/Status";
import Train from "./components/Train";
import Test from "./components/Test";

let model;
export default function App() {
  //hooks
  const [status, setStatus] = useState("Standing by.");
  const [epoch, setEpoch] = useState(40);
  const [learningRate, setLearningRate] = useState(0.01);

  //input data

  const [petalLength, setPetalLength] = useState(5.1);
  const [petalWidth, setPetalWidth] = useState(3.5);
  const [sepalLength, setSepalLength] = useState(1.4);
  const [sepalWidth, setSepalWidth] = useState(0.2);
  ///container
  const lossRef = useRef(null); //
  const accRef = useRef(null); //
  const winnerRef = useRef(null); //
  const logitsRef = useRef(null); //
  const confusionRef = useRef(null); //
  const tableRef = useRef(null); //
  const loadRef = useRef(null); //
  const saveRef = useRef(null); //
  const removeRef = useRef(null); //
  const trainFromScatch = useRef(null); //
  const loadPretrainedModelButtonRef = useRef(null);
  const localModelStatusRef = useRef(null); //
  const petalLengthIncRef = useRef(null); //
  const petalLengthDecRef = useRef(null); //
  const petalWidthIncRef = useRef(null); //
  const petalWidthDecRef = useRef(null); //
  const sepalLengthIncRef = useRef(null); //
  const sepalLengthDecRef = useRef(null); //
  const sepalWidthIncRef = useRef(null); //
  const sepalWidthDecRef = useRef(null); //
  const petalLengthRef = useRef(null); //
  const petalWidthRef = useRef(null); //
  const sepalLengthRef = useRef(null); //
  const sepalWidthRef = useRef(null); //

  //hooks

  useEffect(() => {
    iris();
  }, []);

  const trainModel = async (xTrain, yTrain, xTest, yTest) => {
    setStatus("Training model... Please wait.");

    //parameters for model.compile

    const params = { epoch, learningRate };

    const model = tf.sequential();
    model.add(
      tf.layers.dense({
        units: 10,
        activation: "sigmoid",
        inputShape: [xTrain.shape[1]]
      })
    );

    model.add(
      tf.layers.dense({
        units: 3,
        activation: "softmax"
      })
    );

    model.summary();

    const optimizer = tf.train.adam(params.learningRate);
    model.compile({
      optimizer: optimizer,
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"]
    });

    const trainLogs = [];
    const lossContainer = lossRef.current;
    const accContainer = accRef.current;
    const beginMs = performance.now();

    const history = await model.fit(xTrain, yTrain, {
      epochs: params.epoch,
      validationData: [xTest, yTest],
      callbacks: {
        onEpochEnd: async (epochs, logs) => {
          const secPerEpoch =
            (performance.now() - beginMs) / (1000 * (epoch + 1));
          setStatus(
            `Training model... Approximately ${secPerEpoch.toFixed(
              4
            )} seconds per epoch`
          );

          trainLogs.push(logs);
          tfvis.show.history(lossContainer, trainLogs, ["loss", "val_loss"]);
          tfvis.show.history(accContainer, trainLogs, ["acc", "val_loss"]);

          //confusion matrix here so wait
          calculateAndDrawConfusionMatrix(model, xTest, yTest);
        }
      }
    });

    const secPerEpoch = (performance.now() - beginMs) / (1000 * params.epoch);
    setStatus(
      `Model training complete:  ${secPerEpoch.toFixed(4)} seconds per epoch`
    );

    return model;
  };

  const predictOnManualInput = (model) => {
    if (model == null) {
      winnerRef.current.textContent =
        "ERROR: Please load or train model first.";
      return;
    }

    tf.tidy(() => {
      const inputData = getInputData();
      const input = tf.tensor2d([inputData], [1, 4]);

      const predictOut = model.predict(input);
      const logits = Array.from(predictOut.dataSync());
      const winner = data.IRIS_CLASSES[predictOut.argMax(-1).dataSync()[0]];

      winnerRef.current.textContent = winner;
      renderLogitsForManualInput(logits);
    });
  };

  const getInputData = () => {
    return [
      Number(petalLengthRef.current.value),
      Number(petalWidthRef.current.value),
      Number(sepalLengthRef.current.value),
      Number(sepalWidthRef.current.value)
    ];
  };

  const renderLogitsForManualInput = (logits) => {
    const logitsElement = logitsRef.current;
    renderLogits(logits, logitsElement);
  };

  const renderLogits = (logits, parentElement) => {
    while (parentElement.firstChild) {
      parentElement.removeChild(parentElement.firstChild);
    }

    logitsToSpans(logits).map((el) => parentElement.appendChild(el));
  };
  //

  const logitsToSpans = (logits) => {
    let idxMax = -1;
    let maxLogit = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < logits.petalLength; ++i) {
      if (logits[i] > maxLogit) {
        maxLogit = logits[i];
        idxMax = i;
      }
    }

    const spans = [];
    for (let i = 0; i < logits.length; ++i) {
      const logitSpan = document.createElement("span");
      logitSpan.textContent = logits[i].toFixed(3);
      if (i === idxMax) {
        logitSpan.style["font-weight"] = "bold";
      }
      logitSpan.classList = ["logit-span"];
      spans.push(logitSpan);
    }

    return spans;
  };
  //
  //

  const calculateAndDrawConfusionMatrix = async (model, xTest, yTest) => {
    const [preds, labels] = tf.tidy(() => {
      const preds = model.predict(xTest).argMax(-1);
      const labels = yTest.argMax(-1);
      return [preds, labels];
    });

    const confMatrixData = await tfvis.metrics.confusionMatrix(labels, preds);
    const container = confusionRef.current;
    tfvis.render.confusionMatrix(
      container,
      {
        values: confMatrixData,
        labels: data.IRIS_CLASSES
      },
      { shadeDiagonal: true }
    );

    tf.dispose([preds, labels]);
  };
  //
  //
  const evaluateModelOnTestData = async (model, xTest, yTest) => {
    clearEvaluateTable();

    tf.tidy(() => {
      const xData = xTest.dataSync();
      const yTrue = yTest.argMax(-1).dataSync();
      const predictOut = model.predict(xTest);
      const yPred = predictOut.argMax(-1);
      renderEvaluateTable(
        xData,
        yTrue,
        yPred.dataSync(),
        predictOut.dataSync()
      );
      calculateAndDrawConfusionMatrix(model, xTest, yTest);
    });

    predictOnManualInput(model);
  };
  //
  //
  const clearEvaluateTable = () => {
    const tableBody = tableRef.current;
    while (tableBody.children.length > 1) {
      tableBody.removeChild(tableBody.children[1]);
    }
  };
  //
  //
  const renderEvaluateTable = (xData, yTrue, yPred, logits) => {
    const tableBody = tableRef.current;
    for (let i = 0; i < yTrue.length; ++i) {
      const row = document.createElement("tr");

      for (let j = 0; j < 4; ++j) {
        const cell = document.createElement("td");
        cell.textContent = xData[4 * i + j].toFixed(1);
        row.appendChild(cell);
      }
      const truthCell = document.createElement("td");
      truthCell.textContent = data.IRIS_CLASSES[yTrue[i]];
      row.appendChild(truthCell);

      const predCell = document.createElement("td");
      predCell.textContent = data.IRIS_CLASSES[yPred[i]];

      predCell.classList =
        yPred[i] === yTrue[i] ? ["correct-prediction"] : ["wrong-prediction"];
      row.appendChild(predCell);

      const logitsCell = document.createElement("td");
      const exampleLogits = logits.slice(
        i * data.IRIS_NUM_CLASSES,
        (i + 1) * data.IRIS_NUM_CLASSES
      );
      logitsToSpans(exampleLogits).map((el) => {
        logitsCell.appendChild(el);
      });
      row.appendChild(logitsCell);
      tableBody.appendChild(row);
    }
  };

  //
  //
  const HOSTED_MODEL_JSON_URL =
    "https://storage.googleapis.com/tfjs-models/tfjs/iris_v1/model.json";

  const iris = async () => {
    const [xTrain, yTrain, xTest, yTest] = data.getIrisData(0.15);

    const localLoadButton = loadRef.current;
    const localSaveButton = saveRef.current;
    const localRemoveButton = removeRef.current;
    trainFromScatch.current.addEventListener("click", async () => {
      model = await trainModel(xTrain, yTrain, xTest, yTest);
      await evaluateModelOnTestData(model, xTest, yTest);
      localSaveButton.disabled = false;
    });

    if (await loader.urlExists(HOSTED_MODEL_JSON_URL, setStatus)) {
      setStatus("Model Available: " + HOSTED_MODEL_JSON_URL);
      loadPretrainedModelButtonRef.current.addEventListener(
        "click",
        async () => {
          clearEvaluateTable();
          model = await loader.loadHostedPretrainedModel(
            HOSTED_MODEL_JSON_URL,
            setStatus
          );
          await predictOnManualInput(model);
          localSaveButton.disabled = false;
        }
      );
    }

    localLoadButton.addEventListener("click", async () => {
      model = await loader.loadModelLocally();
      await predictOnManualInput(model);
    });

    localSaveButton.addEventListener("click", async () => {
      await loader.saveModelLocally(model);
      await loader.updateLocalModelStatus(
        localModelStatusRef,
        loadRef,
        removeRef
      );
    });

    localRemoveButton.addEventListener("click", async () => {
      await loader.removeModelLocally();
      await loader.updateLocalModelStatus(
        localModelStatusRef,
        loadRef,
        removeRef
      );
    });

    await loader.updateLocalModelStatus(
      localModelStatusRef,
      loadRef,
      removeRef
    );

    setStatus("Standing By.");
    wireUpEvaluateTableCallbacks(() => predictOnManualInput(model));
  };
  //
  //

  const wireUpEvaluateTableCallbacks = (predictOnManualInputCallback) => {
    const increment = 0.1;

    petalLengthIncRef.current.addEventListener("click", () => {
      petalLengthRef.current.value = (
        Number(petalLengthRef.current.value) + increment
      ).toFixed(1);
      predictOnManualInputCallback();
    });

    petalLengthDecRef.current.addEventListener("click", () => {
      petalLengthRef.current.value = (
        Number(petalLengthRef.current.value) - increment
      ).toFixed(1);
      predictOnManualInputCallback();
    });

    petalWidthIncRef.current.addEventListener("click", () => {
      petalWidthRef.current.value = (
        Number(petalWidthRef.current.value) + increment
      ).toFixed(1);
      predictOnManualInputCallback();
    });

    petalWidthDecRef.current.addEventListener("click", () => {
      petalWidthRef.current.value = (
        Number(petalWidthRef.current.value) - increment
      ).toFixed(1);
      predictOnManualInputCallback();
    });

    sepalLengthIncRef.current.addEventListener("click", () => {
      sepalLengthRef.current.value = (
        Number(sepalLengthRef.current.value) + increment
      ).toFixed(1);
      predictOnManualInputCallback();
    });

    sepalLengthDecRef.current.addEventListener("click", () => {
      sepalLengthRef.current.value = (
        Number(sepalLengthRef.current.value) - increment
      ).toFixed(1);
      predictOnManualInputCallback();
    });

    sepalWidthIncRef.current.addEventListener("click", () => {
      sepalWidthRef.current.value = (
        Number(sepalWidthRef.current.value) + increment
      ).toFixed(1);
      predictOnManualInputCallback();
    });

    sepalWidthDecRef.current.addEventListener("click", () => {
      sepalWidthRef.current.value = (
        Number(sepalWidthRef.current.value) - increment
      ).toFixed(1);
      predictOnManualInputCallback();
    });

    petalLengthRef.current.addEventListener("change", () => {
      predictOnManualInputCallback();
    });
    petalWidthRef.current.addEventListener("change", () => {
      predictOnManualInputCallback();
    });
    sepalLengthRef.current.addEventListener("change", () => {
      predictOnManualInputCallback();
    });
    sepalWidthRef.current.addEventListener("change", () => {
      predictOnManualInputCallback();
    });
  };

  return (
    <div className="tfjs-example-container">
      <Home />
      <Controls
        trainFromScatch={trainFromScatch}
        epoch={epoch}
        setEpoch={setEpoch}
        setLearningRate={setLearningRate}
        learningRate={learningRate}
        loadRef={loadRef}
        saveRef={saveRef}
        removeRef={removeRef}
        loadPretrainedModelButtonRef={loadPretrainedModelButtonRef}
        localModelStatusRef={localModelStatusRef}
      />
      <Status status={status} />
      <Train lossRef={lossRef} accRef={accRef} confusionRef={confusionRef} />
      <Test
        sepalLength={sepalLength}
        sepalWidth={sepalWidth}
        petalLength={petalLength}
        petalWidth={petalWidth}
        petalLengthRef={petalLengthRef}
        petalLengthIncRef={petalLengthIncRef}
        petalLengthDecRef={petalLengthDecRef}
        petalWidthRef={petalWidthRef}
        petalWidthIncRef={petalWidthIncRef}
        petalWidthDecRef={petalWidthDecRef}
        sepalLengthRef={sepalLengthRef}
        sepalLengthIncRef={sepalLengthIncRef}
        sepalLengthDecRef={sepalLengthDecRef}
        sepalWidthRef={sepalWidthRef}
        sepalWidthDecRef={sepalWidthDecRef}
        sepalWidthIncRef={sepalWidthIncRef}
        winnerRef={winnerRef}
        logitsRef={logitsRef}
        tableRef={tableRef}
      />
    </div>
  );
}
