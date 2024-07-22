const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const { messages } = JSON.parse(event.body); // Recibe todo el historial de mensajes

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not set in environment' }),
    };
  }

  const url = 'https://api.openai.com/v1/chat/completions';

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };

  const body = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Eres un asistente tutor y te llamas ZenMaster, y eres tutor de matematiccas, cuando te pidan una ecuacion algo compleja, ponla en formato texto en plan si ocupas un salto de linea para una fraccion, solo escribe 3/4 por ejemplo y lo mas entendible, y esto con todos los simbolos de cualquier ecuacion compleja, ejemplo si te piden una integral, usa los simbolos de texto de toda la vida www.rapidtables.org › math › symbolsLista de símbolos de cálculo (ε, y ,d/dx, ∫., no utilices las negritas dado que el usuario no las va a poder ver' },
      ...messages // Incluye todo el historial de mensajes en la solicitud
    ]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    });

    const data = await response.json();
    const botMessage = data.choices[0]?.message?.content || 'No se pudo obtener respuesta del bot.';
    return {
      statusCode: 200,
      body: JSON.stringify({ botMessage })
    };
  } catch (error) {
    console.error('Error fetching bot response:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch bot response' })
    };
  }
};
