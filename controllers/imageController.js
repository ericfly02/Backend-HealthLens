const axios = require('axios');
const fs = require('fs');

// Image upload handler
exports.uploadImage = async (req, res) => {
    const { file } = req;

    try {
        console.log(file);
        const formData = new FormData();
        formData.append('file', fs.createReadStream(file.path));

        const response = await axios.post(`${process.env.FLASK_SERVER_URL}/upload`, formData, {
            headers: formData.getHeaders(),
        });

        console.log(response.data);

        const rashType = response.data.rashType;
        fs.unlinkSync(file.path); // Clean up

        res.status(200).json({ rashType });
    } catch (err) {
        res.status(500).json({ error: 'Image upload failed' });
    }
};
