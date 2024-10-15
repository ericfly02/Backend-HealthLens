const axios = require('axios');
const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

// IBM Watson Assistant setup
const assistant = new AssistantV2({
    version: process.env.WATSON_ASSISTANT_VERSION,
    authenticator: new IamAuthenticator({
        apikey: process.env.WATSON_API_KEY,
    }),
    serviceUrl: process.env.WATSON_URL,
});

    // Start conversation with Watson Assistant
exports.startConversation = async (req, res) => {
    const { sessionId, disease, message } = req.body;

    console.log('Request body:', req.body);
    console.log('Disease:', disease);
    console.log('Session ID:', sessionId);
    
    // Make a credentials console log to check if the credentials are correct
    console.log("WATSON_ASSISTANT_VERSION: ", process.env.WATSON_ASSISTANT_VERSION);
    console.log("WATSON_API_KEY: ", process.env.WATSON_API_KEY);
    console.log("WATSON_URL: ", process.env.WATSON_URL);
    console.log("WATSON_ASSISTANT_ID: ", process.env.WATSON_ASSISTANT_ID);
    console.log("WATSON_URL: ", process.env.WATSON_URL);

    try {
        let session;
        if (!sessionId) {
        const sessionResponse = await assistant.createSession({
            assistantId: process.env.WATSON_ASSISTANT_ID,
        });
        console.log('Watson Assistant response:', sessionResponse);
        session = sessionResponse.result.session_id;
        console.log('New session created:', session);
        } else {
        session = sessionId;
        console.log('Existing session used:', session);
        }

        console.log('Session ID:', session);

        // Send disease message to Watson Assistant
        console.log('Sending disease to Watson Assistant:', disease);
        const messageResponse = await assistant.message({
        assistantId: process.env.WATSON_ASSISTANT_ID,
        sessionId: session,
        input: {
            'message_type': 'text',
            'text': `${message}`,
        },
        });

        console.log('Watson Assistant response:', messageResponse.result.output.generic.map(item => item.text));

        res.json({
        sessionId: session,
        watsonResponse: messageResponse.result.output.generic.map(item => item.text),
        });
    } catch (error) {
        console.error('Error during interaction with Watson Assistant:', error);
        res.status(500).json({ error: 'Error interacting with Watson Assistant' });
    }
};
