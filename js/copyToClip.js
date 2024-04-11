function copyTextToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard');
      alert("You've copied the code for this button to your clipboard! Paste it in your website's HTML to link to Adams Land! :-)")
    }).catch(err => {
      console.error('Error in copying text: ', err);
    });
  }
  
  document.getElementById('AdamsLandButton').addEventListener('click', function() {
    const textToCopy = `
    <a href="https://adams.land">
      <img src="https://adams.land/img/link-buttons/adamsland.png" alt="adams land 81x33 website share/link button">
    </a>`;
    copyTextToClipboard(textToCopy);
  });
  