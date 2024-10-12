const axios = require('axios');

// Chat interaction with IBM Watson
exports.chat = async (req, res) => {
    const { message } = req.body;

    try {
        const response = await axios.post(process.env.WATSON_API_URL, {
            message,
        }, {
            headers: { 'Authorization': `Bearer ${process.env.WATSON_API_KEY}` }
        });

        const watsonReply = response.data.reply;

        res.status(200).json({ reply: watsonReply });
    } catch (err) {
        res.status(500).json({ error: 'Chat query failed' });
    }
};
