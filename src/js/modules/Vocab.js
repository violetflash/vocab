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
        const { words } = this;
        let counter = 0;
        const actual = document.getElementById('actual');
        actual.innerHTML = '';
        // const learned = document.getElementById('learned');

        for (const key in words) {
            const length = Object.keys(words[key]).length;
            for (const word in words[key]) {
                const index = length - counter;
                const target = document.getElementById(key);
                renderList(target, words[key][word], index);
                counter++;
                console.log(words[key][word]);
            }
            //TODO IM HERE! NEED TO ADD TARGET TO RENDER LIST
            // renderList(insert source here);

        }

    }

    eventListeners() {
        this.root.addEventListener('click', e => {
            const target = e.target;
            if (target.closest('.some-class')) {
                console.log(1);
            }

        });

        this.root.addEventListener('mouseover', e => {
            let target = e.target;

            if (target.closest('.list__row')) {
                target = target.closest('.list__row');
                target.querySelector('.list__controls').classList.add('js-active');
            }
        });

        this.root.addEventListener('mouseout', e => {
            let target = e.target;

            if (target.closest('.list__row')) {
                target = target.closest('.list__row');
                target.querySelector('.list__controls').classList.remove('js-active');
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
