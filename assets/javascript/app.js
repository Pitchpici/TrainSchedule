$(document).ready(function() {

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

        var name = $("#name").val().trim();
        var destination = $("#destination").val().trim();
        var firstTimeTrain = $("#ftt").val().trim();
        var frequency = $("#frequency").val().trim();

        database.ref().push({
                name: name,
                destination: destination,
                ftt: firstTimeTrain,
                fq: frequency
        });

        $("#name").val("");
        $("#destination").val("");
        $("#ftt").val("");
        $("#frequency").val("");

    });


    database.ref().on("child_added", function(TrainInfo) {
      
        var name = TrainInfo.val().name;
        var destination = TrainInfo.val().destination;
        var time = TrainInfo.val().ftt;
        var frequency = TrainInfo.val().fq;

        var firstTimeConverted = moment(time, "hh:mm").subtract(1, "years");

        var currentTime = moment();

        var diffTime = currentTime.diff(moment(firstTimeConverted), "minutes");

        var tRemainder = diffTime % frequency;

        var minutesTillNext = frequency - tRemainder;

        var next = moment().add(minutesTillNext, "minutes");

        var displayTime = moment(next).format("HH:mm");
        console.log(displayTime);


        $("tbody").append("<tr><td" + name + "</td><td>" + destination + "</td><td>" + time + "</td><td>" 
            + frequency + "</td><td>" + displayTime + "</td><td>" + minutesTillNext + "</td></tr>");



    },function(errorObject) {
         console.log("Errors handled: " + errorObject.code);

    });    
 

});