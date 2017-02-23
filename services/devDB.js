var path = require('path');
var models = require(path.join(__dirname, '..')).app.get('models');
var sequelize = require(path.join(__dirname, '..', 'models')).sequelize;

module.exports = (done) => {
	if(process.env.NODE_ENV === 'production')
		return done && done();
	sequelize
		.truncate({cascade: true})
		.then(() => {
			models
				.Selecao
				.create({
					Year: 2014,
					Description: 'teste 1',
					IsOpen: false
				})
				.then();
			models
				.Selecao
				.create({
					Year: 2015,
					Description: 'teste 2',
					IsOpen: false
				})
				.then();
			models
				.Selecao
				.create({
					Year: 2016,
					Description: 'Seleção para o PET 2016',
					IsOpen: true
				})
				.then(function(selecao) {
					models
						.Etapa
						.create({
							SelecaoId: selecao.Id,
							Description: 'Entrega de cv e historico escolar, só 16 passam',
							CanUpdate: true
						})
						.then(function(result) {
							models
								.Candidato
								.create({
									Login: "candidato",
									Password: "candidato",
									Name: "Candidato dos Santos",
									Email: "candidato@candidato.com",
									SelecaoId: selecao.Id,
									EtapaId: result.Id
								})
								.then();
						});
					models
						.Etapa
						.create({
							SelecaoId: selecao.Id,
							Description: 'Dinamica de grupo e entrevista',
							CanUpdate: false
						})
						.then();
				});
			models
				.PETiano
				.create({Login: "pigpet", Password: "pigpet", Profile: 2});
			models
				.PETiano
				.create({
					Login: "dev",
					Password: "dev",
					Name: "Developer dos Santos",
					Balance: 10.05,
					Cpf: "37166666606",
					Email: "lcgm@cin.ufpe.br",
					Rg: "9284948-04",
					CellPhone: "999999999"
				})
				.then((result1) => {
					models
						.AgendaPoint
						.create({
							Title: 'Teste 1',
							Description: 'TESTTEEEEEEETESTTEEE a',
							PETianoId: result1.Id,
							Status: 1
						})
						.then();
					models
						.AgendaPoint
						.create({
							Title: 'Teste 2',
							Description: 'TESTTEEEEEEE b',
							PETianoId: result1.Id,
							Status: 1
						})
						.then();
					models
						.AgendaPoint
						.create({
							Title: 'Teste 3',
							Description: 'TESTTEEEEEEE c',
							PETianoId: result1.Id,
							Status: 1
						})
						.then();
					models
						.PETiano
						.create({
							Login: "dgmneto",
							Password: "dev",
							Name: "Divino Gervarsio de Menezes Neto",
							Balance: -3.05,
							Cpf: "37163975805",
							Email: "dgmn@cin.ufpe.br",
							Rg: "9284948-04",
							CellPhone: "998894338"
						})
						.then((result2) => {
							models
								.PETiano
								.create({
									Login: "hhhh",
									Password: "dev",
									Name: "Haack",
									Balance: -3.05,
									Cpf: "37163975805",
									Email: "haack@cin.ufpe.br",
									Rg: "9284948-04",
									CellPhone: "998894338",
									Profile: 4
								})
								.then((result3) => {
									models
										.RecordOfMeeting
										.create({
											Status: 2,
											AteiroId: result2.Id,
											PresidentId: result3.Id
										})
										.then((result4) => {
											models
												.AbsentOrLate
												.create({
													PETianoId: result1.Id,
													Type: 1,
													IsJustified: true,
													Reason: 'Médico',
													RecordOfMeetingId: result4.Id
												})
												.then();
											models
												.AbsentOrLate
												.create({
													PETianoId: result2.Id,
													Type: 2,
													IsJustified: false,
													Reason: 'Médico',
													RecordOfMeetingId: result4.Id
												})
												.then();
											models
												.AbsentOrLate
												.create({
													PETianoId: result3.Id,
													Type: 2,
													IsJustified: true,
													Reason: '',
													RecordOfMeetingId: result4.Id
												})
												.then();
											models
												.AgendaPoint
												.create({
													Title: 'Teste',
													Description: 'TESTTEEEEEEETESTTEEE\nEEEETESTTEEEEEEETESTTEEEEEEETESTTEEEEEEETESTTEEEEEEETESTTEEEEEEETESTTEEEEEEETESTTEEEEEEETESTTEEEEEEETESTTEEEEEEETESTTEEEEEEETESTTEEEEEEETESTTEEEEEEETESTTEEEEEEETESTTEEEEEEE a',
													RecordOfMeetingId: result4.Id,
													PETianoId: result3.Id,
													Status: 2
												})
												.then();
											models
												.AgendaPoint
												.create({
													Title: 'Teste',
													Description: 'TESTTEEEEEEE b',
													RecordOfMeetingId: result4.Id,
													PETianoId: result3.Id,
													Status: 3
												})
												.then();
											models
												.AgendaPoint
												.create({
													Title: 'Teste',
													Description: 'TESTTEEEEEEE c',
													RecordOfMeetingId: result4.Id,
													PETianoId: result3.Id,
													Status: 4
												})
												.then();
										})
								})
						});
				});
				return done && done();
		})
		.catch((err) => {
			console.log(err);
		});
}
