const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const getAiBaseUrl = () => {
  return process.env.AI_SERVICE_URL || 'http://localhost:5001';
};

/**
 * Health probe for Python AI Microservice
 */
const checkHealth = async () => {
  try {
    const res = await axios.get(`${getAiBaseUrl()}/health`, { timeout: 4000 });
    return res.data;
  } catch (err) {
    console.warn(`[AI Service] Health check failed: ${err.message}`);
    return null;
  }
};

/**
 * Runs the matching algorithm across intern & slot cohorts.
 * `weights` optionally overrides scoring weights/quota percentages.
 */
const triggerMatching = async (interns, slots, weights) => {
  const url = `${getAiBaseUrl()}/match`;
  const payload = { interns, slots };
  if (weights && typeof weights === 'object') {
    payload.weights = weights;
  }
  const response = await axios.post(
    url,
    payload,
    {
      timeout: 120000, // 2-minute maximum wait for heavy cohorts
      headers: { 'Content-Type': 'application/json' },
    }
  );
  return response.data;
};

/**
 * Sends a PDF file stream to the AI parser for text & skill extraction
 */
const parseResume = async (filePath) => {
  const url = `${getAiBaseUrl()}/parse-resume`;
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));

  const response = await axios.post(url, formData, {
    headers: formData.getHeaders(),
    timeout: 30000,
  });

  return response.data;
};

module.exports = {
  checkHealth,
  triggerMatching,
  parseResume,
};
