const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config(); // Carga las variables de entorno desde el archivo .env

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    const apiKey = process.env.OPENAI_API_KEY; // Verifica que esta línea obtiene la API key correctamente
    if (!apiKey) {
        return res.status(500).json({ error: 'API key not set in environment' });
    }

    const url = 'https://api.openai.com/v1/chat/completions';

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    const body = {
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'Eres un asistente tutor y te llamas ZenMaster, y eres tutor de mates.' },
            { role: 'user', content: message }
        ]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        const data = await response.json();
        console.log('API response:', data); // Añadir esta línea para depuración
        const botMessage = data.choices[0]?.message?.content || 'No se pudo obtener respuesta del bot.';
        res.json({ botMessage });
    } catch (error) {
        console.error('Error fetching bot response:', error);
        res.status(500).json({ error: 'Failed to fetch bot response' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
