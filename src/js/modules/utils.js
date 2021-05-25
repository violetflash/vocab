const writeWord = (firebase, target, word, translation) => {
    firebase.database().ref(target + word).set({
        word,
        translation,
    });
};

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

const renderList = (target, source) => {
    target.innerHTML = '';  //clear list for each render process
    target.insertAdjacentHTML('afterbegin', `
        <li class="list__row">
            <span class="list__word">${source.word}</span>
            <span class="list__translation">${source.translation}</span>
            <div class="list__controls">
                <button class="list__move">Move to $</button>
                <button class="list__edit">Edit</button>
                <button class="list__remove">Delete</button>
            </div>
        </li>
    `);
};

export { writeWord, readDatabase, checkInputs, renderList };
