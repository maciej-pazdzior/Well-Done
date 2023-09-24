const details = document.querySelector('#details');
const comments_field = document.querySelector('#comments');

var url = window.location.href;
var index = url.search("#");
var id = url.slice(index+1);

var recipe = db.collection("recipes").doc(id);

var comments_doc = db.collection('recipes').doc(id).collection('comments');

// Wyświetlanie szczegółowego przepisu 
recipe.get().then((doc) => {
    if (doc.exists) {
        let name = document.createElement('h3');
        let time = document.createElement('p');
        let description = document.createElement('p');
        let delete_btn = document.createElement('button');
        let edit_btn = document.createElement('button');
        let img = document.createElement('img');
        let author = document.createElement('a');
        let created_by = document.createElement('p');
        let card = document.createElement('div');
        let card_body = document.createElement('div');
        let card_header = document.createElement('div');
        let btn_row = document.createElement('div');
        let br = document.createElement('br');

        name.textContent = doc.data().name;
        time.textContent = "Czas przygotowania: " + doc.data().time + " min";
        description.textContent = doc.data().description;
        delete_btn.textContent = "Usuń";
        edit_btn.textContent = "Edytuj";
        created_by.textContent = "Utworzony przez: ";

        var authorId = doc.data().user_id;
        db.collection('users').doc(authorId).get().then(doc => {
          author.textContent = doc.data().login;        
          });
        author.setAttribute('href', 'user_profile.html#'+doc.data().user_id);
        
        firebase.auth().onAuthStateChanged(function(user) {
          if(user) {
            var currentUserId = user.uid;
            var recipeUserId = doc.data().user_id;
            if (currentUserId == recipeUserId) {
              delete_btn.setAttribute("style", "display: block;");
              edit_btn.setAttribute("style", "display: block;");
              btn_row.setAttribute('class', 'row')
            } else {
              delete_btn.setAttribute("style", "display: none;");
              edit_btn.setAttribute("style", "display: none;");              
            }
          } else {
            delete_btn.setAttribute("style", "display: none;");
            edit_btn.setAttribute("style", "display: none;")
            } 
        });

        name.setAttribute('class', 'details')
        description.setAttribute('class', 'description')
        img.setAttribute('src', doc.data().photo)
        img.setAttribute('class', 'card-img-top')
        delete_btn.setAttribute("type", "button");
        delete_btn.setAttribute("class", "btn btn-danger col-4 offset-2");
        edit_btn.setAttribute("type", "button");
        edit_btn.setAttribute("class", "btn btn-success col-4 offset-1");
        card.setAttribute('class', 'card');
        card_body.setAttribute('class', 'card-body');
        card_header.setAttribute('class', 'card-header');
        
        card_header.appendChild(name);
        card_body.appendChild(img);
        card_body.appendChild(br);
        card_body.appendChild(time);
        card_body.appendChild(description);
        created_by.appendChild(author);
        card_body.appendChild(created_by);
        btn_row.appendChild(edit_btn);
        btn_row.appendChild(delete_btn);
        card_body.appendChild(btn_row);
        card.appendChild(card_header);
        card.appendChild(card_body);
        details.appendChild(card);

        delete_btn.addEventListener('click', (e) => {
          e.stopPropagation();
          db.collection('recipes').doc(id).delete();
          window.location.replace("show_recipes.html")})

        edit_btn.addEventListener('click', (e) => {
          e.stopPropagation();
          window.location.replace("edit_recipe.html#"+id)
          });
    } else {
        console.log("No such document!");
    }
}).catch((error) => {
    console.log("Error getting document:", error);
});


//komentarze
function renderComment(doc){
    var recipeUserId = doc.data().user_id;

    let card = document.createElement('div');
    let header = document.createElement('div');
    let card_body = document.createElement('div');
    let author = document.createElement('a');
    let rating = document.createElement('span');
    let comment = document.createElement('p');
    let new_line = document.createElement('br');
    let star_icon = document.createElement('img');
    let row = document.createElement('div');
    let col1 = document.createElement('div');
    let col2 = document.createElement('div');
    let div = document.createElement('div');
    let delete_btn = document.createElement('button');
    let profile_img = document.createElement('img');
    let footer = document.createElement('div');

    author.textContent = doc.data().author;
    comment.textContent = doc.data().comment;
    rating.textContent = doc.data().rating + "/5                                                                 ";
    delete_btn.textContent = "Usuń komentarz";

    db.collection('users').doc(doc.data().user_id).get().then((doc) => {
        profile_img.setAttribute('src',doc.data().userPhoto); 
      })
    
    firebase.auth().onAuthStateChanged(function(user) {
      if(user) {
        var currentUserId = user.uid;
        if (currentUserId == recipeUserId) {
          delete_btn.setAttribute("style", "display: block;");
        } else {
          delete_btn.setAttribute("style", "display: none;");             
        }
      } else {
        delete_btn.setAttribute("style", "display: none;");
        } 
    });

    author.setAttribute('href','user_profile.html#'+recipeUserId);
    author.setAttribute('class', 'comment')
    footer.setAttribute('class','card-footer');
    card.setAttribute('data-id', doc.id);
    card.setAttribute('class', 'card');
    header.setAttribute('class', 'card-header');
    card_body.setAttribute('class', 'card-body');
    star_icon.setAttribute('src', 'images/star.png');
    star_icon.setAttribute('class', 'icon');
    row.setAttribute('class', 'row');
    col1.setAttribute('class', 'col-2 col-xs-1 col-md-1 col-lg-1 col-xl-1');
    col2.setAttribute('class', 'col-10 col-xs-11 col-md-11 col-lg-11 col-xl-11 ');
    delete_btn.setAttribute("type", "button");
    delete_btn.setAttribute("class", "btn btn-danger");
    profile_img.setAttribute('class', 'profile-pic');
    footer.setAttribute("align", "right");

    col1.appendChild(profile_img);
    col2.appendChild(author);
    footer.appendChild(rating);
    footer.appendChild(star_icon);
    row.appendChild(col1);
    row.appendChild(col2);
    header.appendChild(row);
    card_body.appendChild(comment);
    card_body.appendChild(delete_btn);
    card.appendChild(header);
    card.appendChild(card_body);
    card.appendChild(footer);
    
    comments_field.appendChild(new_line);
    comments_field.appendChild(card);

    delete_btn.addEventListener('click', (e) => {
      if (window.confirm("Czy chcesz usunąć swój komentarz?")) {
        e.stopPropagation();
        comments_doc.doc(doc.id).delete();
        window.location.reload();
      }
    });
};

//generuje/renderuje aktualne komentarze z bazy danych
comments_doc.onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added'){
            renderComment(change.doc);
        }
    });
});

function add_comment(){
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      window.location.replace("add_comment.html#"+id);
    } else {
      alert("Musisz być zalogowany, żeby móc dodać komentarz!");
      }
  })
};