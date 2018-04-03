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
app.set('genPass', () => {
	let newPass = "";
	const alphabet = "AB8C70DEF1GHI62JKLM3NO5PQRS4TUVWXYZabcd9fghijklmnopqrstuvwxyz";
	for (let i = 0; i < 8; ++i) {
		let temp = Math.floor((Math.random() * 100));
		while (temp >= alphabet.length)
			temp >>= 1;
		if (typeof alphabet[temp] === undefined)
			temp = 44;
		newPass += alphabet[temp];
	}
	return newPass;
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors({ origin: process.env.FRONT_URL, credentials: true }));

// routes
const authenticationService = require(path.join(__dirname, 'services', 'petianoAuthentication.js'));

app.use('/api/authentication', require(path.join(__dirname, 'routes/authentication')));
app.use('/api/ideas', authenticationService, require(path.join(__dirname, 'routes/ideas')));
app.use('/api/petianos', authenticationService, require(path.join(__dirname, 'routes/petianos')));
app.use('/api/agendaPoint', authenticationService, require(path.join(__dirname, 'routes', 'agendaPoint')));
app.use('/api/absentOrLate', authenticationService, require(path.join(__dirname, 'routes', 'absentOrLate')));
app.use('/api/recordOfMeeting', authenticationService, require(path.join(__dirname, 'routes/recordOfMeeting')));
// app.use('/api/events', authenticationService, require(path.join(__dirname, 'routes/events')));
// app.use('/api/activities', authenticationService, require(path.join(__dirname, 'routes/activities')));

app.use('*', (req, res) => res.redirect(process.env.FRONT_URL));

app.get('models').sequelize
	.sync()
	.then(() => {
		require(path.join(__dirname, 'services', 'devDB.js'))(() => {
			app.get('models').PETiano.findOne({ Email: "admin@petutility.com"}).then(data => {
				if (!data) {
					app.get('models').PETiano.create({
						Email: "admin@petutility.com",
						Password: "dev",
						Name: "Developer dos Santos",
						Cpf: "37166666606",
						Rg: "9284948-04",
						CellPhone: "999999999",
						Profile: 3
					}).then(result => console.log('admin created'));
				}
			})
			app.listen(process.env.PORT);
			console.log("app listening at port", process.env.PORT);
		});
	})
	.catch(error => console.log(error));
