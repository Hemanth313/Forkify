class ChatbotView {
  _window = document.querySelector('.chatbot-window');
  _overlay = document.querySelector('.overlay--chatbot'); // ✅ FIXED
  _btnOpen = document.querySelector('.nav__btn--chatbot');
  _btnClose = document.querySelector('.btn--close-chatbot');
  _form = document.querySelector('.chatbot-form');
  _messagesContainer = document.querySelector('.chatbot-messages');

  constructor() {
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
    this._addHandlerSendMessage();
  }

  toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen?.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose?.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay?.addEventListener('click', this.toggleWindow.bind(this)); // ✅ FIXED
  }

  _addHandlerSendMessage() {
    this._form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = this._form.querySelector('.chatbot-input');
      const text = input.value.trim();
      if (!text) return;

      this._renderMessage(text, 'user-message');
      input.value = '';

      try {
        const response = await fetch('http://localhost:3001/api/gemini', {
          method: 'POST',
          body: JSON.stringify({ prompt: text }),
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();
        this._renderMessage(data.response || data.recipes?.join('\n'), 'bot-message');
      } catch (err) {
        console.error(err);
        this._renderMessage('Sorry, there was an error. Please try again.', 'bot-message');
      }
    });
  }

  _renderMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `message ${type}`;
    msg.textContent = text;
    this._messagesContainer.appendChild(msg);
    this._messagesContainer.scrollTop = this._messagesContainer.scrollHeight;
  }
}

export default new ChatbotView();
