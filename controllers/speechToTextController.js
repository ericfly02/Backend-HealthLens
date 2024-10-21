const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH || ffmpegPath);

console.log('ffmpeg path:', ffmpegPath);

const { IamAuthenticator } = require('ibm-watson/auth');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { Readable } = require('stream');
const fs = require('fs');

// Initialize the IBM Speech to Text service
const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_SPEECH_TO_TEXT_API_KEY,
  }),
  serviceUrl: process.env.IBM_SPEECH_TO_TEXT_URL,
});

const processAudio = async (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ error: 'Audio file is required.' });
    }

    // Log details about the uploaded file
    console.log('Processing audio file:', req.file.originalname);
    
    const audioStream = new Readable();
    audioStream.push(req.file.buffer);
    audioStream.push(null); // Signal the end of the stream

    // Convert the audio buffer to L16 (PCM)
    const tempOutputPath = '/tmp/converted_audio.wav'; // Temporary path for converted audio

    ffmpeg(audioStream)
      .inputFormat('wav')
      .audioCodec('pcm_s16le')
      .audioChannels(1)
      .audioFrequency(16000)
      .format('wav')
      .on('end', async () => {
        const convertedAudio = fs.createReadStream(tempOutputPath);

        const params = {
          audio: convertedAudio,
          contentType: 'audio/l16; rate=16000',
          model: 'en-US_BroadbandModel',
        };

        try {
          const transcription = await speechToText.recognize(params);
          res.json({
            transcription: transcription.result.results[0].alternatives[0].transcript,
          });
        } catch (err) {
          console.error('Error with IBM Speech-to-Text:', err);
          res.status(500).json({ error: 'Error with transcription' });
        }
      })
      .on('error', (err) => {
        console.error('Error converting audio:', err);
        res.status(500).json({ error: 'Error converting audio' });
      })
      .save(tempOutputPath); // Save the converted audio
  } catch (error) {
    console.error('Error processing audio file:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { processAudio };
