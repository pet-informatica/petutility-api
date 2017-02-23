// dependecies
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var compression = require('compression');
var htmlPdf = require('html-pdf');

// express
var app = module.exports.app = express();
app.use(compression());
app.set('models', require(path.join(__dirname, 'models')));
app.set('recordOfMeetingRender', require('pug').compileFile(path.join(__dirname, 'printViews', 'recordOfMeeting.pug')));
if(process.env.EMAIL_API && process.env.EMAIL_DOMAIN)
	app
		.set('mailTransporter', require('nodemailer').createTransport(require('nodemailer-mailgun-transport')({auth:{api_key:process.env.EMAIL_API,domain:process.env.EMAIL_DOMAIN}})));
app.use(bodyParser.urlencoded( { extended: true } ));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// routes
var authenticationService = require(path.join(__dirname, 'services', 'petianoAuthentication.js'));

app.use('/public', express.static(path.join(__dirname, 'public', 'bin')));
app.use('/public/templates', express.static(path.join(__dirname, 'public', 'templates')));
app.use('/font', express.static(path.join(__dirname, 'public', 'font')));
app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'img', 'logo.png')));
app.use('/api/petiano', authenticationService, require(path.join(__dirname, 'routes/petiano')));
app.use('/api/candidato', require(path.join(__dirname, 'routes/candidato')));
app.use('/api/selecao', require(path.join(__dirname, 'routes/selecao')));
app.use('/api/recordOfMeeting', authenticationService, require(path.join(__dirname, 'routes/recordOfMeeting')));
app.use('/api/petiano', authenticationService, require(path.join(__dirname, 'routes/petiano')));
app.use('/api/fpass', require(path.join(__dirname, 'routes/fpass')));
app.use('/api/calendar', authenticationService, require(path.join(__dirname, 'routes/calendar')));
app.use('/api/recordOfMeeting', authenticationService, require(path.join(__dirname, 'routes/recordOfMeeting')));
app.use('/api/payment', authenticationService, require(path.join(__dirname, 'routes/payment')));
app.use('/api/pocket', authenticationService, require(path.join(__dirname, 'routes/pocket')));
app.use('/api/spending', authenticationService, require(path.join(__dirname, 'routes/spending')));
app.use('/api/pigpet', authenticationService, require(path.join(__dirname, 'routes/pigpet')));
app.use('/api/agendaPoint', authenticationService, require(path.join(__dirname, 'routes', 'agendaPoint')));
app.use('/api/absentOrLate', authenticationService, require(path.join(__dirname, 'routes', 'absentOrLate')));
app.use('/api/penalty', authenticationService, require(path.join(__dirname, 'routes/penalty')));
app.use('/api/ideas', authenticationService, require(path.join(__dirname, 'routes/ideas')));

// open route match
app.get('/', (req, res) =>
{
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('*', (req, res) =>
{
	res.redirect('/');
});

// server
app
	.get('models')
	.sequelize
	.sync()
	.then(function() {
		require(path.join(__dirname, 'services', 'devDB.js'))(() => {
			app
				.get('models')
				.PigPET
				.findById(1)
				.then((data) => {
					if(!data)
						app
							.get('models')
							.PigPET
							.create({
								Balance: 0.0
							});
				});
			app.listen(process.env.PORT);
			console.log("app listening at port", process.env.PORT);
			return;
		});
		return;
	})
	.catch(function(error) {
		console.log(error);
	});
