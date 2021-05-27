const makeVocabHeader = () => `
    <header>
        <h1 class="title">Vocabulary<span class="h1-span">(v0.1)</span></h1>
    </header>
`;

const makeForm = () => `
    <form class="vocab__form">
        <label class="vocab__label">
            <input class="vocab__input" id="word" name="word" type="text" placeholder="new word" autocomplete="off">
            <span class="vocab__warning">Обязательное поле!</span>
        </label>
        <label class="vocab__label">
            <input class="vocab__input" id="translation" name="translation" type="text" 
                placeholder="translation" autocomplete="off">
            <span class="vocab__warning">Обязательное поле!</span>
        </label>
        <button class="vocab__add-btn button" type="submit">Add new word</button>
    </form> 
`;

const makeActual = () => `
    <div class="vocab__words">
        <div class="vocab__title-box">
            <h2 class="vocab__title vocab__title-actual" data-full="Words to learn:" 
                data-empty="No words added">No words added
            </h2>
            <span class="vocab__title-counter">2222</span>
        </div>
<!--        <img class="" src="./assets/images/recycle.png" alt="">-->
        <ul id="actual" class="vocab__list list"></ul>
    </div>
`;

const makeLearned = () => `
    <div class="vocab__words vocab__words--learned">
        <div class="vocab__title-box">
            <h2 class="vocab__title vocab__title-learned" 
                data-full="Learned words:" 
                data-empty="No words learned">No words learned
            </h2>
            <span class="vocab__title-counter">11111</span>
        </div>
<!--        <img class="" src="./assets/images/sort.png" alt="">-->
        <ul id="learned" class="vocab__list list"></ul>
    </div>
`;

const makeModals = () => `
    <div class="modal modal-edit">
        <svg class="modal__cross" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 
                9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/>
        </svg>
        <h3 class="modal__title">Word editor</h3>
        <form class="modal__form">
            <div class="modal__inputs">
                <label><!-- labels here in case of further effects ;) -->
                    <input class="modal__input" name="word" type="text" autocomplete="off">
                </label>
                <span class="modal__separator">&#9866;</span>
                <label>
                    <input class="modal__input modal__translation" name="translation" type="text" 
                        autocomplete="off">
                </label>
            </div>
            <button class="modal__btn button" type="submit">Save</button>
        </form>
    </div>
    
    <div class="modal modal-delete">
        <svg class="modal__cross" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 
                9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/>
        </svg>
        <h3 class="modal__title">Confirm deletion of word:
            <div class="modal__subtitle"><span class="modal__word-to-delete"></span></div>
            <p class="modal__confirm">
                <input class="modal__confirm-input" type="text" placeholder="translate it">
            </p>
            
        </h3>
        <div class="modal__buttons">
            <button class="modal__delete-btn button" type="button" disabled>Delete</button>
            <button class="modal__undo-btn button" type="button">No</button>
        </div>
    </div>
    
    <div class="overlay"></div>
`;



const makeStructure = root => {
    root.insertAdjacentHTML('afterbegin', makeVocabHeader());
    const main = document.createElement('div');
    main.className = 'main';
    main.insertAdjacentHTML('beforeend', makeForm());
    main.insertAdjacentHTML('beforeend', makeActual());
    main.insertAdjacentHTML('beforeend', makeLearned());
    main.insertAdjacentHTML('beforeend', makeModals());
    root.append(main);
};

export default makeStructure;
