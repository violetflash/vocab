// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// Add the Firebase products that you want to use
import "firebase/database";
import makeStructure from './makeStructure';
import {
    writeWord,
    deleteWord,
    removeSpaces,
    checkInputs,
    renderRow,
    clearList,
    updateTitleCounter,
    lockScreen,
    unlockScreen,
    capitalizer,
    toggleElements,
    checkSearchCrossAppear,
    scroll,
    makeDropdownLink,
    scrollDistance,
    setCookie,
    getCookie,
    makeWordsList,
    sortObject
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
        this.actualID = 'actual';
        this.learnedID = 'learned';
        this.numToShow = { 'actual': 20, 'learned': 20 }; //default num of showed lines
        this.words = JSON.parse(localStorage.getItem('vocabWords'));
        this.sort = JSON.parse(localStorage.getItem('vocabSortOptions')) || { "actual": "", "learned": "" };
        this.sliderPosition = 0;
    }

    addNewWord(reference, word, translation, stats) {
        writeWord(firebase, reference, word, translation, stats);
        this.getData();
    }

    deleteWord(target) {
        const row = target.closest('.list__row');
        const word = row.querySelector('.list__word').textContent.toLowerCase();
        const translation = row.querySelector('.list__translation').textContent.toLowerCase();
        const right = row.querySelector('.list__right').textContent;
        const wrong = row.querySelector('.list__wrong').textContent;
        const stats = { right, wrong };
        const list = row.dataset.master;
        const ref = `${this.refPrefix}/${list}/${word}`;
        deleteWord(firebase, ref);
        return { word, translation, stats };
    }

    getData() {
        const dbRef = firebase.database().ref('vocab/');
        dbRef.get()
            .then(snapshot => {
                if (snapshot.exists()) {
                    const vocab = {};
                    for (const key in snapshot.val()) {
                        vocab[key] = [];
                        for (const word in snapshot.val()[key]) {
                            const sorted = sortObject(snapshot.val()[key][word]);
                            //making arrays in cause of further sorting
                            vocab[key].push(sorted);
                        }
                    }

                    localStorage.setItem('vocab', JSON.stringify(vocab));
                    this.words = makeWordsList(vocab);
                    localStorage.setItem('vocabWords', JSON.stringify(this.words));
                    this.setStats(vocab);
                    this.render();
                } else {
                    console.warning('No data loaded');
                }
            })
            .catch(err => {
                console.error(err);
            });
    }

    makeLayout() {
        makeStructure(this.root);
    }

    checkTitle(titleSelector, listSelector) {
        const title = document.querySelector(titleSelector);
        const list = document.getElementById(listSelector);
        const counter = title.nextElementSibling;
        const beforeLine = list.previousElementSibling;
        const sortingBtns = beforeLine.querySelector('.vocab__controls');

        if (list.innerHTML === '') {
            counter.style.display = 'none';
            title.textContent = title.dataset.empty;
            sortingBtns.style.display = 'none';
        } else {
            counter.style.display = 'block';
            title.textContent = title.dataset.full;
            sortingBtns.style.display = 'flex';
        }
    }

    resetSortOptions() {
        this.sort.actual = '';
        this.sort.learned = '';
    }

    renderList(arr, currentList, currentListId) {
        const oppositeList = currentListId === this.actualID ?
            capitalizer(this.learnedID) :
            capitalizer(this.actualID); //capitalized for move button text

        if (arr) {
            arr.forEach((elem, index) => {
                renderRow(currentList, elem, index + 1, oppositeList, currentListId);
            });
        }


        this.checkListLength(currentListId, this.numToShow[currentListId]);
        const counter = currentList.children.length;
        updateTitleCounter(currentListId, counter);
    }

    render() {
        const { actualID, learnedID } = this;
        const data = JSON.parse(localStorage.getItem(this.refPrefix));

        const actualList = document.getElementById(actualID);
        const learnedList = document.getElementById(learnedID);

        clearList(`#${actualID}`);
        clearList(`#${learnedID}`);

        if (data) {
            this.renderList(data[actualID], actualList, actualID);
            this.renderList(data[learnedID], learnedList, learnedID);
        }


        this.checkTitle(`.vocab__title-${this.actualID}`, this.actualID);
        this.checkTitle(`.vocab__title-${this.learnedID}`, this.learnedID);

        this.checkSortOptionsRender();
        this.checkTrainingAppear();
        this.checkListLength(this.actualID, this.numToShow.actual);
        this.checkListLength(this.learnedID, this.numToShow.learned);

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
        const moreBtn = afterLine.querySelector('.vocab__more');
        const lessBtn = afterLine.querySelector('.vocab__less');
        const info = afterLine.querySelector('.vocab__info-num');
        const infoBlock = afterLine.querySelector('.vocab__info');
        const max = this.getMaxWordWidth(listSelector);


        if (list.children.length > 0) {
            [...list.children].forEach((elem, index) => {
                const wordField = elem.querySelector('.list__word');
                wordField.style.maxWidth = max + 'px';
                wordField.style.width = '100%';
                if (index + 1 > num) {
                    elem.style.display = 'none';
                    info.style.display = 'inline-block';
                    infoBlock.style.display = 'inline-block';
                    moreBtn.style.display = 'inline-block';
                    info.textContent = list.children.length - num;
                } else {
                    elem.style.display = 'flex';
                    info.textContent = 0;
                    info.style.display = 'none';
                    infoBlock.style.display = 'none';
                    moreBtn.style.display = 'none';
                }

                if (index > 21 && info.textContent < list.children.length - 20) {
                    lessBtn.style.display = 'inline-block';
                } else {
                    lessBtn.style.display = 'none';
                }
            });
        } else {
            infoBlock.style.display = 'none';
            moreBtn.style.display = 'none';
        }
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
        toggleElements('.list__translation', 'show');
        this.sliderPosition = 1;
        setTimeout(() => {
            document.querySelector('.test__slider-wrapper').style.transform = 'translateX(0)';
        }, 300);

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
            this.translation = translation; //saving data for further handling
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

    sortArray(array, key) {
        function compare(a, b) {
            if (a[key] > b[key]) {
                return 1;
            } else if (a[key] < b[key]) {
                return -1;
            }
            return 0;
        }
        array.sort(compare);
    }

    sortArrayByStats(array, key, method) {
        if (method === 'asc') {
            return array.sort((a, b) => b.stats[key] - a.stats[key]);
        }

        if (method === 'desc') {
            return array.sort((a, b) => a.stats[key] - b.stats[key]);
        }
    }

    //  Fisher Yates Shuffle
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            //  pick random index before current element
            const j = Math.floor(Math.random() * (i + 1));
            //  swap in place (shorthand way of swapping elements using destructuring
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    sortList(listID, method) {
        const sliderWrapper = document.querySelector('.test__slider-wrapper');
        const data = JSON.parse(localStorage.getItem('vocab'));

        if (this.sort[listID] === 'shuffle') {
            this.shuffle(data[listID]);
        } else if (this.sort[listID] === 'ascending') {
            this.sortArray(data[listID], 'word');
        } else if (this.sort[listID] === 'descending') {
            this.sortArray(data[listID], 'word');
            data[listID].reverse();
        } else if (method && this.sort[listID] === 'right') {
            this.sortArrayByStats(data[listID], 'right', method);
        } else if (method && this.sort[listID] === 'wrong') {
            this.sortArrayByStats(data[listID], 'wrong', method);

        }

        localStorage.setItem('vocab', JSON.stringify(data));
        sliderWrapper.innerHTML = '';
        this.render();
    }

    searchHandler(e) {
        const dropdownList = document.querySelector('.dropdown__list');
        const noMatch = document.querySelector('.dropdown__no-match');
        this.clearDropdown();
        checkSearchCrossAppear('.search__input', '.search__close-button');

        if (e.target.value) {
            const regExp = new RegExp(e.target.value.toLowerCase());

            this.words.forEach(elem => {
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

    setActiveTrainArray(select) {
        if (select.value === 'all') {
            this.trainArray = this.trainArrays.all;
        } else {
            this.trainArray = this.trainArrays.parts[select.selectedIndex - 1];
        }
    }

    generateTrainingArrays(vocab, select, divider) {
        this.trainOption = select.value;
        this.trainArrays = {};
        this.trainArrays.all = [...vocab];
        this.trainArrays.parts = [];

        while (vocab.length) {
            this.trainArrays.parts.push(vocab.splice(0, divider));
        }

        this.setActiveTrainArray(select);
    }

    updateFirebaseStats(word, statName, statValue) {
        const dbRef = firebase.database().ref(`${this.refPrefix}/${this.actualID}/${word}/stats`);
        dbRef.update({
            [statName]: statValue,
        })
            .then()
            .catch(err => {
                console.error(err);
            });
    }

    updateRowStat(word, statName, value) {
        const rowStatField = document.getElementById(removeSpaces(word)).querySelector(`.list__${statName}`);
        rowStatField.textContent = value;
    }

    updateStats(vocab, word, statName, outputTarget) {
        vocab[this.actualID].forEach(elem => {
            if (elem.word !== word) {
                return;
            }

            elem.stats[statName]++;
            outputTarget.textContent = elem.stats[statName];
            this.updateRowStat(word, statName, elem.stats[statName]);
            this.updateFirebaseStats(word, statName, elem.stats[statName]);
            localStorage.setItem('vocab', JSON.stringify(vocab));
        });
    }

    checkTrainingAppear() {
        const trainingBtn = document.querySelector('.training__btn');
        const vocab = JSON.parse(localStorage.getItem('vocab'));
        if (vocab && vocab.actual && vocab.actual.length > 3) {
            trainingBtn.style.display = 'flex';
        } else {
            trainingBtn.style.display = 'none';
        }
    }

    checkSlidersEnd(target) {
        const wrapper = target.closest('.test__slider-wrapper');
        const length = wrapper.children.length;
        if (this.sliderPosition + 1 === length) {
            const btnBox = document.querySelectorAll('.test__btn-box')[this.sliderPosition];
            btnBox.style.justifyContent = 'space-between';
            btnBox.style.width = '60%';
            btnBox.style.marginRight = 'auto';
            return true;
        }
    }

    resetSearch() {
        const dropdownList = document.querySelector('.dropdown__list');
        const searchInput = document.querySelector('.search__input');
        const searchCloseBtn = document.querySelector('.search__close-button');
        const noMatch = document.querySelector('.dropdown__no-match');
        dropdownList.innerHTML = '';
        searchInput.value = '';
        searchCloseBtn.style.display = 'none';
        noMatch.style.display = 'none';
    }

    fillSelect(select, array, divider) {
        select.innerHTML = `<option value="all">All words (${array.length})</option>`;
        let full = 0;

        if (array.length > divider) {
            const rest = array.length % divider;
            full = Math.floor(array.length / divider);


            if (full > 0) {
                let num = 1;
                for (let i = 1; i <= full; i++) {
                    select.insertAdjacentHTML('beforeend', `
                            <option value="${i - 1}">${i}) ${num}-${i * divider}</option>    
                        `);
                    num += divider;
                }
            }

            if (rest && full > 0) {
                const max = full * divider;
                select.insertAdjacentHTML('beforeend', `
                        <option value="${full}">
                            ${full + 1}) ${max + 1}-${max + rest}
                        </option>    
                    `);
            } else if (rest) {
                select.insertAdjacentHTML('beforeend', `
                        <option value="1-${rest}">${1}) 1-${rest}</option>    
                    `);
            }
        }
    }

    clickHandler(e) {
        const searchInput = document.querySelector('.search__input');
        const deleteBtn = document.querySelector('.modal__delete-btn');
        const undoBtn = document.querySelector('.modal__undo-btn');

        let target = e.target;

        if (target.closest('.controls__move')) {
            target = target.closest('.controls__move');
            const { word, translation, stats } = this.deleteWord(target);
            const targetList = target.dataset.move.toLowerCase();
            const reference = `${this.refPrefix}/${targetList}/`;
            this.addNewWord(reference, word, translation, stats);
        }

        if (target.closest('.controls__remove')) {
            this.modalWordHandle(target, '.modal-delete');
        }

        if (target.closest('.modal__cross') ||
            target.closest('.test__close') ||
            target.classList.contains('overlay') ||
            target.closest('.modal__undo-btn')) {
            this.hideModals();
        }

        if (target.closest('.modal__delete-btn')) {
            const list = target.closest('.modal').dataset.list;
            const word = target.closest('.modal').dataset.word;
            const ref = `${this.refPrefix}/${list}/${word}`;
            deleteWord(firebase, ref);
            deleteBtn.style.display = 'none';
            undoBtn.style.display = 'inline-block';
            this.getData();
            this.hideModals();
            this.resetSearch();
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

        if (target.closest('.vocab__less')) {
            const list = target.closest('.vocab__after-line').previousElementSibling;
            this.numToShow[list.id] = 20;
            const targetToScroll = list.previousElementSibling;
            scroll(targetToScroll);
            setTimeout(this.render.bind(this), 800);
        }

        if (target.closest('.search__close-button')) {
            target.previousElementSibling.value = '';
            this.resetSearch();
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

            //highlighting word
            elem.classList.add('js-active');
            //remove highlight
            setTimeout(() => {
                elem.classList.remove('js-active');
            }, 4000);
            scroll(elem);
            this.clearDropdown();
            this.addDropdownElement(word, link);
            checkSearchCrossAppear('.search__input', '.search__close-button');
        }


        //SORTING ARRAY
        if (target.closest('.sort__shuffle') || target.closest('.sort__sort') ||
            target.closest('.sort__stats')) {
            this.listID = target.closest('.vocab__info-line').nextElementSibling.id;
        }

        if (target.closest('.sort__shuffle')) {
            const { listID } = this;
            this.sort[listID] = 'shuffle';
            localStorage.setItem('vocabSortOptions', JSON.stringify(this.sort));
            this.sortList(listID);
        }

        if (target.closest('.sort__sort')) {
            const { listID } = this;
            if (this.sort[listID] !== 'ascending') {
                this.sort[listID] = 'ascending';
                target.closest('.sort__sort').classList.remove('js-active');
            } else if (!this.sort[listID] || this.sort[listID] === 'ascending') {
                this.sort[listID] = 'descending';
                target.closest('.sort__sort').classList.add('js-active');
            }

            localStorage.setItem('vocabSortOptions', JSON.stringify(this.sort));
            this.sortList(listID);
        }

        if (target.closest('.sort__stats')) {
            const { listID } = this;
            if (this.sort[listID] !== 'right') {
                this.sort[listID] = 'right';
                target.classList.remove('js-wrong');
            } else if (!this.sort[listID] || this.sort[listID] === 'right') {
                this.sort[listID] = 'wrong';
                target.classList.add('js-wrong');
            }


            localStorage.setItem('vocabSortOptions', JSON.stringify(this.sort));
            this.sortList(listID, target.dataset.sort);
        }

        if (target.closest('.training__btn')) {
            const sliderWrapper = document.querySelector('.test__slider-wrapper');
            const trainModal = document.querySelector('.modal-training');
            const actualList = document.getElementById('actual');
            const checkboxes = document.querySelectorAll('.checkbox__input');
            toggleElements('.list__translation', 'hide', actualList);

            let divider = 0;
            //get default num of words to train
            checkboxes.forEach(elem => {
                if (elem.checked === true) {
                    divider = +elem.value;
                }
            });

            //making select options
            const actual = JSON.parse(localStorage.getItem('vocab')).actual;
            const select = trainModal.querySelector('.modal__select');
            this.fillSelect(select, actual, divider);

            //preparing for training
            this.translations = actual.map(element => element.translation); // ?? NO NEED OF THIS


            this.generateTrainingArrays(actual, select, divider);
            select.selectedIndex = localStorage.getItem('test-select-index') || 0;
            this.setActiveTrainArray(select);
            if (!sliderWrapper.children.length) {
                this.makeAnswers(sliderWrapper);
            }
            this.showModal(trainModal);
        }

        //MODAL WITH TRAINING OPTIONS
        if (target.closest('.modal-training .modal__btn')) {
            const actualList = document.getElementById('actual');
            const testModal = document.querySelector('.test');
            const wrapper = document.querySelector('.test__slider-wrapper');
            this.hideModals();
            this.showModal(testModal);
            toggleElements('.list__translation', 'hide', actualList);
            this.sliderPosition = 0;
            this.pageCounter(this.sliderPosition, wrapper);
        }

        //SLIDER NEXT
        if (target.closest('.test__next')) {
            const wrapper = target.closest('.test__slider-wrapper');
            const prevBtns = document.querySelectorAll('.test__prev');

            if (this.sliderPosition + 1) {
                prevBtns.forEach((prev, index) => {
                    if (index === 0) {
                        return;
                    }
                    prev.style.display = 'inline-block';
                });
            } else {
                prevBtns.forEach(prev => prev.style.display = 'none');
            }

            ++this.sliderPosition;
            wrapper.style.transform = `translateX(-${this.sliderPosition * 100}%)`;
            this.pageCounter(this.sliderPosition, wrapper);
        }

        //SLIDER PREV
        if (target.closest('.test__prev')) {
            const wrapper = target.closest('.test__slider-wrapper');

            if (this.sliderPosition !== 0) {
                --this.sliderPosition;
                wrapper.style.transform = `translateX(-${this.sliderPosition * 100}%)`;
                this.pageCounter(this.sliderPosition, wrapper);
            }
        }

        if (target.closest('.test__answer')) {
            //check for the already been clicked
            const vocab = JSON.parse(localStorage.getItem('vocab'));
            const word = target.closest('.test__slide').querySelector('.test__word').textContent;
            const answerBlock = target.closest('.test__answers');
            const answers = answerBlock.querySelectorAll('.test__answer');
            const nextBtn = answerBlock.nextElementSibling.querySelector('.test__next');
            const closeBtn = answerBlock.nextElementSibling.querySelector('.test__close');
            const right = target.closest('.test__slide').querySelector('.test__stats-right');
            const wrong = target.closest('.test__slide').querySelector('.test__stats-wrong');

            for (let i = 0; i < answers.length; i++) {
                if (answers[i].classList.contains('js-right') || answers[i].classList.contains('js-wrong')) {
                    return;
                }
            }

            //CONDITION OF SUCCESS PICK
            this.trainArray.forEach(elem => {
                if (elem.word === word && target.textContent === elem.translation) {
                    target.classList.add('js-right');
                    //HIDE OTHER ANSWERS
                    answers.forEach(answer => {
                        if (answer.classList.contains('js-right')) {
                            return;
                        }
                        answer.classList.add('js-hidden');
                    });

                    //STATS UPDATE
                    this.updateStats(vocab, word, 'right', right);

                } else if (elem.word === word && target.textContent !== elem.translation) {
                    target.classList.add('js-wrong');
                    //SHOW THE RIGHT ANSWER AND HIDE OTHERS
                    answers.forEach(answer => {
                        if (answer.classList.contains('js-wrong')) {
                            return;
                        }

                        if (elem.word === word && answer.textContent === elem.translation) {
                            answer.classList.add('js-right');
                            return;
                        }

                        answer.classList.add('js-hidden');
                    });
                    //STATS COUNTER
                    this.updateStats(vocab, word, 'wrong', wrong);
                }
            });

            //Buttons appear condition
            if (!this.checkSlidersEnd(target)) {
                nextBtn.style.display = 'inline-block';
            } else {
                closeBtn.style.display = 'inline-block';
            }
        }

        //CHECKBOXES
        if (target.closest('.modal-training input[type="radio"]')) {
            const select = document.querySelector('.modal__select');
            const divider = +target.value;
            const actual = JSON.parse(localStorage.getItem('vocab'))[this.actualID];
            this.fillSelect(select, actual, divider);
            this.generateTrainingArrays(actual, select, divider);
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
    }



    eventListeners() {
        const deleteBtn = document.querySelector('.modal__delete-btn');
        const undoBtn = document.querySelector('.modal__undo-btn');
        const searchInput = document.querySelector('.search__input');
        const confirm = document.querySelector('.modal__confirm-input');
        const forms = this.root.querySelectorAll('form');
        const inputs = [document.getElementById('word'), document.getElementById('translation')];
        const modalInputs = document.querySelectorAll('.modal__input');
        const modalSelect = document.querySelector('.modal__select');

        this.root.addEventListener('click', this.clickHandler.bind(this));

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
                    this.addNewWord(`${this.refPrefix}/${this.actualID}/`, word, translation);
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

        modalSelect.addEventListener('change', () => {
            const sliderWrapper = document.querySelector('.test__slider-wrapper');
            sliderWrapper.innerHTML = '';
            this.trainOption = modalSelect.value;
            this.setActiveTrainArray(modalSelect);
            localStorage.setItem('test-select-index', JSON.stringify(modalSelect.selectedIndex));

            this.makeAnswers(sliderWrapper);
        });

        searchInput.addEventListener('input', this.searchHandler.bind(this));
    }

    makeAnswers(sliderWrapper) {
        this.vocabToTrain = JSON.parse(localStorage.getItem('vocab')).actual;
        this.trainArray.forEach(elem => {
            const answers = [elem.translation];

            if (this.vocabToTrain) {
                while (answers.length !== 4) {
                    const randIndex = Math.floor(Math.random() * this.vocabToTrain.length);

                    if (elem.translation === this.vocabToTrain[randIndex].translation ||
                        answers.includes(this.vocabToTrain[randIndex].translation)) {
                        continue;
                    }
                    answers.push(this.vocabToTrain[randIndex].translation);
                }
            }

            this.shuffle(answers);

            sliderWrapper.insertAdjacentHTML('beforeend', this.makeTestSlide(elem, answers));
            const sliders = sliderWrapper.querySelectorAll('.test__slide');
            sliders.forEach(slider => {
                const answers = slider.querySelectorAll('.test__answer');
                answers.forEach(answer => {
                    answer.style.minHeight = answer.clientHeight + 2 + 'px';
                });
            });
        });
    }

    makeTestSlide(elem, answers) {
        return `
            <div class="test__slide">
                <h1 class="test__word">${elem.word}</h1>
                <div class="test__answers">
                    <button class="test__answer" type="button">${answers[0]}</button>
                    <button class="test__answer" type="button">${answers[1]}</button>
                    <button class="test__answer" type="button">${answers[2]}</button>
                    <button class="test__answer" type="button">${answers[3]}</button>
                </div>
                <div class="test__btn-box">
                    <button class="test__prev">Prev</button>
                    <button class="test__close">Close</button>
                    <button class="test__next">Next</button>
                </div>
                <div class="test__stats">
                    <p class="test__stats-title">
                        <span class="test__stats-word">${elem.word}</span>stats:
                    </p>
                    <div class="test__stats-right">${+elem.stats.right}</div>
                    <div class="test__stats-wrong">${+elem.stats.wrong}</div>
                </div>
            </div>
        `;
    }

    pageCounter(position, wrapper) {
        const slides = wrapper.querySelectorAll('.test__slide');
        const curr = document.querySelector('.counter__current');
        const total = document.querySelector('.counter__total');
        curr.textContent = position + 1;
        total.textContent = slides.length;
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
        // this.database = firebase.database();
    }

    checkSortOptions() {
        if (localStorage.getItem('vocabSortOptions')) {
            const sortOptions = JSON.parse(localStorage.getItem('vocabSortOptions'));
            for (const key in sortOptions) {
                const target = document.getElementById(key).previousElementSibling.querySelector('.sort__sort');
                if (sortOptions[key] === 'descending') {
                    target.classList.add('js-active');
                }
            }
        }
    }

    checkSortOptionsRender() {
        const sortActual = document.querySelector('.sort-actual');
        const sortLearned = document.querySelector('.sort-learned');
        const vocab = JSON.parse(localStorage.getItem('vocab'));

        if (vocab && vocab.actual && vocab.actual.length > 1) {
            sortActual.style.display = 'flex';
        } else {
            sortActual.style.display = 'none';
        }

        if (vocab && vocab.learned && vocab.learned.length > 1) {
            sortLearned.style.display = 'flex';
        } else {
            sortLearned.style.display = 'none';
        }
    }

    setStats(vocab) {
        this.stats = [];
        vocab[this.actualID].forEach(elem => {
            this.stats.push(
                {
                    [elem.word]: {
                        right: elem.stats.right,
                        wrong: elem.stats.wrong,
                    }
                }
            );
        });
    }

    init() {
        this.makeLayout();
        this.initFirebase();
        this.eventListeners();
        this.checkSortOptions();

        if (!getCookie('vocab')) {
            this.getData();
            setCookie('vocab', this.generateId());
        }
        this.render();
    }
}

export default Vocab;
