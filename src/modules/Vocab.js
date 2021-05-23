// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// Add the Firebase products that you want to use
import "firebase/database";
import makeStructure from './makeStructure';
import {writeWord, readDatabase, checkInputs} from './utils';

//TODO header - make canvas with arc

class Vocab {
    constructor(
        {
            root,
            db,
            firebaseConfig
        }
    ) {
        this.root = document.querySelector(root);
        this.db = db;
        this.firebaseConfig = firebaseConfig;
        this.actual = 'vocab/actual/';
        this.learned = 'vocab/learned/';
        this.words = localStorage.getItem('vocab') ? JSON.parse(localStorage.getItem('vocab')) : {};

    }

    addNewWord(target, word, translation, example) {
        writeWord(firebase, target, word, translation, example);
    }

    getDatabase() {
        readDatabase(firebase);
        this.words = JSON.parse(localStorage.getItem('vocab'));
    }

    makeLayout() {
        makeStructure(this.root);
    }

    eventListeners() {
        this.root.addEventListener('click', (e) => {
            const target = e.target;

        });

        const form = this.root.querySelector('form');
        const inputs = form.querySelectorAll('input[type="text"]');
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            checkInputs(inputs);
            console.log(1)
        });
    }

    initFirebase() {
        firebase.initializeApp(this.firebaseConfig);
        this.database = firebase.database();
    }

    init() {
        this.makeLayout();
        this.initFirebase();
        this.getDatabase();
        this.eventListeners();


        // this.addNewWord(this.actual,'hello', 'привет', 'привет мир!');
        // this.addNewWord(this.learned,'bye', 'пока');
        // this.addNewWord(this.learned,'overlap', 'перекрытие');
        console.log(this.words);

    }
}

export default Vocab;