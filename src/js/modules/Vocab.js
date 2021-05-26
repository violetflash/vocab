// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// Add the Firebase products that you want to use
import "firebase/database";
import makeStructure from './makeStructure';
import {
    writeWord,
    deleteWord,
    readDatabase,
    checkInputs,
    renderList,
    clearList,
    updateTitle,
} from './utils';

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
        this.refPrefix = 'vocab';
        this.actual = 'vocab/actual/';
        this.learned = 'vocab/learned/';
        this.words = localStorage.getItem('vocab') ? JSON.parse(localStorage.getItem('vocab')) : {};

    }

    addNewWord(reference, word, translation) {
        writeWord(firebase, reference, word, translation);
        this.getDatabase();
        this.render();
    }

    getDatabase() {
        readDatabase(firebase);
        this.words = JSON.parse(localStorage.getItem('vocab'));
    }

    makeLayout() {
        makeStructure(this.root);
    }

    render() {
        this.getDatabase();
        const { words } = this;
        clearList('#actual');
        clearList('#learned');

        //todo check title func

        for (const key in words) {
            let index = 0;    //index for every row in list
            const oppositeList = key === 'actual' ? 'Learned' : 'Actual';    //  for move-to button
            for (const word in words[key]) {
                const target = document.getElementById(key);
                renderList(target, words[key][word], index + 1, oppositeList, key);
                index++;
            }

            updateTitle(key, index);
        }
    }

    deleteWord(target) {
        const row = target.closest('.list__row');
        const word = row.querySelector('.list__word').textContent.toLowerCase();
        const translation = row.querySelector('.list__translation').textContent.toLowerCase();
        const list = row.dataset.master;
        const ref = `${this.refPrefix}/${list}/${word}`;
        deleteWord(firebase, ref);
        this.render();
        return { word, translation };
    }

    eventListeners() {
        this.root.addEventListener('click', e => {
            let target = e.target;

            if (target.closest('.controls__move')) {
                target = target.closest('.controls__move');
                const { word, translation } = this.deleteWord(target);
                const targetList = target.dataset.move.toLowerCase();
                console.log(targetList);
                const reference = `${this.refPrefix}/${targetList}/`;
                this.addNewWord(reference, word, translation);
                return;
            }

            if (target.closest('.controls__remove')) {
                this.deleteWord(target);
            }

        });

        this.root.addEventListener('mouseover', e => {
            let target = e.target;

            if (target.closest('.list__row')) {
                target = target.closest('.list__row');
                target.querySelector('.list__controls').classList.add('js-active');
                // return;
            }

            if (target.classList.contains('controls__move')) {
                console.log(target);
            }

        });

        this.root.addEventListener('mouseout', e => {
            let target = e.target;

            if (target.closest('.list__row')) {
                target = target.closest('.list__row');
                target.querySelector('.list__controls').classList.remove('js-active');
                return;
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
                document.getElementById('word').focus();

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
        // if  (this.words.learned || this.words.actual) {
        //     this.render();
        // }

        this.render();

        // this.addNewWord(this.actual,'hello', 'привет', 'привет мир!');
        // this.addNewWord(this.learned,'bye', 'пока');
        // this.addNewWord(this.learned,'overlap', 'перекрытие');
        console.log(this.words);

    }
}

export default Vocab;
