const urlDPETertiairev2 = "https://data.ademe.fr/data-fair/api/v1/datasets/dpe01tertiaire/lines?select=*&q=";
const urlDPETertiairev1 = "https://data.ademe.fr/data-fair/api/v1/datasets/dpe-tertiaire/lines?select=*&q=";
const urlDPENeufv2 = "https://data.ademe.fr/data-fair/api/v1/datasets/dpe02neuf/lines?select=*&q=";
const urlDPEExistantv2 = "https://data.ademe.fr/data-fair/api/v1/datasets/dpe03existant/lines?select=*&q=";
const urlAuditEnergetique = "https://data.ademe.fr/data-fair/api/v1/datasets/audit-opendata/lines?q=";

// Liste des DPE pour faire des tests :     
// DPE Tertiaire v2 : 2593T2105307R         |
// DPE Tertiaire v1 : 1330V8000001A         |
// DPE Logement Neuf : 2481N0172887C        |
// DPE Logement Existant : 2331E0473998Z    |
// DPE Audit Energétique :  A23770111876U   |

// Menue de paramètrage : 
let classBoutonActiver = "w-60 h-13 text-lg text-center mb-2 mt-2 px-2 py-2 border-4 border-yellow-400 text-gray-700 bg-yellow-400 rounded-xl hover:bg-yellow-400 transition";
let classBoutonDesactiver = "w-60 h-13 text-lg text-center mb-2 mt-2 px-2 py-2 border-4 border-yellow-400 text-gray-700 bg-[#fffade] rounded-xl hover:bg-yellow-400 transition";
let classLignePSimple = "block text-black-500 text-lg break-words line-clamp-1"

let button = document.getElementById('boutonMyForm');
let ConteneurDesCartes = document.getElementById('conteneur-des-cartes')
let input = document.getElementById('myInput');

let typeAPI = 1;
let periodeAPI = 2;

let nomColAPIv2Tertiaire = ["score_ban","adresse_brut","nom_commune_brut","code_postal_brut","numero_dpe","etiquette_dpe","conso_kwhep_m2_an","etiquette_ges",
    "emission_ges_kg_co2_m2_an","date_etablissement_dpe","methode_dpe", "annee_construction", "periode_construction", "secteur_activite", "surface_shon"
    , "surface_utile"];

let nomColAPIv1Tertiaire = ["geo_score", "nom_rue", "commune", "code_postal", "numero_dpe", "classe_consommation_energie", "consommation_energie", 
    "classe_estimation_ges", "estimation_ges", "date_etablissement_dpe", "nom_methode_dpe", "annee_construction", "annee_construction", "secteur_activite", "shon",
    "surface_utile"];

let nomColAPIv2Neuf = ["score_ban","adresse_brut","nom_commune_brut","code_postal_brut","numero_dpe","etiquette_dpe","conso_5_usages_par_m2_ef","etiquette_ges",
    "emission_ges_5_usages_par_m2","date_etablissement_dpe","methode_application_dpe", "annee_construction", "periode_construction","type_batiment",
    "surface_habitable_immeuble","surface_habitable_logement"
];

let nomColAPIv2Existant = ["score_ban","adresse_brut","nom_commune_ban","code_postal_brut","numero_dpe","etiquette_dpe","conso_5_usages_par_m2_ef",
    "etiquette_ges","emission_ges_5_usages_par_m2","date_etablissement_dpe","methode_application_dpe", "annee_construction", "periode_construction","type_batiment"
    ,"surface_habitable_logement","surface_habitable_immeuble"
];

let nomColAPIv2Audit = ["score_ban","adresse_brut","nom_commune_brut","code_postal_brut","numero_dpe","classe_bilan_dpe","conso_5_usages_m2",
     "etiquette_ges","emission_ges_5_usages_m2","date_etablissement_audit","methode_application_dpe", "annee_construction", "periode_construction"
    ,"surface_habitable_logement","surface_ventilee"
];

