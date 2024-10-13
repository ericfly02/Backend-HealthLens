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
    const { sessionId, disease } = req.body;

    try {
        let session;
        if (!sessionId) {
        const sessionResponse = await assistant.createSession({
            assistantId: process.env.WATSON_ASSISTANT_ID,
        });
        session = sessionResponse.result.session_id;
        } else {
        session = sessionId;
        }

        // Send disease message to Watson Assistant
        const messageResponse = await assistant.message({
        assistantId: process.env.WATSON_ASSISTANT_ID,
        sessionId: session,
        input: {
            'message_type': 'text',
            'text': `The user uploaded an image indicating ${disease}. Let's discuss this further.`,
        },
        });

        res.json({
        sessionId: session,
        watsonResponse: messageResponse.result.output.generic.map(item => item.text),
        });
    } catch (error) {
        console.error('Error during interaction with Watson Assistant:', error);
        res.status(500).json({ error: 'Error interacting with Watson Assistant' });
    }
};
