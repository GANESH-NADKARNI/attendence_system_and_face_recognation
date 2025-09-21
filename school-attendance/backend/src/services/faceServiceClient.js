const axios = require('axios');

const faceServiceApi = axios.create({
    baseURL: process.env.FACE_SERVICE_URL,
});

const getEmbedding = async (base64Image) => {
    try {
        const response = await faceServiceApi.post('/enroll', { image: base64Image });
        return response.data.embedding;
    } catch (error) {
        console.error('Error from face service (enroll):', error.response ? error.response.data : error.message);
        return null;
    }
};

const verifyFace = async (base64Image, knownEmbedding) => {
    try {
        const response = await faceServiceApi.post('/verify', {
            image: base64Image,
            known_embedding: knownEmbedding,
        });
        return response.data.is_match;
    } catch (error) {
        console.error('Error from face service (verify):', error.response ? error.response.data : error.message);
        return false;
    }
};

module.exports = {
    getEmbedding,
    verifyFace,
};