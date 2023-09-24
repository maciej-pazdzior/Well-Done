const form = document.querySelector('#add-recipe-form');
const errorElement = document.getElementById('error')
const image = document.getElementById('upload')


form.addEventListener('submit', (e) => {
    e.preventDefault();
	validation();
	console.log(form.description.value.length)
});

// Walidacja i zapisywanie przepisu w bazie
function validation(){
	let messages = []
	if ( form.name.value.length < 5 || form.name.value == null ){
		messages.push('Nazwa przepisu musi zawierać conajmniej 5 znaków')
		form.name.style.border = "solid 2px red"
	}

	if ( form.time.value <= 0 || form.time.value == null || isNaN(form.time.value) ){
		messages.push('Proszę podać prawidłową wartość minut, większą od 0')
		form.time.style.border = "solid 2px red"
	}

	if ( form.description.value.length < 10 || form.description.value.length > 10000){
		messages.push('Opis powinien zawierać conajmniej 10 znaków oraz maksymalnie 10000')
		form.description.style.border = "solid 2px red"
	}
	
	if (messages.length > 0){
		errorElement.className = "alert"
		text = "";
		for (i = 0; i < messages.length; i++){
			text += "! " + messages[i] + "<br>";
		}
		errorElement.innerHTML = text
		;
	} else {

	let indexDot = image.value.lastIndexOf(".") + 1;
	let extFile = image.value.substr(indexDot, image.value.length).toLowerCase();
	
    if(extFile == "jpg" || extFile == "gif" || extFile == "jpeg" || extFile == "png") {
	
      var file = form.file.files[0];
      
      var storageRef = firebase.storage().ref('images/'+Date.now()+file.name);
      var uploadTask = storageRef.put(file);

      // Wyłapywanie zmian, błędów oraz progresu przesyłania
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, 
        (snapshot) => {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: 
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: 
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case 'storage/unauthorized':
              // Użytkownik nie ma dostępu do obiektu 
              break;
            case 'storage/canceled':
              // Użytkownik przerwał przesyłanie
              break;

            // ...

            case 'storage/unknown':
              // Nieznany błąd
              break;
          }
        },
        () => {
          // Przesyłanie zakończone sukcesem, pobranie URL do obrazka
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL);
            firebase.auth().onAuthStateChanged(function(user) {
              if (user) {
                var email = user.email
                var uid = user.uid;

                db.collection('recipes').add({
                  name: form.name.value,
                  time: form.time.value,
                  description: form.description.value,
                  photo: downloadURL,
                  author: email,
                  user_id: uid,
	              });
              } 
            });
          window.location.replace("show_recipes.html");
          }
      );
    }
    );

    }else if(image.value ==""){
		firebase.auth().onAuthStateChanged(function(user) {
              if (user) {
                var email = user.email
                var uid = user.uid;

                db.collection('recipes').add({
                  name: form.name.value,
                  time: form.time.value,
                  description: form.description.value,
                  photo: "images/dish.png",
                  author: email,
                  user_id: uid,
	              });
              } 
            });
			window.location.replace("show_recipes.html");

	}
    else if (extFile == "jpg" || extFile == "gif" || extFile == "jpeg" || extFile == "png" ){
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          var author = user.email;
          var uid = user.uid;

          console.log('else');
          db.collection('recipes').add({
            name: form.name.value,
            time: form.time.value,
            description: form.description.value,
            author: author,
            user_id: uid,
          });
          } 
      });
      window.location.replace("show_recipes.html");
    }else{
		alert("Dozwolone typy plików to: .jpg, .jpeg, .png, .gif")
	}
	
	 }

}
