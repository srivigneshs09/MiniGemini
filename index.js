import { GoogleGenerativeAI } from "@google/generative-ai";
import express from 'express';

const app = express();
const port = 3000;

// Initialize the GoogleGenerativeAI client
const genAi = new GoogleGenerativeAI("YOUR_API_KEY_HERE");

// Serve static files from the "public" directory
app.use(express.static('public'));

// Define the /api/generate endpoint
app.get('/api/generate', async (req, res) => {
    const query = req.query.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const model = genAi.getGenerativeModel({
            model: 'gemini-1.5-flash',
        });

        const response = await model.generateContent(query);

        // Log the response to inspect its structure
        console.log('API response:', response);

        // Assuming the generated content is in response.response.candidates[0].content.parts[0].text
        const generatedText = response.response.candidates[0].content.parts[0].text;

        res.json({ text: generatedText });
    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).json({ error: 'Failed to generate content' });
    }
});

// Default route to serve the welcome message
app.get('/', (req, res) => {
    res.send('Welcome to my Chat application');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
