async function askAI() {
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const userText = input.value.trim();
    
    if (!userText) return;

    // 1. Add User Bubble
    chatBox.innerHTML += `<div class="bubble user-msg">${userText}</div>`;
    input.value = ""; 
    chatBox.scrollTop = chatBox.scrollHeight;

    // 2. Show a "typing..." indicator
    const typingId = "typing-" + Date.now();
    chatBox.innerHTML += `<div id="${typingId}" class="bubble ai-msg"><i>Thinking...</i></div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // 3. Call Puter AI
        const response = await puter.ai.chat(userText, { model: 'gpt-4o-mini' });
        
        // --- FIX: Extract String from Object ---
        let aiText = "";
        if (typeof response === 'string') {
            aiText = response;
        } else {
            // Check common Puter.js response paths
            aiText = response.text || (response.message && response.message.content) || JSON.stringify(response);
        }

        // 4. Format with Marked and Prism
        const typingDiv = document.getElementById(typingId);
        
        // Convert Markdown to HTML
        typingDiv.innerHTML = `<b>AI:</b><br>${marked.parse(aiText)}`;

        // 5. Add Copy Buttons to any generated code blocks
        typingDiv.querySelectorAll('pre').forEach((block) => {
            const button = document.createElement('button');
            button.innerText = 'Copy';
            button.className = 'copy-btn';
            block.appendChild(button);

            button.addEventListener('click', () => {
                const codeElement = block.querySelector('code');
                const textToCopy = codeElement ? codeElement.innerText : block.innerText;
                navigator.clipboard.writeText(textToCopy);
                button.innerText = 'Copied!';
                setTimeout(() => button.innerText = 'Copy', 2000);
            });
        });

        // 6. Highlight the code
        Prism.highlightAllUnder(typingDiv);

    } catch (error) {
        document.getElementById(typingId).innerHTML = `<div style="color: #ff4444;">Error: ${error.message}</div>`;
    }
    
    chatBox.scrollTop = chatBox.scrollHeight;
}
