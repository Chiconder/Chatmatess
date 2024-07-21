let messages = []; // Array para almacenar el historial de mensajes

document.addEventListener('DOMContentLoaded', () => {
  const sendButton = document.getElementById('send-btn');
  const darkModeToggle = document.getElementById('dark-mode-toggle');

  sendButton.addEventListener('click', function() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() !== '') {
      appendMessage(userInput, 'user-message');
      messages.push({ role: 'user', content: userInput }); // Añade el mensaje del usuario al historial
      document.getElementById('user-input').value = '';
      
      // Llama a la función de Netlify aquí y añade la respuesta del bot
      fetchBotResponse();
    }
  });

  darkModeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
  });

  // Aplicar el modo oscuro si está guardado en localStorage
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  }
});

function appendMessage(message, messageType) {
  const messageElement = document.createElement('div');
  messageElement.className = `message ${messageType}`;
  messageElement.innerText = message;
  
  const chatBox = document.getElementById('chat-box');
  const chatMessage = document.createElement('div');
  chatMessage.className = 'chat-message';
  chatMessage.appendChild(messageElement);
  chatBox.appendChild(chatMessage);
  
  // Desplázate hasta el final del cuadro de chat
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function fetchBotResponse() {
  try {
    const response = await fetch('/.netlify/functions/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages }) // Envía el historial completo de mensajes
    });

    const data = await response.json();
    const botMessage = data.botMessage;
    appendMessage(botMessage, 'bot-message');
    messages.push({ role: 'assistant', content: botMessage }); // Añade la respuesta del bot al historial
  } catch (error) {
    console.error('Error fetching bot response:', error);
    appendMessage('Lo siento, hubo un error al obtener la respuesta del bot.', 'bot-message');
  }
}
