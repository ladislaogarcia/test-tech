var envFilePath = '../.env';
var config = require('dotenv').config({path: envFilePath}).parsed || {};
var Database = require('../index');
var fs = require('fs');
const { exec  } = require("child_process");


process.env.npm_package_scripts_start = process.env.npm_package_scripts_start.replace('$PATH', config.DB_PATH);

function checkExists() {
    fs.access(config.DB_PATH, err => {
        if( err ) {
            try {
                fs.mkdirSync(config.DB_PATH);
                console.log('DB did not exist.DB created');
                exec('mongo --shell set tech_test')
                return;
            } catch( err ) {
                throw err;
            }
        }
        return console.log('DB already exists. Skiping its creation.')
    });
}

checkExists()