const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_API_KEY_SPEECH_TO_TEXT,  // From your environment variables
  }),
  serviceUrl: process.env.IBM_API_URL_SPEECH_TO_TEXT,  // From your environment variables
});

const processAudio = async (req, res) => {
  try {
    // Ensure an audio file is provided
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    // Set up parameters for the speech-to-text service
    const recognizeParams = {
      audio: req.file.buffer,  // The uploaded audio file
      contentType: 'audio/wav',  // Adjust based on your audio format
      model: 'en-US_BroadbandModel',  // Adjust model based on your needs
    };

    // Call IBM Watson Speech to Text service
    const response = await speechToText.recognize(recognizeParams);

    // Extract transcription from the response
    const transcription = response.result.results[0].alternatives[0].transcript;
    console.log('Transcription:', transcription);

    // Send the transcription back to the frontend
    return res.json({ transcript: transcription });

  } catch (error) {
    console.error('Error processing audio file:', error);
    return res.status(500).json({ error: 'Failed to process audio file' });
  }
};

module.exports = { processAudio };
