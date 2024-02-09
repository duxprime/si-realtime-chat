# si-chat

The `si-chat` module is the front end application project for the System Iniative chat solution. It consumes several other monorepo projects:
* `domain`
* `presentation`
* `utils`

## How to Test
Component integration tests exist in the `si-chat` project. From the root directory:
```
npm run test:component
``` 

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).



## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
