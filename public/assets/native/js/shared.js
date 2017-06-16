var userState = JSON.parse(localStorage.getItem("userState"));
  if(!userState || userState == 2){
    location.href= "login.html";
}
