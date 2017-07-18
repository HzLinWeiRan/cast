// var WebSocketServer = require('ws').Server;
var UUID = require('uuid');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
var expressWs = require('express-ws')(app);


app.use(cookieParser());
app.use(session({
	genid: function (req) {
		return UUID() // use UUIDs for session IDs
	},
	secret: "xxxxx",
	key: 'sessionid',
	cookie: { secure: false },
	saveUninitialized: true,
	resave: true
}));


app.use(bodyParser.urlencoded({ extended: false }))


app.use('/static', express.static('./static'));


var aWss = expressWs.getWss('/');

app.get('/getUser', function (req, res, next) {
	var result = {
		isSuccess: true
	};

	req.session.user && (result.name = req.session.user);
	res.send(result);
});

app.post('/setUser', function (req, res, next) {
	req.session.user = req.body.user;
	req.session.save();
	res.send({
		isSuccess: true
	});
});
app.get('/', function (req, res, next) {
	req.session.uid || (req.session.uid = UUID());
	req.session.save();
	res.sendFile(__dirname + '/static/index.html');
});

app.ws('/', function (ws, req) {
	if (req.session.user) {
		ws.user = req.session.user;
		ws.uid = req.session.uid;
		ws.sessionID = req.sessionID;
		ws.on('message', function (msg) {
			aWss.clients.forEach(function (client) {
				client.send(JSON.stringify({
					// uid: client.uid,
					isMySelf: client.sessionID === req.sessionID,
					user: req.session.user,
					msg: msg
				}));
			})
		})
	} else {
		ws.send('未登录');
	}
})

app.listen(3000);
/*var wss = new WebSocketServer({'port': 9998});
wss.on('connection', function(ws) {
	console.log('client connected');
	ws.on('message', function(message){
		console.log(message);
		ws.send(message + 1);
	})
});*/

