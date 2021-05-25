// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// Add the Firebase products that you want to use
import "firebase/database";
import makeStructure from './makeStructure';
import { writeWord, readDatabase, checkInputs, renderList } from './utils';

//TODO header - make canvas with arc

class Vocab {
    constructor(
        {
            root,
            db,
            word,
            translation,
            firebaseConfig
        }
    ) {
        this.root = document.querySelector(root);
        this.db = db;
        this.word = word;
        this.translation = translation;
        this.firebaseConfig = firebaseConfig;
        this.actual = 'vocab/actual/';
        this.learned = 'vocab/learned/';
        this.words = localStorage.getItem('vocab') ? JSON.parse(localStorage.getItem('vocab')) : {};

    }

    addNewWord(target, word, translation, example) {
        writeWord(firebase, target, word, translation, example);
        this.getDatabase();
    }

    getDatabase() {
        readDatabase(firebase);
        this.words = JSON.parse(localStorage.getItem('vocab'));
    }

    makeLayout() {
        makeStructure(this.root);
    }

    render() {
        const { words } = this.words;
        for (const key in words) {
            if (key === 'actual') {
                console.log('render for actual list');
                for (const word in words[key]) {
                    renderList(words[key][word]);
                }
                //TODO IM HERE! NEED TO ADD TARGET TO RENDER LIST
                // renderList(insert source here);
            }
        }

    }

    eventListeners() {
        this.root.addEventListener('click', e => {
            const target = e.target;
            if (target.closest('.some-class')) {
                console.log(1);
            }

        });

        const form = this.root.querySelector('form');
        const inputs = form.querySelectorAll('input[type="text"]');
        form.addEventListener('submit', e => {
            e.preventDefault();

            if (checkInputs(inputs)) {  //write word to database
                const word = document.querySelector(this.word).value;
                const translation = document.querySelector(this.translation).value;
                this.addNewWord(this.actual, word, translation);
                form.reset();
                this.render();
            }

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

        //first time render
        if  (this.words.learned || this.words.actual) {
            this.render();
        }


        // this.addNewWord(this.actual,'hello', 'привет', 'привет мир!');
        // this.addNewWord(this.learned,'bye', 'пока');
        // this.addNewWord(this.learned,'overlap', 'перекрытие');
        console.log(this.words);

    }
}

export default Vocab;
