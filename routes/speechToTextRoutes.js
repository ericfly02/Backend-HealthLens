const express = require('express');
const multer = require('multer');  // Multer is required for handling multipart/form-data (file uploads)
const { IamAuthenticator } = require('ibm-watson/auth');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');

const router = express.Router();

// Set up IBM Watson Speech to Text service
const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.WATSON_API_KEY,
  }),
  serviceUrl: process.env.WATSON_URL,
});

// Set up Multer for audio file uploads
const upload = multer();

// POST route for speech-to-text
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

router.post('/speech-to-text', upload.single('audio'), async (req, res) => {
  const audioFile = req.file;

  console.log('Audio buffer size:', audioFile.buffer.length);


  if (!audioFile) {
    return res.status(400).send('No audio file uploaded');
  }

  const inputPath = path.join(__dirname, `../uploads/${audioFile.originalname}`);
  const outputPath = path.join(__dirname, `../uploads/${Date.now()}_converted.pcm`);  // Generate a unique name for the output file
  
  fs.writeFileSync(inputPath, audioFile.buffer);

  // Convert WAV to PCM
  ffmpeg(inputPath)
    .toFormat('s16le')  // PCM format
    .on('end', async () => {
      try {
        const pcmBuffer = fs.readFileSync(outputPath);
        console.log('PCM Buffer size:', pcmBuffer.length);
        

        const response = await speechToText.recognize({
            audio: pcmBuffer,
            contentType: 'audio/l16; rate=16000',
          });
          

        console.log('Transcription:', response.result.results);

        const transcription = response.result.results
          .map(r => r.alternatives[0].transcript)
          .join('\n');

        res.json({ transcription });
      } catch (err) {
        console.error('Error with IBM Speech to Text:', err);
        res.status(500).send('Error transcribing audio');
      } finally {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      }
    })
    .on('error', (err) => {
      console.error('Error during FFmpeg conversion:', err);
      res.status(500).send('Error during audio conversion');
    })
    .save(outputPath);
});


  

module.exports = router;
