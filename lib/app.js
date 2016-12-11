'use strict';

const path = require('path'),
    express = require('express'),
    exphbs = require('express-handlebars'),
    marked = require('marked'),
    nconf = require('nconf'),
    bodyParser = require('body-parser');

const contentService = require('./modules/services/contentService'),
    userService = require('./modules/services/userService');

var port = process.env['PORT'] || 4004;

var app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use('/public', express.static('lib/public'))
app.use(bodyParser.json())


// used for domain forwarding (e.g. www.lawrenceripsher.com -> www.simplcv.com/user/lawrenceripsher)
app.get('/', function (req, res) {
    let user = userService.getUserByDomain(req.headers.host);

    if (user) {
        contentService.get(user.username, (err, result) => {
            result.user = user.username;
            result.editMode = req.query.edit;

            // for discoverability of new css themes, show the switcher only on the showcase site
            let homepage = req.headers.host.indexOf("localhost") > -1 ? true : null;

            _processResponse(req, res, user, result, homepage);
        })
    }
    else {
        return res.status(404).send();        
    }
});

// e.g. www.simplcv.com/user/lawrenceripsher
app.get('/user/:user', function (req, res) {
    let user = userService.getUserByUsername(req.params.user);

    if (user) {
        contentService.get(req.params.user, (err, result) => {
            result.user = req.params.user;
            result.editMode = req.query.edit;

            _processResponse(req, res, user, result);
        });
    }
    else {
        return res.status(404).send();        
    }
});

// save content e.g. POST www.simplcv.com/user/lawrenceripsher/title
app.post('/user/:user/:type', function (req, res) {
    if (req.body.content) {

        // remove leading quotes and whitespace
        let content = req.body.content.replace(/(^\s*"|"\s*$)/g, '');

        contentService.save(req.params.user, req.params.type, content);

        return res.status(201).send({ result: 'ok' });
    }
    else {
        return res.status(400).send();
    }
})

app.listen(port, function () {
    console.log('Listening on port ' + port);
})


function _processResponse(req, res, user, result, homepage) {
    result.homepage = homepage;
    
    // check if in edit mode, and if so, password is inccorrect
    if (req.query.edit && req.query.edit != user.password) {
        return res.status(401).send("incorrect password");
    }

    // if not in edit mode, transform content to html
    if (!req.query.edit) {
        result.content =  marked(result.content); 
        result.links =  marked(result.links); 
        result.footer = marked(result.footer);
    }
    else {
        result.content =  result.content.replace(/\n/g,'<br>'); 
        result.links =  result.links.replace(/\n/g,'<br>'); 
        result.footer = result.footer.replace(/\n/g,'<br>');
        
    }

    // show page
    return res.render('index', result);            
}
