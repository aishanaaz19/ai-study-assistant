import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRoute from './routes/upload.js';
import summarizeRoutes from './routes/summarize.js';
import pdfSummaryRoute from './routes/pdfSummary.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/upload', uploadRoute);
app.use('/api/summarize', summarizeRoutes);
app.use('/api/pdf-summary', pdfSummaryRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
