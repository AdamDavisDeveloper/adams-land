function isMobileDevice() {
    return window.innerWidth <= 768;
}

if (isMobileDevice()) {
    document.querySelector('.image-container img').addEventListener('click', function() {
        var speechBubble = this.nextElementSibling; 
        var isDisplayed = speechBubble.style.display === 'block';
        speechBubble.style.display = isDisplayed ? 'none' : 'block';
    });
}

window.addEventListener('resize', function() {    
    var imgElement = document.querySelector('.image-container img');
    if (isMobileDevice()) {
        
        if (!imgElement.getAttribute('data-click-initialized')) {
            imgElement.addEventListener('click', toggleSpeechBubble);
            imgElement.setAttribute('data-click-initialized', 'true');
        }
    } else {
        
        imgElement.removeEventListener('click', toggleSpeechBubble);
        imgElement.removeAttribute('data-click-initialized');
    }
});

function toggleSpeechBubble() {
    var speechBubble = this.nextElementSibling; 
    var isDisplayed = speechBubble.style.display === 'block';
    speechBubble.style.display = isDisplayed ? 'none' : 'block';
}
