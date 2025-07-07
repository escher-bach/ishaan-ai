function Popup() {
  const injectScript = (funcName: string) => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab?.id !== undefined) {
        chrome.tabs.executeScript(tab.id, { file: 'scripts.js' }, () => {
          chrome.tabs.executeScript(tab.id!, {
            code: `${funcName}();`
          });
        });
      }
    });
  };

  return (
    <div className="w-64 p-4 bg-white text-gray-800 font-sans">
      <h2 className="text-lg font-semibold mb-4 text-center">
        🧠 Accessibility Tools
      </h2>

      <button
        onClick={() => injectScript('toggleDyslexiaFont')}
        className="w-full mb-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Toggle Dyslexia Font
      </button>

      <button
        onClick={() => injectScript('toggleWordSpacing')}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Toggle Word Spacing
      </button>
    </div>
  );
}

export default Popup;