function getChoixAPI(typeAPIf, periodeAPIf, num_ademe) {
    if (typeAPIf === 1 && periodeAPIf === 1) {
        urlGetf = `${urlDPETertiairev1}${num_ademe}&q_mode=simple&q_field=numero_dpe`;
    } else if (typeAPIf === 1 && periodeAPIf === 2) {
        urlGetf = `${urlDPETertiairev2}${num_ademe}&q_mode=simple&q_fields=numero_dpe`;
    } else if (typeAPIf === 2 && periodeAPIf === 2) {
        urlGetf = `${urlDPENeufv2}${num_ademe}&q_mode=simple&q_fields=numero_dpe`;
    } else if (typeAPIf === 3 && periodeAPIf === 2) {
        urlGetf = `${urlDPEExistantv2}${num_ademe}&q_mode=simple&q_fields=numero_dpe`;
    } else if (typeAPIf === 4 && periodeAPIf === 2) {
        urlGetf = `${urlAuditEnergetique}${num_ademe}&q_mode=simple&q_fields=n_audit`;
    }
    return urlGetf
};

function getChoixColonneAPI(typeAPIf, periodeAPIf) {
    let listeColonneAPI = [];
    if (typeAPIf === 1 && periodeAPIf === 1) {
        listeColonneAPI = nomColAPIv1Tertiaire;
    } else if (typeAPIf === 1 && periodeAPIf === 2) {
        listeColonneAPI = nomColAPIv2Tertiaire;
    } else if (typeAPIf === 2 && periodeAPIf === 2) {
        listeColonneAPI = nomColAPIv2Neuf;
    } else if (typeAPIf === 3 && periodeAPIf === 2) {
        listeColonneAPI = nomColAPIv2Existant;
    } else if (typeAPIf === 4 && periodeAPIf === 2) {
        listeColonneAPI = nomColAPIv2Audit;
    }
    return listeColonneAPI
}

function getNomAPI(typeAPIf, periodeAPIf, num) {
    let nomAPIDPE = "";
    if (typeAPIf === 1 && periodeAPIf === 1) {
        nomAPIDPE = `DPE Tertiaire Avant Juillet 2021 (${num} DPE)`;
    } else if (typeAPIf === 1 && periodeAPIf === 2) {
        nomAPIDPE = `DPE Tertiaire Après Juillet 2021 (${num} DPE)`;
    } else if (typeAPIf === 2 && periodeAPIf === 2) {
        nomAPIDPE = `DPE Logement Neuf Après Juillet 2021 (${num} DPE)`;
    } else if (typeAPIf === 3 && periodeAPIf === 2) {
        nomAPIDPE = `DPE Logement Existant Après Juillet 2021 (${num} DPE)`;
    } else if (typeAPIf === 4 && periodeAPIf === 2) {
        nomAPIDPE = `Audit Energétique Après Juillet 2021 (${num} DPE)`;
    }
    return nomAPIDPE
}

// Fonction pour aller récupérer les DPE associé au geo_id
async function getInfoDPE(num_ademe, type, prd, liste) {

    let urlGet = getChoixAPI(type, prd, num_ademe);
    // let listeColonneAPI = getChoixColonneAPI(typeAPI, periodeAPI);
    let div = creationDivVide();
    const requete = await fetch(urlGet, {
        method: 'GET'
    });

    if (!requete.ok) {
        alert('Un problème est survenu, veuillez réessayer plus tard');
    } else {
        let donnees = await requete.json();
        let nom = getNomAPI(type, prd, donnees.total);
        let elementNomAPI = creationNomAPI(nom);
        console.log(donnees)
        // ConteneurDesCartes.innerHTML = ""; 
        if (donnees.total == 0) {
            let msg = creationMessageVide();
            div.appendChild(elementNomAPI);
            div.appendChild(msg);
            ConteneurDesCartes.appendChild(div);
        } else {
            div.appendChild(elementNomAPI);
            for (let index = 0; index < donnees.total; index++) {
                carteDPE = creationCarteDPE(donnees, liste, index);
                div.appendChild(carteDPE);
            }
            ConteneurDesCartes.appendChild(div);
        }
    }
};


