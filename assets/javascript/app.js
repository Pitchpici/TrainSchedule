$(document).ready(function() {

    $('.parallax').parallax();

    $('.timepicker').pickatime({
        default: 'now',
        twelvehour: false, // change to 12 hour AM/PM clock from 24 hour
        donetext: 'OK',
        format: "HH:ii",
        autoclose: false,
        vibrate: true
    });

    var config = {
        apiKey: "AIzaSyCv17u-Z8N1R6UImll3JDwu2EGgensp2es",
        authDomain: "train-schedule-bfaa7.firebaseapp.com",
        databaseURL: "https://train-schedule-bfaa7.firebaseio.com",
        projectId: "train-schedule-bfaa7",
        storageBucket: "",
        messagingSenderId: "457421751008"
     };
  
    firebase.initializeApp(config);
    var database = firebase.database();


    $("#submit").on("click", function() {

        event.preventDefault();

        var trainName = $("#name").val().trim();
        console.log("name " + trainName);

        var trainDestination = $("#destination").val().trim();
        console.log("destination " + trainDestination);

        var firstTimeTrain = $("#firstTime").val();
        console.log("FTT " + firstTimeTrain);

        var frequency = $("#frequency").val().trim();
        console.log("frequency " + frequency);

        if ((trainName=="")  || (trainDestination=="") || (firstTimeTrain=="") || (frequency=="")) {
            alert("You must complete all fields before adding your train!");
            return false;
        }

        var data = {
            firstTimeTrain: firstTimeTrain,
            trainName: trainName,
            destination: trainDestination,
            fq: frequency
        }

        console.log("AAAAA " + data.trainName);
        console.log("AAAAA " + data.firstTimeTrain);
        console.log("AAAAA " + data.frequency);
        console.log("AAAAA " + data.destination);


        database.ref().push(data);

        $("#name").val("");
        $("#destination").val("");
        $("#firstTime").val("");
        $("#frequency").val("");

    });


    database.ref().on("child_added", function(TrainInfo) {
      
        var trainName = TrainInfo.val().trainName;
        console.log("name inside database:" + trainName);

        var destination = TrainInfo.val().destination;
        console.log("train destination inside database: " + destination);

        var time = TrainInfo.val().firstTimeTrain;
        console.log("time: " + time);

        var frequency = TrainInfo.val().fq;
        console.log("frequency: " + frequency);

        console.log(parseInt(frequency));

        var firstTimeConverted = moment(time, "hh:mm").subtract(1, "years");
        console.log("firstTimeConverted" + firstTimeConverted);

        var currentTime = moment();
        console.log("currentTime" + currentTime);


        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("time difference" + diffTime);


        var tRemainder = diffTime % parseInt(frequency);

        var minutesTillNext = parseInt(frequency) - tRemainder;
        console.log("Minutes till ext" + minutesTillNext);

        var next = moment().add(minutesTillNext, "minutes");

        var displayTime = moment(next).format("HH:mm");
        console.log(displayTime);


        $("tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>"
            + frequency + "</td><td>" + displayTime + "</td><td>" + minutesTillNext + "</td></tr>");



    },function(errorObject) {
         console.log("Errors handled: " + errorObject.code);

    });    
 

});