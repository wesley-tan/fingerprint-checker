let logs = [];

// Function to append logs
const appendLog = (message) => {
  logs.push(message);
  console.log(message);
};

// Function to download logs as a file
const downloadLogs = () => {
  const blob = new Blob([logs.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download({
    url: url,
    filename: 'fingerprint_logs.txt',
    saveAs: true
  });
};

// Function to check if a site is fingerprinting based on urlClassification
const isFingerprinting = (urlClassification) => {
  const { firstParty, thirdParty } = urlClassification || {};
  appendLog('URL Classification: ' + JSON.stringify(urlClassification));

  const checkFingerprinting = (classification) => {
    if (classification && Array.isArray(classification)) {
      return classification.includes('fingerprinting') || 
            classification.includes('fingerprinting_content');
    }
    return false;
  };

  const firstPartyResult = checkFingerprinting(firstParty);
  const thirdPartyResult = checkFingerprinting(thirdParty);

  appendLog('First party fingerprinting detected: ' + firstPartyResult);
  appendLog('Third party fingerprinting detected: ' + thirdPartyResult);

  return firstPartyResult || thirdPartyResult;
};

// Monitor web requests
chrome.webRequest.onCompleted.addListener(
  (details) => {
    appendLog('Request Details: ' + JSON.stringify(details));

    const urlClassification = details.urlClassification || {};
    const result = isFingerprinting(urlClassification); 
    appendLog('Fingerprinting detected: ' + result + ' on URL: ' + details.url);

    chrome.storage.local.set({ fingerprintingDetected: result });
    chrome.browserAction.setBadgeText({ text: result ? 'FP' : '' }); // set badge when FP
    chrome.browserAction.setBadgeBackgroundColor({ color: result ? '#FF0000' : '#FFFFFF' });
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'checkFingerprinting') {
    appendLog('Received message from popup: ' + JSON.stringify(message));
    chrome.storage.local.get('fingerprintingDetected', (data) => {
      appendLog('Storage data: ' + JSON.stringify(data));
      sendResponse({ isFingerprinting: data.fingerprintingDetected });
    });
    return true; // Required to use sendResponse asynchronously
  } else if (message.type === 'downloadLogs') {
    downloadLogs();
  }
});
