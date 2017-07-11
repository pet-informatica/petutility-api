angular
	.module('Finance')
	.controller('financeController', function(Upload, PenaltyAPI, PaymentAPI, SpendingAPI, PigpetAPI, PocketAPI, UserService, PETianoService, $scope, $timeout) {

		$scope.payments = [];
		$scope.PETianosList = [];
		$scope.penalties = [];
		$scope.spending = {};

		var monthNames = {'1': 'Janeiro', '2': 'Fevereiro', '3': 'Março', '4': 'Abril', '5': 'Maio',
							'6': 'Junho', '7': 'Julho', '8': 'Agosto', '9': 'Setembro', '10': 'Outubro', '11': 'Novembro', '12': 'Dezembro'};
		var status = {'1': true, '2': true, '3': true};
		var instrumentValues = {'Transferência': 1, 'Dinheiro': 2, 'Crédito': 3};
		$scope.acceptedColor = 'green';
		$scope.pendingColor = 'yellow darken-1';
		$scope.refusedColor = 'red';

		$scope.checkIfHasPhoto = function(photo) {
			return !(angular.isUndefined(photo) || photo == null);
		}

		//screen filters and organizers

		$scope.selectStatus = function(type) {
			switch(type) {
				case 1:
					status[1] = !status[1];
					$scope.acceptedColor = (status[1] ? 'green' : 'grey');
					break;
				case 2:
					status[2] = !status[2];
					$scope.refusedColor = (status[2] ? 'red' : 'grey');
					break;
				case 3:
					status[3] = !status[3];
					$scope.pendingColor = (status[3] ? 'yellow darken-1' : 'grey');
					break;
			}
			$scope.filterPayments();
		}

		$scope.isValidePaymentStatus = function(status) {
			return (status != 1);
		}

		$scope.canAcceptPenalty = function(status) {
			return $scope.isPigpetAccount && (status == 2);
		}

		$scope.filterPayments = function() {
			$scope.payments = [];
			for(var i = 0; i < $scope.dataset.length; ++i) {
				var p = $scope.dataset[i];
				if(status[p.Status]) {
					p = filterSolePayment(p);
					$scope.payments.push(p);
				}
			}
		}

		var filterSolePayment = function(p) {
			switch(p.Status) {
				case 1:
					p.Icon = 'thumb_up';
					p.IconColor = 'green';
					break;
				case 2:
					p.Icon = 'thumb_down';
					p.IconColor = 'red';
					break;
				case 3:
					p.Icon = 'query_builder';
					p.IconColor = 'yellow darken-1';
					break;
			}
			switch(p.Type) {
				case 1:
					p.TypeText = 'Multa';
					break;
				case 2:
					p.TypeText = 'PigPET';
					break;
				case 3:
					p.TypeText = 'Crédito';
					break;
			}
			switch(p.Instrument) {
				case 1:
					p.InstrumentName = 'Transferência';
					break;
				case 2:
					p.InstrumentName = 'Dinheiro';
					break;
				case 3:
					p.InstrumentName = 'Crédito';
					break;
			}
			return p;
		}

		$scope.organizePenalties = function() {
			for(var index = 0; index < $scope.penalties.length; index+=1) {
				$scope.penalties[index] = $scope.organizeSolePenalty($scope.penalties[index]);
			}
		}

		PETianoService.getAllPETianos((err, data) => {
			if(err)
				return;
			$scope.PETianosList = data;
			$scope.organizePenalties();
		});

		$scope.organizeSolePenalty = function(p) {
			if(p.Status == 1) {
				p.StatusIcon = 'thumb_up';
				p.StatusIconColor = 'green';
			} else {
				p.StatusIcon = 'query_builder';
				p.StatusIconColor = 'yellow darken-1';
			}
			for(var petianoId in $scope.PETianosList) {
				if(petianoId == p.PETianoId) {
					p.PETianoName = $scope.PETianosList[petianoId].Name;
				}
			}
			return p;
		}

		$scope.organizeSpendings = function() {
			for(var index = 0; index < $scope.spendings.length; index += 1) {
				$scope.spendings[index] = $scope.organizeSoleSpending($scope.spendings[index]);
			}
		}

		$scope.organizeSoleSpending = function(s) {
			if(s.Status == 1) {
				s.StatusIcon = 'thumb_up';
				s.StatusIconColor = 'green';
			} else if(s.Status == 2) {
				s.StatusIcon = 'query_builder';
				s.StatusIconColor = 'yellow darken-1';
			} else {
				s.StatusIcon = 'thumb_down';
				s.StatusIconColor = 'red';
			}
			return s;
		}

		//on load functions

		var loadPayments = function(isPigPet) {
			$scope.getPayments();
		}

		var loadPenalties = function(isPigPet) {
			if(isPigPet)
				$scope.getAllPenalties();
			else
				$scope.getPenalties();
		}

		var loadPigPet = function() {
			$scope.getPigPetBalance();
		}

		PocketAPI.getPockets((err, data) => {
			if(err)
				$scope.errMsg = err.status + ' - ' + err.data.message;
			else {
				$scope.errMsg = null;
				$scope.pockets = (data.map(function(element) {
					element.MonthName = monthNames[element.Month];
					return element;
				}));
			}
		});

		SpendingAPI.getSpendings((err, data) => {
			if(err)
				$scope.errMsg = err.status + ' - ' + err.data.message;
			else {
				$scope.errMsg = null;
				$scope.spendings = data;
				$scope.organizeSpendings();
			}
		});

		//payment functions

		$scope.paymentToUpdate = {};

		var toDateInputValue = function(date) {
			return date.substring(0,10);
		}

		$scope.openUpdatePaymentModal = function(p) {
			p.Date = toDateInputValue(p.Date);
			$scope.paymentToUpdate = p;
			$('#updatePaymentModal').openModal();
		}

		$scope.refusePaymentModalTrigger = function(id) {
			$scope.setRefusingPaymentId(id);
			$('#refusePaymentModal').openModal();
		}

		$scope.refusingPaymentId = -1;

		$scope.setRefusingPaymentId = function(id) {
			$scope.refusingPaymentId = id;
		}

		var updatePaymentScope = function(payment) {
			for(var index = 0; index < $scope.payments.length; index += 1) {
				if($scope.payments[index].Id == payment.Id) {
					$scope.payments[index] = payment;
				}
			}
		}

		$scope.refusePayment = function(justification) {
			var pay = {
				Id: $scope.refusingPaymentId,
				RefusedJustification: justification,
				Status: 2
			}
			Upload.upload({
				url: '/api/payment/'+pay.Id,
				data: pay
			})
			.then(function(data) {
				var p = filterSolePayment(data.data);
				updatePaymentScope(p);
			}, function(err) {
				// console.log("error in update payment");
			}, function(evt) {
				// console.log("fazendo upload");
			});
		}

		$scope.getPayments = function() {
			PaymentAPI.getPayments((err, data) => {
				if(err){
					$scope.errMsg = err.status + ' - ' + err.data.message;
				} else {
					$scope.errMsg = null;
					$scope.dataset = data;
					$scope.filterPayments();
				}
			});
		};

		$scope.createPayment = function(payment) {
			var date = $('#paymentdate').val();
			date = date.split('/');
			if(date.length!==3) {
				// console.log("data invalida");
				return;
			}
			date.reverse();
			date = new Date(date);
			var pay = {
				Type: payment.type,
				Value: payment.value,
				Date: date,
				Status: 3,
				Notes: payment.notes,
				Instrument: payment.instrument,
				PETianoId: UserService.user.Id,
				Photo: payment.photo
			};
			Upload.upload({
				url: '/api/payment/',
				method: 'POST',
				data: pay
			})
			.then(function(data) {
				var p = filterSolePayment(data.data);
				$scope.payments.push(p);
			}, function(err) {
				// console.log(err);
			}, function(evt) {
				// // console.log("fazendo upload");
			});
		};

		$scope.acceptPayment = function(id) {
			var pay = {Id: id};
			PaymentAPI.acceptPayment(pay, function(done, data) {
				var p = filterSolePayment(data.payment);
				updatePaymentScope(data.payment);
				$scope.pigPetBalance = data.pigpet.Balance;
			}, function(err) {
				// console.log("error in acceptPayment");
			})
		}

		$scope.updatePayment = function(payment) {
			var date = $('#updatepaymentdate').val();
			date = date.split('/');
			if(date.length!==3) {
				// console.log("data invalida");
				return;
			}
			date.reverse();
			date = new Date(date);
			payment.Date = date;
			Upload.upload({
				url: '/api/payment/'+payment.Id,
				method: 'PUT',
				data: payment
			})
			.then(function(data) {
				updatePaymentScope(payment);
			}, function(err) {
				// console.log("error in create payment");
			}, function(evt) {
				// // console.log("fazendo upload");
			});
		}

		var deletePaymentFromScope = function(id) {
			for(var index = 0; index < $scope.payments.length; index += 1) {
				if($scope.payments[index].Id == id) {
					$scope.payments.splice(index, 1);
				}
			}
		}

		$scope.deletePayment = function(id) {
			var pay = {
				Id: id
			};
			PaymentAPI.deletePayment(pay, function(done) {
				deletePaymentFromScope(pay.Id);
			}, function(err) {
				// console.log("error in delete payment");
			});
		}

		//pigpet functions

		$scope.getPigPetBalance = function() {
			PigpetAPI.getPigPetBalance((err, data) => {
				if(err) {
					$scope.errMsg = err.status + ' - ' + err.data.message;
				} else {
					$scope.errMsg = null;
					$scope.pigPetBalance = (data.Balance);
				}
			});
		}

		$scope.updatePigPetBalance = function(value, justification) {
			var parameters = {
				pigpet: {
					Id: 1,
					Balance: value
				},
				reason: justification
			}
			PigpetAPI.updatePigPetBalance(parameters, function(err, data) {
				$scope.pigPetBalance = (data.Balance);
			}, function(err) {
				// console.log("error in update pigpet balance");
			});
		}

		//penalty functions

		$scope.getPenalties = function() {
			PenaltyAPI.getPenalties((err, data) => {
				if(err)
					$scope.errMsg = err.status + ' - ' + err.data.message;
				else {
					$scope.penalties = data;
					$scope.organizePenalties();
				}
			});
		}

		$scope.getAllPenalties = function() {
			PenaltyAPI.getAllPenalties((err, data) => {
				if(err)
					$scope.errMsg = err.status + ' - ' + err.data.message;
				else {
					$scope.penalties = data;
					$scope.organizePenalties();
				}
			});
		}

		var getEmailOfPETiano = function(id) {
			for(var petianoid in $scope.PETianosList) {
				if(petianoid == id) {
					return $scope.PETianosList[petianoid].Email;
				}
			}
		}

		$scope.createPenalty = function(value, date, justification, petianoid) {
			date = $('#penaltyDate').val();
			date = date.split('/');
			if(date.length!==3) {
				// console.log("data invalida");
				return;
			}
			date.reverse();
			date = new Date(date);
			var email = getEmailOfPETiano(petianoid);
			var parameters = {
				penalty: {
					Value: value,
					Date: date,
					Status: 2,
					PenaltyJustification: justification,
					PETianoId: petianoid
				},
				PETianoEmail: email
			};
			PenaltyAPI.createPenalty(parameters, function(done, data) {
				var p = $scope.organizeSolePenalty(data);
				$scope.penalties.push(p);
			}, function(err) {
				// console.log("error in createPenalty");
			})
		}

		$scope.penaltyToUpdate = {};

		$scope.openUpdatePenaltyModal = function(p) {
			$scope.penaltyToUpdate = p;
			$('#updatePenaltyModal').openModal();
		}

		var updatePenaltyScope = function(penalty) {
			for(var index = 0; index < $scope.penalties.length; index+=1) {
				if($scope.penalties[index].Id == penalty.Id) {
					penalty = $scope.organizeSolePenalty(penalty);
					$scope.penalties[index] = penalty;
				}
			}
		}

		var updatePenaltyIdScope = function(id) {
			for(var index = 0; index < $scope.penalties.length; index+=1) {
				if($scope.penalties[index].Id == id) {
					$scope.penalties[index].Status = 1;
					$scope.penalties[index] = $scope.organizeSolePenalty($scope.penalties[index]);
				}
			}
		}

		$scope.updatePenalty = function() {
			var penalty = $scope.penaltyToUpdate;
			date = $('#updatePenaltyDate').val();
			date = date.split('/');
			if(date.length!==3) {
				// console.log("data invalida");
				return;
			}
			date.reverse();
			date = new Date(date);
			penalty.Date = date;
			PenaltyAPI.updatePenalty(penalty, function(err, data) {
				updatePenaltyScope(data);
			}, function(err) {
				// // console.log("error in update penalty");
			})
		}

		$scope.changePenaltyStatus = function(id) {
			var penalty = {
				Id: id,
				Status: 1
			}
			PenaltyAPI.changePenaltyStatus(penalty, function(err, data) {
				updatePenaltyIdScope(id);
			}, function(err) {
				// // console.log("error in change penalty status");
			})
		}

		var deletePenaltyFromScope = function(p) {
			for(var index = 0; index < $scope.penalties.length; index+=1) {
				if($scope.penalties[index].Id == p.Id) {
					$scope.penalties.splice(index, 1);
				}
			}
		}

		$scope.deletePenalty = function(id) {
			var penalty = {
				Id: id
			};
			PenaltyAPI.deletePenalty(penalty, function() {
				deletePenaltyFromScope(penalty);
			}, function(err) {
				// // console.log("error in delete penalty");
			})
		}

		//spending functions

		$scope.createSpending = function(value, date, description) {
			date = $('#spendingDate').val();
			date = date.split('/');
			if(date.length!==3) {
				// // console.log("data invalida");
				return;
			}
			date.reverse();
			date = new Date(date);
			var status = ($scope.isPigpetAccount ? 1 : 2);
			var spending = {
				Description: description,
				Value: value,
				Date: date,
				Status: status
			}
			SpendingAPI.createSpending(spending, function(done, data) {
				var s = $scope.organizeSoleSpending(data);
				$scope.spendings.push(s);
				if(status == 1) {
					$scope.pigPetBalance = parseFloat($scope.pigPetBalance) - parseFloat(value);;
				}
			}, function(err) {
				// console.log("error in create spending");
			})
		};

		var deleteSpendingFromScope = function(spending) {
			for(var index = 0; index < $scope.spendings.length; index+=1) {
				if($scope.spendings[index].Id == spending.Id) {
					$scope.spendings.splice(index, 1);
				}
			}
		}

		$scope.deleteSpending = function(id, value, status) {
			var spending = {
				Value: value,
				Status: status,
				Id: id
			}
			SpendingAPI.deleteSpending(spending, function() {
				deleteSpendingFromScope(spending);
				if(spending.Status == 1) {
					$scope.pigPetBalance = parseFloat($scope.pigPetBalance) + parseFloat(value);
				}
			}, function(err) {
				 // console.log("error in delete spending");
			})
		}

		$scope.acceptSpending = function(id, value) {
			var spending = {
				Id: id,
				Value: value
			}
			SpendingAPI.acceptSpending(spending, function(done, data) {
				acceptSpendingScope(id);
				$scope.pigPetBalance = data.pigpet.Balance;
			}, function(err) {
				// console.log("error in accept spending");
			});
		};

		var acceptSpendingScope = function(id) {
			for(var index = 0; index < $scope.spendings.length; index+=1) {
				if($scope.spendings[index].Id == id) {
					$scope.spendings[index].Status = 1;
					$scope.spendings[index] = $scope.organizeSoleSpending($scope.spendings[index]);
				}
			}
		}

		var updateSpendingScope = function(spending) {
			for(var index = 0; index < $scope.spendings.length; index+=1) {
				if($scope.spendings[index].Id == spending.Id) {
					spending = $scope.organizeSoleSpending(spending);
					$scope.spendings[index] = spending;
				}
			}
		}

		$scope.spendingToUpdateId = -1;

		$scope.openUpdateSpendingModal = function(id, spending) {
			$scope.spendingToUpdateId = id;
			$('#updateSpendingModal').openModal();
		}

		$scope.updateSpending = function(value, date, description) {
			date = $('#updateSpendingDate').val();
			date = date.split('/');
			if(date.length!==3) {
				// console.log("data invalida");
				return;
			}
			date.reverse();
			date = new Date(date);
			var spending = {
				Id: $scope.spendingToUpdate,
				Description: description,
				Value: value,
				Date: date
			}
			SpendingAPI.updateSpending(spending, function(err, data) {
				data.Status = 2;
				updateSpendingScope(data);
			}, function(err) {
				// console.log("error in updateSpending");
			})
		}

		//pocket functions

		$scope.editPocketId = -1;
		$scope.pocket = {};

		$scope.editPocketOpenModal = function(pocket) {
			$scope.editPocketId = pocket.Id;
			$scope.pocket = pocket;
			$('#editPocketModal').openModal();
		}

		var makeValidDate = function(date) {
			date = date.substring(6,10) + "-" + date.substring(3,5) + "-" + date.substring(0,2);
			return new Date(date);
		}

		$scope.createPocket = function(month, year, date) {
			date = $('#pocketDate').val();
			date = date.split('/');
			if(date.length!==3) {
				// console.log("data invalida");
				return;
			}
			date.reverse();
			date = new Date(date);
			var pocket = {
				Month: month,
				Year: year,
				Date: date
			}
			PocketAPI.createPocket(pocket, function(done, data) {
				data.MonthName = monthNames[data.Month];
				$scope.pockets.push(data);
			}, function(err) {
				// console.log("error in create pocket");
			})
		}

		var updatePocketScope = function(pocket) {
			for(var index = 0; index < $scope.pockets.length; index += 1) {
				if($scope.pockets[index].Id == pocket.Id) {
					pocket.MonthName = monthNames[pocket.Month];
					$scope.pockets[index] = pocket;
				}
			}
		}

		$scope.updatePocket = function(month, year, date) {
			date = $('#updatePocketDate').val();
			date = date.split('/');
			if(date.length!==3) {
				// console.log("data invalida");
				return;
			}
			date.reverse();
			date = new Date(date);
			var pocket = {
				Id: $scope.editPocketId,
				Month: month,
				Year: year,
				Date: date
			}
			PocketAPI.updatePocket(pocket, function(err, data) {
				updatePocketScope(data);
			}, function(err) {
				// console.log("error in update pocket");
			})
		}

		var deletePocketFromScope = function(p) {
			for(var index = 0; index < $scope.pockets.length; index+=1) {
				if($scope.pockets[index].Id == p.Id) {
					$scope.pockets.splice(index, 1);
				}
			}
		}

		$scope.deletePocket = function(id) {
			var pocket = {
				Id: id
			}
			PocketAPI.deletePocket(pocket, function() {
				deletePocketFromScope(pocket);
			}, function(err) {
				// console.log("error in delete pocket");
			})
		}

		$timeout(() => {
			$('ul.tabs').tabs();
			$scope.isPigpetAccount = (UserService.user.Profile == 2);
			loadPenalties($scope.isPigpetAccount);
			loadPayments($scope.isPigpetAccount);
			loadPigPet();
			$('select').material_select();
		}, 1000);
	}
);
