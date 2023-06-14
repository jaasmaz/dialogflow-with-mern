const express = require('express');
const { SessionsClient } = require('@google-cloud/dialogflow-cx');
require('dotenv').config();

const app = express();
app.use(express.json());
const port = 5000;
const mongoose = require('mongoose');

mongoose.connect(
  `mongodb+srv://jaasmaz:${process.env.DATABASE_KEY}@cluster0.whxon0x.mongodb.net/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.post('/api/detectIntent', async (req, res) => {
  const projectId = 'dialogflow-388919';
  const location = 'us-central1';
  const agentId = '6551f763-bfac-406e-a3ea-f858bef67e61';
  const sessionId = Math.random().toString(36).substring(7);
  console.log(req.body.query);
  const query = req.body.query;

  const client = new SessionsClient({
    apiEndpoint: 'us-central1-dialogflow.googleapis.com',
  });
  const sessionPath = client.projectLocationAgentSessionPath(
    projectId,
    location,
    agentId,
    sessionId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
      },
      languageCode: 'en-US',
    },
  };

  const [response] = await client.detectIntent(request);

  res.json(response);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
