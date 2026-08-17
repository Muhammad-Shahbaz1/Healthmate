const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * HealthMate Gemini Multimodal Analysis Service
 * Reads medical report files (PDFs / Images) and generates bilingual summaries & insights.
 */
const analyzeMedicalReport = async (fileBuffer, rawMimeType, additionalContext = {}) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in backend environment variables.');
  }

  // Normalize MIME types for Gemini API
  let mimeType = rawMimeType || 'application/pdf';
  if (mimeType === 'image/jpg' || mimeType.includes('jpeg') || mimeType.includes('jpg')) {
    mimeType = 'image/jpeg';
  } else if (mimeType.includes('png')) {
    mimeType = 'image/png';
  } else if (mimeType.includes('webp')) {
    mimeType = 'image/webp';
  } else if (mimeType.includes('pdf')) {
    mimeType = 'application/pdf';
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  const prompt = `
You are HealthMate AI (Sehat ka Smart Dost), an empathetic, highly accurate, bilingual medical report analyzer.
Analyze the provided medical document (lab test report, prescription, pharmacy invoice/memo, ultrasound, x-ray, blood test, etc.).

Context from user:
- Report Title / Note: "${additionalContext.title || 'Medical Document'}"
- Category: "${additionalContext.reportType || 'General Medical Report'}"

Your task is to extract all medical insights, medicines, test parameters, and produce a JSON object strictly matching this schema:

{
  "summaryEnglish": "A clear, friendly, and easy-to-understand explanation of the overall document, medicine uses, or test results in plain English.",
  "summaryRomanUrdu": "A very natural, respectful, and crystal-clear explanation in conversational Roman Urdu (e.g. 'Aapki is prescription/report me...'). Explain the medicines, tests, or results simply so any patient or family elder can easily understand in Pakistan/India conversational Roman Urdu.",
  "keyFindings": [
    "Key takeaway point 1",
    "Key takeaway point 2",
    "Key takeaway point 3"
  ],
  "abnormalValues": [
    {
      "testName": "e.g. Hemoglobin / Fasting Sugar / Medicine Name",
      "observedValue": "e.g. 140 mg/dL or 50mg",
      "normalRange": "e.g. 70 - 100 mg/dL or Standard Dosage",
      "status": "High", // "High" | "Low" | "Abnormal" | "Borderline" | "Normal" | "Prescribed"
      "severity": "Moderate", // "Low" | "Moderate" | "High" | "Critical"
      "explanation": "Why this matters in English",
      "explanationUrdu": "Roman Urdu me iska asaan matlab"
    }
  ],
  "doctorQuestions": [
    "Specific question 1 the patient should ask their doctor/pharmacist",
    "Specific question 2 to ask",
    "Specific question 3 to ask"
  ],
  "foodsToEat": [
    "Healthy food / diet recommendation 1 suited for this health condition",
    "Healthy food recommendation 2"
  ],
  "foodsToAvoid": [
    "Food or habit to avoid 1",
    "Food to avoid 2"
  ],
  "homeRemedies": [
    "Safe, supportive lifestyle tip or care advice 1",
    "Safe tip 2"
  ],
  "suggestedFollowUp": "When or what follow-up doctor visit or test is recommended",
  "disclaimer": "Yeh AI sirf samajhne ke liye hai, ilaaj ya formal medical diagnosis ke liye nahi. Hamesha apne doctor ya certified healthcare professional se mashwara karein."
}

Rules:
1. If the document is a prescription or pharmacy receipt/memo, explain each medicine, its general purpose, and dosage advice in simple English and conversational Roman Urdu.
2. If it is a lab report, explain the normal vs abnormal values clearly.
3. Roman Urdu should be authentic, empathetic, and grammatically natural.
4. Strictly return valid JSON. Do not include markdown code block tags outside the JSON.
`;

  const inlineData = {
    inlineData: {
      data: fileBuffer.toString('base64'),
      mimeType: mimeType,
    },
  };

  // Models list in fallback order
  const models = ['gemini-3.5-flash', 'gemini-3.6-flash', 'gemini-flash-latest', 'gemini-3.7-flash'];
  let lastError = null;

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      });

      const result = await model.generateContent([prompt, inlineData]);
      const responseText = result.response.text();
      
      // Parse JSON safely
      let parsedData;
      try {
        parsedData = JSON.parse(responseText);
      } catch (parseError) {
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(cleaned);
      }

      return {
        success: true,
        data: parsedData,
        rawResponse: responseText,
        modelUsed: modelName,
      };
    } catch (err) {
      console.warn(`[Gemini Warning] Model ${modelName} failed: ${err.message}. Trying next fallback...`);
      lastError = err;
    }
  }

  throw new Error(`Gemini Analysis Failed on all models: ${lastError?.message}`);
};

module.exports = { analyzeMedicalReport };
