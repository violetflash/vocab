//TODO: search field with links to anchors, controls behavior refactor, adaptive

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
    updateTitleCounter,
    lockScreen,
    unlockScreen,
    capitalizer,
    showBlocks,
    checkSearchInputValue,
    scroll,
    makeWordsList,
    makeDropdownLink,
    scrollDistance,
} from './utils';

//TODO header - make canvas with arc

class Vocab {
    constructor(
        {
            root,
            firebaseConfig
        }
    ) {
        this.root = document.querySelector(root);
        this.firebaseConfig = firebaseConfig;
        this.refPrefix = 'vocab';
        this.actual = 'vocab/actual/';
        this.learned = 'vocab/learned/';
        this.numToShow = { 'actual': 20, 'learned': 20 }; //default num of showed lines
        this.words = JSON.parse(localStorage.getItem('vocab'));

    }

    addNewWord(reference, word, translation) {
        writeWord(firebase, reference, word, translation);
        this.getDatabase();
        this.render();
    }

    getDatabase() {
        readDatabase(firebase);
        this.words = JSON.parse(localStorage.getItem('vocab'));
        this.wordsList = makeWordsList(this.words);
    }

    makeLayout() {
        makeStructure(this.root);
    }

    checkTitle(titleSelector, listSelector) {
        const title = document.querySelector(titleSelector);
        const list = document.getElementById(listSelector);
        const counter = title.nextElementSibling;

        if (list.innerHTML === '') {
            counter.style.display = 'none';
            title.textContent = title.dataset.empty;
        } else {
            counter.style.display = 'block';
            title.textContent = title.dataset.full;
        }
    }

    render() {
        // this.getDatabase();
        const { words } = this;
        clearList('#actual');
        clearList('#learned');

        //todo check title func

        for (const key in words) {
            let index = 0;    //index for every row in list
            const oppositeList = key === 'actual' ? 'Learned' : 'Actual';    //  list name for move-to button
            for (const word in words[key]) {
                const target = document.getElementById(key);
                renderList(target, this.shuffle(words[key][word]), index + 1, oppositeList, key);
                index++;
            }

            updateTitleCounter(key, index);
            this.checkListLength(key, this.numToShow[key]);
        }
        this.checkTitle('.vocab__title-actual', 'actual');
        this.checkTitle('.vocab__title-learned', 'learned');
    }

    getMaxWordWidth(listSelector) {
        const list = document.getElementById(listSelector);
        let max = 0;
        [...list.children].forEach(elem => {
            const wordWidth = elem.querySelector('.list__word').clientWidth;
            if (max < wordWidth) {
                max = wordWidth;
            }
        });
        return max;
    }

    checkListLength(listSelector, num) {
        const list = document.getElementById(listSelector);
        const afterLine = list.nextElementSibling;
        const info = afterLine.querySelector('.vocab__info-num');
        const max = this.getMaxWordWidth(listSelector);

        if (list.children.length > 0) {
            [...list.children].forEach((elem, index) => {
                const wordField = elem.querySelector('.list__word');
                wordField.style.maxWidth = max + 'px';
                wordField.style.width = '100%';
                if (index + 1 > num) {
                    elem.style.display = 'none';
                    afterLine.style.display = 'flex';
                    info.textContent = list.children.length - num;
                } else {
                    elem.style.display = 'flex';
                    info.textContent = 0;
                    afterLine.style.display = 'none';
                }
            });
        }
    }

    deleteWord(target) {
        const row = target.closest('.list__row');
        const word = row.querySelector('.list__word').textContent.toLowerCase();
        const translation = row.querySelector('.list__translation').textContent.toLowerCase();
        const list = row.dataset.master;
        const ref = `${this.refPrefix}/${list}/${word}`;
        deleteWord(firebase, ref);
        return { word, translation };
    }

    showModal(modal) {
        lockScreen();
        if (modal.classList.contains('modal-delete')) {
            document.querySelector('.modal__confirm-input').value = '';
        }
        modal.classList.add('js-active');

    }

