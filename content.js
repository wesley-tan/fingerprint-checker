// This file is now unnecessary

console.log("Content script running");

// Function to detect fingerprinting libraries
const detectFingerprintingLibraries = () => {
  console.log("Running fingerprint detection for libraries");
  const suspiciousLibraries = [
    'fingerprintjs', 
    'clientjs', 
    'fingerprint2',
    'evercookie', 
    'canvasfingerprintblock'
  ];
  const scripts = document.getElementsByTagName('script');
  for (let script of scripts) {
    for (let lib of suspiciousLibraries) {
      if (script.src.includes(lib)) {
        console.log(`Detected fingerprinting library: ${lib}`);
        chrome.runtime.sendMessage({ type: 'fingerprintingDetected', library: lib });
      }
    }
  }
};

// Call the function to detect fingerprinting libraries
detectFingerprintingLibraries();
