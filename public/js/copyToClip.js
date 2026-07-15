function showCopyNotice(message) {
  const wrapper = document.getElementById('AdamsLandBtnWrapper');
  if (!wrapper) return;

  let notice = document.getElementById('AdamsLandCopyNotice');
  if (!notice) {
    notice = document.createElement('p');
    notice.id = 'AdamsLandCopyNotice';
    notice.setAttribute('role', 'status');
    wrapper.appendChild(notice);
  }

  notice.textContent = message;
  notice.classList.add('is-visible');

  window.clearTimeout(showCopyNotice.hideTimerId);
  showCopyNotice.hideTimerId = window.setTimeout(() => {
    notice.classList.remove('is-visible');
  }, 4000);
}

function copyTextToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showCopyNotice("Copied! Paste this button's HTML on your site to link to Adams Land. :-)");
  }).catch((err) => {
    console.error('Error in copying text: ', err);
    showCopyNotice('Could not copy automatically — check clipboard permissions.');
  });
}

document.getElementById('AdamsLandButton').addEventListener('click', function () {
  const textToCopy = `
    <a href="https://adams.land">
      <img src="https://adams.land/img/link-buttons/adamsland.png" alt="adams land 81x33 website share/link button">
    </a>`;
  copyTextToClipboard(textToCopy);
});
