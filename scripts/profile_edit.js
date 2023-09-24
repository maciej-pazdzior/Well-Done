var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var btn2 = document.getElementById("myBtn2")
var denyElement = document.getElementById('denyChanges')
var applyElement = document.getElementById('applyChanges')
var denyElementP = document.getElementById('denyChangesP')
var applyElementP = document.getElementById('applyChangesP')
var desc = document.getElementById('newDesc')
var pModal = document.getElementById('passModal')
var login = document.getElementById('newLogin')
const errorElement = document.getElementById('error');
var oldPass = document.getElementById('oldPassword')
var newPass = document.getElementById('newPassword')
var newPass2 = document.getElementById('newPassword2')
var errorElement2 = document.getElementById('error2')
// Operatory modali 			
btn.onclick = function() {
	modal.style.display = "block";
}

btn2.onclick = function(){
	pModal.style.display = "block"
}
		
denyElement.onclick = function() {
	modal.style.display = "none";
}

denyElementP.onclick = function(){
	pModal.style.display = "none"
}	

window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
} 

window.onclick = function(event) {
	if (event.target == pModal) {
		pModal.style.display = "none";
	}
} 


// Przycisk aktualizacji profilu
firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
		db.collection('users').doc(firebaseUser.uid).get().then(doc => {
			login.value = doc.data().login
			desc.value = doc.data().bio
			
			// Zmiana informacji oraz walidacja
			applyElement.addEventListener('click', e =>{
				let messages = []

				if (login.value.length < 5 || login.value == null){
					messages.push("Nazwa użytkownika musi zawierać conajmniej 5 znaków")
					login.style.border= "solid 2px red"
				}

				if (desc.value.length < 10 || desc.value == null ){
					messages.push("Opis powinien zawierać co najmniej 10 znakow")
					desc.style.border= "solid 2px red"
				}

				if (messages.length > 0){
					errorElement.className = "alert"
					text = "";
					for (i = 0; i < messages.length; i++){
						text += "! " + messages[i] + "<br>";
					}
					errorElement.innerHTML = text
				}else{
					if(confirm("Jesteś pewien, że chcesz zapisać zmiany?")){
						db.collection('users').doc(firebaseUser.uid).update({
              bio:desc.value,
              login:login.value
					})
					window.location.reload()
				} 

				}
				
				
			})
			// haslo
			applyElementP.addEventListener('click', e=>{
				currentPassword = oldPass.value
				let messages = []
				
				var cred = firebase.auth.EmailAuthProvider.credential(
					firebaseUser.email, currentPassword);

				firebaseUser.reauthenticateWithCredential(cred).then(function() {
				}).catch(function(error){
					alert("Podane stare hasło jest nieprawidłowe lub przekroczyłeś/aś limit")
				})

				if (oldPass.value.length < 6 ){
					messages.push("Stare hasło nie może być puste")
					oldPass.style.border = "solid 2px red"
				}

				if (newPass.value < 6 || newPass.value == ""){
					messages.push("Uzupełnij pole z hasłem, hasło musi mieć conajmniej 6 znaków.")
					newPass.style.border= "solid 2px red"
				}
				
				if (newPass.value != newPass2.value ){
					messages.push("Podane hasła nie zgadzają się lub są puste")
					newPass.style.border = "solid 2px red"
					newPass2.style.border = "solid 2px red"
				}
				if (messages.length > 0){
					errorElement2.className = "alert"
					text = "";
					for (i = 0; i < messages.length; i++){
						text += "! " + messages[i] + "<br>";
					}
					errorElement2.innerHTML = text
				}else{
					firebaseUser.updatePassword(newPass.value).then(function(){
            alert("Pomyślnie zmieniono hasło użytkownika")
            window.location.reload()
					}).catch(function(error){
						console.log(error)
					})
					
				}
			})
	})
	}
})
