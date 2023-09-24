// Wyświetlanie przepisów zalogowanego użytkownika 
const recipeRows = document.querySelector('#recipe-row');

var url = window.location.href;
var index = url.search("#");
var id = url.slice(index+1);

var user_doc = db.collection("users").doc(id);
console.log(user);

function renderRecipe(doc){
    let name = document.createElement('h3');
    let time = document.createElement('h6');
    let rows = document.createElement('div');
    let card = document.createElement('div');
    let card_body = document.createElement('div');
    let btn = document.createElement('button');
    let icon = document.createElement('img');
    let new_line2 = document.createElement('br');
    let img = document.createElement('img');
    let author = document.createElement('a');
    let author2 = document.createElement('h6');
    let card_deck = document.createElement('div');
    let card_footer = document.createElement('div');
    
    name.textContent = doc.data().name;
    time.textContent = doc.data().time + " min ";
    btn.textContent = 'Zobacz więcej';
    author2.textContent = 'Utworzone przez: '
    var authorId = doc.data().user_id;

    db.collection('users').doc(authorId).get().then(doc => {
      author.textContent = doc.data().login;
      author.setAttribute('href','user_profile.html#'+authorId);        
      });
    
    if (typeof doc.data().photo === 'undefined') {
      img.setAttribute('src', 'images/dish.png')
    } else {
      img.setAttribute('src', doc.data().photo)   
    }

    author2.setAttribute('class', 'author')
    time.setAttribute('class', 'time')
    img.setAttribute('class', 'card-img')
    rows.setAttribute('data-id', doc.id)
    rows.setAttribute('class', 'col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 py-2')
    btn.setAttribute('class', 'btn btn-success btn-lg btn-block')
    icon.setAttribute('src','images/clock.png')
    icon.setAttribute('class', 'icon')
    card.setAttribute('class', 'card hover h-100')
    card_body.setAttribute('class', 'card-body')
    name.setAttribute('class', 'card-title')
    card_deck.setAttribute('class', 'class-deck')
    card_footer.setAttribute('class', 'card-footer')

    time.appendChild(icon);
    card_body.appendChild(time);
    card_body.appendChild(name);
    card_body.appendChild(img);
    card.appendChild(card_body);
    author2.appendChild(author);
    card_footer.appendChild(author2);
    card_footer.appendChild(btn);
    card.appendChild(card_footer);
    card_deck.appendChild(card);
    rows.appendChild(card_deck);
    
    recipeRows.appendChild(rows);

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      let id = e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-id');
      window.location.replace("details.html#"+id);
    })

}

user_doc.get().then((doc) => {
  if(doc) {
    db.collection('recipes').where("user_id", "==", id).orderBy('time').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added'){
            renderRecipe(change.doc);
        } else if (change.type == 'removed'){
            let rows = recipeRows.querySelector('[data-id=' + change.doc.id + ']');
            recipeRows.removeChild(rows);
        }
    });
});
  }
});