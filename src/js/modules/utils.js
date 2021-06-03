const writeWord = (
    firebase,
    reference,
    word,
    translation,
    stats = { "right": 0, "wrong": 0 }) => {
    firebase.database().ref(reference + word).set({
        word,
        translation,
        stats,
    });
};

const removeSpaces = string => string.replace(/\s/g, '');

const deleteWord = (firebase, reference) => firebase.database().ref(reference).remove();

const capitalizer = word => word[0].toUpperCase() + word.slice(1);

const makeWordsList = vocab => {
    let wordList = [];
    for (const vocabKey in vocab) {
        if (vocab[vocabKey]) {
            const list = vocab[vocabKey].map(elem => elem.word);
            wordList = wordList.concat(list);
        }
    }
    return wordList;
};

const sortObject = sourceObject => Object.keys(sourceObject).sort().reverse().reduce(
    (obj, key) => {
        obj[key] = sourceObject[key];
        return obj;
    },
    {}
);

const makeDropdownLink = (word, anchor) => `
    <li class="dropdown__row">
        <a class="dropdown__link" href="#${removeSpaces(anchor)}">${word}</a>
    </li>
`;

const scroll = e => {
    e.scrollIntoView({ behavior: "smooth", block: "start" });
};

const scrollDistance = distance => {
    window.scrollBy({
        top: distance,
        behavior: 'smooth'
    });
};

const checkSearchCrossAppear = (inputSelector, buttonSelector) => {
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

const renderRow = (target, source, index, moveTo, list) => {
    const word = capitalizer(source.word);
    const id = removeSpaces(source.word);
    target.insertAdjacentHTML('beforeend', `
        <li id="${id}" class="list__row" data-index="${index})"  data-master="${list}">
            <span class="list__word">${word}</span>
            
            <span class="list__translation">${source.translation}</span>
            <div class="list__stats">
                <div class="list__right">${source.stats.right}</div>
                <div class="list__wrong">${source.stats.wrong}</div>
            </div>
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

const toggleElements = (className, option, root = document) => {
    const blocks = root.querySelectorAll(className);
    blocks.forEach(elem => {
        elem.style.opacity = option === 'show' ? 1 : 0;
    });
};


const setCookie = (name, value, options = {}) => {

    options = {
        path: '/',
        // при необходимости добавьте другие значения по умолчанию
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (const optionKey in options) {
        updatedCookie += "; " + optionKey;
        const optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
};

const getCookie = name => {
    const matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
};

export {
    writeWord,
    deleteWord,
    checkInputs,
    renderRow,
    clearList,
    updateTitleCounter,
    lockScreen,
    unlockScreen,
    capitalizer,
    toggleElements,
    makeWordsList,
    checkSearchCrossAppear,
    makeDropdownLink,
    scroll,
    scrollDistance,
    setCookie,
    getCookie,
    sortObject,
    removeSpaces,
};
