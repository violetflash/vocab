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
          <button class="vocab__add-btn button" type="submit">Add new word</button>
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

const makeEditModal = () => {
    return `
        <div class="overlay">
            <div class="modal modal-edit" data-modal="edit">
                <svg class="modal__cross modal__close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/>
                </svg>
                <h3 class="modal__title">Word editor</h3>
                <form class="modal__form">
                    <div class="modal__inputs">
                        <label><!-- labels here in case of further effects ;) -->
                            <input class="modal__input" name="word" type="text" autocomplete="off">
                        </label>
                        <span class="modal__separator">&#9866;</span>
                        <label>
                            <input class="modal__input modal__translation" name="translation" type="text" autocomplete="off">
                        </label>
                    </div>
                    <button class="modal__btn button" type="submit">Save</button>
                </form>
            </div>
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
    main.insertAdjacentHTML('beforeend', makeEditModal());
    root.append(main);
};

export default makeStructure;