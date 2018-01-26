const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');

function insert(colle, id, data, callback) {
    colle.find({"id": id}).toArray(function (err, items) {
        if (items.length == 0) {
            insert_data = {"id":id, "style":data};
            colle.insertOne(insert_data, function (err, result) {
                assert.equal(err, null);
                assert.equal(1, result.result.n);
                assert.equal(1, result.ops.length);
                console.log("Inserted 1 data into the collection");
                return callback(true);
            });
        }
        else{
            callback(false);
        }
    });
}

function insertData(id, data, db_url, callback) {
    mongoClient.connect(db_url, function (err, client) {
        assert.equal(null, err);

        const db = client.db("topresentdb");
        const style = db.collection('style');

        return insert(style, id, data, callback);

    });
}

module.exports = insertData;