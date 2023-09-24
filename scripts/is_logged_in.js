
  // Sprawdzanie czy użytkownik jest zalogowany oraz powiązane z tym operacje
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      var currentUserId = firebaseUser.uid;
      console.log('is logged in:', firebaseUser.email);
      document.getElementById("register").setAttribute("style", "display: none;");
      document.getElementById("login").setAttribute("style", "display: none;");
      document.getElementById("recipes").setAttribute("href", "my_recipes.html#"+currentUserId);
      let name = document.getElementById('navbarDropdown')
      db.collection('users').doc(currentUserId).get().then(doc => {
        name.innerText = doc.data().login;
        });
    } else {
      console.log('not logged in');
      document.getElementById("add_recipe").setAttribute("style", "display: none;");
      document.getElementById("user").setAttribute("style", "display: none;");
      }
  })


