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

const apiKey = () => {
	try {
		return process.env.FIRESTORE_API_KEY;
	} catch (error) {
		console.error(error);
	}
};

const firebaseConfig = {
	apiKey: apiKey(),

	authDomain: "adamsland-guestbook.firebaseapp.com",

	projectId: "adamsland-guestbook",

	storageBucket: "adamsland-guestbook.appspot.com",

	messagingSenderId: "994225521602",

	appId: "1:994225521602:web:637ce4785ba4fa40b3cc5b",

	measurementId: "G-YPXBDZMZS4",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();

async function getEntries() {
	const querySnapshot = await getDocs(collection(db, "guestbook-entries"));
	querySnapshot.forEach((doc) => {
		console.log(doc.id, "=>", doc.data());
	});
}

if (FIRESTORE_API_KEY) getEntries();
//getEntries();
