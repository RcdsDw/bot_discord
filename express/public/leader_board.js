let list = document.getElementById('coubeh-list');

console.log('js prêt.');

// Utilisation de fetch pour récupérer les données de l'API
fetch('/api/users')
  .then((response) => response.json())
  .then((users) => {
    users.forEach((user) => {
      list.innerHTML += `<li class="kudos-item">
                          <img src="${user.avatar}" alt="${user.name}" class="avatar">
                          <span class="username">@${user.global_name}</span>
                          <span class="kudos">${user.number_of_looses} 👏</span>
                        </li>`;
    });
  })
  .catch((error) => {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
  });
