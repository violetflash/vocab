const makeVocabHeader = () => `
    <header>
        <h1 class="title">Vocabulary<span class="h1-span">(v0.1)</span></h1>
    </header>
`;

const makeSearchInput = () => `
    <div class="search">
        <div class="search__content">
            <input class="search__input" type="text" placeholder="search for word...">
            <div class="search__close-button"></div>
            <div class="search__dropdown dropdown">
                <div class="dropdown__autocomplete">
                    <ul class="dropdown__list">
                        
                    </ul>
                </div>
                <div class="dropdown__no-match">No matches found...</div>
            </div>
        </div>
    </div>   
`;

const makeForm = () => `
    <form class="vocab__form">
        <label class="vocab__label">
            <input class="vocab__input" id="word" name="word" type="text" placeholder="new word" autocomplete="off">
            <span class="input-warning">This field must not be empty!</span>
        </label>
        <label class="vocab__label">
            <input class="vocab__input" id="translation" name="translation" type="text" 
                placeholder="translation" autocomplete="off">
            <span class="input-warning">This field must not be empty!</span>
        </label>
        <button class="vocab__add-btn button" type="submit">Add new word</button>
    </form> 
`;

const makeActual = () => `
    <div class="vocab__words">
        <div class="vocab__info-line">
            <div class="vocab__title-box">
                <h2 class="vocab__title vocab__title-actual" data-full="Words to learn:" 
                    data-empty="No words added">No words added
                </h2>
                <span class="vocab__title-counter">2222</span>
            </div>
            <div class="vocab__adaptive-box">
                <div class="vocab__training training">
                    <button class="training__btn">
                        <span class="training__tooltip">Start training</span>
                    </button>     
                </div>
                <div class="vocab__controls">
                    <div class="vocab__sort sort">
                        <button class="sort__shuffle"></button>
                        <button class="sort__sort"></button>
                    </div>
                </div>
            </div>
        </div>
        <ul id="actual" class="vocab__list list"></ul>
        <div class="vocab__after-line">
            <span class="vocab__info">Hidden words: <strong class="vocab__info-num"></strong></span>
            <button class="vocab__more">Show more</button>
            <button class="vocab__less">Show less</button>
        </div>
        
    </div>
`;

const makeLearned = () => `
    <div class="vocab__words vocab__words--learned">
        <div class="vocab__info-line">
            <div class="vocab__title-box">
                <h2 class="vocab__title vocab__title-learned" 
                    data-full="Learned words:" 
                    data-empty="No words learned">No words learned
                </h2>
                <span class="vocab__title-counter"></span>
            </div>
            <div class="vocab__controls">
                <div class="vocab__sort sort">
                    <button class="sort__shuffle"></button>
                    <button class="sort__sort"></button>
<!--                    <button class="sort__descending">descending</button>-->
                </div>
            </div>
        </div>
        <ul id="learned" class="vocab__list list"></ul>
        <div class="vocab__after-line">
            <span class="vocab__info">Hidden words: <strong class="vocab__info-num"></strong></span>
            <button class="vocab__more">Show more</button>
            <button class="vocab__less">Show less</button>
        </div>
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
                <label class="modal__label"><!-- labels here in case of further effects ;) -->
                    <input class="modal__input" name="word" type="text" autocomplete="off">
                    <span class="input-warning modal__warning">This field must not be empty!</span>
                </label>
                <span class="modal__separator">&#9866;</span>
                <label class="modal__label">
                    <input class="modal__input modal__translation" name="translation" type="text" 
                        autocomplete="off">
                    <span class="input-warning modal__warning">This field must not be empty!</span>
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
        <h3 class="modal__title">Confirm deletion of word:</h3>
        <div class="modal__subtitle"><span class="modal__word-to-delete"></span></div>
        <p class="modal__confirm">
            <input class="modal__confirm-input" type="text" placeholder="translate it">
        </p>
            
        
        <div class="modal__buttons">
            <button class="modal__delete-btn button" type="submit">Delete</button>
            <button class="modal__undo-btn button" type="button">No</button>
        </div>
    </div>
    
    <div class="modal modal-training">
        <svg class="modal__cross" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 
                9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/>
        </svg>
        <h3 class="modal__title">Words training</h3>
        <form class="modal__form">
            <div class="modal__train-options">
               
                <div class="modal__select-label">
                    Please choose which part of words would you like to train:
                    <select class="modal__select"></select>
                </div>
<!--                <div class="modal__checkboxes">-->
<!--                    <label class="modal__checkbox-label">answer 1-->
<!--                        <input type="checkbox" class="modal__answer">-->
<!--                    </label>-->
<!--                </div>-->
            </div>
            <button class="modal__btn button" type="submit">START</button>
        </form>
    </div>
    
    <div class="modal test">
        <svg class="modal__cross" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 
                9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/>
        </svg>
        <div class="test__slider">
            <h3 class="test__title">Choose the correct option for the word:</h3>
            <div class="test__slider-wrapper">
                
            </div>
        </div>
    </div>
    
    <div class="overlay"></div>
`;



const makeStructure = root => {
    root.insertAdjacentHTML('afterbegin', makeVocabHeader());
    const main = document.createElement('div');
    main.className = 'main';
    main.insertAdjacentHTML('beforeend', makeForm());
    main.insertAdjacentHTML('beforeend', makeSearchInput());
    main.insertAdjacentHTML('beforeend', makeActual());
    main.insertAdjacentHTML('beforeend', makeLearned());
    main.insertAdjacentHTML('beforeend', makeModals());
    root.append(main);
};

export default makeStructure;
