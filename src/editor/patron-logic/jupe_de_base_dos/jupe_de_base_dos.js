import { createCurveThroughPoints } from '../../function/svg/createCurveThroughPoints.js'
import { setTailles } from '../../function/setTailles.js'

export  function appliquerTailles(
    aissence,
    bassin,
    longeurtotalejupe,
    heuteurtaillebassin,
    longeurmiebassin,
    heuteurmiebassin,
    Tourdetaille,
    nivcourbure
) {    
    const tailles = {
      aissence,
      bassin,
      longeurtotalejupe,
      heuteurtaillebassin,
      longeurmiebassin,
      heuteurmiebassin,
      Tourdetaille,
      nivcourbure
    };
    setTailles(tailles)

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
let nombre1 = (bassin - Tourdetaille) ;

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
if (nombre1 >= 34 && devant >= limiteDevant && dos >= limiteDos && coter >= limiteCoter) {
break;
}
}

// Calcul des valeurs finales en cm
var demipincedevant = devant / 2;
var demipincedos = dos / 2;
var longeurpincedevant = devant * 4;
var longeurpincedos = dos * 4;

// Conversion des valeurs finales en pixels
var conversionFactor = 37.795275591;
var demipincedevant_px = demipincedevant * conversionFactor;
var demipincedos_px = demipincedos * conversionFactor;
var longeurpincedevant_px = longeurpincedevant * conversionFactor;
var longeurpincedos_px = longeurpincedos * conversionFactor;
var longeurpincecoter_px  = coter * conversionFactor;


    var varif = 24
    var varcourbure = 3
    var callculepossibliter2pince = bassin  -  Tourdetaille
    var longeur;

    // Détermination de la longeur en fonction de la valeur de nivcourbure
