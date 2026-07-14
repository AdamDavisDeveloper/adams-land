document.addEventListener('DOMContentLoaded', function () {
    var favicon = document.getElementById('dynamic-favicon');
    var currentHours = new Date().getHours();

    if (currentHours < 6) {
        // Night (12am - 6am)
        favicon.href = '/favicon/night.ico'
    } else if (currentHours < 12) {
        // Morning (6am - 12pm)
        favicon.href = '/favicon/morning.ico'
    } else if (currentHours < 18) {
        // Day (12pm-6pm)
        favicon.href = '/favicon/day.ico'
    } else {
        // Evening (6pm - 12am)
        favicon.href = '/favicon/evening.ico'
    }
});