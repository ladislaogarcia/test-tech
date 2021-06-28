var express = require('express');
var router = express.Router();

function getDataFromRequest(req) {
    const { amount, date, type, category, description } = req.body;
    return {
        amount,
        date,
        type,
        category,
        description
    };
}

/* GET All Items. */
router.get('/', function (req, res) {
    var db = req.app.database;
    db.load()
        .then(items => {
            res.send(items);
        })
        .catch(err => {
            throw err;
        });
});

/* GET latest 10 Items. */
router.get('/latest/:category?', function (req, res) {
    var params = req.params;
    var category = params.category || false;
    var db = req.app.database;
    db.getLatest(category, 10)
        .then(items => {
            res.send(items);
        })
        .catch(err => {
            throw err;
        });
});

/* GET Items by month. */
router.get('/monthly/:year/:month/:category?', function (req, res) {
    var params = req.params;
    var category = params.category || false;
    var db = req.app.database;
    db.getMonthly(params.month, params.year, category)
        .then(items => {
            res.send(items);
        })
        .catch(err => {
            throw err;
        });
});

/* POST Add Item */
router.post('/add', (req, res) => {
    var db = req.app.database;
    const obj = getDataFromRequest(req);
    db.save(obj)
        .then(item => {
            var response = {
                saved: true,
                item
            };
            res.send(response);
        })
        .catch(error => {
            var response = {
                saved: false,
                item: obj,
                error
            };
            res.send(response);
        });
});

/* POST Remove Item */
router.post('/remove', (req, res) => {
    var db = req.app.database;
    const item = getDataFromRequest(req);
    db.remove(item)
        .then(data => {
            var response = {
                removed: !!data.deletedCount,
                item
            };
            res.send(response);
        })
        .catch(err => {
            res.send(`ERROR: ${err}`);
        });
});

module.exports = router;
