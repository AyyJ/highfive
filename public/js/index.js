function submitPhoneNumberForm(ele) {
  var phoneNumberValue = document.getElementById("phoneNumber").value;
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    var parsedData = JSON.parse(this.responseText);

    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("demo").innerHTML = parsedData.message;
    }
  };

  var fun = "";
  if(ele.value === "Format"){
    fun = "formatPhone";
  }
  else if(ele.value === "Validate"){
    fun = "validPhone";
  }

  var url = fun + '?phoneNumber=' + phoneNumberValue;
  xhr.open("GET", url, true);
  xhr.send(null);
}
