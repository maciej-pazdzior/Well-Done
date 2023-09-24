// Wyświetlanie profilu konkretnego użytkownika 

const profile = document.querySelector('#profileContent')

var url = window.location.href;
var index = url.search("#");
var id = url.slice(index+1);

var user = db.collection("users").doc(id);

user.get().then((doc) => {
    if (doc.exists) {
      
      let login = document.createElement('h2');
      let profile_img = document.createElement('img');
      let h5 = document.createElement('h5');
      let bio = document.createElement('p');
      let card_header = document.createElement('div');
      let card_body = document.createElement('div');
      let row = document.createElement('div');
      let col1 = document.createElement('div');
      let col2 = document.createElement('div');
      let recipes_link = document.createElement('a')
      let center_link = document.createElement('div')

      login.textContent = doc.data().login;
      h5.textContent = "O mnie:";
      bio.textContent = doc.data().bio;
	  // link przepisy
      recipes_link.textContent = "Przepisy użytkownika"
      
      center_link.setAttribute('style', 'text-align: center')
      recipes_link.setAttribute('href', 'user_recipes.html#'+id)
      recipes_link.setAttribute('class', 'recipes-link')
      card_body.setAttribute('class', 'card-body');
      card_header.setAttribute('class', 'card-header');
      profile_img.setAttribute('class', 'profile')
      profile_img.setAttribute('src',doc.data().userPhoto);
      row.setAttribute('class','row');
      col1.setAttribute('class','col-6');
      col2.setAttribute('class','col-6');
    
      card_header.appendChild(login);
      col1.appendChild(profile_img);
      col2.appendChild(h5);
      col2.appendChild(bio);
      row.appendChild(col2);
      row.appendChild(col1);
      card_body.appendChild(row);
      center_link.appendChild(recipes_link);
      card_body.appendChild(center_link);
      profile.appendChild(card_header);
      profile.appendChild(card_body);
		
	} else {
        console.log("No such profile!");
    }
})
