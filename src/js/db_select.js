const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');

function select(colle, id, callback) {
    colle.find({"id": id}).toArray(function (err, items) {
        if (items.length != 0) {
            return callback(true, items[0]);
        }
        else{
            return callback(false, "");
        }
    });
}

function selectData(id, db_url, callback) {
    mongoClient.connect(db_url, function (err, client) {
        assert.equal(null, err);

        const db = client.db("topresentdb");
        const style = db.collection('style');

        return select(style, id, callback);

    });
}

module.exports = selectData;