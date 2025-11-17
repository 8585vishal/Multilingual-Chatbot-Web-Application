(function() {
  const WIDGET_CONFIG = {
    supabaseUrl: 'YOUR_SUPABASE_URL',
    supabaseKey: 'YOUR_SUPABASE_ANON_KEY',
    position: 'bottom-right',
    primaryColor: '#2563eb',
  };

  function createWidget() {
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'multilingual-chatbot-widget';
    widgetContainer.style.cssText = `
      position: fixed;
      ${WIDGET_CONFIG.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
      ${WIDGET_CONFIG.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    `;

    const toggleButton = document.createElement('button');
    toggleButton.id = 'chatbot-toggle';
    toggleButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    `;
    toggleButton.style.cssText = `
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: ${WIDGET_CONFIG.primaryColor};
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
    `;

    const chatWindow = document.createElement('div');
    chatWindow.id = 'chatbot-window';
    chatWindow.style.cssText = `
      width: 380px;
      height: 600px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      display: none;
      flex-direction: column;
      overflow: hidden;
      margin-bottom: 10px;
    `;

    const header = document.createElement('div');
    header.style.cssText = `
      background-color: ${WIDGET_CONFIG.primaryColor};
      color: white;
      padding: 16px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
    header.innerHTML = `
      <span>Chat with us</span>
      <button id="close-chat" style="background: none; border: none; color: white; cursor: pointer; font-size: 20px;">&times;</button>
    `;

    const iframe = document.createElement('iframe');
    iframe.src = `${window.location.origin}/widget-chat`;
    iframe.style.cssText = `
      flex: 1;
      border: none;
      width: 100%;
    `;

    chatWindow.appendChild(header);
    chatWindow.appendChild(iframe);
    widgetContainer.appendChild(chatWindow);
    widgetContainer.appendChild(toggleButton);

    document.body.appendChild(widgetContainer);

    toggleButton.addEventListener('click', () => {
      if (chatWindow.style.display === 'none') {
        chatWindow.style.display = 'flex';
        toggleButton.style.transform = 'scale(0.9)';
      } else {
        chatWindow.style.display = 'none';
        toggleButton.style.transform = 'scale(1)';
      }
    });

    header.querySelector('#close-chat').addEventListener('click', () => {
      chatWindow.style.display = 'none';
      toggleButton.style.transform = 'scale(1)';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
