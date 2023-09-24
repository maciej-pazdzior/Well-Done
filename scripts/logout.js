// Przycisk "Wyloguj się"

drpLogout.addEventListener('click', e => {
  firebase.auth().signOut();
  window.location.href = "index.html";
});