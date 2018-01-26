var db_insert = require('./src/js/db_insert.js')
var db_select = require('./src/js/db_select.js')
var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

var url = '';

// db_insert(data, url);

app.use(express.static(path.join(__dirname)));
app.set('view engine', 'jade')

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/download', function (req, res) {
    console.log(req.query);
    db_select(req.query.id, url, function (flag, data) {
        if (flag) {
            res.send({ "flag": "true", "data": data });
        }
        else {
            res.send({ "flag": "false", "data": data });
        }
    })
});

app.post('/upload', function (req, res) {

    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = 'false';

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '/uploads_conf');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function (field, file) {
        //fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    // log any errors that occur
    form.on('error', function (err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function () {

    });

    // parse the incoming request containing the form data
    form.parse(req, function (err, fields, files) {
        file_path = files["upload_file"].path;
        fs.readFile(files["upload_file"].path, 'utf8', function (err, data) {
            db_insert(fields["id"], data, url, function (flag) {
                fs.unlink(file_path);
                if (flag) {
                    res.end("{\"flag\":\"true\", \"data\":" + data + "}");
                }
                else {
                    res.end("{\"flag\":\"true\", data:\"\"}");
                }
            });

        });
    });

});

app.get('/output', function (req, res) {
    res.render('output',
        {
            "title": 'Presentation',
            "style": req.query.style,
            "content": req.query.content,
            "ratio": req.query.ratio,
            "trans": req.query.trans
        })
})

var server = app.listen(3000, function () {
    console.log('Server listening on port 3000');
});
