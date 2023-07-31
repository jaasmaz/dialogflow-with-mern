const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { SessionsClient } = require('@google-cloud/dialogflow-cx');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());
const port = 5001;

mongoose.connect(
  `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_KEY}@cluster0.whxon0x.mongodb.net/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.post('/api/detectIntent', async (req, res) => {
  const projectId = process.env.PROJECT_ID;
  const location = process.env.LOCATION;
  const agentId = process.env.AGENT_ID;
  const sessionId = Math.random().toString(36).substring(7);
  const query = req.body.query;

  const client = new SessionsClient({
    apiEndpoint: process.env.API_ENDPOINT,
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
