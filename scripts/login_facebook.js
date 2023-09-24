// Logowanie za pomocą konta Facebook
const btnLoginFacebook = document.getElementById('btnLoginFacebook');
const auth = firebase.auth();

const signInWithFacebook = () => {

  const facebookProvider = new firebase.auth.FacebookAuthProvider();

  auth.signInWithPopup(facebookProvider)
  .then(() => {
  firebase.auth().onAuthStateChanged(firebaseUser => {
      if(firebaseUser) {
          var email = firebaseUser.email;
          var id = firebaseUser.uid;
          db.collection('users').doc(id).set({
            login: email,
            bio: 'Użytkownik nie dodał jeszcze opisu',
            userPhoto: 'images/dish.png'
		      });
          window.location.assign('index.html');
      }
})    
  })
  .catch(error => {
    console.error(error);
  })
}

btnLoginFacebook.addEventListener('click', signInWithFacebook);
