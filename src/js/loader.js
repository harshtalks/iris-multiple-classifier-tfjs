import * as tf from "@tensorflow/tfjs";

export const urlExists = async (url, setStatus) => {
  setStatus("Testing url " + url);

  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (err) {
    return false;
  }
};

export async function loadHostedPretrainedModel(url, setStatus) {
  setStatus("Loading pretrained model from " + url);
  try {
    const model = await tf.loadLayersModel(url);
    setStatus("Done loading pretrained model.");
    return model;
  } catch (err) {
    console.error(err);
    setStatus("Loading pretrained model failed.");
  }
}

const LOCAL_MODEL_URL = "indexeddb://tfjs-iris-demo-model/v1";

export async function saveModelLocally(model) {
  const saveResult = await model.save(LOCAL_MODEL_URL);
}

export async function loadModelLocally() {
  return await tf.loadLayersModel(LOCAL_MODEL_URL);
}

export async function removeModelLocally() {
  return await tf.io.removeModel(LOCAL_MODEL_URL);
}

export async function updateLocalModelStatus(
  localModelStatusRef,
  localLoadButtonRef,
  localRemoveButtonRef
) {
  const modelsInfo = await tf.io.listModels();

  if (LOCAL_MODEL_URL in modelsInfo) {
    localModelStatusRef.current.textContent =
      "Found locally-stored model saved at " +
      modelsInfo[LOCAL_MODEL_URL].dateSaved.toDateString();

    localLoadButtonRef.current.disabled = false;
    localRemoveButtonRef.current.disabled = false;
  } else {
    localModelStatusRef.current.textContent =
      "No locally-stored model is found.";
    localLoadButtonRef.current.disabled = true;
    localRemoveButtonRef.current.disabled = true;
  }
}
