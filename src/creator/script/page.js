import { SVGCreator } from "../script.js";
const svgElement = document.getElementById("svg");
const SVGcreator = new SVGCreator(svgElement);

class App {
  constructor() {
    this.body = document.querySelector("body");
    this.themeToggleButton = document.getElementById("theme-toggle");
    this.toggleColorButton = document.getElementById("toggleColor");
    this.hideButton = document.getElementById("hide");
    this.svgElement = svgElement;
    this.viewportRect = document.querySelector("#viewport > rect");
    this.colorList = [
      "000000",
      "993300",
      "333300",
      "003300",
      "003366",
      "000066",
      "333399",
      "333333",
      "660000",
      "FF6633",
      "666633",
      "336633",
      "336666",
      "0066FF",
      "666699",
      "666666",
      "CC3333",
      "FF9933",
      "99CC33",
      "669966",
      "66CCCC",
      "3366FF",
      "663366",
      "999999",
      "CC66FF",
      "FFCC33",
      "FFFF66",
      "99FF66",
      "99CCCC",
      "66CCFF",
      "993366",
      "CCCCCC",
      "FF99CC",
      "FFCC99",
      "FFFF99",
      "CCffCC",
      "CCFFff",
      "99CCFF",
      "CC99FF",
      "FFFFFF",
    ];
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.applySavedTheme();
      this.drawGridOnViewport();
      this.createColorPicker();
      this.loadSavedColor();
      this.addHotbarImageEventListeners();

      this.themeToggleButton.addEventListener("click", () =>
        this.toggleTheme()
      );
      this.hideButton.addEventListener("click", () =>
        this.togglePanelControls()
      );
      this.toggleColorButton.addEventListener("click", (event) =>
        this.toggleColorPicker(event)
      );
      document.body.addEventListener("click", () => this.hideColorPicker());
    });
  }

  applySavedTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      this.body.classList.add("dark-mode");
      this.themeToggleButton.textContent = "☀️";
      this.svgElement.classList.add("dark-mode-filter");
    } else {
      this.body.classList.remove("dark-mode");
      this.themeToggleButton.textContent = "🌙";
      this.svgElement.classList.remove("dark-mode-filter");
    }
  }

  drawGridOnViewport() {
    if (!this.viewportRect) return;

    const viewportWidth = this.viewportRect.getAttribute("width");
    const viewportHeight = this.viewportRect.getAttribute("height");

    const verticalSpacing = viewportWidth / 4;
    const horizontalSpacing = viewportHeight / 4;

    this.createLines(verticalSpacing, viewportHeight, true);
    this.createLines(horizontalSpacing, viewportWidth, false);
  }

  createLines(spacing, length, isVertical) {
    for (let i = 1; i <= 4; i++) {
      const position = spacing * i;
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("x1", isVertical ? position : 0);
      line.setAttribute("y1", isVertical ? 0 : position);
      line.setAttribute("x2", isVertical ? position : length);
      line.setAttribute("y2", isVertical ? length : position);
      line.setAttribute("style", "stroke: green; stroke-width: 1");
      line.style.pointerEvents = "none";
      this.viewportRect.parentNode.appendChild(line);
    }
  }

  toggleTheme() {
    this.body.classList.toggle("dark-mode");
    if (this.body.classList.contains("dark-mode")) {
      this.themeToggleButton.textContent = "☀️";
      this.svgElement.classList.add("dark-mode-filter");
      localStorage.setItem("theme", "dark");
    } else {
      this.themeToggleButton.textContent = "🌙";
      this.svgElement.classList.remove("dark-mode-filter");
      localStorage.setItem("theme", "light");
    }
  }

  togglePanelControls() {
    const panelControls = document.querySelectorAll(".panel.controls"); // Sélectionne plusieurs éléments
    panelControls.forEach((panel) => {
      panel.classList.toggle("hidden"); // Bascule la classe "hidden"
    });

    // Mise à jour du texte du bouton pour le premier panneau, par exemple
    if (panelControls.length > 0) {
      this.hideButton.textContent = panelControls[0].classList.contains(
        "hidden"
      )
        ? "▶"
        : "◀";
    }
  }

  createColorPicker() {
    const picker = document.getElementById("color-picker");
    if (picker) {
      this.colorList.forEach((colorHex) => {
        const li = document.createElement("li");
        li.className = "color-item";
        li.dataset.hex = "#" + colorHex;
        li.style.backgroundColor = "#" + colorHex;
        picker.appendChild(li);
      });

      picker.querySelectorAll("li").forEach((item) => {
        item.addEventListener("click", () => {
          this.saveSelectedColor(item.dataset.hex);
        });
      });
    } else {
      console.error("L'élément avec l'ID 'color-picker' est introuvable.");
    }
  }

  toggleColorPicker(event) {
    event.stopPropagation();
    const picker = document.getElementById("color-picker");
    if (picker) {
      picker.style.display =
        picker.style.display === "block" ? "none" : "block";
    }
  }

  hideColorPicker() {
    const picker = document.getElementById("color-picker");
    if (picker) {
      picker.style.display = "none";
    }
  }

  saveSelectedColor(colorHex) {
    localStorage.setItem("selectedColor", colorHex);
    this.applySavedColor(colorHex);
  }

  loadSavedColor() {
    const savedColor = localStorage.getItem("selectedColor");
    if (savedColor) {
      this.applySavedColor(savedColor);
    }
  }

  applySavedColor(colorHex) {
    document.querySelector(
      ".panel.controls"
    ).style.backgroundColor = `${colorHex}80`;

    document.querySelectorAll(".color").forEach((element) => {
      element.style.backgroundColor = `${colorHex}80`;
    });
  }

  addHotbarImageEventListeners() {
    const images = document.querySelectorAll(".hotbar img");
    const createCurveButton = document.getElementById("createCurveButton");
    images.forEach((image) => {
      image.addEventListener("click", () => {
        images.forEach((image) => image.classList.remove("selected"));
        image.classList.add("selected");

        if (image.name == "courbe") createCurveButton.style.display = "block";
        else createCurveButton.style.display = "none";

        SVGcreator.changeMode(image.name);
      });
    });
  }
}
const app = new App();
app.init();

