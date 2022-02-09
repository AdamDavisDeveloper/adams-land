import data from "../photos-data.js";

const currentURL = window.location.href;

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
			<div class="photo-caption">
				<a href=${photo.path}>
					<p>${photo.caption || ""}</p>
				</a>
			</div>
		`;
		gallery.appendChild(galleryImg);
	});
}

window.addEventListener("DOMContentLoaded", () => {
	if (document.getElementById("DowntownAtlanta")) {
		generatePhotos(getVolumeImages("downtown-atl"));
	}
	if (document.getElementById("ForgottenThings")) {
		generatePhotos(getVolumeImages("forgotten-things"));
	}
	if (document.getElementById("FriendsAndAdventures")) {
		generatePhotos(getVolumeImages("friends-and-adventures"));
	}
	if (document.getElementById("Photography")) {
		generatePhotos(getVolumeImages("photography"));
	}
});
