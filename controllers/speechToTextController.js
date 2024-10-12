const fs = require('fs');
const { IamAuthenticator } = require('ibm-watson/auth');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const ffmpeg = require('fluent-ffmpeg'); // Add this line

// Load environment variables
const API_URL = process.env.WATSON_URL;
const API_KEY = process.env.WATSON_API_KEY;

const speechToTextService = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: API_KEY,
  }),
  serviceUrl: API_URL,
});

const speechToText = async (req, res) => {
  try {
    console.log('File received:', req.file); // Check if file is received
    console.log('File MIME type:', req.file.mimetype);

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const audioFilePath = req.file.path; 
    const convertedAudioPath = `uploads/${req.file.filename}.wav`; // Path for converted audio file

    // Convert the audio file from webm to wav
    await new Promise((resolve, reject) => {
      ffmpeg(audioFilePath)
        .toFormat('wav')
        .on('end', () => {
          console.log('Audio conversion completed successfully');
          resolve();
        })
        .on('error', (err) => {
          console.error('Error during audio conversion:', err);
          reject(err);
        })
        .save(convertedAudioPath);
    });

    const audioStream = fs.createReadStream(convertedAudioPath);
    console.log('Processing file:', convertedAudioPath);

    const params = {
      audio: audioStream,
      contentType: 'audio/wav', // Set the content type to wav
    };

    const response = await speechToTextService.recognize(params);
    const transcript = response.result.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    // Clean up: delete the original and converted files after processing
    fs.unlinkSync(audioFilePath);
    fs.unlinkSync(convertedAudioPath);

    console.log('Transcription:', transcript);

    res.json({ transcription: transcript });
  } catch (error) {
    console.error('Error in speech-to-text:', error);
    res.status(500).json({ error: 'Failed to process speech-to-text' });
  }
};

module.exports = { speechToText };
