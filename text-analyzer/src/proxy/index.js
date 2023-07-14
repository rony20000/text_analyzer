const http = require("http");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const qs = require("qs");

const baseUrl = "http://api.textrazor.com";
const API_KEY = "4619c0fa9505fd1ffa75b10612f220d9927d29262c3ed06e82bfb834";

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.post("/textrazor", async (req, res) => {
  try {
    const requestBody = qs.stringify({
      apiKey: API_KEY,
      text: req.body.text,
      extractors: "entities",
      "entities.filterDbpediaTypes": ["Country", "Person"],
      "entities.filterFreebaseTypes": ["/location/country", "/people/person"],
    });

    const response = await axios.post(baseUrl, requestBody, {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    });
    return res.send(response.data);
  } catch (err) {
    return res.status(400).send(err);
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
