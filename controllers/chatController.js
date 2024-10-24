// chatController.js
const axios = require('axios');

// Constants
const API_URL = process.env.WATSON_URL;
const IAM_URL = process.env.IAM_URL;
const API_KEY = process.env.WATSON_API_KEY;

// Function to get IAM token
async function getIAMToken() {
  console.log('Attempting to get IAM token with API key:', API_KEY);
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

    console.log('Successfully got IAM token');
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
    console.log('Received message:', message);

    // Get IAM token
    const accessToken = await getIAMToken();
    console.log('Access token obtained:', accessToken ? 'Yes' : 'No');

    // Prepare body for the Watson API request
    const body = {
        input: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nYou are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe. \nYour answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature.\n\nIf a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n${message}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`,
        parameters: {
          decoding_method: "greedy",
          max_new_tokens: 3,
          min_new_tokens: 0,
          stop_sequences: [],
          repetition_penalty: 1
        },
        model_id: "meta-llama/llama-3-2-3b-instruct",
        project_id: "d5428963-a688-4d05-b9b8-410d3a879e78"
      };
  

    // Make the request to the Watson API
    console.log('Making request to Watson API...');
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
    console.log('Watson API Response:', data);
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
