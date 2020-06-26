# gostack-challange06-nodejs-typescript

NodeJS with typescript back-end based on challenge 6 from BootCamp goStack by Rocketseat. (https://github.com/Rocketseat/bootcamp-gostack-desafios/tree/master/desafio-database-upload)



> To install the project dependencies: `$ yarn`

> To run: `$ yarn dev:server`

> To test: `$ yarn test`

Api routes
* **POST /transactions** *(add a transaction and add the category if it not exists)*
```
body: {
  "title": "Salary",
  "value": 5000,
  "type": "income", 
  "category": "Others"
}
```

* **GET /transactions** *(list all transactions and a balance of transactions)*

* **DELETE /transactions/:id** *(delete a transaction by id)*

* **POST /transactions/import** *(import a csv file with transactions. This method use the multer middleware(https://github.com/expressjs/multer) and csv-parse(https://github.com/adaltas/node-csv-parse))*

FILE FORMAT
```
title, type, value, category
Loan, income, 1500, Others
Website Hosting, outcome, 50, Others
Ice cream, outcome, 3, Food
```

* **POST /categories** *(add a category)*
```
body: {
  "title": "Bonus"
}
```

* **GET /categories** *(list all categories)*


 
