import { getEditorObject } from './getEditorObject.js';

export function setTailles(data) {
  // console.log(data); // Affiche les données passées à la fonction
  
  const editor = getEditorObject();
  // console.log(editor); // Affiche l'objet éditeur
  
  // Parcourt chaque clé dans l'objet data
  for (const [key, value] of Object.entries(data)) {
    // Génère l'ID de l'élément DOM à partir de la clé
    const elementId = key.replace(/_/g, '');
    
    // Trouve l'élément DOM correspondant
    const element = document.getElementById(elementId);
    
    // Si l'élément existe, mettez à jour sa valeur
    if (element) {
      element.value = parseFloat(value);
    } else {
      // Affiche un message d'erreur dans la console si l'élément n'est pas trouvé
      console.error(`Élément avec l'ID "${elementId}" non trouvé pour la clé "${key}".`);
    }
  }
}
