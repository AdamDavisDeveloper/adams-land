document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('image-grid');
    const searchInput = document.getElementById('search-input');
    let images = [];

    async function fetchImages() {
        const response = await fetch('images.json');
        images = await response.json();
        displayImages(images);
    }

    function displayImages(imagePaths) {
        grid.innerHTML = '';
        imagePaths.forEach(imagePath => {
            const div = document.createElement('div');
            div.className = 'image-container';
            // Splitting the path and file name to extract the name without extension
            const parts = imagePath.split('/');
            const fileName = parts[parts.length - 1];
            const imageNameWithoutExtension = fileName.split('.')[0];
            div.innerHTML = `<img src="${imagePath}" alt="${imageNameWithoutExtension}">
                             <p>${imageNameWithoutExtension}</p>`;
            grid.appendChild(div);
        });
    }

    searchInput.addEventListener('keyup', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredImages = images.filter(imagePath => imagePath.toLowerCase().includes(searchTerm));
        displayImages(filteredImages);
    });

    fetchImages();
});

