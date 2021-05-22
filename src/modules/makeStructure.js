const makeVocabHeader = () => {
    return `
        <header>
            <h1 class="title">Vocabulary<span class="h1-span">(v0.1)</span></h1>
        </header>
    `;
};

const makeForm = () => {
    return `
        <form class="vocab__form">
          <input class="vocab__input" id="word" name="word" type="text" placeholder="new word" autocomplete="off">
          <input class="vocab__input" id="translation" name="translation" type="text" placeholder="translation" autocomplete="off">
          <button class="vocab__add-btn button" type="button">Add new word</button>
        </form> 
    `;
};

const makeActual = () => {
    return `
        <div class="vocab__words">
            <div class="vocab__title-box">
                <h2 class="vocab__title" data-name="Words to learn">No words added</h2>
            </div>
            <ul class="vocab__list"></ul>
        </div>
    `;
};

const makeLearned = () => {
    return `
        <div class="vocab__words vocab__words--learned">
            <div class="vocab__title-box">
                <h2 class="vocab__title" data-name="Learned words">No words learned</h2>
            </div>
            <ul class="vocab__list"></ul>
        </div>
    `;
};

const makeStructure = (root) => {
    root.insertAdjacentHTML('afterbegin', makeVocabHeader());
    const main = document.createElement('div');
    main.className = 'main';
    main.insertAdjacentHTML('beforeend', makeForm());
    main.insertAdjacentHTML('beforeend', makeActual());
    main.insertAdjacentHTML('beforeend', makeLearned());
    root.append(main);
};

export default makeStructure;