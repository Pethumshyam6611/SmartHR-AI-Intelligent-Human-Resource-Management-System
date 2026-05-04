import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export const recommendLeave = async (req: Request, res: Response): Promise<void> => {
    try {
        const { workload, lastLeaveDate, upcomingProjects } = req.body;

        const prompt = `As an HR assistant, analyze the following employee situation and recommend whether they should take leave:
    - Current workload: ${workload}
    - Last leave date: ${lastLeaveDate}
    - Upcoming projects: ${upcomingProjects}
    
    Provide a recommendation with reasoning.`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const recommendation = response.text();

        res.json({
            recommendation,
        });
    } catch (error) {
        console.error('Recommend leave error:', error);
        res.status(500).json({ message: 'AI service error. Please check GEMINI_API_KEY configuration.' });
    }
};

export const analyzeResume = async (req: Request, res: Response): Promise<void> => {
    try {
        const { resumeText, jobDescription } = req.body;

        if (!resumeText || !jobDescription) {
            res.status(400).json({ message: 'Resume text and job description are required' });
            return;
        }

        const prompt = `Analyze this resume against the job description and provide:
    1. Match score (0-100)
    2. Key strengths
    3. Gaps or missing skills
    4. Recommendation (Highly Recommended, Recommended, Consider, Not Recommended)
    
    Resume:
    ${resumeText}
    
    Job Description:
    ${jobDescription}
    
    Provide the analysis in JSON format.`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const analysis = response.text();

        res.json({
            analysis,
        });
    } catch (error) {
        console.error('Analyze resume error:', error);
        res.status(500).json({ message: 'AI service error. Please check GEMINI_API_KEY configuration.' });
    }
};

export const analyzeSalary = async (req: Request, res: Response): Promise<void> => {
    try {
        const { position, experience, location, currentSalary } = req.body;

        const prompt = `As an HR compensation analyst, analyze the following:
    - Position: ${position}
    - Years of experience: ${experience}
    - Location: ${location}
    - Current salary: ${currentSalary}
    
    Provide:
    1. Market salary range for this position
    2. Whether current salary is competitive
    3. Recommendations for salary adjustment
    4. Factors affecting compensation`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const analysis = response.text();

        res.json({
            analysis,
        });
    } catch (error) {
        console.error('Analyze salary error:', error);
        res.status(500).json({ message: 'AI service error. Please check GEMINI_API_KEY configuration.' });
    }
};

export const hrAssistant = async (req: Request, res: Response): Promise<void> => {
    try {
        const { question } = req.body;

        if (!question) {
            res.status(400).json({ message: 'Question is required' });
            return;
        }

        const prompt = `You are an HR assistant for SmartHR system. Answer the following HR-related question professionally and concisely:
    
    ${question}`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const answer = response.text();

        res.json({
            answer,
        });
    } catch (error) {
        console.error('HR assistant error:', error);
        res.status(500).json({ message: 'AI service error. Please check GEMINI_API_KEY configuration.' });
    }
};

export const attendanceInsights = async (req: Request, res: Response): Promise<void> => {
    try {
        const { attendanceData } = req.body;

        if (!attendanceData) {
            res.status(400).json({ message: 'Attendance data is required' });
            return;
        }

        const prompt = `Analyze the following attendance data and provide insights:
    ${JSON.stringify(attendanceData)}
    
    Provide:
    1. Attendance trends
    2. Potential issues or patterns
    3. Recommendations for improvement
    4. Employees who may need attention`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const insights = response.text();

        res.json({
            insights,
        });
    } catch (error) {
        console.error('Attendance insights error:', error);
        res.status(500).json({ message: 'AI service error. Please check GEMINI_API_KEY configuration.' });
    }
};
