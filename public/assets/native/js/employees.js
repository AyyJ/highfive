$(document).ready(function(){
    var companyData = JSON.parse(localStorage.getItem("currentCompany"));
    var myCompanyId = companyData._id;

    console.log(myCompanyId);

    var curUser = JSON.parse(localStorage.getItem('currentUser'));
    $('#user-name').text(curUser.first_name + ' ' +  curUser.last_name);

    var employees = getEmployees();
    
    var source = $("#employee-list-template").html();
    var template = Handlebars.compile(source);
    var compiledHtml = template(employees);

    $("#employee-list").html(compiledHtml);
    $('.save-btn').click(submitForm);

    
   /**
    * @api {get} /api/employees/company/:id Request All Employees
    * @apiName GetAllEmployees
    * @apiGroup Employee
    * @apiPermission admin
    *
    * @apiSuccess {Number} id The Employees-ID.
    * @apiSuccess {String} email The Employees email.
    * @apiSuccess {Number} phone_number The Employees number.
    * @apiSuccess {String} role The Employees role.
    * @apiSuccess {Number} company_id The Employees Company-ID.
    *
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       {
    *         "id": "12314125",
    *         "email": "test@yahoo.com",
    *         "phone_number": "6581922344",
    *         "role": "a_admin",
    *         "company_id": "12314125"
    *       },
    *       {
    *         "id": "12314125",
    *         "email": "test@yahoo.com",
    *         "phone_number": "6581922344",
    *         "role": "a_admin",
    *         "company_id": "12314125"
    *       }
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
   /***
     * Makes a get request to display list of employees 
     * @param none
     * @returns displays the employee list
     */
    function getEmployees() {
       var json;
       $.ajax({
           dataType: 'json',
           type: 'GET',
           data: $('#response').serialize(),
           async: false,
           url: '/api/employees/company/' + myCompanyId,
           success: function(response) {
               json = response;
               //console.log(response);
           }
       });
       return json;
   }

   /**
    * @api {post} /api/employees/ Post new employee
    * @apiName PostNewEmployee
    * @apiGroup Employee
    *
    * @apiDescription For role param, they are defined as follows (c_admin): company admin, (c_receptionist): company receptionist, (c_employee): company employee, a_admin: app administrator.
    *
    * @apiParam {String} first_name First name of new employee.
    * @apiParam {String} last_name Last name of new employee.
    * @apiParam {String} email Email of new employee.
    * @apiParam {String} password Password of new employee.
    * @apiParam {Number} phone_number Phone number of new employee.
    * @apiParam {String} role Role of new employee.
    *
    * @apiSuccessExample Success-Response:
    *     HTTP/1.1 200 OK
    *     {
    *       "_id": "12314125",
    *       "first_name": "Billy",
    *       "last_name": "Bob",
    *       "email": "test@yahoo.com",
    *       "phone_number": "6581922344",
    *       "company_id": "12314125",
    *       "role": "a_admin"
    *     }
    *
    * @apiError EmailTaken Email Inputed already taken.
    *
    * @apiErrorExample Error-Response:
    *     HTTP/1.1 401 Not Found
    *     {
    *       "error": "EmailTaken"
    *     }
    */
   /***
     * Makes a post request to update list of employees when adding a new employee
     * @param none
     * @returns updates the employee list
     */
   function updateEmployeeList(obj) {
      $.ajax({
        dataType: 'json',
           type: 'POST',
           data: obj,
           async: false,
           url: '/api/employees',
           success: function(response) {
               employees.push(response);
               //console.log(response);
           }
      });
    }

     /***
     * When a patient submits their form
     * @param none
     * @returns updates the employee list
     */
    function submitForm(){
        var d = grabFormElements();
        console.log(d);
        updateEmployeeList(d);
        $("#employee-list").html(template(employees));
        document.getElementById("employee-form").reset();
    }

    /***
     * Grabs elements from the check in and puts it into an object
     * @param none
     * @returns new employee object
     */
    function grabFormElements(){
        var newEmployee = {};
        newEmployee.company_id = myCompanyId;
        newEmployee.role = "c_employee",
        newEmployee.first_name= $('#employee-first').val();
        newEmployee.last_name = $('#employee-last').val();
        newEmployee.phone_number = $('#employee-number').val();
        newEmployee.email = $('#employee-email').val();
        newEmployee.password = $('#employee-pw').val();
        newEmployee.confirm_password = $('#employee-confirm-pw').val();
        return newEmployee;
    }

     /***
     * Find Specific Employee Given Employee ID within the Employee Array
     * @param id
     * @returns {string}
     */
    function findEmployee(id){

        for(var employee in employeeList) {
           if(employeeList.hasOwnProperty(employee)){
              if(employeeList[employee]._id === id){
                  if(DEBUG) //console.log(employeeList[employee]);
                  return employeeList[employee];
              }
           }
        }
    }

    $('#logoutButton').on('click',function(){
      localStorage.setItem('userState',0);
    });


});
