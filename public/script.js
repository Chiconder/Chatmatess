document.getElementById('send-btn').addEventListener('click', function() {
  const userInput = document.getElementById('user-input').value;
  if (userInput.trim() !== '') {
    appendMessage(userInput, 'user-message');
    document.getElementById('user-input').value = '';
    
    // Call the Netlify function here and append the bot's response
    fetchBotResponse(userInput);
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
  
  // Scroll to the bottom of the chat box
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function fetchBotResponse(userInput) {
  try {
    const response = await fetch('/.netlify/functions/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: userInput })
    });

    const data = await response.json();
    const botMessage = data.botMessage;
    appendMessage(botMessage, 'bot-message');
  } catch (error) {
    console.error('Error fetching bot response:', error);
    appendMessage('Lo siento, hubo un error al obtener la respuesta del bot.', 'bot-message');
  }
}
