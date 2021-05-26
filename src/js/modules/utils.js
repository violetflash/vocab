const writeWord = (firebase, reference, word, translation) => {
    firebase.database().ref(reference + word).set({
        word,
        translation,
    });
};

const deleteWord = (firebase, reference) => {
    console.log(reference);
    firebase.database().ref(reference).remove();
};

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

const checkInputs = arr => {
    let res = true;
    arr.forEach(input => {
        //add warning
        if (!input.value) {
            input.nextElementSibling.classList.add('js-active');

            //remove warning
            setTimeout(() => {
                input.nextElementSibling.classList.remove('js-active');
            }, 2000);
            res = false;
        }
    });

    return res;
};

const renderList = (target, source, index, moveTo, list) => {
    const word = capitalizer(source.word);
    target.insertAdjacentHTML('beforeend', `
        <li class="list__row" data-index="${index})"  data-master="${list}">
            <span class="list__word">${word}</span>
            <span class="list__translation">${source.translation}</span>
            <div class="list__controls controls">
                <button class="controls__move button" data-move="${moveTo}">
                    Move to <strong>${moveTo}</strong>
                </button>
                <button class="controls__edit button">
                    <span class="controls__tooltip">Edit</span>
                </button>
                <button class="controls__remove button">
                    <span class="controls__tooltip">Delete</span>
                </button>
            </div>
        </li>
    `);
};

const clearList = target => document.querySelector(target).innerHTML = '';

const updateTitle = (list, index) => {
    const target = document.getElementById(list);
    const title = target.previousElementSibling.querySelector('.vocab__title');
    const text = title.dataset.full;
    title.textContent = `${text}: ${index}`;
};

const lockScreen = () => {
    document.querySelector('.overlay').classList.add('js-active');
    document.body.classList.add('js-lock');
};

const unlockScreen = () => {
    document.querySelector('.overlay').classList.remove('js-active');
    document.body.classList.remove('js-lock');
};

export {
    writeWord,
    deleteWord,
    readDatabase,
    checkInputs,
    renderList,
    clearList,
    updateTitle,
    lockScreen,
    unlockScreen,
    capitalizer,
};
