const profile = document.querySelector('#profileContent')
const btnUpload = document.getElementById('btnPhotoUpload')

var file = {};

function chooseFile(e) {
	file = e.target.files[0]
}

// Wyświetlanie informacji o użytkowniku 
firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
		db.collection('users').doc(firebaseUser.uid).get().then(doc => {
			
      let login = document.createElement('h2');
      let profile_img = document.createElement('img');
      let email = document.createElement('p');
      let h5 = document.createElement('p');
      let bio = document.createElement('p');
      let card_header = document.createElement('div');
      let card_body = document.createElement('div');
      let row = document.createElement('div');
      let col1 = document.createElement('div');
      let col2 = document.createElement('div');

      login.textContent = doc.data().login;
      email.textContent = "Twój email: "+firebaseUser.email;
      h5.textContent = "O mnie:";
      bio.textContent = doc.data().bio;

      card_body.setAttribute('class', 'card-body');
      card_header.setAttribute('class', 'card-header');
      profile_img.setAttribute('class', 'profile')
      profile_img.setAttribute('src',doc.data().userPhoto);
      row.setAttribute('class','row');
      col1.setAttribute('class','col-6');
      col2.setAttribute('class','col-6');

      card_header.appendChild(login);
      col1.appendChild(profile_img);
      col2.appendChild(email);
      col2.appendChild(h5);
      col2.appendChild(bio);
      row.appendChild(col2);
      row.appendChild(col1);
      card_body.appendChild(row);
      profile.appendChild(card_header);
      profile.appendChild(card_body);
      
      // Dodawanie lub aktualizacja zdjęcia
			btnUpload.addEventListener('click', e =>{
				
				if(file.name == undefined){
					alert("Proszę wybrać plik")
				}else{
				let indexDot = file.name.lastIndexOf(".") + 1;
				let extFile = file.name.substr(indexDot, file.name.length).toLowerCase();
				if(extFile == "jpg" || extFile == "gif" || extFile == "jpeg" || extFile == "png"){
					firebase.storage().ref('users/' + firebaseUser.uid + '/profile.jpg').put(file).then(function(){
					firebase.storage().ref('users/' + firebaseUser.uid + '/profile.jpg').getDownloadURL().then(photoURL => {
						db.collection('users').doc(firebaseUser.uid).update({userPhoto: photoURL})
						window.location.reload()
					})	
				}).catch(error =>{
					console.log(error.message);
				})
				}else{
					alert("Dozwolone typy plików to: .jpg, .jpeg, .png, .gif")
			}
				}
			})
		})
	}
})



