$(document).ready(function(){
   console.log('ready');

    //DashBoard Template
    var source = $("#company-list-template").html();
    var template = Handlebars.compile(source);


    var compiledHtml = template(companies);
    
    $('#company-list').html(compiledHtml);
});
