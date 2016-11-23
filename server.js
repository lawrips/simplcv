'use strict';

const path = require('path'),
  fs = require('fs'),
  express = require('express'),
  exphbs  = require('express-handlebars'),
  marked = require('marked');

var port = process.env['PORT'] || 4004; 

var app = express()

app.engine('handlebars', exphbs({defaultLayout: path.join(__dirname, 'lib/views/layouts/main')}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'lib/views'));

app.use('/public', express.static('lib/public'))

app.get('/', function (req, res) {
  res.render('index', {
      content: marked(fs.readFileSync('content/content.md', 'utf8')),
      header: marked(fs.readFileSync('content/header.md', 'utf8')),
      footer: marked(fs.readFileSync('content/footer.md', 'utf8')),
    })
})

app.listen(port, function () {
  console.log('Listening on port ' + port);
})