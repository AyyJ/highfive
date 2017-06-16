// with Button named loginButton
$(function() {
   $('#loginButton').click(function () {
       var userData = grabUserData();
       event.preventDefault();
       ajaxPostUser('/api/employees/login', userData);
       console.log("off we go...");
       
   });
});


// with Button named signin-bt
$(function() {
   $('#logoutButton').click(function() {
       localStorage.removeItem('userState');
       localStorage.removeItem('currentUser');
       localStorage.removeItem('currentCompany');
   });
});

/**
 * @name ajaxPostUser
 * @description Ajax function to create a POST request to server
 * @param {string} url - 
 * @param {string} data - 
 */
function ajaxPostUser(url, data){
   $.ajax({
       type: "POST",
       url: url,
       data: data,
       dataType: 'json',
       success: function(response){
           console.log(response);
           if(response.role == 'a_admin'){
             localStorage.setItem('userState' , 2);
             location.href = '/admin-dashboard'
           }
           else{
             localStorage.setItem('userState' , 1);
             localStorage.setItem('currentUser', JSON.stringify(response));
             ajaxGetCompanyInfo('/api/companies/' + response.company_id);
             location.href = '/visitors';
         }
       },
       error: function(response) {
           console.log(response.responseText);
           window.onerror=handleError();
           event.preventDefault();
        }
   });
}
/**
 * @name ajaxGetCompanyInfo
 * @description Ajax function to create a POST request to server
 * @param {string} url - 
 */
function ajaxGetCompanyInfo(url){
   $.ajax({
       type: "GET",
       url: url,
       data: $('#response').serialize(),
       async: false,
       dataType: 'json',
       success: function(response){
           console.log(response);
           localStorage.setItem('currentCompany', JSON.stringify(response));
       }
   });
}

/**
 * @name grabUserData
 * @description Grab user data from form
 * @returns {object} user - user object
 */
function grabUserData(){
   var user = {};
   user.email = $('#username').val();
   user.password = $('#password').val();
   return user;
}

/**
 * @name handleError
 * @description returns error message, 
 * @returns {Boolean} true
 */
function handleError()
{
   errorlog.innerHTML="Not Valid Username and Password, please type valid one.";
   return true;
}
