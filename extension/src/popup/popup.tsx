function Popup() {
  const injectScript = (funcName: string) => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab?.id !== undefined) {
        chrome.tabs.executeScript(tab.id, { file: 'scripts.js' }, () => {
          // Wait for scripts.js to finish loading, then call the function
          chrome.tabs.executeScript(tab.id!, {
            code: `${funcName}();`
          });
        });
      }
    });
  };

  return (
    <div style={{ padding: 10, width: 250 }}>
      <h2>Accessibility Tools</h2>
      <button onClick={() => injectScript('toggleDyslexiaFont')}>
        Toggle Dyslexia Font
      </button>
      <br />
      <button onClick={() => injectScript('toggleWordSpacing')}>
        Toggle Word Spacing
      </button>
    </div>
  );
}

export default Popup;