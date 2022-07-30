import express from "express";
import { IamAuthenticator } from "ibm-watson/auth/index.js";
import NaturalLanguageUnderstandingV1 from "ibm-watson/natural-language-understanding/v1.js";
import d from "dotenv";
import cors from "cors";

d.config();

const app = new express();

app.use(express.static("client"));
app.use(cors());

// Helper functions

const performAnalysis = async (analyzeParams, targetKey) => {
  const nluInstance = new NaturalLanguageUnderstandingV1({
    version: "2021-08-01",
    authenticator: new IamAuthenticator({
      apikey: process.env.API_KEY,
    }),
    serviceUrl: process.env.API_URL,
  });
  try {
    const analysisResults = await nluInstance.analyze(analyzeParams);
    if (analysisResults.result.keywords.length > 0) {
      return {
        detail: analysisResults.result.keywords[0][targetKey],
        ok: true,
      };
    } else {
      return { detail: "Not enough context in the message", ok: true };
    }
  } catch (err) {
    return {
      detail: `Could not carry out the desired operation ${err}`,
      ok: false,
    };
  }
};

// -- Routes --

app.get("/", (req, res) => res.render("index.html"));

//The endpoint for the webserver ending with /url/emotion
app.get("/url/emotion", async (req, res) => {
  const r = await performAnalysis(
    {
      url: req.query.url,
      features: {
        keywords: { emotion: true, limit: 1 },
      },
    },
    "emotion"
  );
  return res.send(r.detail);
});

//The endpoint for the webserver ending with /url/sentiment
app.get("/url/sentiment", async (req, res) => {
  const r = await performAnalysis(
    {
      url: req.query.url,
      features: {
        keywords: { sentiment: true, limit: 1 },
      },
    },
    "sentiment"
  );
  return res.send(r.detail);
});

//The endpoint for the webserver ending with /text/emotion
app.get("/text/emotion", async (req, res) => {
  const r = await performAnalysis(
    {
      text: req.query.text,
      features: {
        keywords: { emotion: true, limit: 1 },
      },
    },
    "emotion"
  );
  return res.send(r.detail);
});

app.get("/text/sentiment", async (req, res) => {
  const r = await performAnalysis(
    {
      text: req.query.text,
      features: {
        keywords: { sentiment: true, limit: 1 },
      },
    },
    "sentiment"
  );
  return res.send(r.detail);
});

let server = app.listen(8080, () => {
  console.log("Listening", server.address().port);
});
