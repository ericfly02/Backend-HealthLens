const axios = require('axios');
const { p } = require('framer-motion/client');
const fs = require('fs');

const processAudio = async (req, res) => {
  try {
    // Get the audio file from the request
    const audioFile = req.file;

    if (!audioFile) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    // IBM Watson Speech to Text API credentials
    const apiKey = process.env.IBM_API_KEY_SPEECH_TO_TEXT;
    const url = process.env.IBM_API_URL_SPEECH_TO_TEXT;

    // Log the environment variables
    console.log('API URL:', url);
    console.log('API Key:', apiKey);

    if (!url || !apiKey) {
      return res.status(500).json({ error: 'IBM API credentials missing' });
    }

    // Send the audio file to IBM's Speech to Text API
    const response = await axios.post(url, audioFile.buffer, {
      headers: {
        'Content-Type': 'audio/wav',
      },
      params: {
        model: 'en-US_BroadbandModel', // You can choose a different language model if needed
      },
      auth: {
        username: 'apikey',
        password: apiKey,
      }
    });

    // Get the transcription from IBM's response
    const transcription = response.data.results[0].alternatives[0].transcript;
    console.log('Transcription:', transcription);

    // Send the transcription back to the frontend
    return res.json({ transcript: transcription });

  } catch (error) {
    console.error('Error processing audio file:', error);
    return res.status(500).json({ error: 'Failed to process audio file' });
  }
};


module.exports = { processAudio };
