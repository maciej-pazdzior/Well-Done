// Logowanie 
const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const btnLogin = document.getElementById('btnLogin');
const errorElement = document.getElementById('error');

btnLogin.addEventListener('click', e =>{
  const email = txtEmail.value;
  const pass = txtPassword.value;  
  const auth = firebase.auth();

  let messages = []

  if (email == ""){
		messages.push("Uzupełnij pole z emailem");
		txtEmail.style.border = "solid 2px red";
	}

  if (pass == ""){
		messages.push("Uzupełnij pole z hasłem")
		txtPassword.style.border= "solid 2px red"
	} 
  
  if (messages.length > 0){
    errorElement.className = "alert"
    text = "";
    for (i = 0; i < messages.length; i++){
      text += "! " + messages[i] + "<br>";
    }
    errorElement.innerHTML = text

  
  } else {

  const promise = auth.signInWithEmailAndPassword(email, pass);
  promise.catch(e => console.log(e.message));

  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      window.location.href = "index.html";
    } else {
    }
  }) };

});