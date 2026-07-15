document.getElementById('ContactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const userMinute = document.getElementById('minute').value;
    const currentMinute = new Date().getMinutes();

    if (validateMinute(userMinute, currentMinute)) {
        alert("Thank you! I'll get back to you as soon as possible! --Worm regards, Adam :-)");
        event.target.submit();
    } else {
        document.getElementById('errorMessage').style.display = 'block';
    }
});

function validateMinute(userMinute, currentMinute) {
    return parseInt(userMinute) === currentMinute;
}
