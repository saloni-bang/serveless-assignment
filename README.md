Node.js Sample project (Serverless + eventing)

This is a simple loan application, that will be split in two apps and communicate with each other through events & commands.
The code focuses on
    <ul> - coding on SOLID principles </ul>
    <ul>- exploring AWS serverless in local environment </ul>
    <ul>- emiting and recieving events</ul>
    <ul>- schema  and input validation</ul>
    <ul>- using external open source APIS</ul>
    <ul>- using error first mechnaism in javascript</ul>
    <ul>- using aync await</ul>
    <ul>- using jest test cases</ul>


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

<ul>Platform: Node.js</ul>
<ul>Programming language: Javascript (ES6) / Typescript</ul>
<ul>Framework: Serverless.com</ul>
<ul>Main AWS Services: Lambda, DybamoDB</ul>

Flow

<ul>app1: takes and performs CRUD operations for loan</ul>
<ul>app1: publishes DisburseLoan command</ul>
<ul>app2: consume DisburseLoan command</ul>
<ul>app2: publishes LoanDisbursed event</ul>
<ul>app1: consume LoanDisbursed event</ul>
<ul>app1: update status of disbursed loan to disbursed</ul>
