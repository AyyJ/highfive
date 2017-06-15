$(document).ready(function(){
   var companyData = JSON.parse(localStorage.getItem("currentCompany"));
   var myCompanyId = companyData._id;

   console.log(myCompanyId);

   var curUser = JSON.parse(localStorage.getItem('currentUser'));
   $('#user-name').text(curUser.first_name + ' ' +  curUser.last_name);
   var employees = getEmployee();

   var source = $("#setting-list-template").html();
   var template = Handlebars.compile(source);
   var compiledHtml = template(employees);

   // Pre-fill in current user information
   document.getElementsByTagName("input")[0].setAttribute("value", curUser.first_name);
   document.getElementsByTagName("input")[1].setAttribute("value", curUser.last_name);
   document.getElementsByTagName("input")[2].setAttribute("value", curUser.phone_number);
   document.getElementsByTagName("input")[3].setAttribute("value", curUser.email);

   // Pulls up form to change employee info
   $('.update-btn').click(updateEmployeeInfo);
   $("#setting-list").html(compiledHtml);

   /**
    * @api {get} /api/employees/:id Request Employee
    * @apiName GetEmployee
    * @apiGroup Employee
    *
    * @apiSuccess {Number} _id The Employees-ID.
    * @apiSuccess {String} first_name First name of Employee.
    * @apiSuccess {String} last_name First name of Employee.
    * @apiSuccess {String} email The Employees email.
    * @apiSuccess {Number} phone_number The Employees number.
    * @apiSuccess {Number} company_id The Employees Company-ID.
    * @apiSuccess {String} role The Employees role.
    *
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "_id": "12314125",
    *       "first_name": "Billy",
    *       "last_name": "Bobby",
    *       "email": "test@yahoo.com",
    *       "phone_number": "6581922344",
    *       "company_id": "12314125",
    *       "role": "a_admin",
    *     }
    *
    * @apiError IncorrectCredentials Only authenticated Admins can access the data.
    *
    * @apiErrorExample Error-Response:
    *     HTTP/1.1 401 Not Found
    *     {
    *       "error": "IncorrectCredentials"
    *     }
    */
   /**
    * Makes a get request to display list of employees
    * @param none
    * @returns displays the employee list
    */
   function getEmployee() {
       var json;
       $.ajax({
           dataType: 'json',
           type: 'GET',
           data: $('#response').serialize(),
           async: false,
           url: '/api/employees/' + curUser._id,
           success: function(response) {
               json = response;
               console.log(response);
           }
       });
       return json;
   }

   /**
    * Grabs elements from the check in and puts it into an object
    * @param none
    * @returns new employee object
    */
   function grabFormElementsUpdate(){
       var newEmployee = {};
       newEmployee.first_name= $('#employee-first').val();
       newEmployee.last_name = $('#employee-last').val();
       newEmployee.phone_number = $('#employee-number').val();
       newEmployee.email = $('#employee-email').val();
       return newEmployee;
   }

   /**
    * Update the current employee information
    * @param id
    * @returns {string}
    */
   function updateEmployeeInfo(){
       var data = grabFormElementsUpdate();
       console.log(data);
       updateEmployee(data);
       $("#setting-list").html(template(employees));
       document.getElementById("settings-form").reset();
   }

   /**
    * @api {put} /api/employees/ Modify employee info
    * @apiName PutEmployee
    * @apiGroup Employee
    *
    * @apiDescription All parameters are optional, except ID.
    *
    * @apiParam {Number} id ID number of employee.
    * @apiParam {String} name Name of employee.
    * @apiParam {String} email Email of employee.
    * @apiParam {String} password Password of employee.
    * @apiParam {Number} phone_number Phone number of employee.
    * @apiParam {String} role Role of employee.
    *
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "id": "12314125",
    *       "email": "test@yahoo.com",
    *       "phone_number": "6581922344",
    *       "role": "a_admin",
    *       "company_id": "12314125",
    *     }
    *
    * @apiErrorExample Error-Response:
    *     HTTP/1.1 401 Not Found
    *     {
    *       "error": "Incorrect credentials"
    *     }
    */

   /**
    * @name updateEmployee
    * @description Makes a put request to update info of employee
    * @param {obj} - Employee object
    */
   function updateEmployee(obj) {
       $.ajax({
           dataType: 'json',
           type: 'PUT',
           data: obj,
           async: false,
           url: '/api/employees/' + curUser._id,
           success: function(response) {
               console.log(response);
               localStorage.setItem('currentUser', JSON.stringify(response));
           }
       });
   }

   $('#logoutButton').on('click',function(){
       localStorage.setItem('userState',0);
   });


});
