const { IamAuthenticator } = require('ibm-watson/auth');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { Readable } = require('stream');

// Initialize the IBM Speech to Text service
const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_SPEECH_TO_TEXT_API_KEY,
  }),
  serviceUrl: process.env.IBM_SPEECH_TO_TEXT_URL,
});

const processAudio = async (req, res) => {
  try {
    console.log("API KEY: ", process.env.IBM_SPEECH_TO_TEXT_API_KEY);
    console.log("URL: ", process.env.IBM_SPEECH_TO_TEXT_URL);

    // Check if file is uploaded
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ error: 'Audio file is required.' });
    }

    // Log details about the uploaded file
    console.log('Processing audio file:', req.file.originalname);
    console.log('File size:', req.file.size);
    console.log('File buffer length:', req.file.buffer.length); // Log buffer length instead of the buffer itself

    // Check for empty audio buffer
    if (req.file.size === 0 || req.file.buffer.length === 0) {
      return res.status(400).json({ error: 'Audio file cannot be empty.' });
    }

    // Create a readable stream from the audio buffer
    const audioStream = new Readable();
    audioStream.push(req.file.buffer);
    audioStream.push(null); // Signal the end of the stream

    const params = {
      audio: audioStream,
      contentType: 'audio/wav; rate=16000; channels=1',
      model: 'en-US_BroadbandModel', // Specify the model
    };

    const transcription = await speechToText.recognize(params);
    res.json({
      transcription: transcription.result.results[0].alternatives[0].transcript,
    });
  } catch (error) {
    console.error('Error processing audio file:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { processAudio };
