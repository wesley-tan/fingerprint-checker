document.addEventListener('DOMContentLoaded', function () {
  const resultDiv = document.getElementById('result');
  const checkBtn = document.getElementById('checkBtn');
  const downloadBtn = document.getElementById('downloadBtn');

  checkBtn.addEventListener('click', function() {
    resultDiv.textContent = 'Checking...';
    resultDiv.style.color = 'black';

    chrome.runtime.sendMessage({ type: 'checkFingerprinting' }, (response) => {
      if (chrome.runtime.lastError) {
        // Handle messaging errors
        resultDiv.textContent = 'Communication error: ' + chrome.runtime.lastError.message;
        resultDiv.style.color = 'red';
        console.error('Communication error:', chrome.runtime.lastError);
        return;
      }

      if (!response) {
        // Handle null or undefined response
        resultDiv.textContent = 'No response received from the background script.';
        resultDiv.style.color = 'orange';
        console.warn('No response received');
        return;
      }

      if (response.hasOwnProperty('isFingerprinting')) {
        // Properly handle the expected response
        if (response.isFingerprinting) {
          resultDiv.textContent = 'Fingerprinting detected';
          resultDiv.style.color = 'red';
        } else {
          resultDiv.textContent = 'Fingerprinting not detected';
          resultDiv.style.color = 'green';
        }
      } else {
        // Handle unexpected response structure
        resultDiv.textContent = 'Unexpected response format.';
        resultDiv.style.color = 'orange';
        console.warn('Unexpected response format:', response);
      }
    });
  });

  downloadBtn.addEventListener('click', function() {
    console.log('Download Logs button clicked');
    chrome.runtime.sendMessage({ type: 'downloadLogs' }, () => {
      if (chrome.runtime.lastError) {
        // Handle messaging errors
        resultDiv.textContent = 'Download error: ' + chrome.runtime.lastError.message;
        resultDiv.style.color = 'red';
        console.error('Download error:', chrome.runtime.lastError);
        return;
      }
      resultDiv.textContent = 'Logs downloaded';
      resultDiv.style.color = 'blue';
    });
  });
});
