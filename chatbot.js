(async () => {
  // 1. Load FAQ data
  const faq = await fetch('faq.json').then(r => r.json()).catch(() => []);
  const fuse = new Fuse(faq, { keys: ['q'], threshold: 0.4 });

  // 2. DOM elements
  const launchBtn = document.getElementById('chatbot-launch');
  const botWindow = document.getElementById('chatbot');
  const log = document.getElementById('chat-log');
  const input = document.getElementById('chat-input');

  // 3. Show / hide bot
  launchBtn.addEventListener('click', () => {
    botWindow.style.display = botWindow.style.display === 'flex' ? 'none' : 'flex';
    if (botWindow.style.display === 'flex') input.focus();
  });

  // 4. Helper to add messages
  function add(role, text) {
    const div = document.createElement('div');
    div.className = role;
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  // 5. Handle user input
  input.addEventListener('keydown', e => {
    if (e.key !== 'Enter' || !input.value.trim()) return;
    const question = input.value.trim();
    add('user', question);
    input.value = '';

    const result = fuse.search(question)[0];
    if (result) {
      add('bot', result.item.a);
    } else {
      add('bot', "Sorry—I can only answer these:\n• " +
                 faq.map(f => f.q).join("\n• "));
    }
  });
})();
