export function createInput(labelData) {
    // Créer le label
    const label = document.createElement('label');
    label.setAttribute('for', labelData.id);
    label.textContent = labelData.label;
    
    // Créer l'input
    const input = document.createElement('input');
    input.setAttribute('type', labelData.type);
    input.setAttribute('id', labelData.id);
    input.setAttribute('name', labelData.name);
    input.setAttribute('min', labelData.min);
    input.setAttribute('max', labelData.max);
    input.setAttribute('step', labelData.step);
    input.setAttribute('value', labelData.value);
    input.setAttribute('class', labelData.class);
    
    return [label, input];
}
