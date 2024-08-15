var path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();

const app = express();

const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

app.use(express.static('dist'));

// Serve the index.html file for the root path
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Variables for URL and API key
const meaningCloudUrl = 'https://api.meaningcloud.com/sentiment-2.1';
const meaningCloudApiKey = process.env.MEANINGCLOUD_API_KEY;

// POST Route for sentiment analysis
app.post('/analyze', async function (req, res) {
    const userText = req.body.text; // Get text from request body

    try {
        const response = await axios.post(meaningCloudUrl, null, {
            params: {
                key: meaningCloudApiKey,
                txt: userText,
                lang: 'en' // Specify the language
            }
        });

        // Log the response data to verify structure
        console.log(response.data);

        // Extract important information from the response
        const { score_tag, confidence, subjectivity, irony } = response.data;

        // Create a human-readable summary
        const resultText = `
            Sentiment: ${score_tag === 'P+' ? 'Strong Positive' :
                        score_tag === 'P'  ? 'Positive' :
                        score_tag === 'NEU' ? 'Neutral' :
                        score_tag === 'N'  ? 'Negative' :
                        score_tag === 'N+' ? 'Strong Negative' :
                        score_tag === 'NONE' ? 'No Sentiment' : 'Unknown'}
            Confidence: ${confidence}%
            Subjectivity: ${subjectivity === 'SUBJECTIVE' ? 'Subjective' : 'Objective'}
            Irony: ${irony === 'IRONIC' ? 'Ironic' : 'Non-Ironic'}
        `;

        // Log the resultText to verify content
        console.log(resultText.trim());

        // Send the summarized result back to the client
        res.send(resultText.trim());
    } catch (error) {
        console.error('Error calling MeaningCloud API:', error);
        res.status(500).send('Error analyzing text');
    }
});

// Designates what port the app will listen to for incoming requests
app.listen(8000, function () {
    console.log('Example app listening on port 8000!');
});

