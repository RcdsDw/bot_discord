let incoubables = document.getElementById('top-sender');
let list = document.getElementById('coubeh-list');
let date = document.getElementById('date-range');

date.innerHTML = `${new Date().toLocaleDateString('fr-FR')}`;

fetch('/api/users')
  .then((response) => response.json())
  .then((users) => {
    users.forEach((user) => {
      console.log(user);
      if (
        user.user_id === '246753473587052555' ||
        user.user_id === '110357707059380224' ||
        user.user_id === '700823009643987014' 
      ) {
        incoubables.innerHTML += `<img src="${user.avatar}" alt="Avatar de ${user.global_name}" class="avatar">
                                <div class="top-sender-name">@${user.global_name}</div>`;
      } else {
        if (user.number_of_looses > 0) {
          list.innerHTML += `<li class="kudos-item">
                                <img src="${user.avatar}" alt="Avatar de ${user.global_name}" class="avatar">
                                <span class="username">@${user.global_name}</span>
                                <span class="kudos">${user.number_of_looses} 👏</span>
                             </li>`;
        }
      }
    });
  })
  .catch((error) => {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
  });
