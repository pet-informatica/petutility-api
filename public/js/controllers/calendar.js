angular
  .module('Calendar')
  .controller('CalendarController', function($scope, uiCalendarConfig, CalendarAPI, $http, $timeout, $compile, $filter) {

    $scope.tEvents = [];
    $scope.uiConfig = {
      calendar: {
        height: 700,
        editable: false,
        displayEventTime: true,
        header:{
          right: 'today prev,next'
        },
        dayNamesShort: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"],
        monthNames: [
          "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
          "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ]
      }
    };
    $scope.idx = -1;

    $scope.init = function() {
      $timeout(function() {
        $('.datepicker').pickadate({
          selectMonths: true, // Creates a dropdown to control month
          selectYears: 15, // Creates a dropdown of 15 years to control year
          container: 'body'
        });
      }, 0, true);
    };
    $scope.init();

    $scope.eventMouseOver = function( event, element, view ) {
      element.attr({
        'tooltip': event.title,
        'tooltip-append-to-body': true
      });
      $compile(element)($scope);
    };

    $scope.eventsF = function (start, end, timezone) {
      var s = new Date(start);
      var e = new Date(end);
      // console.log(s,e);
      CalendarAPI.query({s:s, e:e}, (result) => {
        $scope.tEvents.splice(0, $scope.tEvents.length);
        var ret = result;
        for(var i = 0 ; i < ret.length ; ++i) {
          var hour = ret[i].time.substring(0,2);
          var minutes;
          var stage;

          if(parseInt(hour) < 10) {
            hour = hour.substring(0,1);
            minutes = ret[i].time.substring(2,4);
            stage = ret[i].time.substring(4);
          } else {
            minutes = ret[i].time.substring(3,5);
            stage = ret[i].time.substring(5);
          }
          if(stage==="pm") {
             if(hour!=12) hour = (parseInt(hour)+12);
             hour = hour.toString();
          }
          ret[i].start = new Date(
            (ret[i].start.substring(0,4)),
            ((parseInt((ret[i].start.substring(5,7)))-1).toString()),
            (ret[i].start.substring(8,10)), hour, minutes
          );
        }
        $.merge($scope.tEvents, ret);
      }, (err) => {
        // console.log(err);
      })
    };

    $scope.createEvent = function(eventTitle) {
      var eventDate = $('#eventDateFieldCreate').val();
      var eventTime = $('#eventTimeFieldCreate').val();
      // console.log(eventDate);
      // console.log(eventTime);
      var hour = eventTime.substring(0,2);
      var minutes;
      var stage;
      if(parseInt(hour) < 10) {
        hour = hour.substring(0,1);
        minutes = eventTime.substring(2,4);
        stage = eventTime.substring(4);
      } else {
        minutes = eventTime.substring(3,5);
        stage = eventTime.substring(5);
      }
      if(stage==="pm") {
        if(hour!=12) hour = (parseInt(hour)+12);
        hour = hour.toString();
      }
      var from = eventDate.split('/');
      var eventDateObject = new Date(from[2], from[1]-1, from[0], hour, minutes);
      var t = {title: eventTitle, start: eventDateObject, time: eventTime};
      var tIdx = $scope.tEvents.length;
      $scope.tEvents.push(t);
      var eventDateObjectBD = new Date(from[2], from[1]-1, from[0], parseInt(hour-3).toString(), minutes);
      var tBD = {title: eventTitle, start: eventDateObjectBD, time: eventTime};
      CalendarAPI.save(tBD, (res)=>{
        $scope.tEvents[$scope.tEvents.length-1].Id = res.Id;
      }, (err) => {
        $scope.tEvents.splice(tIdx, 1);
      });
    };

    $scope.editEvent = () => {
      var ref = $scope.tEvents[$scope.idx];
      ref.title = $('#eventTitleFieldEdit').val();
      ref.time = $('#eventTimeFieldEdit').val();
      var date = $('#eventDateFieldEdit').val();
      var hour; var minutes;
      if(ref.time.charAt(2) ==':') {
        hour = ref.time.substring(0,2);
        minutes = ref.time.substring(3,5);
        if(ref.time.charAt(5)=='p') {
          if(hour!=12) hour = (parseInt(hour)+12);
          hour = hour.toString();
        }
      } else {
        hour = '0' + ref.time.substring(0,1);
        minutes = ref.time.substring(2,4);
      }
      if(date.charAt(2)=='/'){
        ref.start = new Date(date.substring(6), (parseInt(date.substring(3,5))-1).toString(), date.substring(0,2), hour, minutes);
        var dateBD = new Date(date.substring(6), (parseInt(date.substring(3,5))-1).toString(), date.substring(0,2), parseInt(hour-3).toString(), minutes);
      } else {
        ref.start = new Date(date.substring(5), (parseInt(date.substring(2,4))-1).toString(), ('0'+date.substring(0,1)), hour, minutes);
        var dateBD = new Date(date.substring(5), (parseInt(date.substring(2,4))-1).toString(), ('0'+date.substring(0,1)), parseInt(hour-3).toString(), minutes);
      }
      CalendarAPI.update({eventId: ref.Id}, {
        eventTitle: ref.title,
        start: dateBD,
        time: ref.time
      }, (suc)=>{
        Materialize.toast('Evento editado com sucesso!', 4000);
      }, (err)=>{
        Materialize.toast('Um erro ocorreu.', 4000);
      });
    };

    $scope.removeEvent = () => {
      var tempId = $scope.tEvents[$scope.idx].Id;
      $scope.tEvents.splice($scope.idx,1);
      CalendarAPI.delete({eventId: tempId}, (suc)=>{
        Materialize.toast('Evento deletado com sucesso!', 4000);
      }, (err)=>{
        Materialize.toast('Um erro ocorreu.', 4000);
      });
    };

    $scope.openCreateEventModal = () => {
      $('#modalCreateEvents').openModal();
      Materialize.updateTextFields();
    };

    $scope.openEventsModal = () => {
      $('#modalEvents').openModal();
    };

    $scope.openEditEventModal = (idx) => {
      $scope.idx = idx;
      $('#modalEditEvent').openModal();
      $('#eventTitleFieldEdit').val($scope.tEvents[idx].title);
      $('#eventDateFieldEdit').val($filter('date')($scope.tEvents[idx].start, 'd/MM/y'));
      $('#eventTimeFieldEdit').val($scope.tEvents[idx].time);
      Materialize.updateTextFields();
    };

    $scope.validateRemoveEvent = (idx) => {
      $('#modalText').html("Tem certeza que deseja remover o evento " + $scope.tEvents[idx].title + "?");
      $scope.idx = idx;
      $('#modalRemoveEvent').openModal();
    };

    $scope.eventSources = [$scope.tEvents, $scope.eventsF];

    $('#eventTimeFieldCreate').timepicker({ 'scrollDefault': 'now' });
    $('#eventTimeFieldEdit').timepicker({ 'scrollDefault': 'now' });

  }
);
