// popup.js

document.getElementById('checkBtn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'checkFingerprinting' }, (response) => {
    const resultDiv = document.getElementById('result');
    if (response.isFingerprinting) {
      resultDiv.textContent = 'Fingerprinting detected';
      resultDiv.style.color = 'red';
    } else {
      resultDiv.textContent = 'Fingerprinting not detected';
      resultDiv.style.color = 'green';
    }
  });
});
