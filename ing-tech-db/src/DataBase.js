const envFilePath = '../.env';
const config = require('dotenv').config({path: envFilePath}).parsed || {};

const mongoose = require('mongoose');
const EventEmitter = require('events');
const PaymentSchema = require('./models/PaymentSchema');

class DataBase extends EventEmitter {

    constructor() {
        super();
        this.maxAllowedMonthsRequested = 6;
        this.connection = null;
        this.overrideMethods();        
        this.model = mongoose.model('Payment', PaymentSchema);
        this.connectionString = `${config.DB_PROTOCOL}://${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`;        
    }

    getLatest(category, itemsLimit) {
        itemsLimit = itemsLimit || 10;
        const obj = category && category.toLowerCase() !== 'all'
            ? { category }
            : {};
        return new Promise((resolve, reject) => {
            this.model.find(obj, (err, items) => {
                if(err) reject(err);
                const ret = items
                    .reverse()
                    .slice(0, itemsLimit)
                    .sort((a, b) => {
                        const regexp = /(\d+)/g;
                        const elemA = parseInt(a.id.match(regexp), 10);
                        const elemB = parseInt(b.id.match(regexp), 10);
                        if (elemA < elemB) {
                            return 1;
                        }
                        if (elemA > elemB) {
                            return -1;
                        }
                        return 0;
                    });
                resolve(ret);
            });
        });
    }

    normalizeMaxDate(maxDate) {
        return maxDate = maxDate && new Date(maxDate) !== 'Invalid Date' ? maxDate : new Date();
    }

    getMinDate(maxDate, monthsBackward) {
        maxDate = this.normalizeMaxDate(maxDate);
        var isAllowed = parseInt(maxDate) && maxDate <= this.maxAllowedMonthsRequested;
        monthsBackward =  isAllowed ? monthsBackward : false;
        const max = new Date(maxDate);
        const maxMonth = max.getMonth();
        const maxYear = max.getFullYear();
        let monthDiff = monthsBackward || this.maxAllowedMonthsRequested;
        monthDiff -= 1;
        const rawMonthDiff =  maxMonth - monthDiff;
        const minMonth = rawMonthDiff <= -1
            ? maxMonth + monthDiff
            : rawMonthDiff;
        const minYear = rawMonthDiff <= -1  ? maxYear - 1 : maxYear;
        return new Date(minYear, minMonth, 1, 1);
    }

    overrideMethods() {
        PaymentSchema.methods.toJSON = function() {
            const removeKeys = ['_id', '__v'];
            const obj = this.toObject();
            removeKeys.forEach(key => delete obj[key]);
            return obj;
        };
    }

    connect() {
        const connOpts = {
            dbName: config.DB_NAME,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        }
        mongoose.connect(this.connectionString, () => {
            console.log(`Database is on ${this.connectionString}`);
        }, connOpts);
        this.connection = mongoose.connection;
        this.connection.on('error', () => {
            console.error.bind(console, 'connection error:');
        });
        this.connection.on('disconnected', () => {
            console.error.bind(console, 'connection disconnected:');
        });
        this.connection.once('open', () => {
            this.emit('DataBase.CONNECTED');
        });
    }

    disconnect() {
        this.connection.close(() => {
            console.log(`MongoDB is disconnected on ${this.connectionString}`);
            this.emit('DataBase.DISCONNECTED');
        });
    }

    save(data) {
        return new Promise((resolve, reject) => {            
            const item = new this.model(data);
            this.model.collection.count()
                .then( itemsLength => {
                    item.id = `Tx${itemsLength + 1}`;                 
                })
                .catch(err => {
                    item.id = 1;
                    console.log('err', err)
                })
                .finally(() => {
                    item.save((err, elem) => {
                        if(err) reject(err);
                        resolve(elem);
                    });
                })
        });
    }

    load(data, maxDate, monthsBackward) {
        maxDate = this.normalizeMaxDate(maxDate);
        const minDate = this.getMinDate(maxDate, monthsBackward);
        const obj = {...data};
        obj.date = {
            $gte: new Date(minDate),
            $lte: new Date(maxDate)
        };
        return new Promise((resolve, reject) => {
            this.model.find(obj, (err, items) => {
                if(err) reject(err);
                resolve(items);
            }).sort({'date': -1});
        });
    }    

}

module.exports = DataBase;