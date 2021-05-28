const writeWord = (firebase, reference, word, translation) => {
    firebase.database().ref(reference + word).set({
        word,
        translation,
    });
};

const deleteWord = (firebase, reference) => firebase.database().ref(reference).remove();

const capitalizer = word => word[0].toUpperCase() + word.slice(1);

const readDatabase = firebase => {
    const dbRef = firebase.database().ref('vocab/');
    dbRef.on('value', snapshot => {
        if (snapshot.exists()) {
            // console.log(snapshot.val());
            localStorage.setItem('vocab', JSON.stringify(snapshot.val()));
        } else {
            console.log("No data available");
        }
    });
};

const makeWordsList = vocab => {
    let wordList = [];
    for (const vocabKey in vocab) {
        const list = Object.values(vocab[vocabKey]).reduce((arr, elem) => {
            arr.push(elem.word);
            return arr;
        }, []);
        wordList = wordList.concat(list);
    }
    return wordList;
};

const makeDropdownLink = (word, anchor) => `
    <li class="dropdown__row">
        <a class="dropdown__link" href="#${anchor}">${word}</a>
    </li>
`;

const scroll = e => {
    e.scrollIntoView({ behavior: "smooth", block: "start" });
};

const checkSearchInputValue = (inputSelector, buttonSelector) => {
    const input = document.querySelector(inputSelector);
    const button = document.querySelector(buttonSelector);
    if (input.value) {
        button.style.display = 'flex';
    } else {
        button.style.display = 'none';
    }
};

const checkInputs = arr => {
    let res = true;
    arr.forEach(input => {
        //add warning
        if (!input.value) {
            input.nextElementSibling.classList.add('js-active');

            //remove warning
            setTimeout(() => {
                input.nextElementSibling.classList.remove('js-active');
            }, 3000);
            res = false;
        }
    });

    return res;
};

const renderList = (target, source, index, moveTo, list) => {
    const word = capitalizer(source.word);
    target.insertAdjacentHTML('beforeend', `
        <li id="${source.word}" class="list__row" data-index="${index})"  data-master="${list}">
            <span class="list__word">${word}</span>
            <span class="list__translation">${source.translation}</span>
            <div class="list__controls controls">
                <button class="controls__move button" data-move="${moveTo}">
                    <i class="controls__move-icon"></i>
                    <span class="controls__move-tooltip">Move to <strong>${moveTo}</strong></span>
                </button>
                <button class="controls__edit button">
<!--                    <span class="controls__tooltip">Edit</span>-->
                </button>
                <button class="controls__remove button">
<!--                    <span class="controls__tooltip">Delete</span>-->
                </button>
            </div>
        </li>
    `);
};

const clearList = target => document.querySelector(target).innerHTML = '';

const updateTitleCounter = (list, index) => {
    const target = document.getElementById(list);
    const counter = target.previousElementSibling.querySelector('.vocab__title-counter');
    // const text = title.dataset.full;
    counter.textContent = index;
};

const lockScreen = () => {
    document.querySelector('.overlay').classList.add('js-active');
    document.body.classList.add('js-lock');
};

const unlockScreen = () => {
    document.querySelector('.overlay').classList.remove('js-active');
    document.body.classList.remove('js-lock');
};

const showBlocks = className => {
    const blocks = document.querySelectorAll(className);
    blocks.forEach(elem => {
        elem.style.opacity = 1;
    });
};

export {
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
    makeWordsList,
    checkSearchInputValue,
    makeDropdownLink,
    scroll,
};
