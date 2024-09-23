// Importation des fonctions externes pour la création et la manipulation des éléments SVG
import { createCurveThroughPoints } from "./function/svg/createCurveThroughPoints.js";
import { DynamicBlockManager } from "./script/scratch.js";

import { createLine } from "./function/svg/createLine.js";
import { createPath } from "./function/svg/createPath.js";
import { createInput } from "./script/preview/function/svg/createInput.js";
import { getEditorObject } from "./script/preview/function/getEditorObject.js";

import { SVGPreview } from "./script/preview/script.js";
// Classe SVGCreator pour la gestion et l'édition d'un SVG
export class SVGCreator {
  constructor(svgSelector) {
    this.svg = svgSelector; // Sélection de l'élément SVG dans le DOM
    this.elementsEditor = this.svg.querySelector("#elementsEditor"); // Groupe d'éléments dans le SVG
    this.elementsPreview = this.svg.querySelector("#elementsPreview");
    this.panelControls = document.getElementById("htmlElementCreator"); // Élément HTML pour les contrôles
    this.selectedMod = "deplacement"; // Mode de sélection actuel
    this.curvePoints = []; // Points pour les courbes
    this.segmentPoints = []; // Points pour les segments
    this.movingPoint = null; // Point en déplacement
    this.connections = [];
    this.inputData = [];

    this.variableCount = 1; // Compteur de variables

    this.workspace;

    this.dynamicBlockManager = new DynamicBlockManager();
    this.init(); // Initialisation de l'éditeur
  }

  // Méthode d'initialisation
  init() {
    var toolbox = document.getElementById("toolbox");
    this.workspace = Blockly.inject("blocklyDiv", {
      toolbox: toolbox.innerHTML,
      scrollbars: true,
      trashcan: true,
    });

    this.addEventListeners(); // Ajout des écouteurs d'événements

    setInterval(() => {
      this.updateScriptAreas(this);
      this.dynamicBlockManager.updateToolbox(this);
    }, 2500);
  }

  updateToolbox() {
    this.dynamicBlockManager.updateToolbox(this);
  }

  // Ajoute les écouteurs d'événements aux éléments nécessaires
  addEventListeners() {
    const addButton = document.getElementById("add-label");
    if (addButton) {
      addButton.addEventListener("click", () => this.addInput());
    }

    // Gestion des clics sur le SVG
    this.svg.addEventListener("click", (event) => this.handleSVGClick(event));
    // Gestion du déplacement des points
    this.svg.addEventListener("mousemove", (event) =>
      this.handleSVGMouseMove(event)
    );
    // Création de courbes
    const createCurveButton = document.getElementById("createCurveButton");
    createCurveButton.addEventListener("click", () => this.finishCurve());

    const downloadButton = document.getElementById("downloadDataButton");
    if (downloadButton) {
      downloadButton.addEventListener("click", () => this.downloadData());
    }
  }

  preview() {
    this.elementsEditor.style.display = "none"; // Effacer le contenu SVG

    const { jsonStringElements, jsonStringEditor, jsContent } = this.getData();

    this.SVGpreview = new SVGPreview(
      jsonStringElements,
      jsonStringEditor,
      jsContent,
      createLine,
      createPath,
      createInput,
      getEditorObject
    );
  }

  editor() {
    while (this.elementsPreview.firstChild) {
      this.elementsPreview.removeChild(this.elementsPreview.firstChild);
    }
    this.elementsEditor.style.display = "block"; // Effacer le contenu SVG
  }

  // Gère les clics sur le SVG
  handleSVGClick(event) {
    const point = this.svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const svgPoint = point.matrixTransform(this.svg.getScreenCTM().inverse());
    const x = svgPoint.x;
    const y = svgPoint.y;

    switch (this.selectedMod) {
      case "point":
        this.addCircle(x, y);
        break;
      case "segment":
        this.selectCircleForSegment(event.target);
        break;
      case "courbe":
        this.selectCircleForCurve(event.target);
        break;
      case "deplacement":
        if (this.movingPoint) {
          this.moveCircle(this.movingPoint, x, y);
          this.movingPoint.style.pointerEvents = "auto";
          this.movingPoint = null; // Désélectionner le point après déplacement
        }
        break;
    }
  }