// WINDOWS

document.addEventListener("DOMContentLoaded", (event) => {
  let isDragging = false;
  let offsetX, offsetY;
  let currentWindow;
  const svgElement = document.getElementById("svg");

  function svgPointToScreen(svgElement, svgX, svgY) {
    const svgPoint = svgElement.createSVGPoint();
    svgPoint.x = svgX;
    svgPoint.y = svgY;

    const svgCTM = svgElement.getScreenCTM();
    if (svgCTM) {
      const screenPoint = svgPoint.matrixTransform(svgCTM);
      return { x: screenPoint.x, y: screenPoint.y };
    } else {
      console.warn("SVG CTM is not available.");
      return null;
    }
  }

  function screenPointToSvg(svgElement, screenX, screenY) {
    const svgPoint = svgElement.createSVGPoint();
    svgPoint.x = screenX;
    svgPoint.y = screenY;

    const svgCTM = svgElement.getScreenCTM().inverse();
    if (svgCTM) {
      const svgPointResult = svgPoint.matrixTransform(svgCTM);
      return { x: svgPointResult.x, y: svgPointResult.y };
    } else {
      console.warn("SVG CTM is not available.");
      return null;
    }
  }

  function updateWindowSizeAndPosition() {
    const svgRect = svgElement.getBoundingClientRect();

    document.querySelectorAll(".window").forEach((win) => {
      const svgX = parseFloat(win.getAttribute("data-svg-x"));
      const svgY = parseFloat(win.getAttribute("data-svg-y"));
      const svgWidth = parseFloat(win.getAttribute("data-svg-width"));
      const svgHeight = parseFloat(win.getAttribute("data-svg-height"));

      const pointOnSVG = svgPointToScreen(svgElement, svgX, svgY);

      if (pointOnSVG) {
        // Calculer la taille proportionnelle de la fenêtre
        const width =
          (svgWidth / svgElement.viewBox.baseVal.width) * svgRect.width;
        const height =
          (svgHeight / svgElement.viewBox.baseVal.height) * svgRect.height;

        win.style.position = "absolute";
        win.style.left = `${pointOnSVG.x}px`;
        win.style.top = `${pointOnSVG.y}px`;
        win.style.width = `${width * 1.5}px`;
        win.style.height = `${height}px`;

        const fontSize = Math.min(width, height) * 0.05;
        win.style.fontSize = `${fontSize}px`;
      }
    });

    requestAnimationFrame(updateWindowSizeAndPosition);
  }

  function onMouseDown(event) {
    if (event.button === 2) {
      // Clic droit
      isDragging = true;
      currentWindow = event.target.closest(".window");
      if (currentWindow) {
        offsetX = event.clientX - currentWindow.getBoundingClientRect().left;
        offsetY = event.clientY - currentWindow.getBoundingClientRect().top;
        event.preventDefault(); // Empêcher le menu contextuel du clic droit
      }
    }
  }

  function onMouseMove(event) {
    if (isDragging && currentWindow) {
      const x = event.clientX - offsetX;
      const y = event.clientY - offsetY;

      currentWindow.style.left = `${x}px`;
      currentWindow.style.top = `${y}px`;

      const { x: svgX, y: svgY } = screenPointToSvg(
        svgElement,
        event.clientX,
        event.clientY
      );

      if (svgX !== null && svgY !== null) {
        currentWindow.setAttribute("data-svg-x", svgX);
        currentWindow.setAttribute("data-svg-y", svgY);
      }
    }
  }

  function onMouseUp(event) {
    if (isDragging) {
      isDragging = false;
      currentWindow = null;
    }
  }

  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  updateWindowSizeAndPosition();
});

