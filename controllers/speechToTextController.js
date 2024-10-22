const { IamAuthenticator } = require('ibm-watson/auth');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { Readable } = require('stream');
const fs = require('fs');
const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');

// Initialize the IBM Speech to Text service
const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_SPEECH_TO_TEXT_API_KEY,
  }),
  serviceUrl: process.env.IBM_SPEECH_TO_TEXT_URL,
});

// Initialize FFmpeg
const ffmpeg = createFFmpeg({ log: true });

const processAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required.' });
    }

    console.log('Processing audio file:', req.file.originalname);

    await ffmpeg.load();

    // Load the audio file into FFmpeg
    ffmpeg.FS('writeFile', 'input.wav', await fetchFile(req.file.buffer));

    // Convert the audio file to PCM
    await ffmpeg.run(
      '-i', 'input.wav',
      '-acodec', 'pcm_s16le',
      '-ac', '1',
      '-ar', '16000',
      'output.pcm'
    );

    // Retrieve the converted file
    const output = ffmpeg.FS('readFile', 'output.pcm');
    const outputPath = '/tmp/output.pcm';
    fs.writeFileSync(outputPath, Buffer.from(output.buffer));

    const audioStream = fs.createReadStream(outputPath);

    const params = {
      audio: audioStream,
      contentType: 'audio/l16; rate=16000',
      model: 'en-US_BroadbandModel',
    };

    const transcription = await speechToText.recognize(params);
    res.json({
      transcription: transcription.result.results[0].alternatives[0].transcript,
    });

    // Clean up the temporary file
    fs.unlinkSync(outputPath);
  } catch (error) {
    console.error('Error processing audio file:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { processAudio };
