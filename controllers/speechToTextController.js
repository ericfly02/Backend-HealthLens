const { IamAuthenticator } = require('ibm-watson/auth');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const ffmpeg = require('fluent-ffmpeg');
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
    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required.' });
    }

    console.log('Processing audio file:', req.file.originalname);

    // Convert audio to the required format (L16 PCM)
    const outputPath = '/tmp/output.pcm'; // Temporary storage for converted file
    ffmpeg()
      .input(Readable.from(req.file.buffer))
      .output(outputPath)
      .audioCodec('pcm_s16le')
      .audioChannels(1)
      .audioFrequency(16000)
      .format('s16le')
      .on('end', async () => {
        console.log('Audio converted to L16 PCM format.');

        const audioStream = fs.createReadStream(outputPath);

        const params = {
          audio: audioStream,
          contentType: 'audio/l16; rate=16000', // L16 format with 16000Hz sample rate
          model: 'en-US_BroadbandModel',
        };

        const transcription = await speechToText.recognize(params);
        res.json({
          transcription: transcription.result.results[0].alternatives[0].transcript,
        });

        // Clean up the temporary file
        fs.unlinkSync(outputPath);
      })
      .on('error', (err) => {
        console.error('Error converting audio:', err);
        res.status(500).json({ error: 'Audio conversion failed.' });
      })
      .run();
  } catch (error) {
    console.error('Error processing audio file:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { processAudio };
