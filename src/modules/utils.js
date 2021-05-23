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

export {writeWord, readDatabase};