// RESIZE

document.addEventListener("DOMContentLoaded", () => {
  // EDITOR
  function manageResize(md, sizeProp, posProp) {
    var r = md.target;

    var prev = r.previousElementSibling;
    var next = r.nextElementSibling;
    if (!prev || !next) {
      return;
    }

    md.preventDefault();

    var prevSize = prev[sizeProp];
    var nextSize = next[sizeProp];
    var sumSize = prevSize + nextSize;
    var prevGrow = Number(prev.style.flexGrow);
    var nextGrow = Number(next.style.flexGrow);
    var sumGrow = prevGrow + nextGrow;
    var lastPos = md[posProp];

    function onMouseMove(mm) {
      SVGcreator.updateToolbox();
      var pos = mm[posProp];
      var d = pos - lastPos;
      prevSize += d;
      nextSize -= d;
      if (prevSize < 0) {
        nextSize += prevSize;
        pos -= prevSize;
        prevSize = 0;
      }
      if (nextSize < 0) {
        prevSize += nextSize;
        pos += nextSize;
        nextSize = 0;
      }

      var prevGrowNew = sumGrow * (prevSize / sumSize);
      var nextGrowNew = sumGrow * (nextSize / sumSize);

      prev.style.flexGrow = prevGrowNew;
      next.style.flexGrow = nextGrowNew;

      lastPos = pos;
    }

    function onMouseUp(mu) {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  function setupResizerEvents() {
    document.body.addEventListener("mousedown", function (md) {
      var target = md.target;
      if (target.nodeType !== 1 || target.tagName !== "FLEX-RESIZER") {
        return;
      }
      var parent = target.parentNode;
      var h = parent.classList.contains("h");
      var v = parent.classList.contains("v");
      if (h && v) {
        return;
      } else if (h) {
        manageResize(md, "scrollWidth", "pageX");
      } else if (v) {
        manageResize(md, "scrollHeight", "pageY");
      }
    });
  }
  const button = document.getElementById("previewCodeButton");
  const drawing = document.getElementById("drawing");

  setupResizerEvents();

  // Hotbar

  button.addEventListener("click", function () {
    // Bascule la classe contour-rouge sur l'élément drawing
    drawing.classList.toggle("contour-rouge");

    // Sélectionne toutes les images dans .hotbar
    const images = document.querySelectorAll(".hotbar img");

    // Récupère les éléments editor et preview
    const editor = document.getElementById("editor");
    const preview = document.getElementById("preview");

    // Si contour-rouge est activé, griser ou rogner les images et alterner l'affichage
    if (drawing.classList.contains("contour-rouge")) {
      images.forEach((image) => {
        image.classList.remove("selected");
        image.classList.add("griser"); // Applique l'effet grisé
      });

      SVGcreator.changeMode(""); // Mode réinitialisé
      button.textContent = "Edit editor"; // Change le texte du bouton

      // Cacher l'éditeur et afficher la prévisualisation
      editor.style.display = "none";
      preview.style.display = "block";

      SVGcreator.preview();
    } else {
      // Sinon, retirer les effets et sélectionner la première image
      images.forEach((image) => {
        image.classList.remove("griser"); // Retire l'effet grisé
      });

      // Sélectionner la première image si disponible
      if (images.length > 0) {
        images[0].classList.add("selected");
      }

      // Activer le mode "deplacement"
      SVGcreator.changeMode("deplacement");
      button.textContent = "Code preview"; // Change le texte du bouton

      // Afficher l'éditeur et cacher la prévisualisation
      editor.style.display = "block";
      preview.style.display = "none";

      SVGcreator.editor();
    }
  });
});
