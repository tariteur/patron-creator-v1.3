require("dotenv").config();
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const path = require("path");
const Joi = require("joi");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});
app.use(limiter);

const filePath = "./data.json";
let token = process.env.TOKEN;
let admin_name = process.env.ADMIN_NAME;
let admin_password = process.env.ADMIN_PASSWORD;

function generateToken() {
  const newToken = jwt.sign({}, token, { expiresIn: "1h" }); // Utilise token ici, qui est maintenant initialisé
  const envContent = `TOKEN=${token}\nADMIN_NAME=${admin_name}\nADMIN_PASSWORD=${admin_password}`;
  fs.writeFileSync(".env", envContent);
  return newToken;
}
setInterval(generateToken, 60 * 60 * 1000);

function authenticateAdmin(req, res, next) {
  const clientToken = req.headers.authorization;

  if (!clientToken) {
    return res.status(401).send("Accès non autorisé. Token manquant.");
  }

  jwt.verify(clientToken.split(" ")[1], token, (err, decoded) => {
    if (err) {
      return res.status(403).send("Accès interdit. Token invalide.");
    }

    if (!decoded.isAdmin) {
      return res
        .status(403)
        .send(
          "Accès interdit. Seuls les administrateurs peuvent accéder à cette ressource."
        );
    }

    next();
  });
}

function readJsonFile(callback) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      try {
        const jsonData = data.length ? JSON.parse(data) : [];
        callback(null, jsonData);
      } catch (parseErr) {
        callback(parseErr, null);
      }
    }
  });
}

const writeJsonFile = (data, callback) => {
  fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8", (err) => {
    callback(err);
  });
};

async function processTypes(types) {
  // Vérifie si `types` est une chaîne et la convertit en tableau si nécessaire
  if (typeof types === "string") {
    types = types.split(",").map((type) => type.trim());
  }

  const typeResults = {};

  // Fonction pour lire le fichier JSON et stocker le résultat
  const readFileForType = async (type) => {
    const path2 = `src/editor/patron-logic/${type}/editor.json`;
    const fullPath = path.resolve(__dirname, path2);

    try {
      const data = await fs.promises.readFile(fullPath, "utf8");
      // Exemple de traitement et stockage des données lues
      typeResults[type] = JSON.parse(data);
    } catch (err) {
      console.error(
        `Erreur lors de la lecture du fichier pour ${type} : ${err.message}`
      );
    }
  };

  // Traiter chaque type avec `forEach` et `Promise.all` pour gérer les tâches asynchrones
  await Promise.all(types.map((type) => readFileForType(type)));

  return typeResults;
}

async function getTypesName() {
  try {
    const baseDir = path.resolve(__dirname, "src/editor/patron-logic");

    // Lire tout le contenu du répertoire
    const elements = fs.readdirSync(baseDir);

    // Filtrer pour ne garder que les dossiers
    const dossiers = elements.filter((element) => {
      const cheminComplet = path.join(baseDir, element);
      return fs.statSync(cheminComplet).isDirectory();
    });

    return dossiers;
  } catch (err) {
    console.error("Erreur lors de la lecture des dossiers :", err);
    return [];
  }
}

const loginDirectory = path.join(__dirname, "src", "login");
const addPersonDirectory = path.join(__dirname, "src", "add-person");
const editorDirectory = path.join(__dirname, "src", "editor");
const creatorDirectory = path.join(__dirname, "src", "creator");
const node_modulesDirectory = path.join(__dirname, "src", "node_modules");
const testDirectory = path.join(__dirname, "src", "test");

app.use("/login", express.static(loginDirectory));
app.use("/add-person", express.static(addPersonDirectory));
app.use("/editor", express.static(editorDirectory));
app.use("/creator", express.static(creatorDirectory));
app.use("/node_modules", express.static(node_modulesDirectory));
app.use("/test", express.static(testDirectory));

app.get("/data", authenticateAdmin, (req, res) => {
  readJsonFile((err, jsonData) => {
    if (err) {
      return res.status(500).send("Erreur lors de la lecture du fichier");
    }
    res.send(jsonData);
  });
});

app.get("/getTypesName", authenticateAdmin, async (req, res) => {
  try {
    const typesName = await getTypesName();
    res.send(typesName);
  } catch (err) {
    res.status(500).send("Erreur lors de la récupération des types de noms");
  }
});

