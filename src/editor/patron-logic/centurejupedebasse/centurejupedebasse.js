import { createCurveThroughPoints } from "../../function/svg/createCurveThroughPoints.js";
import { setTailles } from "../../function/setTailles.js";

export function appliquerTailles(
    aissence,
    Tourdetaille,
    longeurpatedeboutonageceinture,
    Largeurceinture,
) {
    const tailles = {
        aissence,
        Tourdetaille,
        longeurpatedeboutonageceinture,
        Largeurceinture,
    };
    setTailles(tailles);

    // Convertir les tailles de cm en points
    var aissence_pt = aissence * 37.795275591;
    var longeurpatedeboutonage_pt = Largeurceinture * 37.795275591;
    var Largeurceinturen_pt = longeurpatedeboutonageceinture * 37.795275591;
    var Tourdetaille_pt = Tourdetaille * 37.795275591;

    var toutredos = (Tourdetaille_pt + aissence_pt) / 4 - 1;
    var toutrdevant = (Tourdetaille_pt + aissence_pt) / 4 + 1;

    // Modifier les attributs des lignes
    var ligneFA = document.querySelector("#ligneFA");
    ligneFA.setAttribute(
        "x2",
        Tourdetaille_pt + aissence_pt + longeurpatedeboutonage_pt,
    );

    var ligneFB = document.querySelector("#ligneFB");
    ligneFB.setAttribute("y2", 4493.8582677 - Largeurceinturen_pt * 2);
    ligneFB.setAttribute("y1", ligneFA.getAttribute("y1"));
    ligneFB.setAttribute("x1", ligneFA.getAttribute("x1"));
    ligneFB.setAttribute("x2", ligneFA.getAttribute("x1"));

    var ligneFC = document.querySelector("#ligneFC");
    ligneFC.setAttribute("y2", ligneFB.getAttribute("y2"));
    ligneFC.setAttribute("y1", ligneFB.getAttribute("y2"));
    ligneFC.setAttribute("x1", ligneFB.getAttribute("x1"));
    ligneFC.setAttribute(
        "x2",
        Tourdetaille_pt + aissence_pt + longeurpatedeboutonage_pt,
    );

    var ligneFD = document.querySelector("#ligneFD");
    ligneFD.setAttribute("y2", ligneFA.getAttribute("y2"));
    ligneFD.setAttribute("y1", ligneFC.getAttribute("y2"));
    ligneFD.setAttribute("x1", ligneFC.getAttribute("x2"));
    ligneFD.setAttribute("x2", ligneFA.getAttribute("x2"));

    var ligneFE = document.querySelector("#ligneFE");
    ligneFE.setAttribute("y2", 4493.8582677 - 56, 69295);
    ligneFE.setAttribute("y1", ligneFA.getAttribute("y1"));
    ligneFE.setAttribute("x1", 37.795275591 + toutredos);
    ligneFE.setAttribute("x2", 37.795275591 + toutredos);

    var ligneFF = document.querySelector("#ligneFF");
    ligneFF.setAttribute("y2", 4493.8582677 - 56, 69295);
    ligneFF.setAttribute("y1", ligneFE.getAttribute("y1"));
    ligneFF.setAttribute("x1", 37.795275591 + toutredos + toutrdevant);
    ligneFF.setAttribute("x2", 37.795275591 + toutredos + toutrdevant);

    var ligneFG = document.querySelector("#ligneFG");
    ligneFG.setAttribute("y2", 4493.8582677 - 56, 69295);
    ligneFG.setAttribute("y1", ligneFF.getAttribute("y1"));
    ligneFG.setAttribute(
        "x1",
        37.795275591 + toutredos + toutrdevant + toutrdevant,
    );
    ligneFG.setAttribute(
        "x2",
        37.795275591 + toutredos + toutrdevant + toutrdevant,
    );

    var ligneFH = document.querySelector("#ligneFH");
    ligneFH.setAttribute("y2", 4493.8582677 - 56, 69295);
    ligneFH.setAttribute("y1", ligneFF.getAttribute("y1"));
    ligneFH.setAttribute(
        "x1",
        37.795275591 + toutredos + toutrdevant + toutrdevant + toutredos,
    );
    ligneFH.setAttribute(
        "x2",
        37.795275591 + toutredos + toutrdevant + toutrdevant + toutredos,
    );
}
