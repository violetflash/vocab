
<div>
    <a href="https://github.com/webpack/webpack">
        <img width="150" height="150" src="https://webpack.js.org/assets/icon-square-big.svg">
    </a>
</div>



## Файловая структура

```
webpack-frontend-template
├── dist/
├── src/
│   ├── assets/
│   │   ├── fonts
│   │   └── images
│   ├── styles/
│   │   ├── components/
│   │   └── index.scss
│   ├── js/
│   │   ├── modules/
│   │   └── index.js
│   │
│   └── index.html
│
├── webpack.config.js
├── package.json
├── .eslintrc
├── .jshintrc
└── .gitignore
```

> В зависимости от фреймворка, вы можете переделать организацию файлов в папке src т.к. обычно она отличается


## Команды

* ```npm run dev``` - собираем development
* ```npm run build``` - собираем production
* ```npm start``` - слежение за файлами и открываем в браузере
* ```npm run stats``` - смотрим размеры и статы бандла

## Установка

Установим все необходимые пакеты из package.json

```bash
npm install
```

Запускаем

```bash
npm start
```
