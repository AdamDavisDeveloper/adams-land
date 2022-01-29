import data from "../photos-data.js";

function getVolumeImages(volume) {
	return data.filter((img) => img.volume === volume)[0];
}

const gallery = document.querySelector(".gallery");

function generatePhotos(data) {
	console.log(data);
	data.photos.forEach((photo) => {
		const galleryImg = document.createElement("div");
		galleryImg.classList.add("gallery-img");
		galleryImg.innerHTML = `
   			<img src=${photo.path || ""}></img>
			<p>${photo.caption || ""}</p>
		`;
		gallery.appendChild(galleryImg);
	});
}

window.addEventListener("DOMContentLoaded", () => {
	generatePhotos(getVolumeImages("downtown-atl"));
});
