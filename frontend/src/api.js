import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,  // This will use the environment variable
});

export const generateForm = async (prompt, conversationId = null, mockFailures = 0) => {
    const url = mockFailures > 0 ? `/api/form/generate?mock_llm_failure=${mockFailures}` : '/api/form/generate';
    const response = await api.post(url, { prompt, conversationId });
    return response.data;
};