if (nivcourbure === 1) {
longeur = 18,8976377955;
} else if (nivcourbure === 2) {
longeur = 28,34645669325;
} else if (nivcourbure === 3) {
longeur = 37.795275591;
} else {
// Si la valeur de nivcourbure n'est pas 1, 2 ou 3, on peut définir une valeur par défaut
longeur = 0; // Valeur par défaut
}

    // Modifier les attributs des lignes
    var ligneAB = document.querySelector('#ligneAB');
    ligneAB.setAttribute('x2', bassin_pt / 4 + aissence_pt - 1);

    var ligneAC = document.querySelector('#ligneAC');
    ligneAC.setAttribute('y2', 4493.8582677 - longeurtotalejupe_pt);
    ligneAC.setAttribute('y1', ligneAB.getAttribute('y1'));
    ligneAC.setAttribute('x1', ligneAB.getAttribute('x1'));
    ligneAC.setAttribute('x2', ligneAB.getAttribute('x1'));

    var ligneCD = document.querySelector('#ligneCD');
    ligneCD.setAttribute('y2', ligneAC.getAttribute('y2') - Nheuteurtaillebassin_pt);
    ligneCD.setAttribute('y1', ligneAC.getAttribute('y2') - Nheuteurtaillebassin_pt);
    ligneCD.setAttribute('x1', ligneAC.getAttribute('x1'));
    ligneCD.setAttribute('x2', bassin_pt / 4 + aissence_pt);

    var ligneGH = document.querySelector('#ligneGH');
    ligneGH.setAttribute('y2', ligneAC.getAttribute('y2') - heuteurmiebassin_pt);
    ligneGH.setAttribute('y1', ligneAC.getAttribute('y2') - heuteurmiebassin_pt);
    ligneGH.setAttribute('x1', ligneAC.getAttribute('x1'));
    ligneGH.setAttribute('x2', longeurmiebassin_pt / 4 + aissence_pt);

    var ligneED = document.querySelector('#ligneED');
    ligneED.setAttribute('y2', ligneAC.getAttribute('y2'));
    ligneED.setAttribute('y1', ligneAC.getAttribute('y2'));
    ligneED.setAttribute('x1', ligneAC.getAttribute('x2'));
    ligneED.setAttribute('x2', bassin_pt / 4 + aissence_pt);

    var ligneEA = document.querySelector('#ligneEA');
    ligneEA.setAttribute('y2', ligneAB.getAttribute('y2'));
    ligneEA.setAttribute('y1', ligneAB.getAttribute('y2'));
    ligneEA.setAttribute('x1', ligneAB.getAttribute('x2'));
    ligneEA.setAttribute('x2', (bassin_pt / 4 + aissence_pt  - 1) / 2 );

    var ligneEF = document.querySelector('#ligneEF');
    ligneEF.setAttribute('y2', 4493.8582677 - longeurtotalejupe_pt + longeurpincedevant_px);
    ligneEF.setAttribute('y1', ligneEA.getAttribute('y1'));
    ligneEF.setAttribute('x1', ligneEA.getAttribute('x2'));
    ligneEF.setAttribute('x2', ligneEA.getAttribute('x2'));
    
    var ligneEC = document.querySelector('#ligneEC'); 
    ligneEC.setAttribute('y1', ligneEF.getAttribute('y2'));
    ligneEC.setAttribute('x1', ligneEF.getAttribute('x2'));
    ligneEC.setAttribute('y2', 4493.8582677 - longeurtotalejupe_pt );
    ligneEC.setAttribute('x2', ligneEF.getAttribute('x2'));

    var ligneED = document.querySelector('#ligneED');
    ligneED.setAttribute('y1', ligneEF.getAttribute('y2'));
    ligneED.setAttribute('x1', ligneEF.getAttribute('x2'));
    ligneED.setAttribute('y2', ligneEF.getAttribute('y2'));
    ligneED.setAttribute('x2', ( bassin_pt / 4 + aissence_pt - 1)/2 + 56.693);
    
    var ligneEE = document.querySelector('#ligneEE');
    ligneEE.setAttribute('y1', ligneED.getAttribute('y2'));
    ligneEE.setAttribute('x1', ligneED.getAttribute('x2'));
    ligneEE.setAttribute('y2', ligneEC.getAttribute('y2'));
    ligneEE.setAttribute('x2', ligneEC.getAttribute('x2'));

    var ligneEH = document.querySelector('#ligneEH');
    ligneEH.setAttribute('y1', ligneEC.getAttribute('y2'));
    ligneEH.setAttribute('x1', ligneEC.getAttribute('x2'));
    ligneEH.setAttribute('y2', ligneEC.getAttribute('y2'));
    ligneEH.setAttribute('x2', ( bassin_pt / 4 + aissence_pt - 1)/2 + demipincedos_px );

    var ligneEG = document.querySelector('#ligneEG');
    ligneEG.setAttribute('y1', ligneEC.getAttribute('y2'));
    ligneEG.setAttribute('x1', ligneEC.getAttribute('x2'));
    ligneEG.setAttribute('y2', ligneEC.getAttribute('y2'));
    ligneEG.setAttribute('x2', ( bassin_pt / 4 + aissence_pt - 1)/2 - demipincedos_px  );
    
    var ligneEI = document.querySelector('#ligneEI');
    ligneEI.setAttribute('y1', ligneEG.getAttribute('y2'));
    ligneEI.setAttribute('x1', ligneEG.getAttribute('x2'));
    ligneEI.setAttribute('y2', ligneEF.getAttribute('y2'));
    ligneEI.setAttribute('x2', ligneEF.getAttribute('x2'));
    
    var ligneEJ = document.querySelector('#ligneEJ');
    ligneEJ.setAttribute('y1', ligneEG.getAttribute('y2'));
    ligneEJ.setAttribute('x1', ligneEG.getAttribute('x2'));
    ligneEJ.setAttribute('y2', ligneEF.getAttribute('y2'));
    ligneEJ.setAttribute('x2', ligneEF.getAttribute('x2'));

    var ligneEK = document.querySelector('#ligneEK');
    ligneEK.setAttribute('y1', ligneEH.getAttribute('y2'));
    ligneEK.setAttribute('x1', ligneEH.getAttribute('x2'));
    ligneEK.setAttribute('y2', ligneEF.getAttribute('y2'));
    ligneEK.setAttribute('x2', ligneEF.getAttribute('x2'));

    
    var ligneEL = document.querySelector('#ligneEL');
    ligneEL.setAttribute('y1', ligneEG.getAttribute('y2'));
    ligneEL.setAttribute('x1', ligneEG.getAttribute('x2'));
    ligneEL.setAttribute('y2', ligneED.getAttribute('y2'));
    ligneEL.setAttribute('x2', ligneED.getAttribute('x2'));

    var ligneEM = document.querySelector('#ligneEM');
    ligneEM.setAttribute('y1', ligneEH.getAttribute('y2'));
    ligneEM.setAttribute('x1', ligneEH.getAttribute('x2'));
    ligneEM.setAttribute('y2', ligneED.getAttribute('y2'));
    ligneEM.setAttribute('x2', ligneED.getAttribute('x2'));

    var ligneEN = document.querySelector('#ligneEN');
    ligneEN.setAttribute('y1', ligneAC.getAttribute('y2'));
    ligneEN.setAttribute('x1', ligneAC.getAttribute('x2'));
    ligneEN.setAttribute('y2', ligneAC.getAttribute('y2'));
    ligneEN.setAttribute('x2', (((bassin_pt / 4 ) + aissence_pt) - 1) - longeurpincecoter_px  );

    var ligneEO = document.querySelector('#ligneEO');
    ligneEO.setAttribute('y1', ligneAB.getAttribute('y2'));
    ligneEO.setAttribute('x1', ligneAB.getAttribute('x2'));
    ligneEO.setAttribute('y2', ligneCD.getAttribute('y2'));
    ligneEO.setAttribute('x2', ligneCD.getAttribute('x2'));

    var ligneEP = document.querySelector('#ligneEP');
    ligneEP.setAttribute('y2', ligneAB.getAttribute('y2'));
    ligneEP.setAttribute('y1', ligneAB.getAttribute('y2'));
    ligneEP.setAttribute('x1', ligneAB.getAttribute('x2'));
    ligneEP.setAttribute('x2',   ( ( bassin_pt / 4 + aissence_pt - 1)/2 ) + (demipincedos_px + 151,181 + demipincedos_px) );

    var ligneEQ = document.querySelector('#ligneEQ'); 
    ligneEQ.setAttribute('y1', ligneEP.getAttribute('y2'));
    ligneEQ.setAttribute('x1', ligneEP.getAttribute('x2'));
    ligneEQ.setAttribute('y2', 4493.8582677 - longeurtotalejupe_pt );
    ligneEQ.setAttribute('x2', ligneEP.getAttribute('x2'));

    
    var ligneER = document.querySelector('#ligneER');
    ligneER.setAttribute('y2', 4493.8582677 - longeurtotalejupe_pt +  longeurpincedevant_px);
    ligneER.setAttribute('y1', ligneEP.getAttribute('y1'));
    ligneER.setAttribute('x1', ligneEP.getAttribute('x2'));
    ligneER.setAttribute('x2', ligneEP.getAttribute('x2'));

    var ligneES = document.querySelector('#ligneES');
    ligneES.setAttribute('y1', ligneER.getAttribute('y2'));
    ligneES.setAttribute('x1', ligneER.getAttribute('x2'));
    ligneES.setAttribute('y2', ligneER.getAttribute('y2'));
    ligneES.setAttribute('x2',  ( ( bassin_pt / 4 + aissence_pt - 1)/2 ) + (demipincedos_px + 151,181 + demipincedos_px) + 56.693 );

    var ligneET = document.querySelector('#ligneET');
    ligneET.setAttribute('y2', ligneES.getAttribute('y2'));
    ligneET.setAttribute('y1', ligneEQ.getAttribute('y2'));
    ligneET.setAttribute('x1', ligneEQ.getAttribute('x2'));
    ligneET.setAttribute('x2', ligneES.getAttribute('x2'));

    var ligneEU = document.querySelector('#ligneEU');
    ligneEU.setAttribute('y1', ligneEQ.getAttribute('y2'));
    ligneEU.setAttribute('x1', ligneEQ.getAttribute('x2'));
    ligneEU.setAttribute('y2', ligneEQ.getAttribute('y2'));
    ligneEU.setAttribute('x2',  ( ( bassin_pt / 4 + aissence_pt - 1)/2 ) + (demipincedos_px + 151,181 + demipincedos_px) + demipincedos_px);

    var ligneEV = document.querySelector('#ligneEV');
    ligneEV.setAttribute('y1', ligneEQ.getAttribute('y2'));
    ligneEV.setAttribute('x1', ligneEQ.getAttribute('x2'));
    ligneEV.setAttribute('y2', ligneEQ.getAttribute('y2'));
    ligneEV.setAttribute('x2',  ( ( bassin_pt / 4 + aissence_pt - 1)/2 ) + (demipincedos_px + 151,181 + demipincedos_px) - demipincedos_px);

    var ligneEW = document.querySelector('#ligneEW');
    ligneEW.setAttribute('y2', ligneES.getAttribute('y2'));
    ligneEW.setAttribute('y1', ligneEV.getAttribute('y2'));
    ligneEW.setAttribute('x1', ligneEV.getAttribute('x2'));
    ligneEW.setAttribute('x2', ligneES.getAttribute('x2'));

    var ligneEX = document.querySelector('#ligneEX');
    ligneEX.setAttribute('y2', ligneES.getAttribute('y2'));
    ligneEX.setAttribute('y1', ligneEU.getAttribute('y2'));
    ligneEX.setAttribute('x1', ligneEU.getAttribute('x2'));
    ligneEX.setAttribute('x2', ligneES.getAttribute('x2'));

    var ligneEY = document.querySelector('#ligneEY');
    ligneEY.setAttribute('y2', ligneES.getAttribute('y1'));
    ligneEY.setAttribute('y1', ligneEU.getAttribute('y2'));
    ligneEY.setAttribute('x1', ligneEU.getAttribute('x2'));
    ligneEY.setAttribute('x2', ligneES.getAttribute('x1'));

    
    var ligneEZ = document.querySelector('#ligneEZ');
    ligneEZ.setAttribute('y2', ligneES.getAttribute('y1'));
    ligneEZ.setAttribute('y1', ligneEV.getAttribute('y2'));
    ligneEZ.setAttribute('x1', ligneEV.getAttribute('x2'));
    ligneEZ.setAttribute('x2', ligneES.getAttribute('x1'));

    var ligneEEA = document.querySelector('#ligneEEA');  
    ligneEEA.setAttribute('y2', (4493.8582677 - longeurtotalejupe_pt) + longeur );
    ligneEEA.setAttribute('y1', ligneAB.getAttribute('y1'));
    ligneEEA.setAttribute('x1', ligneAB.getAttribute('x1'));
    ligneEEA.setAttribute('x2', ligneAB.getAttribute('x1'));

    var ligneEEB = document.querySelector('#ligneEEB');  
    ligneEEB.setAttribute('x1', ligneEEA.getAttribute('x2'));
    ligneEEB.setAttribute('y1', ligneEEA.getAttribute('y2'));
    ligneEEB.setAttribute('y2', ligneEM.getAttribute('y1'));
    ligneEEB.setAttribute('x2', ligneEM.getAttribute('x1'));

    var ligneEEC = document.querySelector('#ligneEEC');  
    ligneEEC.setAttribute('x1', ligneEEB.getAttribute('x2'));
    ligneEEC.setAttribute('y1', ligneEEB.getAttribute('y2'));
    ligneEEC.setAttribute('y2', ligneEN.getAttribute('y2'));
    ligneEEC.setAttribute('x2', ligneEN.getAttribute('x2'));

    var ligneEED = document.querySelector('#ligneEED');  
    ligneEED.setAttribute('x1', ligneEEB.getAttribute('x2'));
    ligneEED.setAttribute('y1', ligneEEB.getAttribute('y2'));
    ligneEED.setAttribute('y2', ligneEN.getAttribute('y2'));
    ligneEED.setAttribute('x2', ligneEN.getAttribute('x2'));



    class TailleHelper {
// Méthode pour appliquer les tailles et dessiner la courbe
appliquerTailles() {
// Récupération des valeurs des attributs des lignes
var ligneCD = document.getElementById("ligneCD");
var ligneGH = document.getElementById("ligneGH");
var ligneEN = document.getElementById("ligneEN");

var Ax = parseFloat(ligneCD.getAttribute("x2"));
var Ay = parseFloat(ligneCD.getAttribute("y2"));
var Bx = parseFloat(ligneGH.getAttribute("x2"));
var By = parseFloat(ligneGH.getAttribute("y2"));
var Cx = parseFloat(ligneEN.getAttribute("x2"));
var Cy = parseFloat(ligneEN.getAttribute("y2"));

const points = [
  [Ax, Ay],
  [Bx, By],
  [Cx, Cy]
];

// Création de la courbe passant par les points
var curvePath = createCurveThroughPoints(points);

// Accéder aux éléments SVG par leur ID
var courbeEmmanchure = document.getElementById("courbeEmmanchure");
courbeEmmanchure.setAttribute("d", curvePath);
}
}

// Exemple d'utilisation
var tailleHelper = new TailleHelper();
tailleHelper.appliquerTailles();

if (nivcourbure < varcourbure){
document.getElementById('ligneEL').setAttribute('visibility', 'hidden');
document.getElementById('ligneEM').setAttribute('visibility', 'hidden');
} else {
document.getElementById('ligneEJ').setAttribute('visibility', 'hidden');
document.getElementById('ligneEK').setAttribute('visibility', 'hidden');
}
//2emepince
if (callculepossibliter2pince < varif){
document.getElementById('ligneEY').setAttribute('visibility', 'hidden');
document.getElementById('ligneEZ').setAttribute('visibility', 'hidden'); 
document.getElementById('ligneEW').setAttribute('visibility', 'hidden');
document.getElementById('ligneEX').setAttribute('visibility', 'hidden');
} else {
if (nivcourbure < varcourbure){
document.getElementById('ligneEW').setAttribute('visibility', 'hidden');
document.getElementById('ligneEX').setAttribute('visibility', 'hidden');
} else {
document.getElementById('ligneEY').setAttribute('visibility', 'hidden');
document.getElementById('ligneEZ').setAttribute('visibility', 'hidden');
}
}
}