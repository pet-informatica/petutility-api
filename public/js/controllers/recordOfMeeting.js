angular
	.module('RecordOfMeeting')
	.controller('RecordOfMeetingController',
		function($scope, $window, $timeout, RecordOfMeetingAPI, AgendaPointAPI, AbsentOrLateAPI, PETianoService) {
			$scope.canOpen = false;
			$scope.searchYears = Array.apply(null, Array(100)).map(function (_, i) {return ((new Date()).getFullYear() - i);});
			$scope.PETianosList = {};
			$scope.recordOfMeeting = {};
			$scope.UsersAgendaPoints = [];

			$scope.init = function() {
				PETianoService.getAllPETianos((err, data) => {
					if (err) return;
					$scope.PETianosList = data;
				});
				RecordOfMeetingAPI.query((res) => {
					if (res.length) {
						var check = true;
						for (var i = 0; i < res.length; ++i) {
							res[i].Date = new Date(res[i].Date);
							if (res[i].Status === 1)
								check = false;
						}
						$scope.canOpen = check;
						$scope.recordsFound = res;
						RecordOfMeetingAPI.get({recordOfMeetingId: res[0].Id}, (record) => {
							record.Date = new Date(record.Date);
							$scope.recordOfMeeting = record;
							$timeout(() => {
								$('.collapsible').collapsible({});
								$('select').material_select();
								$('.tooltipped').tooltip();
							}, 500, false);
						});
					}
				});
				AgendaPointAPI.getAgendaPoints((err, result) => {
					if (err) return;
					$scope.UsersAgendaPoints = result;
				});
			};
			$scope.init();

			$scope.searchRecordOfMeeting = () => {
				var nYear = $('#searchYearSelect').val();
				var pYear = $scope.selectedYear;
				$scope.selectedYear = nYear;
				var pFounds = $scope.recordsFound;
				$scope.recordsFound = [];
				RecordOfMeetingAPI.get({year: nYear}, (data) => {
					for(var i = 0; i < data.length; ++i)
						data[i].Date = new Date(data[i].Date);
					$scope.recordsFound = data;
				}, (err) => {
					$scope.recordsFound = pFounds;
					$scope.selectedYear = pYear;
				});
			};

			$scope.deleteAgendaPoint = (agendaPoint) => {
				var t = {};
				t.idx = -1;
				t.agendaPoint = agendaPoint;
				for(var i = 0; i < $scope.recordOfMeeting.AgendaPoints.length; ++i) {
					if($scope.recordOfMeeting.AgendaPoints[i].Id == t.agendaPoint.Id)	{
						t.idx = i;
						break;
					}
				}
				if (t.idx === -1) return;
				$scope.toDeleteAgendaPoint = t;
				$('#deleteAgendaPointModal').openModal();
				$('#deleteModalButton').focus();
			};

			$scope.confirmDeleteAgendaPoint = function() {
				$('#deleteAgendaPointModal').closeModal();
				var t = $scope.toDeleteAgendaPoint;
				$scope.recordOfMeeting.AgendaPoints.splice(t.idx, 1);
				AgendaPointAPI.deleteAgendaPoint(t.agendaPoint.Id, (err, data) => {
					if(!err) return;
					$scope.recordOfMeeting.AgendaPoints.splice(idx, 0, t.agendaPoint);
				});
			};

			$scope.addAgendaPoint = function() {
				Materialize.updateTextFields();
				$('#addAgendaPointModal').openModal();
				$('#toAddTitle').focus();
			};

			$scope.confirmAddAgendaPoint = function() {
				var agendaPoint = {};
				$('#addAgendaPointModal').closeModal();
				agendaPoint.Title = $scope.toAddAgendaPoint.Title;
				agendaPoint.Description = $scope.toAddAgendaPoint.Description;
				agendaPoint.Status = 4; //just added
				agendaPoint.PETianoId = $scope.recordOfMeeting.Ateiro.Id;
				agendaPoint.RecordOfMeetingId = $scope.recordOfMeeting.Id;
				var idx = $scope.recordOfMeeting.AgendaPoints.length;
				$scope.recordOfMeeting.AgendaPoints.push(agendaPoint);
				AgendaPointAPI.addAgendaPoint(agendaPoint, (err, data) => {
					if (err) {
						$scope.recordOfMeeting.AgendaPoints.splice(idx, 1);
					} else {
						agendaPoint.Id = data.Id;
						$scope.toAddAgendaPoint = {};
						$('.tooltipped').tooltip();
					}
				});
			};

			$scope.editAteiroAndPresident = () => {
				$('#petianosModal').openModal();
			};

			$scope.confirmEditeAteiroAndPresident = () => {
				var prevAteiro = $scope.recordOfMeeting.AteiroId;
				var prevPresident = $scope.recordOfMeeting.PresidentId;
				$('#petianosModal').closeModal();
				$scope.recordOfMeeting.AteiroId = $('#ateiroSelectDropdown').val();
				$scope.recordOfMeeting.Ateiro = $scope.PETianosList[$scope.recordOfMeeting.AteiroId];
				$scope.recordOfMeeting.PresidentId = $('#presidentSelectDropdown').val();
				$scope.recordOfMeeting.President = $scope.PETianosList[$scope.recordOfMeeting.PresidentId];
				RecordOfMeetingAPI.update({recordOfMeetingId: $scope.recordOfMeeting.Id}, {
					AteiroId: $scope.recordOfMeeting.AteiroId,
					PresidentId: $scope.recordOfMeeting.PresidentId
				}, (err, data) => {
					if (err) {
						$scope.recordOfMeeting.AteiroId = prevAteiro;
						$scope.recordOfMeeting.Ateiro = $scope.PETianosList[prevAteiro];
						$scope.recordOfMeeting.PresidentId = prevPresident;
						$scope.recordOfMeeting.President = $scope.PETianosList[prevPresident];
					}
				});
			};

			$scope.editAgendaPoint = (agendaPoint) => {
				$scope.editingAgendaPoint = agendaPoint;
				if(!agendaPoint.ServerTitle)
					agendaPoint.ServerTitle = agendaPoint.Title;
				if(!agendaPoint.ServerDescription)
					agendaPoint.ServerDescription = agendaPoint.Description;
				$('#editAgendaPointModal').openModal();
				$timeout(() => {Materialize.updateTextFields();}, 0);
				$('#editingDescription').focus();
			};

			$scope.confirmEditAgendaPoint = () => {
				$('#editAgendaPointModal').closeModal();
				var agendaPoint = $scope.editingAgendaPoint;
				if (agendaPoint.Title != agendaPoint.ServerTitle ||
						agendaPoint.Description != agendaPoint.ServerDescription) {
					var tTitle = agendaPoint.ServerTitle;
					var tDescription = agendaPoint.ServerDescription;
					agendaPoint.ServerTitle = agendaPoint.Title;
					agendaPoint.ServerDescription = agendaPoint.Description;
					AgendaPointAPI.updateAgendaPoint(agendaPoint, (err, data) => {
						if (err) {
							agendaPoint.ServerTitle = tTitle;
							agendaPoint.ServerDescription = tDescription;
							return;
						}
						agendaPoint.Title = agendaPoint.ServerTitle = data.Title;
						agendaPoint.Description = agendaPoint.ServerDescription = data.Description;
					});
				}
			};

			$scope.desafixarAgendaPoint = (agendaPoint) => {
				$('.tooltipped').tooltip('remove');
				AgendaPointAPI.changeStatus(agendaPoint, 3, (err, data) => {
					if(!err) {
						agendaPoint.Status = 3; // outstanding;
						$timeout(()=>{$('.tooltipped').tooltip();},0,true);
					}
				});
			};

			$scope.fixarAgendaPoint = (agendaPoint) => {
				$('.tooltipped').tooltip('remove');
				AgendaPointAPI.changeStatus(agendaPoint, 2, (err, data) => {
					if(!err) {
						agendaPoint.Status = 2;
						$timeout(()=>{$('.tooltipped').tooltip();},0,true);
					}
				});
			};

			$scope.saveRecordOfMeeting = () => {
				$('#recordOfMeetingSavingModal').openModal();
			};

			$scope.confirmSaveRecordOfMeeting = () => {
				$('#recordOfMeetingSavingModal').closeModal();
				RecordOfMeetingAPI.close({recordOfMeetingId: $scope.recordOfMeeting.Id}, {}, (data) => {
					$scope.recordOfMeeting.Status = 2;
					$scope.canOpen = true;
				}, (err) => {
					$scope.recordOfMeeting.Status = 1;
					$scope.canOpen = false;
				});
			};

			$scope.deleteAbsentOrLate = (absentOrLate) => {
				var t = {};
				t.absentOrLate = absentOrLate;
				t.idx1 = -1;
				for(var i = 0; i < $scope.recordOfMeeting.AbsentsOrLates.length; ++i) {
					if($scope.recordOfMeeting.AbsentsOrLates[i].Id == absentOrLate.Id) {
						t.idx1 = i;
						break;
					}
				}
				if (t.idx1 == -1) return;
				$scope.deletingAbsentOrLateModal = t;
				$('#deletingAbsentOrLateModal').openModal();
				$('#deletingAbsentOrLateModalButton').focus();
			};

			$scope.confirmDeleteAbsentOrLate = () => {
				$('#deletingAbsentOrLateModal').closeModal();
				var t = $scope.deletingAbsentOrLateModal;
				$scope.recordOfMeeting.AbsentsOrLates.splice(t.idx1, 1);
				$('.tooltipped').tooltip('remove');
				AbsentOrLateAPI.delete({id: t.absentOrLate.Id}, function() {
					$('.tooltipped').tooltip();
				}, function(err) {
					$scope.recordOfMeeting.AbsentsOrLates.splice(t.idx1, 0, t.absentOrLate);
					$timeout(()=>{$('.tooltipped').tooltip()}, 0, false);
				});
			};

			$scope.addAbsentOrLate = (type) => {
				if($scope.addingAbsentOrLate)
					$scope.addingAbsentOrLate.Type = type;
				else
					$scope.addingAbsentOrLate = {Type: type};
				Materialize.updateTextFields;
				$('#addAbsentOrLateModal').openModal();
			};

			$scope.confirmAddAbsentOrLate = () => {
				$('#addAbsentOrLateModal').closeModal();
				var t = $scope.addingAbsentOrLate;
				var u = $scope.recordOfMeeting.AbsentsOrLates;
				t.PETianoId = $('#absentOrLateSelectDropdown').val();
				if(!t.PETianoId) return;
				t.inval = -1;
				for(var i = 0; i < u.length; ++i)
					if (u[i].PETianoId == t.PETianoId) {
						t.inval = i;
						t.invalPT = u[i];
						u.splice(i, 1);
						break;
					}
				t.idx = u.length;
				$('.tooltipped').tooltip('remove');
				u.push(
					AbsentOrLateAPI.save({
							Type: t.Type,
							PETianoId: t.PETianoId,
							Reason: t.Reason,
							RecordOfMeetingId: $scope.recordOfMeeting.Id,
							IsJustified: t.IsJustified
						}, function(data) {
							PETianoService.getPETianoById(data.PETianoId, (err, PETiano) => {
								if(!err) {
									u[t.idx].PETiano = PETiano;
									$scope.addingAbsentOrLate = {};
									$timeout(()=>{$('.tooltipped').tooltip();$('#absentOrLateSelectDropdown').val('');$('select').material_select();},0,true);
								}
							});
						}, function(err) {
							u.splice(t.idx, 1);
							if (t.inval != -1 && (t.inval || t.inval == 0))
								u.splice(t.inval, 0, t.invalPT);
							$timeout(()=>{$('.tooltipped').tooltip();},0,true);
						}));
			};

			$scope.createRecordOfMeeting = () => {
				$('#recordOfMeetingCreatingModal').openModal();
			};

			$scope.confirmCreateRecordOfMeeting = () => {
				$('#recordOfMeetingCreatingModal').closeModal();
				RecordOfMeetingAPI.open((data) => {
					data.Date = new Date(data.Date);
					$scope.recordOfMeeting = data;
					$scope.UsersAgendaPoints = [];
					$timeout(() => {
						$('.collapsible').collapsible({});
						$('select').material_select();
						$('.tooltipped').tooltip();
					}, 500, false);
				});
			};

			$scope.openDownloadWindow = () => {
				if($scope.recordOfMeeting.Status === 2)
					$window.open('/api/recordOfMeeting/' + $scope.recordOfMeeting.Id + '/download');
			};

			$scope.openSearchModal = () => {
				$('#searchModal').openModal();
			};

			$scope.closeSearchModal = () => {
				$('#searchModal').closeModal();
			};

			$scope.loadRecordOfMeeting = (id) => {
				if (!id) return;
				$('#searchModal').closeModal();
				RecordOfMeetingAPI.get({recordOfMeetingId: id}, (data) => {
					data.Date = new Date(data.Date);
					$scope.recordOfMeeting = data;
					$scope.canOpen = data.Status === 1;
					$timeout(() => {
						$('.collapsible').collapsible({});
						$('select').material_select();
						$('.tooltipped').tooltip();
					}, 1000, false);
				});
			};

			$scope.openNewAgendaPointsModal = () => {
				$('#addNewAgendaPointModal').openModal();
				$('ul.tabs').tabs();
				$('.collapsible').collapsible({});
				Materialize.updateTextFields();
			};

			$scope.addNewAgendaPoint = () => {
				$scope.toAddNewAgendaPoint.Status = 1;
				var t = $scope.toAddNewAgendaPoint;
				$scope.toAddNewAgendaPoint = {};
				var tIdx = $scope.UsersAgendaPoints.length;
				$scope.UsersAgendaPoints.push(t);
				AgendaPointAPI.addAgendaPoint(t, (data) => {
					t.Id = data.Id;
					t.PETianoId = data.PETianoId;
					Materialize.updateTextFields();
				}, (err) => {
					$scope.toAddNewAgendaPoint = t;
					$scope.UsersAgendaPoints.splice(tIdx, 1);
					Materialize.updateTextFields();
				});
			};

		}
	);
