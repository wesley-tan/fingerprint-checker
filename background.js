// Function to check if a site is fingerprinting based on urlClassification
const isFingerprinting = (urlClassification) => {
  if (!urlClassification) return false;
  const { firstParty, thirdParty } = urlClassification;
  console.log('URL Classification:', urlClassification);
  return (firstParty && (firstParty.includes('fingerprinting') || firstParty.includes('fingerprinting_content'))) ||
         (thirdParty && (thirdParty.includes('fingerprinting') || thirdParty.includes('fingerprinting_content')));
};

// Monitor web requests
chrome.webRequest.onCompleted.addListener(
  (details) => {
    console.log('Request Details:', details);
    if (details.urlClassification) {
      console.log('URL Classification is present:', details.urlClassification);
      const result = isFingerprinting(details.urlClassification);
      console.log('Fingerprinting detected:', result, 'on URL:', details.url);
      chrome.storage.local.set({ fingerprintingDetected: result });
      chrome.browserAction.setBadgeText({ text: result ? 'FP' : '' });
      chrome.browserAction.setBadgeBackgroundColor({ color: result ? '#FF0000' : '#FFFFFF' });
    } else {
      console.log('URL Classification is not present');
      chrome.storage.local.set({ fingerprintingDetected: false });
      chrome.browserAction.setBadgeText({ text: '' });
      chrome.browserAction.setBadgeBackgroundColor({ color: '#FFFFFF' });
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders", "urlClassification"]
);

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'checkFingerprinting') {
    console.log('Received message from popup:', message);
    chrome.storage.local.get('fingerprintingDetected', (data) => {
      console.log('Storage data:', data);
      sendResponse({ isFingerprinting: data.fingerprintingDetected });
    });
    return true; // Required to use sendResponse asynchronously
  }
});
