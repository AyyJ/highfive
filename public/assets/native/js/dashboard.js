var userState = JSON.parse(localStorage.getItem("userState"));
  if(!userState){
    location.href= "login.html";
}

$(document).ready(function(){


    var socket = io(); //Initialize Socket

    //Socket variables
    var DEBUG = 1;
    var VALIDATE_COMPANY_ID = "validate_company_id";
    var VISITOR_LIST_UPDATE = "visitor_list_update";
    var REMOVE_VISITOR = "remove_visitor";

    var companyData = JSON.parse(localStorage.getItem("currentCompany"));
    var visitorList;
    companyData.company_id = companyData._id;

    var curUser = JSON.parse(localStorage.getItem('currentUser'));
    var companyName = companyData.name;


    $('#user-name').text(curUser.first_name + ' ' +  curUser.last_name);

    //Connect to private socket
    socket.emit(VALIDATE_COMPANY_ID, companyData);

   /***
    * Compile all the Handle Bar Templates
    */

    //DashBoard Template
    var source = $("#visitor-list-template").html();
    var template = Handlebars.compile(source);

    //Modal Template
    var modal = $('#visitor-info-template').html();
    var modalTemplate = Handlebars.compile(modal);

    //Socket listen for visitor queue
    socket.on(VISITOR_LIST_UPDATE, function (data) {
        visitorList = data.visitors
        //Parse Visitor List to format Date
        for(var i = 0, len = visitorList.length; i< len; i++){
            visitorList[i].checkin_time = formatTime(visitorList[i].checkin_time);
        }

        //Parse Visitors appoitments
        for(i = 0; i < len; i++){
          var appList = visitorList[i].appointments;
          if(appList[0]){
            for(var j = 0, appLen = appList.length; j < appLen; j++){
              if(compareDate(appList[j].date)){
                visitorList[i].appointmentTime = formatTime(appList[j].date);
                visitorList[i]._apptId = appList[j]._id;
                break;
              }
            }
          }
          else{
      
            visitorList[i].appointmentTime = "None";
          }
        }

       //visitorList.checkin_time = visitorList;

        var compiledHtml = template(visitorList);
        $('#visitor-list').html(compiledHtml);
    });


    /***
    * Listener for Opening a Modal
    */
    $(document).on('click','.patient-check-out',function(){
        var uniqueId = $(this).attr('value');
        var visitor = findVisitor(uniqueId);
        var compiledTemplate = modalTemplate(visitor);
        $('.modal-dialog').html(compiledTemplate);
    });

   /**
    * @api {delete} /api/visitorLists/company/:company_id/visitor/:visitor_id Delete Visitor from VisList
    * @apiName DeleteVisitor
    * @apiGroup Visitor
    * @apiPermission admin
    *
    * @apiDescription Store additional field info not including name and phone_number, in the field additional_info as dictionary type{}
    *
    * @apiParam {Number} id The visitorId
    *
    * @apiSuccess {Number} _id The Appointment-ID.
    * @apiSuccess {Number} id The Visitor-ID.
    * @apiSuccess {String} first_name The first name of the visitor.
    * @apiSuccess {String} last_name The last name of visitor.
    * @apiSuccess {String} phone_number The person's number.
    * @apiSuccess {Date} checkin_time Date visitor checked in.
    * @apiSuccess {ObjectId} company_id Company-ID for company that created appt.
    * @apiSuccess {Appointment} appointments A appointment object.
    * @apiSuccess {Dictionary} additional_info 'Dictionary' for optional fields.
    *
    *
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "_id": "123124124",
    *       "company_id": "12312355",
    *       "visitors":
    *        [
    *                 {
    *                   "id": "12314125",
    *                   "company_id": "12314125",
    *                   "first_name" : "test",
    *                   "last_name" : "test",
    *                   "phone_number": "21324125",
    *                   "checkin_time": "2016-04-23T18:25:43.511Z",
    *                   "appointments":
    *                   [
    *                           {
    *                                   "_id" : "12314125",
    *                                   "name" : "test1",
    *                                   "phone_number" : "0123456789",
    *                                   "date" : "2016-04-23T18:25:43.511Z",
    *                                   "company_id" : "23424125",
    *                                   "provider_name" : "test test"
    *                           }
    *                   ]
    *                   "additional_info":
    *                           {
    *                                   "allergies": "peanuts",
    *                                   "sex": "male"
    *                           }
    *                }
    *        ]
    *     }
    *
    * @apiError NotFound Could not find VisitorList in question.
    *
    * @apiErrorExample Error-Response:
    *     HTTP/1.1 401 Not Found
    *     {
    *       "error": "Can't find visitor List"
    *     }
    */
    /***
     * Listener for Checking out a Visitor
     */
    $(document).on('click','.check-in-btn',function(){
        var id = $(this).closest('.modal-content').find('.modal-body').attr('value');
        var apptId = $(this).closest('.modal-content').find('.modal-left').attr('value');

        var removeVisitor = findVisitor(id);
   
        removeVisitor.visitor_id = removeVisitor._id;

        $.ajax({
          dataType:'json',
          type: 'DELETE',
          url:'/api/appointments/' + apptId,
          success:function(response){
          }
        });
        

        socket.emit(REMOVE_VISITOR, removeVisitor);
    });

    /***
     * Compare appointment Date to today's Date
     */
    function compareDate(appointment){
      var today = new Date();
      appointment = new Date(Date.parse(appointment));

      var appointmentDate = appointment.getFullYear() + ' ' + appointment.getDate() + ' ' + appointment.getMonth();
      var todayDate = today.getFullYear() + ' ' + today.getDate() + ' ' + today.getMonth();

      return (appointmentDate == todayDate);
    }

    /**
     * @name findVisitor
     * @description Find Specific Visitor Given Visitor ID within the Visitor
     * Array
     * @param {string} - id of visitor
     * @returns visitor
     */

    function findVisitor(id){

        for(var visitor in visitorList) {
           if(visitorList.hasOwnProperty(visitor)){
              if(visitorList[visitor]._id === id){
                  if(DEBUG) console.log(visitorList[visitor]);
                  return visitorList[visitor];
              }
           }
        }
    }

    /**
     * @name formatTime
     * @description Function to format a JSON date object into a string
     * @param {string} current time
     * @returns {number} a number representing the current time
     */
    function formatTime(time){
        var currentTime = new Date(Date.parse(time));
        var hour = currentTime.getHours();
        var minute = currentTime.getMinutes();

        if(minute < 10) {
            minute = '0' + minute;
        }

        if(hour >= 13){
            hour = hour-12;
            currentTime = hour + ':' + minute + 'PM';
        }

        else if(hour === 12){
            currentTime = hour + ':' + minute +'PM';
        }
        else if(hour === 0){
            currentTime = 1 + ':' + minute + 'AM';
        }
        else{
            currentTime = hour + ':' + minute +'AM';
        }

        return currentTime;

    }

    $('#logoutButton').on('click',function(){
      localStorage.setItem('userState',0);
    });

});
