Node.js Assignment (Serverless + eventing)

We are going to (re)write a simple loan application, that will be split in two apps and communicate with each other through events & commands. The main goal of this assignment is to test your skills understanding, implementing new functionality, refactoring and writing tests. The current code is full of bad practices, outdated libraries and inconsistencies, and it's your goal to make it shine and up-to-date, keeping it simple enough.


Requirements

Node (or Nvm)
Serverless.com CLI
Yarn (optional)


Getting started

Install dependencies: yarn install

Install local dynamodb (required workaround): serverless dynamodb install

Run tests: yarn test

Run for development: yarn start

Check lint issues: yarn lint



Technologies

Platform: Node.js
Programming language: Javascript (ES6) / Typescript
Framework: Serverless.com
Main AWS Services: Lambda, DybamoDB



app1: publishes DisburseLoan command
app2: consume DisburseLoan command
app2: publishes LoanDisbursed event
app1: consume LoanDisbursed event
app1: update status of disbursed loan to disbursed
