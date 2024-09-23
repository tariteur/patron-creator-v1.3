import { createCurveThroughPoints } from "../../function/svg/createCurveThroughPoints.js";
import { setTailles } from "../../function/setTailles.js";

export function appliquerTailles(
  aissence,
  bassin,
  longeurtotalejupe,
  heuteurtaillebassin,
  longeurmiebassin,
  heuteurmiebassin,
  Tourdetaille,
  nivcourbure,
) {
  const tailles = {
    aissence,
    bassin,
    longeurtotalejupe,
    heuteurtaillebassin,
    longeurmiebassin,
    heuteurmiebassin,
    Tourdetaille,
    nivcourbure,
  };
  setTailles(tailles);

  // Convertir les tailles de cm en points
  var aissence_pt = aissence * 37.795275591;
  var bassin_pt = bassin * 37.795275591;
  var longeurtotalejupe_pt = longeurtotalejupe * 37.795275591;
  var Nheuteurtaillebassin_pt = heuteurtaillebassin * -37.795275591;
  var longeurmiebassin_pt = longeurmiebassin * 37.795275591;
  var heuteurmiebassin_pt = heuteurmiebassin * -37.795275591;
  var Tourdetaille_pt = Tourdetaille * 37.795275591;
  var nivcourbure_pt = nivcourbure * 37.795275591;

  // Calcul des pincettes
  var calculepince = (bassin_pt - Tourdetaille_pt) / 8;

  // Calcul de 'nombre1'
  let nombre1 = bassin - Tourdetaille;

  // Détermination de 'nombre' en fonction de 'nombre1'
  let nombre;
  if (nombre1 < 34) {
    nombre = nombre1 / 2;
  } else {
    nombre = nombre1 / 4;
  }

  // Définition des limites pour chaque catégorie
  const limiteDevant = 3.0;
  const limiteDos = 4.0;
  const limiteCoter = 5.0;
  const limiteCoter2 = 5.0; // Mise à jour de la limite de "Coter2"

  // Initialisation des variables pour chaque catégorie
  let devant = 0.0;
  let dos = 0.0;
  let coter = 0.0;
  let coter2 = 0.0;

  // Répartition du nombre dans les catégories
  while (nombre > 0) {
    // Répartition cyclique
    if (devant < limiteDevant && nombre > 0) {
      devant += 0.1;
      nombre -= 0.1;
    }

    if (dos < limiteDos && nombre > 0) {
      dos += 0.1;
      nombre -= 0.1;
    }

    if (coter < limiteCoter && nombre > 0) {
      coter += 0.1;
      nombre -= 0.1;
    }

    // Répartition dans Coter2 uniquement si nombre1 est inférieur à 34
    if (nombre1 < 34 && coter2 < limiteCoter2 && nombre > 0) {
      coter2 += 0.1;
      nombre -= 0.1;
    }

    // Si nombre1 est supérieur ou égal à 34 et toutes les autres catégories sont remplies, on s'arrête
    if (
      nombre1 >= 34 &&
      devant >= limiteDevant &&
      dos >= limiteDos &&
      coter >= limiteCoter
    ) {
      break;
    }
  }

  // Calcul des valeurs finales en cm
  var demipincedevant_cm = devant / 2;
  var demipincedos_cm = dos / 2;
  var longeurpincedevant_cm = devant * 4;
  var longeurpincedos_cm = dos * 4;

  // Conversion des valeurs finales en pixels
  var conversionFactor = 37.795275591;
  var demipincedevant_px = demipincedevant_cm * conversionFactor;
  var demipincedos_px = demipincedos_cm * conversionFactor;
  var longeurpincedevant_px = longeurpincedevant_cm * conversionFactor;
  var longeurpincedos_px = longeurpincedos_cm * conversionFactor;
  var longeurpincecoter_px = coter * conversionFactor;

  var varif = 24;
  var varcourbure = 3;
  var callculepossibliter2pince_cm = bassin - Tourdetaille;
  var longeur = 0;
  var longeur1 = 0;
  var longeur2 = 0;
  var longeur3 = 0;
  // Détermination de la longeur en fonction de la valeur de nivcourbure_cm
  if (nivcourbure === 1) {
    (longeur = 56), 693;
    (longeur1 = 18), 8977;
    (longeur2 = 37), 7953;
    (longeur3 = 28), 3465;
  } else if (nivcourbure === 2) {
    (longeur = 75), 5906;
    (longeur1 = 28), 3465;
    (longeur2 = 47), 2441;
    (longeur3 = 37), 7953;
  } else if (nivcourbure === 3) {
    (longeur = 113), 3859;
    (longeur1 = 37), 7953;
    (longeur2 = 56), 693;
    (longeur3 = 47), 2441;
  }

  // Modifier les attributs des lignes
  var ligneAAB = document.querySelector("#ligneAAB");
  ligneAAB.setAttribute("x2", bassin_pt / 4 + aissence_pt + 1);

  var ligneAAC = document.querySelector("#ligneAAC");
  ligneAAC.setAttribute("y2", 4493.8582677 - longeurtotalejupe_pt);
  ligneAAC.setAttribute("y1", ligneAAB.getAttribute("y1"));
  ligneAAC.setAttribute("x1", ligneAAB.getAttribute("x1"));
  ligneAAC.setAttribute("x2", ligneAAB.getAttribute("x1"));

  var ligneACD = document.querySelector("#ligneACD");
  ligneACD.setAttribute(
    "y2",
    ligneAAC.getAttribute("y2") - Nheuteurtaillebassin_pt,
  );
  ligneACD.setAttribute(
    "y1",
    ligneAAC.getAttribute("y2") - Nheuteurtaillebassin_pt,
  );
  ligneACD.setAttribute("x1", ligneAAC.getAttribute("x1"));
  ligneACD.setAttribute("x2", bassin_pt / 4 + aissence_pt);

  var ligneAGH = document.querySelector("#ligneAGH");
  ligneAGH.setAttribute(
    "y2",
    ligneAAC.getAttribute("y2") - heuteurmiebassin_pt,
  );
  ligneAGH.setAttribute(
    "y1",
    ligneAAC.getAttribute("y2") - heuteurmiebassin_pt,
  );
  ligneAGH.setAttribute("x1", ligneAAC.getAttribute("x1"));
  ligneAGH.setAttribute("x2", longeurmiebassin_pt / 4 + aissence_pt);

  var ligneAED = document.querySelector("#ligneAED");
  ligneAED.setAttribute("y2", ligneAAC.getAttribute("y2"));
  ligneAED.setAttribute("y1", ligneAAC.getAttribute("y2"));
  ligneAED.setAttribute("x1", ligneAAC.getAttribute("x2"));
  ligneAED.setAttribute("x2", bassin_pt / 4 + aissence_pt);

  var ligneAEA = document.querySelector("#ligneAEA");
  ligneAEA.setAttribute("y2", ligneAAB.getAttribute("y2"));
  ligneAEA.setAttribute("y1", ligneAAB.getAttribute("y2"));
  ligneAEA.setAttribute("x1", ligneAAB.getAttribute("x2"));
  ligneAEA.setAttribute("x2", (bassin_pt / 4 + aissence_pt + 1) / 2);

  var ligneAEF = document.querySelector("#ligneAEF");
  ligneAEF.setAttribute(
    "y2",
    4493.8582677 - longeurtotalejupe_pt + longeurpincedevant_px,
  );
  ligneAEF.setAttribute("y1", ligneAEA.getAttribute("y1"));
  ligneAEF.setAttribute("x1", ligneAEA.getAttribute("x2"));
  ligneAEF.setAttribute("x2", ligneAEA.getAttribute("x2"));

  var ligneAEC = document.querySelector("#ligneAEC");
  ligneAEC.setAttribute("y1", ligneAEF.getAttribute("y2"));
  ligneAEC.setAttribute("x1", ligneAEF.getAttribute("x2"));
  ligneAEC.setAttribute("y2", 4493.8582677 - longeurtotalejupe_pt);
  ligneAEC.setAttribute("x2", ligneAEF.getAttribute("x2"));

  var ligneAED = document.querySelector("#ligneAED");
  ligneAED.setAttribute("y1", ligneAEF.getAttribute("y2"));
  ligneAED.setAttribute("x1", ligneAEF.getAttribute("x2"));
  ligneAED.setAttribute("y2", ligneAEF.getAttribute("y2"));
  ligneAED.setAttribute("x2", (bassin_pt / 4 + aissence_pt + 1) / 2 + 56.693);

  var ligneAEE = document.querySelector("#ligneAEE");
  ligneAEE.setAttribute("y1", ligneAED.getAttribute("y2"));
  ligneAEE.setAttribute("x1", ligneAED.getAttribute("x2"));
  ligneAEE.setAttribute("y2", ligneAEC.getAttribute("y2"));
  ligneAEE.setAttribute("x2", ligneAEC.getAttribute("x2"));

  var ligneAEH = document.querySelector("#ligneAEH");
  ligneAEH.setAttribute("y1", ligneAEC.getAttribute("y2"));
  ligneAEH.setAttribute("x1", ligneAEC.getAttribute("x2"));
  ligneAEH.setAttribute("y2", ligneAEC.getAttribute("y2"));
  ligneAEH.setAttribute(
    "x2",
    (bassin_pt / 4 + aissence_pt + 1) / 2 + demipincedevant_px,
  );

  var ligneAEG = document.querySelector("#ligneAEG");
  ligneAEG.setAttribute("y1", ligneAEC.getAttribute("y2"));
  ligneAEG.setAttribute("x1", ligneAEC.getAttribute("x2"));
  ligneAEG.setAttribute("y2", ligneAEC.getAttribute("y2"));
  ligneAEG.setAttribute(
    "x2",
    (bassin_pt / 4 + aissence_pt + 1) / 2 - demipincedevant_px,
  );

  var ligneAEI = document.querySelector("#ligneAEI");
  ligneAEI.setAttribute("y1", ligneAEG.getAttribute("y2"));
  ligneAEI.setAttribute("x1", ligneAEG.getAttribute("x2"));
  ligneAEI.setAttribute("y2", ligneAEF.getAttribute("y2"));
  ligneAEI.setAttribute("x2", ligneAEF.getAttribute("x2"));

  var ligneAEJ = document.querySelector("#ligneAEJ");
  ligneAEJ.setAttribute("y1", ligneAEG.getAttribute("y2"));
  ligneAEJ.setAttribute("x1", ligneAEG.getAttribute("x2"));
  ligneAEJ.setAttribute("y2", ligneAEF.getAttribute("y2"));
  ligneAEJ.setAttribute("x2", ligneAEF.getAttribute("x2"));

  var ligneAEK = document.querySelector("#ligneAEK");
  ligneAEK.setAttribute("y1", ligneAEH.getAttribute("y2"));
  ligneAEK.setAttribute("x1", ligneAEH.getAttribute("x2"));
  ligneAEK.setAttribute("y2", ligneAEF.getAttribute("y2"));
  ligneAEK.setAttribute("x2", ligneAEF.getAttribute("x2"));

  var ligneAEL = document.querySelector("#ligneAEL");
  ligneAEL.setAttribute("y1", ligneAEG.getAttribute("y2"));
  ligneAEL.setAttribute("x1", ligneAEG.getAttribute("x2"));
  ligneAEL.setAttribute("y2", ligneAED.getAttribute("y2"));
  ligneAEL.setAttribute("x2", ligneAED.getAttribute("x2"));

  var ligneAEM = document.querySelector("#ligneAEM");
  ligneAEM.setAttribute("y1", ligneAEH.getAttribute("y2"));
  ligneAEM.setAttribute("x1", ligneAEH.getAttribute("x2"));
  ligneAEM.setAttribute("y2", ligneAED.getAttribute("y2"));
  ligneAEM.setAttribute("x2", ligneAED.getAttribute("x2"));

  var ligneAEN = document.querySelector("#ligneAEN");
  ligneAEN.setAttribute("y1", ligneAAC.getAttribute("y2"));
  ligneAEN.setAttribute("x1", ligneAAC.getAttribute("x2"));
  ligneAEN.setAttribute("y2", ligneAAC.getAttribute("y2"));
  ligneAEN.setAttribute("x2", bassin_pt / 4 + aissence_pt + 1);

  var ligneAEO = document.querySelector("#ligneAEO");
  ligneAEO.setAttribute("y1", ligneAAB.getAttribute("y2"));
  ligneAEO.setAttribute("x1", ligneAAB.getAttribute("x2"));
  ligneAEO.setAttribute("y2", ligneACD.getAttribute("y2"));
  ligneAEO.setAttribute("x2", ligneACD.getAttribute("x2"));

  var ligneAEP = document.querySelector("#ligneAEP");
  ligneAEP.setAttribute("y2", ligneAAB.getAttribute("y2"));
  ligneAEP.setAttribute("y1", ligneAAB.getAttribute("y2"));
  ligneAEP.setAttribute("x1", ligneAAB.getAttribute("x2"));
  ligneAEP.setAttribute(
    "x2",
    (bassin_pt / 4 + aissence_pt + 1) / 2 +
      (demipincedevant_px + 151, 181 + demipincedevant_px),
  );

  var ligneAEQ = document.querySelector("#ligneAEQ");
  ligneAEQ.setAttribute("y1", ligneAEP.getAttribute("y2"));
  ligneAEQ.setAttribute("x1", ligneAEP.getAttribute("x2"));
  ligneAEQ.setAttribute("y2", 4493.8582677 - longeurtotalejupe_pt);
  ligneAEQ.setAttribute("x2", ligneAEP.getAttribute("x2"));

  var ligneAER = document.querySelector("#ligneAER");
  ligneAER.setAttribute(
    "y2",
    4493.8582677 - longeurtotalejupe_pt + longeurpincedevant_px,
  );
  ligneAER.setAttribute("y1", ligneAEP.getAttribute("y1"));
  ligneAER.setAttribute("x1", ligneAEP.getAttribute("x2"));
  ligneAER.setAttribute("x2", ligneAEP.getAttribute("x2"));

  var ligneAES = document.querySelector("#ligneAES");
  ligneAES.setAttribute("y1", ligneAER.getAttribute("y2"));
  ligneAES.setAttribute("x1", ligneAER.getAttribute("x2"));
  ligneAES.setAttribute("y2", ligneAER.getAttribute("y2"));
  ligneAES.setAttribute(
    "x2",
    (bassin_pt / 4 + aissence_pt + 1) / 2 +
      (demipincedevant_px + 151, 181 + demipincedevant_px) +
      56.693,
  );

  var ligneAET = document.querySelector("#ligneAET");
  ligneAET.setAttribute("y2", ligneAES.getAttribute("y2"));
  ligneAET.setAttribute("y1", ligneAEQ.getAttribute("y2"));
  ligneAET.setAttribute("x1", ligneAEQ.getAttribute("x2"));
  ligneAET.setAttribute("x2", ligneAES.getAttribute("x2"));

  var ligneAEU = document.querySelector("#ligneAEU");
  ligneAEU.setAttribute("y1", ligneAEQ.getAttribute("y2"));
  ligneAEU.setAttribute("x1", ligneAEQ.getAttribute("x2"));
  ligneAEU.setAttribute("y2", ligneAEQ.getAttribute("y2"));
  ligneAEU.setAttribute(
    "x2",
    (bassin_pt / 4 + aissence_pt + 1) / 2 +
      (demipincedevant_px + 151, 181 + demipincedevant_px) +
      demipincedevant_px,
  );

  var ligneAEV = document.querySelector("#ligneAEV");
  ligneAEV.setAttribute("y1", ligneAEQ.getAttribute("y2"));
  ligneAEV.setAttribute("x1", ligneAEQ.getAttribute("x2"));
  ligneAEV.setAttribute("y2", ligneAEQ.getAttribute("y2"));
  ligneAEV.setAttribute(
    "x2",
    (bassin_pt / 4 + aissence_pt + 1) / 2 +
      (demipincedevant_px + 151, 181 + demipincedevant_px) -
      demipincedevant_px,
  );

  var ligneAEW = document.querySelector("#ligneAEW");
  ligneAEW.setAttribute("y2", ligneAES.getAttribute("y2"));
  ligneAEW.setAttribute("y1", ligneAEV.getAttribute("y2"));
  ligneAEW.setAttribute("x1", ligneAEV.getAttribute("x2"));
  ligneAEW.setAttribute("x2", ligneAES.getAttribute("x2"));

  var ligneAEX = document.querySelector("#ligneAEX");
  ligneAEX.setAttribute("y2", ligneAES.getAttribute("y2"));
  ligneAEX.setAttribute("y1", ligneAEU.getAttribute("y2"));
  ligneAEX.setAttribute("x1", ligneAEU.getAttribute("x2"));
  ligneAEX.setAttribute("x2", ligneAES.getAttribute("x2"));

  var ligneAEY = document.querySelector("#ligneAEY");
  ligneAEY.setAttribute("y2", ligneAES.getAttribute("y1"));
  ligneAEY.setAttribute("y1", ligneAEU.getAttribute("y2"));
  ligneAEY.setAttribute("x1", ligneAEU.getAttribute("x2"));
  ligneAEY.setAttribute("x2", ligneAES.getAttribute("x1"));

  var ligneAEZ = document.querySelector("#ligneAEZ");
  ligneAEZ.setAttribute("y2", ligneAES.getAttribute("y1"));
  ligneAEZ.setAttribute("y1", ligneAEV.getAttribute("y2"));
  ligneAEZ.setAttribute("x1", ligneAEV.getAttribute("x2"));
  ligneAEZ.setAttribute("x2", ligneAES.getAttribute("x1"));

  var ligneAEEA = document.querySelector("#ligneAEEA");
  ligneAEEA.setAttribute("y2", 4493.8582677 - longeurtotalejupe_pt + longeur);
  ligneAEEA.setAttribute("y1", ligneAAAB.getAttribute("y1"));
  ligneAEEA.setAttribute("x1", ligneAAAB.getAttribute("x1"));
  ligneAEEA.setAttribute("x2", ligneAAAB.getAttribute("x1"));

  var ligneAEEB = document.querySelector("#ligneAEEB");
  ligneAEEB.setAttribute("y1", 4493.8582677 - longeurtotalejupe_pt);
  ligneAEEB.setAttribute("x1", ligneAEF.getAttribute("x2") / 2);
  ligneAEEB.setAttribute("y2", 4493.8582677 - longeurtotalejupe_pt + longeur1);
  ligneAEEB.setAttribute("x2", ligneAEF.getAttribute("x2") / 2);

  var ligneAEEC = document.querySelector("#ligneAEEC");
  ligneAEEC.setAttribute("y1", 4493.8582677 - longeurtotalejupe_pt + longeur2);
  ligneAEEC.setAttribute("x1", ligneAEF.getAttribute("x2"));
  ligneAEEC.setAttribute("y2", ligneAEF.getAttribute("y2"));
  ligneAEEC.setAttribute("x2", ligneAEF.getAttribute("x2"));

  var ligneAEEE = document.querySelector("#ligneAEEE");
  ligneAEEE.setAttribute("y2", ligneAEC.getAttribute("y2"));
  ligneAEEE.setAttribute("y1", ligneAEN.getAttribute("y2"));
  ligneAEEE.setAttribute("x1", ligneAEN.getAttribute("x2"));
  ligneAEEE.setAttribute("x2", ligneAEC.getAttribute("x2"));

  var distance2 =
    (ligneAEEE.getAttribute("x1") - ligneAEEE.getAttribute("x2")) / 2;
  console.log(distance2);

  var ligneAEEF = document.querySelector("#ligneAEEF");
  ligneAEEF.setAttribute("y1", ligneAAAC.getAttribute("y2"));
  ligneAEEF.setAttribute("x1", bassin_pt / 4 + aissence_pt + 1 - distance2);
  ligneAEEF.setAttribute("y2", 4493.8582677 - longeurtotalejupe_pt + longeur3);
  ligneAEEF.setAttribute("x2", bassin_pt / 4 + aissence_pt + 1 - distance2);

  class TailleHelper {
    // Méthode pour appliquer les tailles et dessiner la courbe
    appliquerTailles() {
      // Récupération des valeurs des attributs des lignes
      var ligneACD = document.getElementById("ligneACD");
      var ligneAGH = document.getElementById("ligneAGH");
      var ligneAEN = document.getElementById("ligneAEN");

      var Ax = parseFloat(ligneACD.getAttribute("x2"));
      var Ay = parseFloat(ligneACD.getAttribute("y2"));
      var Bx = parseFloat(ligneAGH.getAttribute("x2"));
      var By = parseFloat(ligneAGH.getAttribute("y2"));
      var Cx = parseFloat(ligneAEN.getAttribute("x2"));
      var Cy = parseFloat(ligneAEN.getAttribute("y2"));

      // Création de la courbe passant par les points
      var curvePath = this.createCurveThroughPoints(Ax, Ay, Bx, By, Cx, Cy);

      var AcourbeEmmanchure = document.getElementById("AcourbeEmmanchure");
      AcourbeEmmanchure.setAttribute("d", curvePath);
    }

    createCurveThroughPoints(Ax, Ay, Bx, By, Cx, Cy) {
      // Fonction d'interpolation de spline cubique Catmull-Rom
      function interpolateCatmullRom(p0, p1, p2, t) {
        var t2 = t * t;
        var t3 = t2 * t;

        var c0 = -0.5 * t3 + t2 - 0.5 * t;
        var c1 = 1.5 * t3 - 2.5 * t2 + 1.0;
        var c2 = -1.5 * t3 + 2.0 * t2 + 0.5 * t;
        var c3 = 0.5 * t3 - 0.5 * t2;

        var x = c0 * p0[0] + c1 * p1[0] + c2 * p2[0] + c3 * p2[0];
        var y = c0 * p0[1] + c1 * p1[1] + c2 * p2[1] + c3 * p2[1];

        return [x, y];
      }

      // Points de contrôle
      var points = [
        [Ax, Ay],
        [Bx, By],
        [Cx, Cy],
      ];

      var curvePath = "M" + points[0][0] + " " + points[0][1];

      // Interpolation entre les points
      for (var i = 0; i < points.length - 2; i++) {
        var p0 = points[i];
        var p1 = points[i + 1];
        var p2 = points[i + 2];

        for (var t = 0; t <= 1; t += 0.01) {
          var interpolated = interpolateCatmullRom(p0, p1, p2, t);
          curvePath += " L" + interpolated[0] + " " + interpolated[1];
        }
      }

      return curvePath;
    }
  }

  // Exemple d'utilisation
  var tailleHelper = new TailleHelper();
  tailleHelper.appliquerTailles();

  if (nivcourbure < varcourbure) {
    document.getElementById("ligneAEL").setAttribute("visibility", "hidden");
    document.getElementById("ligneAEM").setAttribute("visibility", "hidden");
  } else {
    document.getElementById("ligneAEJ").setAttribute("visibility", "hidden");
    document.getElementById("ligneAEK").setAttribute("visibility", "hidden");
  }
  //2emepince
  if (callculepossibliter2pince_cm < varif) {
    document.getElementById("ligneAEY").setAttribute("visibility", "hidden");
    document.getElementById("ligneAEZ").setAttribute("visibility", "hidden");
    document.getElementById("ligneAEW").setAttribute("visibility", "hidden");
    document.getElementById("ligneAEX").setAttribute("visibility", "hidden");
  } else {
    if (nivcourbure_cm < varcourbure) {
      document.getElementById("ligneAEW").setAttribute("visibility", "hidden");
      document.getElementById("ligneAEX").setAttribute("visibility", "hidden");
    } else {
      document.getElementById("ligneAEY").setAttribute("visibility", "hidden");
      document.getElementById("ligneAEZ").setAttribute("visibility", "hidden");
    }
  }
}
class TailleHelper2 {
  // Méthode pour appliquer les tailles et dessiner la courbe
  appliquerTailles() {
    console.log("appliquerTailles() est appelée");

    // Récupération des valeurs des attributs des lignes
    var ligneAEEA = document.getElementById("ligneAEEA");
    var ligneAEEB = document.getElementById("ligneAEEB");
    var ligneAEF = document.getElementById("ligneAEF");
    var ligneAEEF = document.getElementById("ligneAEEF"); // Correction: ligneEEF au lieu de ligneEF
    var ligneACD = document.getElementById("ligneACD");

    // Vérifiez si les éléments existent
    if (!ligneAEEA || !ligneAEEB || !ligneAEF || !ligneAEEF || !ligneACD) {
      console.error("Un ou plusieurs éléments n'ont pas été trouvés.");
      return;
    }

    var Ax = parseFloat(ligneAEEA.getAttribute("x1"));
    var Ay = parseFloat(ligneAEEA.getAttribute("y1"));
    var Bx = parseFloat(ligneAEEB.getAttribute("x1"));
    var By = parseFloat(ligneAEEB.getAttribute("y1"));
    var Cx = parseFloat(ligneAEF.getAttribute("x1"));
    var Cy = parseFloat(ligneAAEF.getAttribute("y1"));
    var Dx = parseFloat(ligneAEEF.getAttribute("x1"));
    var Dy = parseFloat(ligneAEEF.getAttribute("y1"));
    var Ex = parseFloat(ligneACD.getAttribute("x1"));
    var Ey = parseFloat(ligneACD.getAttribute("y1"));

    console.log("Points récupérés:", {
      Ax,
      Ay,
      Bx,
      By,
      Cx,
      Cy,
      Dx,
      Dy,
      Ex,
      Ey,
    });

    // Création de la courbe passant par les points
    var curvePath = this.createCurveThroughPoints(
      Ax,
      Ay,
      Bx,
      By,
      Cx,
      Cy,
      Dx,
      Dy,
      Ex,
      Ey,
    );

    var Acourbe2 = document.getElementById("Acourbe2");
    if (Acourbe2) {
      Acourbe2.setAttribute("E", curvePath);
      console.log("Chemin de la courbe défini:", curvePath);
    } else {
      console.error("L'élément courbe2 n'a pas été trouvé.");
    }
  }

