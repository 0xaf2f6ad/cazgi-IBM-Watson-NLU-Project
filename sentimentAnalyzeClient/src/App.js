import "./bootstrap.min.css";
import "./App.css";
import EmotionTable from "./EmotionTable.js";
import React from "react";

class App extends React.Component {
  state = {
    innercomp: <textarea rows="4" cols="50" id="textinput" />,
    mode: "text",
    sentimentOutput: [],
    sentiment: true,
  };

  renderOutput = (input_mode) => {
    let rows = 1;
    let mode = "url";
    //If the input mode is text make it 4 lines
    if (input_mode === "text") {
      mode = "text";
      rows = 4;
    }
    this.setState({
      innercomp: <textarea rows={rows} cols="50" id="textinput" />,
      mode: mode,
      sentimentOutput: [],
      sentiment: true,
    });
  };

  sendForSentimentAnalysis = () => {
    this.setState({ sentiment: true });
    let url = ".";
    let mode = this.state.mode;
    let val = document.getElementById("textinput").value;
    url = `${url}/${mode}/sentiment?${mode}=${val}`;

    fetch(url).then((response) => {
      response.json().then((data) => {
        this.setState({ sentimentOutput: data.label });
        let output = data.label;
        let color = "white";
        switch (output) {
          case "positive":
            color = "green";
            break;
          case "negative":
            color = "red";
            break;
          default:
            color = "yellow";
        }
        output = <div style={{ color: color, fontSize: 20 }}>{output}</div>;
        this.setState({ sentimentOutput: output });
      });
    });
  };

  sendForEmotionAnalysis = () => {
    this.setState({ sentiment: false });
    let url = ".";
    let mode = this.state.mode;
    let val = document.getElementById("textinput").value;
    url = `${url}/${mode}/emotion?${mode}=${val}`;

    fetch(url).then((response) => {
      response.json().then((data) => {
        this.setState({ sentimentOutput: <EmotionTable emotions={data} /> });
      });
    });
  };

  render() {
    return (
      <div className="App">
        <button
          className="btn btn-info"
          onClick={() => {
            this.renderOutput("text");
          }}
        >
          Text
        </button>
        <button
          className="btn btn-dark"
          onClick={() => {
            this.renderOutput("url");
          }}
        >
          URL
        </button>
        <br />
        <br />
        {this.state.innercomp}
        <br />
        <button className="btn-primary" onClick={this.sendForSentimentAnalysis}>
          Analyze Sentiment
        </button>
        <button className="btn-primary" onClick={this.sendForEmotionAnalysis}>
          Analyze Emotion
        </button>
        <br />
        {this.state.sentimentOutput}
      </div>
    );
  }
}

export default App;
