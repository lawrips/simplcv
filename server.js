'use strict';

const path = require('path'),
  fs = require('fs'),
  express = require('express'),
  exphbs  = require('express-handlebars'),
  marked = require('marked'),
  bodyParser = require('body-parser');

var port = process.env['PORT'] || 4004; 

var app = express()

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'lib/views'));

app.use('/public', express.static('lib/public'))
app.use(bodyParser.json())

app.get('/', function (req, res) {
  return res.render('index', {
      content: req.query.edit == 'true' ? fs.readFileSync('content/content.md', 'utf8') : marked(fs.readFileSync('content/content.md', 'utf8')),
      header: req.query.edit == 'true' ? fs.readFileSync('content/links.md', 'utf8') : marked(fs.readFileSync('content/links.md', 'utf8')),
      footer: marked(fs.readFileSync('content/footer.md', 'utf8')),
      title: fs.readFileSync('content/title.md', 'utf8'),
      editMode: req.query.edit
    })
})

app.post('/save/:type', function (req, res) {
    if (req.body.content) {
      
      // remove leading quotes and whitespace
      let content = req.body.content.replace(/(^\s*"|"\s*$)/g, '');

      fs.writeFileSync('content/'+ req.params.type + '.md', content);
      return res.status(201).send({result: 'ok'});
    }
    else {
      return res.status(400).send();      
    }
})

app.listen(port, function () {
  console.log('Listening on port ' + port);
})