app.post("/data", authenticateAdmin, (req, res) => {
  let { action, name, numero, email, index } = req.body;

  let [originalName, newName] = name.includes("=")
    ? name.split("=")
    : [name, null];
  name = originalName;

  readJsonFile(async (err, jsonData) => {
    if (err) {
      return res.status(500).send("Erreur lors de la lecture du fichier");
    }
    let existingEntry = jsonData.find((entry) => entry.name === name);
    switch (action) {
      case "add-people":
        if (existingEntry) {
          return res.status(400).send("Person already exists");
        }
        if (name === null) {
          return res.status(400).send("Name of person neaded");
        }
        jsonData.push({ name, numero, email, index: {} });
        break;

      case "remove-people":
        if (!existingEntry) {
          return res.status(400).send("Person not found");
        }
        jsonData = jsonData.filter((entry) => entry.name !== name);
        break;

      case "update-people":
        if (!existingEntry) {
          return res.status(400).send("Person not found");
        }
        const indexToUpdate = jsonData.findIndex(
          (entry) => entry.name === name
        );
        if (indexToUpdate === -1) {
          return res.status(400).send("Person not found");
        }

        jsonData[indexToUpdate].name = newName;
        jsonData[indexToUpdate].numero = numero;
        jsonData[indexToUpdate].email = email;
        break;

      case "add-appointment":
        if (!existingEntry) {
          return res.status(400).send("Person not found");
        }
        if (!index) {
          return res.status(400).send("Invalid appointment data");
        }
        let maxRdv = 0;

        Object.values(existingEntry.index).forEach((data) => {
          if (data.rdv) maxRdv = Math.max(maxRdv, data.rdv);
        });

        const rdv = maxRdv + 1;

        let nextKey = Object.keys(existingEntry.index).length.toString();

        const typeResults = await processTypes(index.types);

        existingEntry.index[nextKey] = {
          date: index.date,
          types: index.types,
          rdv: rdv,
          editor: typeResults,
        };
        break;

      case "remove-appointment":
        if (!existingEntry) {
          return res.status(400).send("Person not found");
        }
        if (!index || index.rdv === undefined) {
          return res.status(400).send("Invalid appointment data");
        }
        existingEntry.index = Object.values(existingEntry.index).filter(
          (data) => data.rdv != index.rdv
        );
        break;

      case "update-appointment":
        if (!existingEntry) {
          return res.status(400).send("Person not found");
        }
        let appointment = Object.values(existingEntry.index).find(
          (data) => data.rdv == index.rdv
        );
        const selectedTypesArray = index.selectedTypes;

        if (appointment) {
          // Mise à jour de la date si elle est définie dans l'index
          if (index.date) appointment.date = index.date;

          // Mise à jour des types
          if (index.selectedTypes)
            appointment.types = index.selectedTypes.join(", ");

          // Mise à jour de l'éditeur
          if (index.editor) {
            appointment.editor = {
              ...appointment.editor,
              ...index.editor,
            };
          }

          // Assurer que tous les types sélectionnés sont présents dans l'éditeur
          try {
            if (selectedTypesArray) {
              const promises = selectedTypesArray.map(async (type) => {
                if (!appointment.editor[type]) {
                  const typeResults = await processTypes(type);

                  // Aplatir les résultats si nécessaire
                  appointment.editor[type] = typeResults[type] || typeResults; // Adapté si `typeResults` est un objet avec le type comme clé
                }
              });

              // Attendre que toutes les promesses soient résolues
              await Promise.all(promises);

              // // Supprimer les types dans l'éditeur qui ne sont plus dans selectedTypesArray
              // Object.keys(appointment.editor).forEach(type => {
              //     if (!selectedTypesArray.includes(type)) {
              //         delete appointment.editor[type];
              //     }
              // });
            }
          } catch (error) {
            console.error("Erreur lors du traitement des types:", error);
            return res.status(500).send("Error processing types");
          }
        } else {
          return res.status(400).send("Appointment not found");
        }

        break;

      // case 'update-appointment':
      //     if (!existingEntry) {
      //         return res.status(400).send('Person not found');
      //     }
      //     let appointment = Object.values(existingEntry.index).find(data => data.rdv == index.rdv);

      //     if (appointment) {
      //         if (index.date) appointment.date = index.date;
      //         if (index.editor) {
      //             appointment.editor = {
      //                 ...appointment.editor,
      //                 ...index.editor
      //             };
      //         }
      //     } else {
      //         return res.status(400).send('Appointment not found');
      //     }
      //     break;

      default:
        return res.status(400).send("Invalid action");
    }

    writeJsonFile(jsonData, (err) => {
      if (err) {
        return res.status(500).send("Erreur lors de la sauvegarde des données");
      }
      res.send("Données sauvegardées avec succès");
    });
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === admin_name && password === admin_password) {
    if (!token) {
      return res
        .status(500)
        .send("Clé secrète manquante. Veuillez vérifier le fichier .env.");
    }

    const tokenGenerated = jwt.sign({ username, isAdmin: true }, token, {
      expiresIn: "1h",
      issuer: "patron-creator",
      audience: "admin",
    });

    res.json({ token: tokenGenerated });
  } else {
    res.status(401).send("Identifiants invalides");
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(loginDirectory, "index.html"));
});

app.get("/editor", (req, res) => {
  res.sendFile(path.join(editorDirectory, "index.html"));
});

app.get("/creator", (req, res) => {
  res.sendFile(path.join(creatorDirectory, "index.html"));
});

app.get("/scratch", (req, res) => {
  res.sendFile(path.join(creatorDirectory, "scratch.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
