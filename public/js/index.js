function submitPhoneNumberForm() {
  var phoneNumberValue = document.getElementById("phoneNumber").value;
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("demo").innerHTML = this.responseText;
    }
  };
  var url = 'https://us-central1-highfive-c6584.cloudfunctions.net/isValidPhone?phoneNumber=' + phoneNumberValue;
  xhr.open("GET", url, true);
  xhr.send(null);
}