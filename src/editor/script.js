// Importation des fonctions externes nécessaires pour créer des éléments SVG et manipuler l'éditeur
import { createLine } from './function/svg/createLine.js';
import { createPath } from './function/svg/createPath.js';
import { createInput } from './function/svg/createInput.js';
import { getEditorObject } from './function/getEditorObject.js';

// Définition de la classe SVGEditor pour manipuler et éditer un SVG
export class SVGEditor {
    // Le constructeur initialise l'éditeur SVG avec le sélecteur du SVG et une partie spécifique
    constructor(svgSelector, part) {
        this.svg = document.querySelector(svgSelector); // Sélectionne l'élément SVG dans le DOM
        this.elements = svg.querySelector("#elements"); // Sélectionne le groupe d'éléments dans le SVG où les lignes et les chemins seront ajoutés
        this.panelControls = document.getElementById('htmlElement'); // Sélectionne l'élément HTML où les contrôles (inputs) seront affichés

        this.part = part; // Stocke la partie spécifique du patron à manipuler
        this.init(); // Appelle la méthode init pour initialiser l'éditeur
    }

    // Méthode pour récupérer les données JSON associées à la partie du patron
    async fetchData() {
        try {
            const response = await fetch(`./patron-logic/${this.part}/elements.json`); // Fait une requête pour charger les données JSON
            return await response.json(); // Renvoie les données JSON
        } catch (error) {
            console.error('Error loading JSON:', error); // Affiche une erreur en cas d'échec
            throw error; // Propage l'erreur pour un traitement ultérieur
        }
    }

    // Méthode pour initialiser les éléments HTML (comme les inputs) à partir des données JSON
    initializeHTML(data) {        
        // Supprimer tout le contenu de 'htmlElement'
        this.panelControls.innerHTML = ''; // Vide l'élément HTML pour pouvoir y ajouter de nouveaux contrôles
        
        // Pour chaque élément dans les données JSON, crée et ajoute un label et un input
        data.forEach(inpuData => {
            const [label, input] = createInput(inpuData); // Utilise la fonction createInput pour créer le label et l'input

            this.panelControls.appendChild(label); // Ajoute le label à l'élément HTML
            this.panelControls.appendChild(input); // Ajoute l'input à l'élément HTML
        });
    }    

    // Méthode pour initialiser les éléments SVG à partir des données JSON
    initializeSVG(data) {
        // Supprimer tout le contenu de 'elements'
        this.elements.innerHTML = ''; // Vide le groupe d'éléments dans le SVG
        
        // Si les données JSON contiennent des lignes, les ajouter au SVG
        if (data.lines) {
            data.lines.forEach(lineData => {
              this.elements.appendChild(createLine(lineData)); // Crée une ligne et l'ajoute au groupe d'éléments
            });
        }

        // Si les données JSON contiennent des chemins, les ajouter au SVG
        if (data.paths) {
            data.paths.forEach(pathData => {
              this.elements.appendChild(createPath(pathData)); // Crée un chemin et l'ajoute au groupe d'éléments
            });
        }

        document.body.appendChild(this.svg); // Ajoute le SVG au corps du document (bien que cela soit peut-être redondant si le SVG est déjà dans le DOM)
    }

    // Méthode pour appliquer les tailles à partir d'une chaîne JSON provenant de l'URL
    applySizesFromEditorString(editorString) {
        let correctEditorObject = {};
        if (editorString) {
            try {
                const editorObject = JSON.parse(editorString); // Convertit la chaîne JSON en un objet JavaScript
                const parts = Object.keys(editorObject); // Récupère toutes les clés de l'objet JSON
                
                // Parcourt chaque clé pour trouver celle qui correspond à la partie actuelle
                parts.forEach((part) => {
                    if (part === this.part) { // Utilise '===' pour s'assurer que la comparaison est stricte
                        correctEditorObject = editorObject[part]; // Extrait l'objet correspondant à la partie
                    }
                });
            } catch (error) {
                console.error('Invalid editor string:', error); // Affiche une erreur si la chaîne JSON est invalide
            }
        }
        this.appliquerTailles(...Object.values(correctEditorObject)); // Applique les tailles en utilisant la méthode `appliquerTailles`
    }

    // Méthode pour configurer les écouteurs d'événements sur les sliders
    setupSliderEventListeners() {
        const patronSliders = document.querySelectorAll(".EventListeners"); // Sélectionne tous les éléments avec la classe "EventListeners"

        // Ajoute un écouteur d'événement à chaque slider pour appliquer les nouvelles tailles lorsqu'il est utilisé
        patronSliders.forEach(patronSlider => {
            patronSlider.addEventListener("input", () => {
                const editor = getEditorObject(); // Obtient l'objet de l'éditeur actuel
                this.appliquerTailles(...Object.values(editor)); // Applique les tailles en fonction des valeurs actuelles de l'éditeur
            });
        });
    }

    // Méthode d'initialisation qui est appelée lors de la création de l'objet SVGEditor
    async init() {
        try {
            const data = await this.fetchData(); // Récupère les données JSON nécessaires pour initialiser le SVG et les contrôles HTML
            this.initializeSVG(data.svg); // Initialise les éléments SVG
            this.initializeHTML(data.html); // Initialise les contrôles HTML

            const module = await import(`./patron-logic/${this.part}/${this.part}.js`); // Importe dynamiquement le module JS correspondant à la partie du patron
            this.appliquerTailles = module.appliquerTailles; // Assigne la méthode `appliquerTailles` du module importé à l'instance courante

            const urlParams = new URLSearchParams(window.location.search); // Récupère les paramètres de l'URL
            const editorString = urlParams.get("editor"); // Récupère la chaîne JSON "editor" à partir des paramètres de l'URL

            this.applySizesFromEditorString(editorString); // Applique les tailles en fonction de la chaîne JSON
            this.setupSliderEventListeners(); // Configure les écouteurs d'événements pour les sliders
        } catch (error) {
            console.error('Initialization failed:', error); // Affiche une erreur si l'initialisation échoue
        }
    }
}
