import firebase from "firebase"
import "firebase/app-check"

export const config = {
	apiKey: "AIzaSyDIVl7uN8x61uShgWPBZweJyLiQMMwqnnc",
	authDomain: "atlas-02.firebaseapp.com",
	projectId: "atlas-02",
	storageBucket: "atlas-02.appspot.com",
	messagingSenderId: "479085086636",
	appId: "1:479085086636:web:4a43f41e6844b2fd821c09",
	measurementId: "G-RRX9ST3SLK",
}

export const initialise = () => {
	if (firebase.apps.length === 0) {
		firebase.initializeApp(config)
		const appCheck = firebase.appCheck()
		appCheck.activate("6Lfs0aQbAAAAAJt8sGwJXSoVtoY6kw_mXi6azdYA")
	}
}
