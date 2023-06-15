import { useState, useEffect } from 'react';
import axios from 'axios';

const useDialogflow = (sessionId, message) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getResponse = async () => {
      setLoading(true);
      try {
        const res = await axios.post('/api/dialogflow', { sessionId, message });
        setResponse(res.data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    getResponse();
  }, [sessionId, message]);

  return { response, loading, error };
};

export default useDialogflow;