    hideModals() {
        unlockScreen();
        document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('js-active'));
        showBlocks('.list__translation');
    }

    modalWordHandle(target, modalSelector) {
        const modal = document.querySelector(modalSelector);
        const row = target.closest('.list__row');
        const wordField = row.querySelector('.list__word');
        const word = wordField.textContent.toLowerCase();
        const translationField = row.querySelector('.list__translation');
        const translation = translationField.textContent.toLowerCase();
        //attributes for further word handle
        modal.dataset.word = word;
        modal.dataset.list = row.dataset.master;

        if (modalSelector === '.modal-delete') {
            this.translation = translation;
            translationField.style.opacity = 0;
            modal.querySelector('.modal__word-to-delete').textContent = ` ${capitalizer(word)}`;
        }

        if (modalSelector === '.modal-edit') {
            modal.querySelector('input[name="word"]').value = ` ${capitalizer(word)}`;
            modal.querySelector('input[name="translation"]').value = ` ${capitalizer(translation)}`;
        }

        this.showModal(modal);
    }

    clearDropdown() {
        const dropdownList = document.querySelector('.dropdown__list');
        dropdownList.innerHTML = '';
    }

    addDropdownElement(word) {
        const dropdownList = document.querySelector('.dropdown__list');
        dropdownList.insertAdjacentHTML('beforeend', makeDropdownLink(word, word));
    }

    sortWords(array) {
        function compare(a, b) {
            if (a.word < b.word) {
                return -1;
            }
            if (a.word > b.word) {
                return 1;
            }
            return 0;
        }
        array.sort(compare);
    }

    //  Fisher Yates Shuffle
    shuffle(array) {
        // const {vocab} = toDoObject;
        for (let i = array.length - 1; i > 0; i--) {
            //  pick random index before current element
            const j = Math.floor(Math.random() * (i + 1));
            //  swap in place (shorthand way of swapping elements using destructuring
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    searchHandler(e) {
        const dropdownList = document.querySelector('.dropdown__list');
        const noMatch = document.querySelector('.dropdown__no-match');
        this.clearDropdown();
        checkSearchInputValue('.search__input', '.search__close-button');
        if (e.target.value) {


            const regExp = new RegExp(e.target.value.toLowerCase());
            this.wordsList.forEach(elem => {
                if (regExp.test(elem)) {
                    const word = elem.replace(regExp, match => `<strong>${match}</strong>`);
                    dropdownList.insertAdjacentHTML('beforeend', makeDropdownLink(word, elem));
                }
            });

            const check = dropdownList.querySelector('.dropdown__link');

            if (!check) {
                noMatch.style.display = 'block';
            } else {
                noMatch.style.display = 'none';
            }
        } else {
            noMatch.style.display = 'none';
        }



    }

    eventListeners() {
        const confirm = document.querySelector('.modal__confirm-input');
        const deleteBtn = document.querySelector('.modal__delete-btn');
        const undoBtn = document.querySelector('.modal__undo-btn');
        const forms = this.root.querySelectorAll('form');
        const inputs = [document.getElementById('word'), document.getElementById('translation')];
        const modalInputs = document.querySelectorAll('.modal__input');
        const searchInput = document.querySelector('.search__input');

        this.root.addEventListener('click', e => {
            let target = e.target;

            if (target.closest('.controls__move')) {
                target = target.closest('.controls__move');
                const { word, translation } = this.deleteWord(target);
                const targetList = target.dataset.move.toLowerCase();
                console.log(targetList);
                const reference = `${this.refPrefix}/${targetList}/`;
                this.addNewWord(reference, word, translation);
                this.getDatabase();
                this.render();
                return;
            }

            if (target.closest('.controls__remove')) {
                this.modalWordHandle(target, '.modal-delete');
            }

            if (target.closest('.modal__cross') || target.classList.contains('overlay')) {
                this.hideModals();
            }

            if (target.closest('.modal__delete-btn')) {
                const list = target.closest('.modal').dataset.list;
                const word = target.closest('.modal').dataset.word;
                const ref = `${this.refPrefix}/${list}/${word}`;
                deleteWord(firebase, ref);
                deleteBtn.style.display = 'none';
                undoBtn.style.display = 'inline-block';
                this.getDatabase();
                this.render();
                this.hideModals();
            }

            if (target.closest('.modal__undo-btn')) {
                this.hideModals();
            }

            if (target.closest('.controls__edit')) {
                this.modalWordHandle(target, '.modal-edit');
            }

            if (target.closest('.vocab__more')) {
                const hidden = target.closest('.vocab__after-line').querySelector('.vocab__info-num').textContent;
                const list = target.closest('.vocab__after-line').previousElementSibling;
                const lineHeight = list.querySelector('.list__row').clientHeight;
                const amount = +hidden > 20 ? 22 : +hidden;
                this.numToShow[list.id] += 20;
                this.render();

                scrollDistance(lineHeight * amount);
            }

            if (target.closest('.search__close-button')) {
                target.previousElementSibling.value = '';
                this.clearDropdown();
                target.style.display = 'none';
            }

            if (target.closest('.dropdown__link')) {
                e.preventDefault();
                searchInput.value = target.textContent;
                const link = e.target.href.replace(/.+#/g, '');
                const elem = document.getElementById(link);
                const word = elem.querySelector('.list__word').textContent.toLowerCase();
                const list = elem.dataset.master;
                const index = parseInt(elem.dataset.index);

                if (index > this.numToShow[list]) {
                    this.numToShow[list] = index;
                    this.checkListLength(list, this.numToShow[list]);
                }

                elem.classList.add('js-active');
                setTimeout(() => {
                    elem.classList.remove('js-active');
                }, 4000);
                scroll(elem);
                this.clearDropdown();
                this.addDropdownElement(word, link);
                checkSearchInputValue('.search__input', '.search__close-button');
            }

            if (document.documentElement.clientWidth < 768) {

                if (target.closest('.list__row')) {
                    target = target.closest('.list__row');
                    const listSelector = target.dataset.master;
                    const index = parseInt(target.dataset.index);
                    const list = document.getElementById(listSelector);
                    [...list.children].forEach((elem, idx) => {

                        if (idx < index) {
                            elem.style.transform = 'translateY(0)';
                            return;
                        }

                        elem.style.transform = 'translateY(30px)';
                    });
                }
            }
        });

        this.root.addEventListener('mouseover', e => {
            let target = e.target;

            if (target.closest('.list__row')) {
                target = target.closest('.list__row');
                target.querySelector('.list__controls').classList.add('js-active');
                // return;
            }
        });

        this.root.addEventListener('mouseout', e => {
            let target = e.target;

            if (target.closest('.list__row')) {
                target = target.closest('.list__row');
                target.querySelector('.list__controls').classList.remove('js-active');
            }


        });

        forms.forEach(form => {
            form.addEventListener('submit', e => {
                e.preventDefault();

                if (form.classList.contains('vocab__form') && checkInputs(inputs)) {  //write word to database
                    const word = document.querySelector('#word').value.toLowerCase();
                    const translation = document.querySelector('#translation').value.toLowerCase();
                    this.addNewWord(this.actual, word, translation);
                    form.reset();
                    document.getElementById('word').focus();
                }

                if (form.closest('.modal-edit') && checkInputs(modalInputs)) {
                    const oldWord = document.querySelector('.modal-edit').dataset.word;
                    const wordField = form.querySelector('input[name="word"]');
                    const word = wordField.value.toLowerCase().trim();
                    const translationField = form.querySelector('input[name="translation"]');
                    const translation = translationField.value.toLowerCase().trim();
                    const list = document.querySelector('.modal-edit').dataset.list;
                    const ref = `${this.refPrefix}/${list}/`;
                    deleteWord(firebase, ref + oldWord);
                    this.addNewWord(ref, word, translation);
                    this.hideModals();
                }

            });
        });

        confirm.addEventListener('input', () => {
            if (confirm.value.toLowerCase() === this.translation) {
                deleteBtn.style.display = 'inline-block';
                undoBtn.style.display = 'none';
            } else {
                deleteBtn.style.display = 'none';
                undoBtn.style.display = 'inline-block';
            }
        });

        searchInput.addEventListener('input', this.searchHandler.bind(this));
    }

    generateId() {
        const newDate = new Date();
        const date = newDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).replace(/[^0-9]/g, "");
        const time = newDate.getTime().toString();
        return date + time;
    }

    initFirebase() {
        firebase.initializeApp(this.firebaseConfig);
        this.database = firebase.database();
    }

    init() {
        this.makeLayout();
        this.initFirebase();
        this.eventListeners();

        //first time render
        const dbRef = firebase.database().ref('vocab/');
        dbRef.on('value', snapshot => {
            if (snapshot.exists()) {
                // console.log(snapshot.val());
                localStorage.setItem('vocab', JSON.stringify(snapshot.val()));
                this.render();
            } else {
                console.log("No data available");
            }
        });
    }
}

export default Vocab;
