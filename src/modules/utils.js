const writeWord = (firebase, target, word, translation, example = '') => {
    firebase.database().ref(target + word).set({
        word,
        translation,
        example,
    });
};

const readDatabase = (firebase, word) => {
    const dbRef = firebase.database().ref('vocab/');
    dbRef.on('value', (snapshot) => {
        if (snapshot.exists()) {
            // console.log(snapshot.val());
            localStorage.setItem('vocab', JSON.stringify(snapshot.val()));
        } else {
            console.log("No data available");
        }
    });
};

const checkInputs = (arr) => {
    arr.forEach((input) => {
        if (!input.value) {
            input.nextElementSibling.classList.add('js-active');
            setTimeout(() => {
                input.nextElementSibling.classList.remove('js-active');
            }, 1000);
        }
    });
}

export {writeWord, readDatabase, checkInputs};