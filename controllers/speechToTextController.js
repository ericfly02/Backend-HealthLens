const { IamAuthenticator } = require('ibm-watson/auth');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');

const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_SPEECH_TO_TEXT_API_KEY,
  }),
  serviceUrl: process.env.IBM_SPEECH_TO_TEXT_URL,
});

const processAudio = async (req, res) => {
  try {
    if (!req.file || req.file.size === 0) {
      return res.status(400).json({ error: 'Audio file is required and cannot be empty.' });
    }

    const audioStream = req.file.buffer; // Get the audio buffer
    const params = {
      audio: audioStream,
      contentType: 'audio/wav', // Ensure correct content type
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
