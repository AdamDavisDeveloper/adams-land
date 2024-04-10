function copyTextToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard');
    }).catch(err => {
      console.error('Error in copying text: ', err);
    });
  }
  
  document.getElementById('copyImage').addEventListener('click', function() {
    const textToCopy = "This is the text to be copied";
    copyTextToClipboard(textToCopy);
  });
  