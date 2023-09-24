var url = window.location.href;
var index = url.search("#");
var id = url.slice(index+1);


var recipe = db.collection("recipes").doc(id);

var file = {};

function chooseFile(e) {
  file = e.target.files[0]
}

// Edycja przepisu 
recipe.get().then((doc) => {
    if (doc.exists) {
        var modal = document.getElementById("myModal");
        var denyElement = document.getElementById('denyChanges')
        var applyElement = document.getElementById('applyChanges')

        var nameModal = document.getElementById("name-modal");
        var descriptionModal = document.getElementById("description-modal");
        var timeModal = document.getElementById("time-modal");
        var btmUploadModal = document.getElementById("upload-modal");

        nameModal.value = doc.data().name;
        descriptionModal.value = doc.data().description;
        timeModal.value = doc.data().time;

        applyElement.addEventListener('click', e =>{
			
          if(confirm("Jesteś pewien że chcesz zapisać zmiany?")){
            db.collection('recipes').doc(id).update({
                    name:nameModal.value,
                    description:descriptionModal.value,
                    time:timeModal.value,
                    });
            if (file.name != undefined) {
              let indexDot = file.name.lastIndexOf(".") + 1;
              let extFile = file.name.substr(indexDot, file.name.length).toLowerCase();
              if(extFile == "jpg" || extFile == "gif" || extFile == "jpeg" || extFile == "png"){
              firebase.storage().ref('images/'+id+file.name).put(file).then(function(){
                firebase.storage().ref('images/'+id+file.name).getDownloadURL().then(photoURL => {
                  db.collection('recipes').doc(id).update({
                  photo: photoURL,
					        })
                  window.location.replace("details.html#"+id);
                })
				
              }).catch(error =>{
                console.log(error.message);
              })
            }else{
				alert("Dozwolone typy plików to: .jpg, .jpeg, .png, .gif")
			}
            }else{
				window.location.replace("details.html#"+id);
			}			            
            }
          });
    } else {
        console.log("No such document!");
    }
}).catch((error) => {
    console.log("Error getting document:", error);
});