  createCurveThroughPoints(Ax, Ay, Bx, By, Cx, Cy, Dx, Dy, Ex, Ey) {
    console.log("createCurveThroughPoints() est appelée avec les points", {
      Ax,
      Ay,
      Bx,
      By,
      Cx,
      Cy,
      Dx,
      Dy,
      Ex,
      Ey,
    });

    // Fonction d'interpolation de spline cubique Catmull-Rom
    function interpolateCatmullRom(p0, p1, p2, t) {
      var t2 = t * t;
      var t3 = t2 * t;

      var c0 = -0.5 * t3 + t2 - 0.5 * t;
      var c1 = 1.5 * t3 - 2.5 * t2 + 1.0;
      var c2 = -1.5 * t3 + 2.0 * t2 - 0.5 * t;
      var c3 = 0.5 * t3 - 0.5 * t2;

      var x = c0 * p0[0] + c1 * p1[0] + c2 * p2[0] + c3 * p2[0];
      var y = c0 * p0[1] + c1 * p1[1] + c2 * p2[1] + c3 * p2[1];

      return [x, y];
    }

    // Points de contrôle
    var points = [
      [Ax, Ay],
      [Bx, By],
      [Cx, Cy],
      [Dx, Dy],
      [Ex, Ey],
    ];

    var curvePath = "M" + points[0][0] + " " + points[0][1];

    // Interpolation entre les points
    for (var i = 0; i < points.length - 2; i++) {
      var p0 = points[i];
      var p1 = points[i + 1];
      var p2 = points[i + 2];

      for (var t = 0; t <= 1; t += 0.01) {
        var interpolated = interpolateCatmullRom(p0, p1, p2, t);
        curvePath += " L" + interpolated[0] + " " + interpolated[1];
      }
    }

    console.log("Chemin de la courbe créé:", curvePath);
    return curvePath;
  }
}

// Exemple d'utilisation
document.addEventListener("DOMContentLoaded", () => {
  var helper = new TailleHelper2();
  helper.appliquerTailles();
});
