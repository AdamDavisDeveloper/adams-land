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

// DOM Content Variables
const Form = document.getElementById("Form");
const SubmitForm = document.getElementById("SubmitForm");
const MainContent = document.getElementById("MainContent");
const GuestbookEntries = document.getElementById("Entries");
const SignGuestbookBtn = document.getElementById("SignBook");

// Formatting
function getCurrentDateFormatted() {
	const datetime = new Date();
	return moment(datetime).format("MM-D-YYYY");
}

// Firebase
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

async function submitData() {
	let data = {
		timestamp: new Date(),
		date: getCurrentDateFormatted(),
		name: document.getElementById("NameData").value,
		message: document.getElementById("MessageData").value,
	};
	const docRef = await addDoc(collection(db, "guestbook-entries"), data).then(
		(res) => {
			if (!res)
				alert(
					"There was an issue with your request. Please try again l8r or shoot adam a message."
				);
		}
	);
}

async function apiKey() {
	const res = await fetch("/.netlify/functions/firestore-api");
	return res.json();
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

// UI changes
function showForm() {
	MainContent.style.display = "none";
	Form.style.display = "flex";
}

function hideForm() {
	MainContent.style.display = "flex";
	Form.style.display = "none";
}

SignGuestbookBtn.addEventListener("click", (e) => {
	showForm();
});

SubmitForm.addEventListener("click", (e) => {
	e.preventDefault();
	hideForm();
	submitData();
});

window.addEventListener("DOMContentLoaded", async (event) => {
	generateEntries(await firestoreEntries());
});
