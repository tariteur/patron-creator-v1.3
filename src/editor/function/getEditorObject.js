export function getEditorObject() {
  // Sélectionner la div avec l'id "htmlElement"
  const container = document.getElementById("htmlElement");
  
  // Créer un objet pour stocker les valeurs
  const result = {};

  // Sélectionner tous les éléments input à l'intérieur de la div
  const inputs = container.querySelectorAll('input');

  // Boucler à travers chaque input pour récupérer son id et sa valeur
  inputs.forEach(input => {
    // Récupérer l'id et la valeur
    const id = input.id;
    const value = parseFloat(input.value) || 0;

    // Ajouter la valeur à l'objet avec l'id comme clé
    result[id] = value;
  });
  return result;
}
