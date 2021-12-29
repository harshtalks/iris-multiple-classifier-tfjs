const Home = () => {
  return (
    <>
      <section className="title-area">
        <h1>TensorFlow.js Layers: Iris Demo</h1>
        <p className="subtitle">
          Classify Structured data with a neural network.
        </p>
      </section>

      <section>
        <p className="section-head">Description</p>
        <p>
          This example uses a neural network to classify tabular data
          representing different flowers. The data used for each flower are the
          petal length and width as well as the sepal length and width. The goal
          is to predict what kind of flower it is based on those features of
          each data point. The data comes from the famous{" "}
          <a href="https://en.wikipedia.org/wiki/Iris_flower_data_set">
            Iris flower
          </a>{" "}
          data set.
        </p>
      </section>

      <section>
        <p className="section-head">Instructions</p>
        <p>
          Using the buttons below you can either train a new model from scratch
          or load a pre-trained model and test its performance.
        </p>
        <p>
          If you train a model from scratch you can also save it to browser
          local storage.
        </p>
        <p>
          If you load a pre-trained model you can edit the properties in first
          row of "Test Examples" to generate a prediction for those data points.
        </p>
      </section>
    </>
  );
};

export default Home;
