# 💚 HealthMate – Sehat ka Smart Dost
> An AI-powered personal health companion app using Google Gemini for reading, organizing, and explaining medical reports in **English** and **Roman Urdu**.

---

## 🌟 Key Features

1. **AI Medical Report Reading (Gemini 1.5/Flash Multimodal)**:
   - Upload PDFs, photos, or scanned lab reports (No manual OCR needed).
   - Automatically detects and flags **Abnormal Values** (e.g. Hemoglobin low, WBC high).
   - Generates bilingual explanations in **English** and conversational **Roman Urdu**.
   - Provides **3-5 specific questions to ask your doctor**.
   - Highlights **Foods to Eat** vs **Foods to Avoid** & safe **Home Remedies**.
   - Includes safety **Medical Disclaimers**.

2. **Manual Health Vitals Tracking**:
   - Log daily BP (Systolic / Diastolic), Blood Sugar (Fasting / Random), Weight, and Pulse.

3. **Unified Medical Timeline**:
   - Chronologically tracks every prescription, test report, and health vital entry in a clean timeline.

4. **Security & Privacy**:
   - JWT-based authentication.
   - Secure MongoDB storage and Cloudinary integration.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Lucide Icons, Axios, Date-fns.
- **Backend**: Node.js, Express.js, MongoDB / Mongoose, Multer, Cloudinary, JWT.
- **AI Model**: Google Gemini API (`@google/generative-ai` multimodal).

---

## 🚀 How to Run Locally

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder (you can copy `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/healthmate?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_gemini_api_key_from_google_ai_studio
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend server:
```bash
npm run dev
```

---

### 2. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!
