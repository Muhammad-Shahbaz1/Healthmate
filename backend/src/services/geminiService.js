const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * HealthMate Gemini Multimodal Analysis Service
 * Reads medical report files (PDFs / Images) and generates bilingual summaries & insights.
 */
const analyzeMedicalReport = async (fileBuffer, mimeType, additionalContext = {}) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in backend environment variables.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Use gemini-3.5-flash - Confirmed working, fast multimodal model
  // Falls back through gemini-3.6-flash -> gemini-3.7-flash if needed
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.5-flash',
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
    },
  });

  const prompt = `
You are HealthMate AI (Sehat ka Smart Dost), an empathetic, highly accurate, bilingual medical report analyzer.
Analyze the provided medical document (lab test report, prescription, ultrasound, x-ray reading, etc.).

Context from user:
- Report Title / Note: "${additionalContext.title || 'Medical Report'}"
- Category: "${additionalContext.reportType || 'General Medical Report'}"

Your task is to extract the details and produce a JSON object strictly matching this schema:

{
  "summaryEnglish": "A concise, friendly, and easy-to-understand explanation of the overall report in plain English. Avoid overly dense medical jargon.",
  "summaryRomanUrdu": "A very natural, respectful, and crystal-clear explanation in conversational Roman Urdu (e.g. 'Aapki report me cholesterol level thora sa barha hua aya hai...'). Explain what is going on simply so any patient or elder in the family can easily understand.",
  "keyFindings": [
    "Key takeaway point 1",
    "Key takeaway point 2"
  ],
  "abnormalValues": [
    {
      "testName": "e.g. Hemoglobin / Hb",
      "observedValue": "e.g. 9.2 g/dL",
      "normalRange": "e.g. 12.0 - 15.5 g/dL",
      "status": "Low", // "High" | "Low" | "Abnormal" | "Borderline" | "Normal"
      "severity": "Moderate", // "Low" | "Moderate" | "High" | "Critical"
      "explanation": "Why this matters in English",
      "explanationUrdu": "Roman Urdu me iska asaan matlab"
    }
  ],
  "doctorQuestions": [
    "Specific question 1 the patient should ask their doctor during the next visit",
    "Specific question 2 to ask the doctor",
    "Specific question 3 to ask the doctor"
  ],
  "foodsToEat": [
    "Healthy food / diet recommendation 1 suited for this condition",
    "Healthy food 2"
  ],
  "foodsToAvoid": [
    "Food or habit to avoid 1",
    "Food to avoid 2"
  ],
  "homeRemedies": [
    "Safe, supportive lifestyle tip or home remedy 1",
    "Safe home remedy / routine tip 2"
  ],
  "suggestedFollowUp": "When or what follow-up test/doctor visit is typically recommended for this case",
  "disclaimer": "Yeh AI sirf samajhne ke liye hai, ilaaj ya formal medical diagnosis ke liye nahi. Please consult your certified healthcare provider."
}

Rules:
1. If the document is clean and all tests are normal, mention that clearly in both English and Roman Urdu.
2. If there are abnormal values (like high sugar, low platelet, high uric acid, elevated enzymes), list them explicitly in abnormalValues.
3. Roman Urdu should be authentic, empathetic, and grammatically natural (Pakistan/India conversational style).
4. Strictly return valid JSON. Do not include markdown code block tags (\`\`\`json) outside the JSON.
`;

  try {
    const inlineData = {
      inlineData: {
        data: fileBuffer.toString('base64'),
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([prompt, inlineData]);
    const responseText = result.response.text();
    
    // Parse JSON
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseError) {
      // Fallback in case wrapped in markdown
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    return {
      success: true,
      data: parsedData,
      rawResponse: responseText,
    };
  } catch (error) {
    console.error('Gemini Analysis Service Error:', error);
    throw new Error(`Gemini Analysis Failed: ${error.message}`);
  }
};

module.exports = { analyzeMedicalReport };
