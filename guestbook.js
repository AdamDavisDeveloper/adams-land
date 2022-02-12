// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
// import {
// 	getFirestore,
// 	collection,
// 	getDocs,
// 	addDoc,
// 	getDoc,
// 	updateDoc,
// 	doc,
// 	deleteDoc,
// } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";

// const firebaseConfig = {
// 	apiKey: FIRESTORE_API_KEY,

// 	authDomain: "adamsland-guestbook.firebaseapp.com",

// 	projectId: "adamsland-guestbook",

// 	storageBucket: "adamsland-guestbook.appspot.com",

// 	messagingSenderId: "994225521602",

// 	appId: "1:994225521602:web:637ce4785ba4fa40b3cc5b",

// 	measurementId: "G-YPXBDZMZS4",
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore();

// const querySnapshot = await getDocs(collection(db, "guestbook-entries"));
// await querySnapshot.forEach((doc) => {
// 	console.log(doc.id, "=>", doc.data());
// });

// const apiKey = () => {
// 	try {
// 		return process.env.FIRESTORE_API_KEY;
// 	} catch (error) {
// 		console.error(error);
// 	}
// };

// async function getFSEntries() {
// 	const response = await fetch("/api/");
// 	if (!response.ok) console.error("could not reach firestore api");
// 	else return response.json();
// }

async function getEntries() {
	const res = await fetch("/.netlify/functions/firestore-api");
	return res.json();
}

window.addEventListener("DOMContentLoaded", (event) => {
	console.log("Content loaded");
	getEntries()
		.then((response) => response)
		.then((data) => console.log(data))
		.catch((err) => console.log(err));
});
