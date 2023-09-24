// Walidacja danych oraz rejestracja użytkownika

const txtEmail = document.getElementById('txtEmail');
const pass1 = document.getElementById('txtPassword')
const pass2 = document.getElementById('txtPassword2')
const btnRegister = document.getElementById('btnRegisterTest');
const login = document.getElementById('txtLogin')
const errorElement = document.getElementById('error')

btnRegisterTest.addEventListener('click', e =>{
    const email = txtEmail.value;
    const passVal1 = pass1.value;  
	  const passVal2 = pass2.value
	  const loginVal = login.value 
    const auth = firebase.auth();

	let messages = []
	if (passVal1 != passVal2){
		messages.push("Podane hasła nie zgadzają się")
		pass1.style.border = "solid 2px red"
		pass2.style.border = "solid 2px red"
	}
	
	if (passVal1.length < 6 || passVal1 == ""){
		messages.push("Uzupełnij pole z hasłem, hasło musi mieć conajmniej 6 znaków.")
		pass1.style.border= "solid 2px red"
	}
  
	if (loginVal.length < 5 || loginVal == ""){
		messages.push("Nazwa użytkownika musi zawierać conajmniej 5 znaków")
		login.style.border= "solid 2px red"
	}

	if ( !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ){
		messages.push("Podany adres email jest niepoprawny")
		txtEmail.style.border = "solid 2px red"
	}
	
	if (messages.length > 0){
		errorElement.className = "alert"
		text = "";
		for (i = 0; i < messages.length; i++){
			text += "! " + messages[i] + "<br>";
		}
		errorElement.innerHTML = text
	}else{
		auth.createUserWithEmailAndPassword(email, passVal1).then(cred => {
		return db.collection('users').doc(cred.user.uid).set({
			login: loginVal,
			bio: 'Użytkownik nie dodał jeszcze opisu',
			userPhoto: 'images/dish.png'
		});
		}).then(() => {
			alert("Konto zostało utworzone")
			window.location.href = "index.html";
		})
		firebase.auth().onAuthStateChanged(firebaseUser => {
			if(firebaseUser) {
			console.log('logged in');
		} else {
			console.log('not logged in');
		}
	})
}
})







	
		