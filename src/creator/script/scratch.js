export class DynamicBlockManager {
  constructor() {
    this.lastUpdateTime = 0; // Temps du dernier appel à updateToolbox
  }

  // Méthode pour définir un bloc dynamique pour les variables
  defineDynamicBlockVariable(dynamicVariables) {
    if (!dynamicVariables) {
      throw new Error("Le nom du bloc est requis !");
    }

    const data = {
      init: function () {
        this.setTooltip("");
        this.setHelpUrl("");
        this.setColour(225);

        // Menu déroulant avec toutes les variables dynamiques disponibles
        this.appendDummyInput("NAME")
          .setAlign(Blockly.inputs.Align.RIGHT)
          .appendField("Input :")
          .appendField(
            new Blockly.FieldDropdown(
              dynamicVariables.map((names) => [names, names])
            ),
            "variable"
          );

        this.setOutput(true, null); // Le bloc renvoie une valeur.
      },
    };

    Blockly.common.defineBlocks({ input: data });

    // Générateur de code pour le bloc `input`
    javascript.javascriptGenerator.forBlock["input"] = function (block) {
      const selectedVariable = block.getFieldValue("variable");
      const code = `Number(${selectedVariable})`; // Convertir la variable sélectionnée en nombre
      return [code, javascript.Order.ATOMIC]; // Retourner la variable convertie
    };
  }

  defineEditBlockVariable(dynamicVariables) {
    if (!dynamicVariables) {
      throw new Error("Le nom de la variable est requis !");
    }

    const data = {
      init: function () {
        this.setTooltip("");
        this.setHelpUrl("");
        this.setColour(150); // Couleur différente pour différencier
        this.appendDummyInput("NAME")
          .setAlign(Blockly.inputs.Align.RIGHT)
          .appendField("Edit Input :")
          .appendField(
            new Blockly.FieldDropdown(
              dynamicVariables.map((names) => [names, names])
            ),
            "variable"
          );

        this.appendValueInput("newValue")
          .setCheck("Number") // Limiter à des valeurs numériques
          .appendField("New Value:");

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null); // Ce bloc peut être utilisé dans des séquences
      },
    };

    Blockly.common.defineBlocks({ editInput: data });

    // Générateur de code pour le bloc `editInput`
    javascript.javascriptGenerator.forBlock["editInput"] = function (block) {
      const selectedVariable = block.getFieldValue("variable");
      const newValue = javascript.javascriptGenerator.valueToCode(
        block,
        "newValue",
        javascript.Order.NONE
      );
      const code = `document.querySelector("#${selectedVariable}").value = ${newValue};\n`; // Génère le code pour affecter la nouvelle valeur
      return code;
    };
  }

  // Méthode pour définir un bloc dynamique pour les lignes
  defineDynamicBlockLine(dynamicLines) {
    if (!dynamicLines) {
      throw new Error("Le nom des lignes est requis !");
    }

    const data = {
      init: function () {
        this.setTooltip("");
        this.setHelpUrl("");
        this.setColour(225);
        this.appendDummyInput("LINE")
          .setAlign(Blockly.inputs.Align.RIGHT)
          .appendField("Line :")
          .appendField(
            new Blockly.FieldDropdown(
              dynamicLines.map((line) => [line, line]) // Menu déroulant pour les lignes disponibles
            ),
            "line"
          )
          .appendField(
            new Blockly.FieldDropdown([
              ["x1", "x1"],
              ["y1", "y1"],
              ["x2", "x2"],
              ["y2", "y2"],
            ]),
            "attribute"
          );

        this.setOutput(true, null); // Le bloc renvoie une valeur.
      },
    };

    Blockly.common.defineBlocks({ line: data });

    // Générateur de code pour le bloc `line`
    javascript.javascriptGenerator.forBlock["line"] = function (block) {
      const selectedLine = block.getFieldValue("line");
      const selectedAttribute = block.getFieldValue("attribute");
      let code = `parseFloat(${selectedLine}.getAttribute("${selectedAttribute}"))`; // Génère le code correspondant à la ligne et l'attribut sélectionnés
      return [code, javascript.Order.NONE];
    };
  }

  defineEditBlockLine(dynamicLines) {
    if (!dynamicLines) {
      throw new Error("Le nom des lignes est requis !");
    }

    const data = {
      init: function () {
        this.setTooltip("");
        this.setHelpUrl("");
        this.setColour(150);
        this.appendDummyInput()
          .appendField("Edit Line :")
          .appendField(
            new Blockly.FieldDropdown(dynamicLines.map((line) => [line, line])),
            "line"
          )
          .appendField("Attribute:")
          .appendField(
            new Blockly.FieldDropdown([
              ["x1", "x1"],
              ["y1", "y1"],
              ["x2", "x2"],
              ["y2", "y2"],
            ]),
            "attribute"
          );

        this.appendValueInput("newValue")
          .setCheck("Number") // Limiter à des valeurs numériques
          .appendField("New Value:");

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
      },
    };

    Blockly.common.defineBlocks({ editLine: data });

    // Générateur de code pour le bloc `editLine`
    javascript.javascriptGenerator.forBlock["editLine"] = function (block) {
      const selectedLine = block.getFieldValue("line");
      const selectedAttribute = block.getFieldValue("attribute");
      const newValue = javascript.javascriptGenerator.valueToCode(
        block,
        "newValue",
        javascript.Order.NONE
      );
      const code = `${selectedLine}.setAttribute("${selectedAttribute}", ${newValue});\n`;
      return code;
    };
  }

  // Méthode pour ajouter des blocs dynamiquement à la toolbox
  addBlock(data) {
    // Récupérer toutes les variables dynamiques à partir des données JSON
    const dynamicVariables = [];

    data.html.forEach((item) => {
      if (item.id && !dynamicVariables.includes(item.id)) {
        dynamicVariables.push(item.id);
      }
    });

    // Créer les blocs dynamiques pour les variables
    this.defineDynamicBlockVariable(dynamicVariables);
    this.defineEditBlockVariable(dynamicVariables);

    const dynamicLines = [];

    data.svg.lines.forEach((item) => {
      if (item.id && !dynamicLines.includes(item.id)) {
        dynamicLines.push(item.id);
      }
    });

    // Créer les blocs dynamiques pour les lignes
    this.defineDynamicBlockLine(dynamicLines);
    this.defineEditBlockLine(dynamicLines);
  }

  // Méthode pour mettre à jour la toolbox avec les nouveaux blocs
  updateToolbox(script) {
    const now = Date.now();
    if (now - this.lastUpdateTime < 100) {
      return; // Ignore l'appel si moins de 100 ms se sont écoulées
    }
    this.lastUpdateTime = now; // Met à jour le temps du dernier appel

    const jsonString = script.getData().jsonStringElements;
    try {
      const data = JSON.parse(jsonString);
      this.addBlock(data);

      let toolboxXml = document.querySelector("#toolbox").innerHTML;

      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(toolboxXml, "text/xml");

      let categoryCustom = xmlDoc.querySelector('category[name="Custom"]');
      if (!categoryCustom) {
        console.error('La catégorie "Custom" n\'existe pas dans le toolbox.');
        return;
      }

      // Assurez-vous que les listes sont définies et initialisées
      const variablesDefined = Array.isArray(data.html) && data.html.length > 0;
      const linesDefined =
        Array.isArray(data.svg.lines) && data.svg.lines.length > 0;

      if (variablesDefined) {
        // Ajouter les blocs dynamiques pour Input, Line, EditInput, et EditLine
        let block1 = xmlDoc.createElement("block");
        block1.setAttribute("type", "input");
        categoryCustom.appendChild(block1);

        let block2 = xmlDoc.createElement("block");
        block2.setAttribute("type", "editInput");
        categoryCustom.appendChild(block2);
      }

      if (linesDefined) {
        let block3 = xmlDoc.createElement("block");
        block3.setAttribute("type", "line");
        categoryCustom.appendChild(block3);

        let block4 = xmlDoc.createElement("block");
        block4.setAttribute("type", "editLine");
        categoryCustom.appendChild(block4);
      }

      let serializer = new XMLSerializer();
      toolboxXml = serializer.serializeToString(xmlDoc);

      script.workspace.updateToolbox(toolboxXml);
    } catch (error) {
      console.error("Erreur lors de la conversion JSON:", error);
    }
  }
}
