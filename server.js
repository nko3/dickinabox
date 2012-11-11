var streamer = require('./lib/streamer')
  , express = require('express')
  , app = express.createServer()
  , http = require('http')
  , url = require('url')
  , fs = require('fs');

app.use(express.favicon())
   .use(express.bodyParser())
   .use(express.staticCache())
   .use(express['static'](__dirname + '/assets'))
   .use(app.router)
   .use(express.errorHandler({dumpExceptions: true}))
   ;

app.set('view options', {layout: false});
app.register('.html', {compile: function (str, _) {
  return function (_) {
    return str;
  };
}});

app.listen(3000);

// le home
app.get('/', function (req, res) {
  res.render('home.html');
});

// le webcam
app.get('/record', function (req, res) {
  res.render('record.html');
});

// le random gif
app.get('/random', function (req, res) {
  var windows = require('./lib/windows')
    , keys = Object.keys(windows.storage)
    , random_key = _.random(0, keys.length);

  if (keys.length) {
    res.redirect('/v/' + keys[random_key]);
  } else {
    // TODO: better
    res.writeHead(404);
    res.end('There are no windows open at this moment!');
  }
});

// le window capture
app.post('/window/:id/capture', function (req, res) {
  streamer.capture(req, res);
});

// le view gif
app.get('/v/:id', function (req, res) {
  res.render('view.html');
});

// le streamed gif
app.get('/:id.gif', function (req, res) {
  streamer.stream(req.param('id'), req, res);
});
