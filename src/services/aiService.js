/**
 * Service to handle Azure AI API calls.
 * 
 * @param {string} endpoint - The full URL of the Azure AI endpoint.
 * @param {string} apiKey - The API key for authentication.
 * @param {object} payload - The JSON body to send.
 * @returns {Promise<any>} - The JSON response from the API.
 */
export const callAzureAI = async (endpoint, apiKey, payload) => {
    if (!endpoint || !apiKey) {
        throw new Error("Endpoint and API Key are required.");
    }

    try {
        // We now call our own backend API (Azure Function)
        // This avoids CORS issues because the browser calls the same origin,
        // and the server-side function calls the external Azure AI service.
        const response = await fetch('/api/aiProxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                endpoint,
                apiKey,
                payload
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Azure AI Service Error:", error);
        throw error;
    }
};

/**
 * Service to handle Azure Custom Vision API calls (URL based).
 * 
 * @param {string} endpoint - The full URL of the Azure Custom Vision Prediction endpoint.
 * @param {string} apiKey - The Prediction-Key.
 * @param {string} imageUrl - The URL of the image to predict.
 * @returns {Promise<any>} - The JSON response from the API.
 */
export const callAzureVision = async (endpoint, apiKey, imageUrl) => {
    if (!endpoint || !apiKey || !imageUrl) {
        throw new Error("Endpoint, API Key, and Image URL are required.");
    }

    // Custom Vision usually expects a body like { "Url": "http://..." }
    const payload = { "Url": imageUrl };

    // Reuse the existing generic AI proxy
    return await callAzureAI(endpoint, apiKey, payload);
};
