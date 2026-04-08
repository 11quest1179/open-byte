async function askAI() {
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const userText = input.value.trim();
    
    if (!userText) return;

    // 1. Add User Bubble
    chatBox.innerHTML += `<div class="bubble user-msg">${userText}</div>`;
    input.value = ""; 
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // 2. Show a "typing..." indicator (optional but looks cool)
        const typingId = "typing-" + Date.now();
        chatBox.innerHTML += `<div id="${typingId}" class="bubble ai-msg">...</div>`;
        
        const response = await puter.ai.chat(userText, { model: 'gpt-4o-mini' });
        
        // 3. Replace typing indicator with actual AI response
        document.getElementById(typingId).innerHTML = `<b>AI:</b> <br>${response}`;
    } catch (error) {
        chatBox.innerHTML += `<div class="bubble" style="background: #ffcccc; align-self: center;">Error: ${error.message}</div>`;
    }
    
    chatBox.scrollTop = chatBox.scrollHeight;
}
