$(document).ready(function(){

    var socket = io();

    var VALIDATE_COMPANY_ID = "validate_company_id";
    var ADD_VISITOR = "add_visitor";
    
    var companyData = JSON.parse(localStorage.getItem("currentCompany"));
    console.log(companyData);
    socket.emit(VALIDATE_COMPANY_ID, companyData);
    
    //Prevent users from scrolling around on iPad
    document.ontouchmove = function(e) {
        e.preventDefault();
    };

    //Bind Listeners
    $('#tap-to-check').on('click', startCheckIn);
    $('.submit-check-in').on('click', submitForm);

    //When a user starts their check in
    function startCheckIn(){
        $('.check-in').addClass('show');
        $('.check-in').animate({
            top:'10%',
            opacity: '1'
        }, 700);
        $(this).addClass('hide');
        $('#clock').addClass('hide');     
    }

    /**
     * @name submitForm
     * @description When a patient submits their form
     */
    function submitForm(){
        //event.preventDefault();
        var data = grabFormElements();
        var text = "Name: " + data['first_name'] + " " + data['last_name'] + " Phone Number: " + data['phone_number'];
        var url = localStorage.getItem('hookURL');

        //Sends slack notification
        $.ajax({
            data: 'payload=' + JSON.stringify({
                "text": text,
                "username": "Emissary Notifier"
            }),
            dataType: 'json',
            processData: false,
            type: 'POST',
            url: url,
            async: true,
        });     
        socket.emit(ADD_VISITOR, data);           
    }

    /**
     * @name grabFormElements
     * into an object
     * @description Grabs elements from the check in and puts it
     * @returns newVisitor - A new visitor object
     */
    function grabFormElements(){
        var newVisitor = {};
        newVisitor.company_id = companyData._id;
        newVisitor.first_name= $('#visitor-first').val();
        newVisitor.last_name = $('#visitor-last').val();
        newVisitor.phone_number = $('#visitor-number').val();
        newVisitor.checkin_time = new Date();
        return newVisitor;
    }

    /**
     * @name updateClock
     * @description Updates the clock
     */
    function updateClock () {
        var currentTime = new Date ( );
        var currentHours = currentTime.getHours ( );
        var currentMinutes = currentTime.getMinutes ( );

        // Pad the minutes and seconds with leading zeros, if required
        currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;

        // Convert the hours component to 12-hour format if needed
        currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;

        // Convert an hours component of "0" to "12"
        currentHours = ( currentHours == 0 ) ? 12 : currentHours;

        // Compose the string for display
        var currentTimeString = currentHours + ":" + currentMinutes;

        $("#clock").html(currentTimeString);
    }
    updateClock();
    setInterval(updateClock, 60 * 1000);

    /**
     * Find a specific cookie name
     * @param cName - The name of the cookie
     * @returns {string|*}
     */
    function getCookie(cName) {
        var name = cName + '=';
        var cookieArray = document.cookie.split(';');

        for (var i = 0, len = cookieArray.length; i < len; i++) {
            var cookie = cookieArray[i];
            while (cookie.charAt(0) == ' ')
                cookie.substring(1);
            if (cookie.indexOf(name) == 0)
                return cookie.substring(name.length, cookie.length);
        }

    }

});
