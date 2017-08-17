const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const htmlPdf = require('html-pdf');
const nodemailer = require('nodemailer');
const mailgun = require('nodemailer-mailgun-transport');
const cors = require('cors');

const app = module.exports.app = express();

app.set('models', require(path.join(__dirname, 'models')));
app.set('recordOfMeetingRender', require('pug').compileFile(path.join(__dirname, 'printViews', 'recordOfMeeting.pug')));
if (process.env.EMAIL_API && process.env.EMAIL_DOMAIN)
	app.set('mailTransporter', nodemailer.createTransport(mailgun({ auth: { api_key: process.env.EMAIL_API, domain: process.env.EMAIL_DOMAIN } })));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors({
	origin: process.env.FRONT_URL,
	credentials: true
}));

// routes
const authenticationService = require(path.join(__dirname, 'services', 'petianoAuthentication.js'));

// app.use('/api/candidato', require(path.join(__dirname, 'routes/candidato')));
// app.use('/api/selecao', require(path.join(__dirname, 'routes/selecao')));
app.use('/api/authentication', require(path.join(__dirname, 'routes/login')));
app.use('/api/petiano', authenticationService, require(path.join(__dirname, 'routes/petiano')));
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

app.use('*', (req, res) => res.redirect(process.env.FRONT_URL));

app.get('models').sequelize.sync().then(() => {
	require(path.join(__dirname, 'services', 'devDB.js'))(() => {
		app.get('models').PigPET.findById(1).then(data => {
			if (!data)
				app.get('models').PigPET.create({ Balance: 0.0 });
		});
		app.listen(process.env.PORT);
		console.log("app listening at port", process.env.PORT);
	});
})
.catch(error => {
	console.log(error);
});
