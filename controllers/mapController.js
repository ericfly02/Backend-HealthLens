const axios = require('axios');

exports.getNearbyDoctors = async (req, res) => {
    const { lat, lng, specialty } = req.query;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const radius = 5000; // 5km radius
    let keyword = 'doctor';

    if (specialty && specialty !== 'all') {
        if (specialty === 'eye_care') {
            keyword += ' eye ophthalmologist';
        } else if (specialty === 'dermatologist') {
            keyword += ' dermatologist';
        } else if (specialty === 'nail_specialist') {
            keyword += ' podiatrist';
        }
    }

    const nearbySearchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=${encodeURIComponent(keyword)}&type=doctor&key=${apiKey}`;

    try {
        const nearbySearchResponse = await axios.get(nearbySearchUrl);
        const places = nearbySearchResponse.data.results;

        const detailedPlaces = await Promise.all(places.map(async (place) => {
            const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total&key=${apiKey}`;
            const detailsResponse = await axios.get(detailsUrl);
            return detailsResponse.data.result;
        }));

        res.json({ results: detailedPlaces });
    } catch (error) {
        console.error('Error fetching nearby doctors:', error.message);
        res.status(500).json({ error: 'Failed to fetch nearby doctors', details: error.message });
    }
};