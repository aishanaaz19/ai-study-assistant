# 🧠 AI Study Assistant Web App

An intelligent, student-friendly web app that helps you upload study materials (PDFs), get summaries, generate flashcards, and even ask questions — all powered by AI.

---

## 🚀 Features

- 📄 Upload PDF Notes
- 🧾 Summarize Long Documents
- 📚 Generate Flashcards
- ❓ Ask Questions about Uploaded Content
- 🎨 Sleek Dark-Themed UI (Tailwind CSS)

---

## 🔧 Tech Stack

| Layer      | Technology                  |
|------------|------------------------------|
| Frontend   | React, Tailwind CSS          |
| Backend    | Node.js, Express             |
| AI Engine  | HuggingFace Transformers (BART) |
| Python API | Flask, Transformers          |
| File Upload| Multer, pdf-parse            |
| Deployment | Vercel / Render / Railway    |

---

## 📁 Project Structure

```
ai-study-assistant/
├── client/         # React frontend
├── server/         # Express backend
```

---

## 🛠️ Installation

### 1. Clone the repo
```bash
git clone https://github.com/your-username/ai-study-assistant.git
cd ai-study-assistant
```

### 2. Setup Frontend (React)
```bash
cd client
npm install
npm start
```

### 3. Setup Backend (Node.js)
```bash
cd ../server
npm install
node index.js
```

### 4. Optional: Run Python Summarizer
```bash
cd ../python-ai
pip install -r requirements.txt
python summarizer.py
```

> ✨ Make sure to add `.env` in `server/` with your API keys (if using OpenAI)

---

## 🔍 Sample `.env`
```
OPENAI_API_KEY=your_api_key_here
```

---

## 🙌 Author
Built with 💡 by **Team**

---

## 📜 License
MIT License. Free to use and modify for educational purposes.

---

## 🌐 Live Demo
> Coming soon...

---
