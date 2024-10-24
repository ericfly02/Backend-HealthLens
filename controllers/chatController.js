// chatController.js
const axios = require('axios');

// Constants
const API_URL = process.env.WATSON_URL;
const IAM_URL = process.env.IAM_URL;
const API_KEY = process.env.WATSON_API_KEY;

// Function to get IAM token
async function getIAMToken() {
  try {
    const response = await axios.post(IAM_URL, 
      `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${API_KEY}`, 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (response.status !== 200) {
      console.error('IAM Token Error Response:', response.data);
      throw new Error('Failed to get IAM token');
    }

    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching IAM token:', error.message);
    throw new Error('Failed to get IAM token');
  }
}

// Rename the function to match the reference in the routes file
exports.startConversation = async (req, res) => {
  try {
    const { message } = req.body;

    // Get IAM token
    const accessToken = await getIAMToken();

    // Prepare body for the Watson API request
    const body = {
        input: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nYou are given a user question, and please write clean, concise and accurate answer to the question.\nYou may only answer questions about skin, eye and nails conditions, nothing else. If the user's question is about anything that is not a skin, eye or nail condition, please say: I don't know anything about that\nYour answer must be correct, accurate and written by an expert using an unbiased and professional tone. Please limit to 512 tokens.<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n${message}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`,
        parameters: {
          decoding_method: "greedy",
          max_new_tokens: 100,
          min_new_tokens: 0,
          stop_sequences: [],
          repetition_penalty: 1
        },
        model_id: "meta-llama/llama-3-2-3b-instruct",
        project_id: "d5428963-a688-4d05-b9b8-410d3a879e78"
      };
  

    // Make the request to the Watson API
    const response = await axios.post(API_URL, body, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      }
    });

    if (response.status !== 200) {
      console.error('Watson API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        error: response.data
      });
      throw new Error(`API call failed: ${response.statusText}`);
    }

    // Return the response from Watson API
    const data = response.data;
    res.json({ response: data.results[0].generated_text });

  } catch (error) {
    console.error('Error during Watson API interaction:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ error: 'Failed to process request' });
  }
};
