const form = document.querySelector('#add-comment');
const comment_validation = document.getElementById('comment');
const errorElement = document.getElementById('error');

var url = window.location.href;
var index = url.search("#");
var id = url.slice(index+1);

var comments_doc = db.collection('recipes').doc(id).collection('comments')

form.addEventListener('submit', (e) => {
    e.preventDefault();
});

// Dodawanie komenatrzy
function add_comment(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var uid = user.uid;
	  let messages = []
	  if (form.comment.value.length < 1 || form.comment.value.length > 5000){
		  messages.push("Komentarz powinien zawierać co najmniej 1 znak oraz co najwyżej 5000")
		  form.comment.style.border = "solid 2px red"
	  }
	  if (messages.length > 0){
		errorElement.className = "alert"
		text = "";
		for (i = 0; i < messages.length; i++){
			text += "! " + messages[i] + "<br>";
		}
		errorElement.innerHTML = text
	  }else{
		db.collection('users').doc(uid).get().then(doc => {
			var author = doc.data().login

			comments_doc.add({
				author: author,
				comment: form.comment.value,
				rating: form.rating.value,
				user_id: uid,
			});
			window.location.replace("details.html#"+id);
		});
	  }	  
    }
  })
}
