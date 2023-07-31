import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import axios from 'axios';
import useDialogflow from '../hooks/useDialogflow';

function ChatInterface() {
  const [sessionId] = useState('1234');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async (event) => {
    event.preventDefault(); // Prevent form submission
    setMessages([...messages, { text: input, sender: 'User' }]);
    setInput('');
    let botMessage = '';
    // const { response, loading, error } = useDialogflow(sessionId, message);
    try {
      const response = await axios
        .post('http://localhost:5001/api/detectIntent', {
          query: input,
          // sessionId: sessionId,
        })
        .then((response) => {
          botMessage = response.data.queryResult.responseMessages[0].text.text;
        })
        .catch((error) => {
          console.log('Server Error: ', error);
        });
      setMessages([
        ...messages,
        { text: input, sender: 'User' },
        { text: botMessage, sender: 'Bot' },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '200px auto' }}>
      <Typography variant='h2' style={{ textAlign: 'center' }}>
        Chatbot
      </Typography>
      <Typography variant='h5' style={{ textAlign: 'center' }}>
        Dialogflow with MREN Stack
      </Typography>

      <List>
        {/* {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>} */}
        {messages.map((message, index) => (
          <ListItem key={index}>
            <ListItemText primary={message.text} secondary={message.sender} />
          </ListItem>
        ))}
      </List>
      <form onSubmit={sendMessage}>
        <TextField
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder='Type your message'
          fullWidth
          variant='outlined'
          style={{ marginBottom: '20px' }}
        />

        <Button type='submit' variant='contained' color='primary'>
          Send
        </Button>
      </form>
    </div>
  );
}

export default ChatInterface;
