import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import {
	getFirestore,
	collection,
	getDocs,
	addDoc,
	getDoc,
	updateDoc,
	doc,
	deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";

const GuestbookEntries = document.getElementById("Entries");

const firebaseConfig = {
	//ik this is bad
	apiKey: apiKey().then((res) => {
		if (!res) alert("Could not fetch API key.");
		else return res;
	}),

	authDomain: "adamsland-guestbook.firebaseapp.com",

	projectId: "adamsland-guestbook",

	storageBucket: "adamsland-guestbook.appspot.com",

	messagingSenderId: "994225521602",

	appId: "1:994225521602:web:637ce4785ba4fa40b3cc5b",

	measurementId: "G-YPXBDZMZS4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

async function firestoreEntries() {
	const querySnapshot = await getDocs(collection(db, "guestbook-entries"));
	return querySnapshot;
}

async function apiKey() {
	return await fetch("/.netlify/functions/firestore-api");
}

function generateEntries(data) {
	data.forEach((ent) => {
		const Entry = document.createElement("div");
		Entry.innerHTML = `
	    <div class="entry">
	      <p class="entry-date">${ent.data().date}</p>
	      <p class="entry-name">${ent.data().name}</p>
	      <p class="entry-message">${ent.data().message}</p>
	    </div>
	`;
		GuestbookEntries.appendChild(Entry);
	});
}

window.addEventListener("DOMContentLoaded", async (event) => {
	generateEntries(await firestoreEntries());
});