function creationMessageVide() {
    const msg = document.createElement('p');
    msg.className = "flex justify-center text-xl text-red-500";
    msg.textContent = "Ce numéro ADEME n'est pas récupèrable dans cette base de données";
    return msg
}

function creationNomAPI(texte) {
    const msg = document.createElement('p');
    msg.className = "flex justify-center text-2xl underline bold";
    msg.textContent = texte;
    return msg
}

function creationDivVide() {
    const div = document.createElement('div');
    return div
}
// Fonction pour ajouter une carte DPE
function creationCarteDPE(donnees, listeColonne, index) {

    // Création des informations des DPE :
    const liCardDPE = document.createElement('li');
    const cardDivDPEEnglobe = document.createElement('div');
    const cardDivDPECarte = document.createElement('div');
    const cardH1Titre = document.createElement('h1');
    const cardDivDPEObjet = document.createElement('div');
    const cardImgDPE = document.createElement('img');
    const cardDivDPEDoneesSaisie = document.createElement('div');
    const cardDivDPEDoneesVerif = document.createElement('div');
    const cardPTitreDoneesSaisie = document.createElement('p');
    const cardPEtiquetteDPE = document.createElement('p');
    const cardPEtiquetteGES = document.createElement('p');
    const cardPDateEtablissement = document.createElement('p');
    const cardPMethodeDPE = document.createElement('p');
    const cardPSecteurActivite = document.createElement('p');
    const cardPAnneeConstruction = document.createElement('p');
    const cardPSurfaceShon = document.createElement('p');
    const cardPSurfaceUtile = document.createElement('p');

    // Changement des classes pour Front : 
    cardDivDPEEnglobe.className = "flex justify-center"
    cardDivDPECarte.className = "bg-[#a5b68d] ml-[5%] rounded-2xl overflow-hidden shadow-md flex flex-col p-2 w-[55%] h-auto border-4 border-[#fffade]"
    cardDivDPECarte.id = `carte_numero_dpe_${index}`
    cardH1Titre.className = "text-center font-bold text-2xl mb-2"
    cardDivDPEObjet.className = "flex items-center"
    cardImgDPE.className = "w-16 h-16 mr-2 object-cover hidden sm:block"
    cardDivDPEDoneesSaisie.className = "bg-[#fffade] rounded-2xl overflow-hidden flex-1 items-center p-2 border-2 border-yellow-400"
    cardDivDPEDoneesVerif.className = "m-2 flex-1"
    cardPTitreDoneesSaisie.className = "font-bold text-xl text-center line-clamp-1"
    cardPEtiquetteDPE.className = classLignePSimple
    cardPEtiquetteGES.className = classLignePSimple
    cardPDateEtablissement.className = classLignePSimple
    cardPMethodeDPE.className = classLignePSimple
    cardPSecteurActivite.className = classLignePSimple
    cardPAnneeConstruction.className = classLignePSimple
    cardPSurfaceShon.className = classLignePSimple
    cardPSurfaceUtile.className = classLignePSimple
    // Changement du style : 
    cardDivDPECarte.style.backgroundColor = "#a5b68d";

    // Source de l'image :
    cardImgDPE.src = "../../static/DPE.png"

    // Changement du texte :
    cardH1Titre.textContent = `DPE n°${index+1} : ${Math.round(donnees.results[index][listeColonne[0]]*100)} % - ${donnees.results[index][listeColonne[1]]}, ${donnees.results[index][listeColonne[2]]} ${donnees.results[index][listeColonne[3]]}`;
    cardPTitreDoneesSaisie.textContent = `N° ADEME : ${donnees.results[index][listeColonne[4]]}`;
    cardPEtiquetteDPE.textContent = `Etiquette DPE : ${donnees.results[index][listeColonne[5]]} - ${donnees.results[index][listeColonne[6]]} kWhep/m²/an`;
    cardPEtiquetteGES.textContent = `Etiquette GES : ${donnees.results[index][listeColonne[7]]} - ${donnees.results[index][listeColonne[8]]} kgCO2/m²/an`;
    cardPDateEtablissement.textContent = `Date DPE : ${donnees.results[index][listeColonne[9]]}`;
    cardPMethodeDPE.textContent = `Méthode du DPE : ${donnees.results[index][listeColonne[10]]}`;
    let anneeConstruction;
    if (!donnees.results[index][listeColonne[11]]) {
        anneeConstruction = donnees.results[index][listeColonne[12]];
    } else {
        anneeConstruction = donnees.results[index][listeColonne[11]];
    };

    cardPSecteurActivite.textContent = `Secteur d'activité : ${donnees.results[index][listeColonne[13]]}`;
    cardPAnneeConstruction.textContent = `Année de construction : ${anneeConstruction}`;
    cardPSurfaceShon.textContent = `Surface SHON : ${donnees.results[index][listeColonne[14]]}`;
    cardPSurfaceUtile.textContent = `Surface Utile : ${donnees.results[index][listeColonne[15]]}`;

    // Ajout à la carte (div de vérif) : 
    cardDivDPEDoneesVerif.appendChild(cardPMethodeDPE);
    cardDivDPEDoneesVerif.appendChild(cardPSecteurActivite);
    cardDivDPEDoneesVerif.appendChild(cardPAnneeConstruction);
    cardDivDPEDoneesVerif.appendChild(cardPSurfaceShon);
    cardDivDPEDoneesVerif.appendChild(cardPSurfaceUtile);

    // Ajout à la carte (div de saisie) : 
    cardDivDPEDoneesSaisie.appendChild(cardPTitreDoneesSaisie);
    cardDivDPEDoneesSaisie.appendChild(cardPEtiquetteDPE);
    cardDivDPEDoneesSaisie.appendChild(cardPEtiquetteGES);
    cardDivDPEDoneesSaisie.appendChild(cardPDateEtablissement);

    // Ajout à la carte d'objet : 
    cardDivDPEObjet.appendChild(cardImgDPE);
    cardDivDPEObjet.appendChild(cardDivDPEDoneesSaisie);
    cardDivDPEObjet.appendChild(cardDivDPEDoneesVerif);

    // Ajout à la carte plus globale :
    cardDivDPECarte.appendChild(cardH1Titre);
    cardDivDPECarte.appendChild(cardDivDPEObjet);

    // Ajout au conteneur :
    cardDivDPEEnglobe.appendChild(cardDivDPECarte)

    //Ajout au Li : 
    liCardDPE.appendChild(cardDivDPEEnglobe)

    return liCardDPE
    // console.log(globalData.length)
    // console.log(globalData)
};

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ---- Ecouteur d'événement ------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Exemple de Recherche ADEME : https://data.ademe.fr/data-fair/api/v1/datasets/dpe-v2-tertiaire-2/lines?select=*&q=2349T0317045P&q_modr=simple&q_fields=N%C2%B0DPE
// Exemple de Recherche ADEME v1 : https://data.ademe.fr/data-fair/api/v1/datasets/dpe-tertiaire/lines?select=*&q=1330V8000001A&q_mode=simple&q_field=numero_dpe
// Exemple Audit : https://data.ademe.fr/data-fair/api/v1/datasets/audit-opendata/lines?q=A23770111876U&q_mode=simple&q_fields=n_audit

button.addEventListener('click', (e) => {
    globalData = []
    ConteneurDesCartes.innerHTML = ""; 
    let valueSend = input.value
    // console.log(valueSend);
    if (isNaN(valueSend) == true && valueSend.length < 150) {
        getInfoDPE(valueSend,1,1,nomColAPIv1Tertiaire);
        getInfoDPE(valueSend,1,2,nomColAPIv2Tertiaire);
        getInfoDPE(valueSend,2,2,nomColAPIv2Neuf);
        getInfoDPE(valueSend,3,2,nomColAPIv2Existant);
        getInfoDPE(valueSend,4,2,nomColAPIv2Audit);
    } else {
        alert("Veuillez saisir une adresse correcte");
    }
});
