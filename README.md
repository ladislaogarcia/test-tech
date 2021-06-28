# test-tech
Technical challenge

This project is made by 3 parts:

<br/>

**1. DATABASE**

MongoDB [https://www.mongodb.com/es]

<br/>

**2. API**

[ExpressJS](https://expressjs.com/) using [Express Generator](https://expressjs.com/es/starter/generator.html)

<br/>

**3. FRONTEND**

[@open-wc](https://open-wc.org/)

<br/>
<br/>

## HOW TO RUN
<br/>

The right way to do it, is as I suggest you. There are three steps to follow. These ones:

<br/>
1. Open a terminal and place you inside this folder. Run

<br/>

    npm run database

in order to run the database server. Wait until finish.

If you want to populate your database with many registers, after database server was running, open a new terminal and type. **It is not working. Very strange matter**.

    npm run database:populate

This would have to fill some payments in our payments database. After it finish, you can close this terminal. DO NOT FORGET. Each time you do this, the same registers will be added to your database. It is suggested to do it just once, just when you start the database server for the first time.

You can try typing

    mongo

in a terminal. When mongo prompt appears ( > ), type:

    set tech_test

With much time, I would resolve it. No doubts.    

<br/>
2. Open another terminal. Run

<br/>

    npm run api


 to rise up the API. Wait until finish too.

<br/>
3. Open one more terminal ( last one ) and type
<br/>

    npm run api
    
and you will be running the frontend of the project. A web browser will open automatically.


There has been created 4 components, besides create the whole project. They are the components created and used to develop this project. All of them ( and the three parts of the project are been created for it.)

Those components are:

**table-expenditures**

NPM: https://www.npmjs.com/package/table-expenditures

**graph-analysis**

NPM: https://www.npmjs.com/package/graph-analysis

**form-payments**

NPM: https://www.npmjs.com/package/form-payments

**filter-transactions**

NPM: https://www.npmjs.com/package/filter-transactions


All of them will be installed in 'node_modules' folder when you install the dependencies.

It could be much better with some more time. I can do averything it is asked.
