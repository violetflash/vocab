import makeStructure from './makeStructure';

class Vocab {
    constructor({root, db}) {
        this.root = document.querySelector(root);
        this.db = db;
    }

    layoutMaker() {
        makeStructure(this.root);

    }

    init() {
        this.layoutMaker();
    }
}

export default Vocab;