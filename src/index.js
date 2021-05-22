import Vocab from './modules/Vocab';

const myVocab = new Vocab({
    root: '.content',
    db: 'link constructor firebase realtime database',
});

myVocab.init();