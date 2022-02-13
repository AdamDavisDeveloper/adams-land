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

const firebaseConfig = {
	//ik this is bad
	apiKey: apiKey().then((response) => response),

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

async function getEntries() {
	const querySnapshot = await getDocs(collection(db, "guestbook-entries"));
	await querySnapshot.forEach((doc) => {
		console.log(doc.id, "=>", doc.data());
	});
}

async function apiKey() {
	const res = await fetch("/.netlify/functions/firestore-api");
	return res.json();
}

window.addEventListener("DOMContentLoaded", (event) => {
	getEntries();
});
