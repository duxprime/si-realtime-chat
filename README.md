# System Initiative Chat

This is the System Initiative chat application test assesment. It is structured as a monorepo and consists of 4 projects:
* `domain`
* `presentation`
* `si-chat`
* `utils`

State management is achieved through shared, singleton services which expose RxJs observables.

## How to Test
Component integration tests are implemented with Cypress and exist in the `si-chat` project. From the root directory:
```
cd projects/si-chat
npm run test:component
``` 
Utility unit tests are implemented with Jest and exist in the `utils` project. From the root directory:
```
cd projects/utils
npm run test
``` 

## What I Would've Done With More Time.
* Implement Prettier auto-formating that is informed by the ES Lint rules.
* Use  Nx to enforce monorepo [module boundaries](https://nx.dev/features/enforce-module-boundaries) and [schedule common project tasks](https://nx.dev/features/run-tasks).
* Use [conflict-free replicated data types](https://mattweidner.com/2022/02/10/collaborative-data-design.html?utm_source=pocket_saves) (CRDTs) for decentralized realtime data.
* Resolved typing issues of Cypress custom commands.




