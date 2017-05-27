function getCompanies() {
    var json;
    $.ajax({
        dataType: 'json',
        type: 'GET',
        data: $('#response').serialize(),
        async: false,
        url: '/api/companies',
        success: function(response) {
            json = response;
            console.log(response);
        }
    });
    return json;

var companies = getCompanies();
var num = companies.length;
