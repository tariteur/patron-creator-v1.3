import { getEditorObject } from './getEditorObject.js';

function getTokenFromCookie() {
  const token = document.cookie.split(';').map(cookie => cookie.trim().split('=')).find(([name]) => name === 'token');
  return token ? token[1] : null;
}

const urlParams = new URLSearchParams(window.location.search);
const token = getTokenFromCookie();

save.addEventListener("click", () => {
  const editorPart = getEditorObject(); // Assurez-vous que cette fonction renvoie l'objet editor correctement
  const name = urlParams.get('name');
  const rdv = urlParams.get('rdv');
  const part = document.querySelector("#typesName").value;

  // Vérifiez que les paramètres nécessaires sont présents
  if (!name || !rdv || !editorPart) {
      console.error('Données manquantes pour la modification du rendez-vous');
      return;
  }
  
  const clientData = {
      action: 'update-appointment',
      name,
      index: {
          rdv,
          editor: {
            [part]: editorPart // Assignez directement la valeur de `editorPart`
          }
      }
  };

  fetch('/data', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(clientData)
  })
  .then(response => response.ok ? response.text() : Promise.reject(response.statusText))
  .then(data => console.log('Rendez-vous modifié avec succès :', data))
  .catch(error => console.error('Erreur lors de la modification du rendez-vous :', error));
});
