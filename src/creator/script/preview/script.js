export class SVGPreview {
  // Le constructeur initialise l'éditeur SVG avec le sélecteur du SVG et une partie spécifique
  constructor(
    jsonStringElements,
    jsonStringEditor,
    jsContent,
    createLine,
    createPath,
    createInput,
    getEditorObject
  ) {
    this.panelControls = document.getElementById("htmlElementPreview"); // Sélectionne l'élément HTML où les contrôles (inputs) seront affichés
    this.elementsPreview = document.getElementById("elementsPreview");

    this.jsonStringElements = jsonStringElements;
    this.jsonStringEditor = jsonStringEditor;
    this.jsContent = jsContent;

    this.createLine = createLine;
    this.createPath = createPath;
    this.createInput = createInput;

    this.getEditorObject = getEditorObject;
    this.init(); // Appelle la méthode init pour initialiser l'éditeur
  }

  // Méthode pour initialiser les éléments HTML (comme les inputs) à partir des données JSON
  initializeHTML(html) {
    // Supprimer tout le contenu de 'htmlElement'
    this.panelControls.innerHTML = ""; // Vide l'élément HTML pour pouvoir y ajouter de nouveaux contrôles
    // Pour chaque élément dans les données JSON, crée et ajoute un label et un input
    html.forEach((inpuData) => {
      const [label, input] = this.createInput(inpuData); // Utilise la fonction createInput pour créer le label et l'input

      this.panelControls.appendChild(label); // Ajoute le label à l'élément HTML
      this.panelControls.appendChild(input); // Ajoute l'input à l'élément HTML
    });
  }

  // Méthode pour initialiser les éléments SVG à partir des données JSON
  initializeSVG(data) {
    // Supprimer tout le contenu de 'elements'
    this.elementsPreview.innerHTML = ""; // Vide le groupe d'éléments dans le SVG

    // Si les données JSON contiennent des lignes, les ajouter au SVG
    if (data.lines) {
      data.lines.forEach((lineData) => {
        this.elementsPreview.appendChild(this.createLine(lineData)); // Crée une ligne et l'ajoute au groupe d'éléments
      });
    }

    // Si les données JSON contiennent des chemins, les ajouter au SVG
    if (data.paths) {
      data.paths.forEach((pathData) => {
        this.elementsPreview.appendChild(this.createPath(pathData)); // Crée un chemin et l'ajoute au groupe d'éléments
      });
    }
  }

  // Méthode pour configurer les écouteurs d'événements sur les sliders
  setupSliderEventListeners() {
    const patronSliders = document.querySelectorAll(".EventListeners"); // Sélectionne tous les éléments avec la classe "EventListeners"

    // Ajoute un écouteur d'événement à chaque slider pour appliquer les nouvelles tailles lorsqu'il est utilisé
    patronSliders.forEach((patronSlider) => {
      patronSlider.addEventListener("input", () => {
        const editor = this.getEditorObject(); // Obtient l'objet de l'éditeur actuel
        this.appliquerTailles(...Object.values(editor)); // Applique les tailles en fonction des valeurs actuelles de l'éditeur
      });
    });
  }

  // Méthode d'initialisation qui est appelée lors de la création de l'objet SVGEditor
  async init() {
    try {
      const data = JSON.parse(this.jsonStringElements);
      this.initializeHTML(data.html);
      this.initializeSVG(data.svg); // Initialise les éléments SVG

      // Importer setTailles avant de traiter jsContent
      const { setTailles } = await import("./function/setTailles.js");

      this.jsContent = this.jsContent.replace(
        /import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"];/g,
        "" // Remplacer l'importation par une chaîne vide
      );

      this.jsContent = this.jsContent.replace(
        /export\s+function\s+appliquerTailles\s*\(/,
        "function appliquerTailles("
      );

      // Créer la fonction avec setTailles accessible
      this.appliquerTailles = new Function(
        "setTailles",
        this.jsContent + "\n return appliquerTailles;"
      )(setTailles); // Passer setTailles comme argument

      const editorString = this.jsonStringEditor;
      const parsedData = JSON.parse(editorString); // Convertit la chaîne JSON en objet
      this.appliquerTailles(...Object.values(parsedData)); // Applique les tailles
      this.setupSliderEventListeners();
    } catch (error) {
      console.error("Initialization failed:", error);
    }
  }
}
