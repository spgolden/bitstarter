var express = require('express');
var fs = require('fs');
var app = express();
app.use(express.logger());

app.get('/', function(request, response) {
    //read from the file
    var infile = "index.html"
    var buf = fs.readFileSync(infile);
    var contents = buf.toString();
    response.send(contents);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});