  // Gère le déplacement des points
  handleSVGMouseMove(event) {
    if (this.selectedMod === "deplacement" && this.movingPoint) {
      const point = this.svg.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;
      const svgPoint = point.matrixTransform(this.svg.getScreenCTM().inverse());
      this.moveCircle(this.movingPoint, svgPoint.x, svgPoint.y);
    }
  }

  // Change le mode de sélection et réinitialise les sélections de points
  changeMode(newMode) {
    this.selectedMod = newMode;
    this.resetSelections(); // Réinitialise les sélections de points
  }

  // Réinitialise les sélections de points
  resetSelections() {
    // Réinitialiser les couleurs des cercles sélectionnés
    this.elementsEditor.querySelectorAll("circle").forEach((circle) => {
      if (circle.getAttribute("fill") === "blue") {
        circle.setAttribute("fill", "green");
      }
    });

    // Réinitialiser les points sélectionnés pour les segments et les courbes
    this.segmentPoints = [];
    this.curvePoints = [];
  }

  // Ajoute un cercle au SVG
  addCircle(x, y) {
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 10);
    circle.setAttribute("fill", "green");
    circle.setAttribute("data-point-id", `${x}-${y}`);

    circle.addEventListener("click", (event) => this.handleCircleClick(event));

    this.elementsEditor.appendChild(circle);
  }

  // Gère le clic sur un cercle
  handleCircleClick(event) {
    event.stopPropagation();
    const circle = event.target;

    switch (this.selectedMod) {
      case "segment":
        this.selectCircleForSegment(circle);
        break;
      case "courbe":
        this.selectCircleForCurve(circle);
        break;
      case "deplacement":
        this.movingPoint = circle;
        break;
      default:
        const fillColor =
          circle.getAttribute("fill") === "green" ? "blue" : "green";
        circle.setAttribute("fill", fillColor);
        break;
    }
  }

  // Déplace un cercle et met à jour les éléments connectés
  moveCircle(circle, x, y, updateConnected = true) {
    // Déplace le cercle en mettant à jour ses attributs 'cx' et 'cy'
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);

    // Empêche le cercle de répondre aux événements de souris
    circle.style.pointerEvents = "none";

    // Met à jour les éléments connectés si nécessaire
    if (updateConnected) {
      this.updateConnectedElements();
    }
  }

  // Met à jour les éléments connectés au cercle déplacé
  updateConnectedElements() {
    // Mise à jour des courbes connectées
    this.updateAllLines();
    this.updateAllCurves();

    this.updateScriptAreas();
  }

  updateAllLines() {
    // Sélectionner tous les éléments de ligne
    const lines = Array.from(this.elementsEditor.querySelectorAll("line"));

    // Réinitialiser toutes les lignes en les supprimant
    lines.forEach((line) => line.remove());

    // Récréer les lignes basées sur les connexions existantes
    this.connections.forEach(([circle1, circle2]) => {
      const x1 = parseFloat(circle1.getAttribute("cx"));
      const y1 = parseFloat(circle1.getAttribute("cy"));
      const x2 = parseFloat(circle2.getAttribute("cx"));
      const y2 = parseFloat(circle2.getAttribute("cy"));

      this.addSegment({ x: x1, y: y1 }, { x: x2, y: y2 });
    });
  }

  // Met à jour toutes les courbes en fonction des points
  updateAllCurves() {
    const points = Array.from(
      this.elementsEditor.querySelectorAll("circle")
    ).map((circle) => [
      parseFloat(circle.getAttribute("cx")),
      parseFloat(circle.getAttribute("cy")),
    ]);

    if (points.length >= 3) {
      const curvePath = createCurveThroughPoints(points);
      const curveElement = this.elementsEditor.querySelector("path");
      if (curveElement) {
        curveElement.setAttribute("d", curvePath);
      }
    }
  }

  // Sélectionne un cercle pour créer un segment
  selectCircleForSegment(circle) {
    if (circle.tagName === "circle") {
      const x = parseFloat(circle.getAttribute("cx"));
      const y = parseFloat(circle.getAttribute("cy"));

      circle.setAttribute("fill", "blue");
      this.segmentPoints.push(circle); // Ajouter le cercle

      if (this.segmentPoints.length === 2) {
        const [circle1, circle2] = this.segmentPoints;
        this.addSegment(
          {
            x: parseFloat(circle1.getAttribute("cx")),
            y: parseFloat(circle1.getAttribute("cy")),
          },
          {
            x: parseFloat(circle2.getAttribute("cx")),
            y: parseFloat(circle2.getAttribute("cy")),
          }
        );
        this.connections.push([circle1, circle2]); // Ajouter les cercles

        this.updateScriptAreas();

        // Réinitialiser la couleur des cercles sélectionnés
        this.segmentPoints.forEach((circ) =>
          circ.setAttribute("fill", "green")
        );

        this.segmentPoints = []; // Réinitialiser les points de segment
      }
    }
  }

  // Sélectionne un cercle pour créer une courbe
  selectCircleForCurve(circle) {
    if (circle.tagName === "circle") {
      const x = parseFloat(circle.getAttribute("cx"));
      const y = parseFloat(circle.getAttribute("cy"));

      circle.setAttribute("fill", "blue");
      this.curvePoints.push([x, y]);

      this.updateScriptAreas();
    }
  }

  // Termine la création d'une courbe et l'ajoute au SVG
  finishCurve() {
    if (this.curvePoints.length >= 3) {
      const curvePath = createCurveThroughPoints(this.curvePoints);
      this.addCurve(curvePath);

      this.curvePoints.forEach(([x, y]) => {
        const circle = this.elementsEditor.querySelector(
          `circle[cx="${x}"][cy="${y}"]`
        );
        if (circle) {
          circle.setAttribute("fill", "green");
        }
      });

      this.curvePoints = [];
    } else {
      console.log("Une courbe nécessite au moins 3 points.");
    }
  }

  addSegment(point1, point2) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", point1.x);
    line.setAttribute("y1", point1.y);
    line.setAttribute("x2", point2.x);
    line.setAttribute("y2", point2.y);
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", 2);
    line.style.pointerEvents = "none";

    this.elementsEditor.appendChild(line);
    this.updateToolbox();
  }

  // Modifiez la méthode addCurve pour utiliser curveCount
  addCurve(curvePath) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", curvePath);
    path.setAttribute("stroke", "black");
    path.setAttribute("stroke-width", 2);
    path.setAttribute("fill", "none");
    path.style.pointerEvents = "none";

    this.elementsEditor.appendChild(path);
    this.updateToolbox();
  }

  // Ajoute un nouvel input avec un bouton de suppression
  addInput() {
    const row = document.createElement("div");
    row.classList.add("row", "align-items-center", "no-gutters");

    const nameCol = document.createElement("div");
    nameCol.classList.add("col");

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "Nom de la variable";
    nameInput.classList.add("form-control");

    const valueCol = document.createElement("div");
    valueCol.classList.add("col");

    const valueInput = document.createElement("input");
    valueInput.type = "number";
    valueInput.placeholder = "Valeur";
    valueInput.value = 50;
    valueInput.classList.add("form-control");
    valueInput.min = 0;
    valueInput.max = 100;
    valueInput.step = 0.1;

    // Ajoutez un ID unique aux inputs
    const nameInputId = `variableName${this.variableCount}`;
    const valueInputId = `variableValue${this.variableCount}`;
    nameInput.id = nameInputId;
    valueInput.id = valueInputId;

    nameCol.appendChild(nameInput);
    valueCol.appendChild(valueInput);

    const buttonCol = document.createElement("div");
    buttonCol.classList.add("col");

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button", "btn", "btn-secondary");
    deleteButton.textContent = "X";
    deleteButton.style.display = "none";

    let isMouseOverDeleteButton = false;

    const updateDeleteButtonVisibility = () => {
      deleteButton.style.display =
        nameInput.matches(":hover") ||
        valueInput.matches(":hover") ||
        isMouseOverDeleteButton
          ? "inline-block"
          : "none";
    };

    nameInput.addEventListener("mouseover", updateDeleteButtonVisibility);
    nameInput.addEventListener("mouseout", updateDeleteButtonVisibility);
    valueInput.addEventListener("mouseover", updateDeleteButtonVisibility);
    valueInput.addEventListener("mouseout", updateDeleteButtonVisibility);
    deleteButton.addEventListener("mouseover", () => {
      isMouseOverDeleteButton = true;
      updateDeleteButtonVisibility();
    });
    deleteButton.addEventListener("mouseout", () => {
      isMouseOverDeleteButton = false;
      updateDeleteButtonVisibility();
    });

    deleteButton.addEventListener("click", () => {
      if (row.nextSibling && row.nextSibling.tagName === "BR") {
        this.panelControls.removeChild(row.nextSibling); // Supprimer le <br>
      }
      this.panelControls.removeChild(row); // Supprimer la ligne

      // Supprimer les données de l'input correspondant
      this.inputData = this.inputData.filter(
        (data) => data.index !== nameInputId && data.index !== valueInputId
      );

      this.updateScriptAreas(this);
      // this.updateToolbox(this);
      this.updateToolbox();
    });

    buttonCol.appendChild(deleteButton);
    row.appendChild(nameCol);
    row.appendChild(valueCol);
    row.appendChild(buttonCol);

    const brElement = document.createElement("br");
    this.panelControls.appendChild(row);
    this.panelControls.appendChild(brElement);
    // Ajouter les données des inputs au tableau inputData
    this.inputData.push({
      index: nameInputId,
      label: nameInput.value,
      id: nameInput.value.replace(/\s+/g, "-").toLowerCase(),
      name: nameInput.value,
      value: valueInput.value,
      type: "number",
      class: "EventListeners form-control",
    });

    this.updateScriptAreas(this);
    this.updateToolbox();

    // Mettre à jour l'ID de la variable
    this.variableCount++;

    // Mise à jour dynamique des valeurs dans inputData
    nameInput.addEventListener("input", () => {
      const inputObj = this.inputData.find(
        (data) => data.index === nameInputId
      );
      if (inputObj) {
        inputObj.label = nameInput.value;
        inputObj.name = nameInput.value;
        inputObj.id = nameInput.value
          .replace(/\s+/g, "_")
          .replace(/-/g, "_")
          .toLowerCase();

        this.updateScriptAreas();
        this.updateToolbox();
      }
    });

    valueInput.addEventListener("input", () => {
      const inputObj = this.inputData.find(
        (data) => data.index === nameInputId
      );
      if (inputObj) {
        inputObj.value = valueInput.value;

        this.updateScriptAreas();
      }
    });
  }

  getData() {
    // Obtenez toutes les positions des segments (lignes)
    const lines = Array.from(this.elementsEditor.querySelectorAll("line")).map(
      (line, index) => ({
        id: `ligne${index + 1}`,
        x1: line.getAttribute("x1"),
        y1: line.getAttribute("y1"),
        x2: line.getAttribute("x2"),
        y2: line.getAttribute("y2"),
        style: "stroke: red; stroke-width: 4; pointer-events: none;",
      })
    );

    // Obtenez toutes les courbes (paths)
    const paths = Array.from(this.elementsEditor.querySelectorAll("path")).map(
      (path, index) => ({
        id: `courbe${index + 1}`,
        d: path.getAttribute("d"),
        style:
          "stroke: red; stroke-width: 2; pointer-events: none; touch-action: none;",
      })
    );

    // Créez un objet JSON avec la structure demandée pour elements.json
    const dataElements = {
      html: this.inputData.map(({ index, ...rest }) => rest), // Ajoutez les données des inputs
      svg: {
        lines,
        paths,
      },
    };

    // Convertissez l'objet JSON en une chaîne pour elements.json
    const jsonStringElements = JSON.stringify(dataElements, null, 2);

    // Créez un objet JSON pour editor.json
    const dataEditor = this.inputData.reduce((acc, { id, value }) => {
      acc[id] = value;
      return acc;
    }, {});

    // Convertissez l'objet JSON en une chaîne pour editor.json
    const jsonStringEditor = JSON.stringify(dataEditor, null, 2);

    // Fonction pour ajouter une indentation à chaque ligne de code
    const ajouterIndentation = (code, indentation = "        ") => {
      const lignes = code.split("\n"); // Séparer le code en lignes
      return lignes
        .map((ligne, index) => (index === 0 ? ligne : `${indentation}${ligne}`)) // Ajouter l'indentation sauf à la première ligne
        .join("\n"); // Rejoindre les lignes en une seule chaîne
    };

    // Récupérer le code depuis Blockly
    var code = Blockly.JavaScript.workspaceToCode(this.workspace);

    // Générer le contenu du fichier JS avec un formatage amélioré
    const jsContent =
      "import { setTailles } from '../../function/setTailles.js';\n" +
      "\n" +
      "export function appliquerTailles(\n" +
      "    " +
      this.inputData.map(({ id }) => id).join(",\n    ") +
      "\n" +
      ") {\n" +
      "    const tailles = {\n" +
      this.inputData.map(({ id }) => `        ${id}`).join(",\n") +
      "\n" +
      "    };\n" +
      "    try {\n" +
      "        setTailles(tailles);\n" +
      "        " +
      ajouterIndentation(code) + // Ajouter l'indentation au code
      "\n" +
      "    } catch (error) {\n" +
      "        console.error('Erreur lors de l’application des tailles :', error);\n" +
      "    }\n" +
      "}\n";

    // Retourner les chaînes JSON et le contenu JS
    return {
      jsonStringElements,
      jsonStringEditor,
      jsContent,
    };
  }

  updateScriptAreas() {
    const { jsonStringElements, jsonStringEditor, jsContent } = this.getData();

    // Exemple pour textarea JSON
    document
      .getElementById("editorJsonContent")
      .querySelector(
        ".content"
      ).innerHTML = `<pre><code class="language-json">${jsonStringEditor}</code></pre>`;
    document
      .getElementById("elementsJsonContent")
      .querySelector(
        ".content"
      ).innerHTML = `<pre><code class="language-json">${jsonStringElements}</code></pre>`;

    // Exemple pour textarea JavaScript
    document
      .getElementById("typeJsContent")
      .querySelector(
        ".content"
      ).innerHTML = `<pre><code class="language-javascript">${jsContent}</code></pre>`;

    // Re-prendre en compte la coloration syntaxique
    Prism.highlightAll();
  }

  // Méthode pour télécharger les données en JSON
  downloadData() {
    // Assurez-vous que JSZip est disponible
    if (typeof JSZip === "undefined") {
      alert("JSZip is not loaded. Please include the JSZip library.");
      return;
    }

    const { jsonStringElements, jsonStringEditor, jsContent } = this.getData();

    // Obtenez la valeur de #typesName
    const folderName =
      document.querySelector("#typesName").value || "default_folder";
    const fileNameElements = `${folderName}/elements.json`;
    const fileNameEditor = `${folderName}/editor.json`;
    const fileNameJS = `${folderName}/${folderName}.js`;

    // Créez une nouvelle instance de JSZip
    const zip = new JSZip();

    // Ajoutez les fichiers JSON et le fichier JS dans le dossier du ZIP
    zip.file(fileNameElements, jsonStringElements);
    zip.file(fileNameEditor, jsonStringEditor);
    zip.file(fileNameJS, jsContent.trim());

    // Générer le fichier ZIP et le télécharger
    zip.generateAsync({ type: "blob" }).then(function (content) {
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${folderName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
}
