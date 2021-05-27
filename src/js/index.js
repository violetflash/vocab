import '../styles/index.scss';
import Vocab from './modules/Vocab';

const myVocab = new Vocab({
    root: '.content',
    firebaseConfig: {
        apiKey: "AIzaSyDdSPunbCu6orihKiCAfmKUwDNRnmTE4sg",
        authDomain: "vocab-c6f05.firebaseapp.com",
        projectId: "vocab-c6f05",
        storageBucket: "vocab-c6f05.appspot.com",
        databaseURL: "https://vocab-c6f05-default-rtdb.europe-west1.firebasedatabase.app/",
        messagingSenderId: "17286614459",
        appId: "1:17286614459:web:adef6ba863bbddb9d6089e"
    },
});

myVocab.init();
