const urlDPETertiairev2 = "https://data.ademe.fr/data-fair/api/v1/datasets/dpe-v2-tertiaire-2/lines?select=*&q=";
const urlDPETertiairev1 = "https://data.ademe.fr/data-fair/api/v1/datasets/dpe-tertiaire/lines?select=*&q=";
const urlDPENeufv2 = "https://data.ademe.fr/data-fair/api/v1/datasets/dpe02neuf/lines?select=*&q=";
const urlDPEExistantv2 = "https://data.ademe.fr/data-fair/api/v1/datasets/dpe-v2-logements-existants/lines?select=*&q=";

// Menue de paramètrage : 
let classBoutonActiver = "w-60 h-13 text-lg text-center mb-2 mt-2 px-2 py-2 border-4 border-yellow-400 text-gray-700 bg-yellow-400 rounded-xl hover:bg-yellow-400 transition";
let classBoutonDesactiver = "w-60 h-13 text-lg text-center mb-2 mt-2 px-2 py-2 border-4 border-yellow-400 text-gray-700 bg-[#fffade] rounded-xl hover:bg-yellow-400 transition";
let classLignePSimple = "block text-black-500 text-lg break-words line-clamp-1"

let button = document.getElementById('boutonMyForm');
let ConteneurDesCartes = document.getElementById('conteneur-des-cartes')
let input = document.getElementById('myInput');
let boutonDPETertiaire = document.getElementById('boutonDPETertiaire');
let boutonLogementNeuf = document.getElementById('boutonLogementNeuf');
let boutonLogementExistant = document.getElementById('boutonLogementExistant');
let boutonAvant2021 = document.getElementById('boutonAvant2021');
let boutonApres2021 = document.getElementById('boutonApres2021');

let typeAPI = 1;
let periodeAPI = 2;

let nomColAPIv2Tertiaire = ["Score_BAN","Adresse_brute","Nom__commune_(Brut)","Code_postal_(brut)","N°DPE","Etiquette_DPE","Conso_kWhep/m²/an","Etiquette_GES",
    "Emission_GES_kgCO2/m²/an","Date_établissement_DPE","Méthode_du_DPE", "Année_construction", "Période_construction", "Secteur_activité", "Surface_(SHON)"
    , "Surface_utile"];
let nomColAPIv1Tertiaire = ["Score_BAN","Adresse_brute","Nom__commune_(Brut)","Code_postal_(brut)","N°DPE","Etiquette_DPE","Conso_kWhep/m²/an","Etiquette_GES",
    "Emission_GES_kgCO2/m²/an","Date_établissement_DPE","Méthode_du_DPE", "Année_construction", "Période_construction", "Secteur_activité", "Surface_(SHON)"
    , "Surface_utile"];
let nomColAPIv2Neuf = ["score_ban","adresse_brut","nom_commune_brut","code_postal_brut","numero_dpe","etiquette_dpe","conso_5_usages_par_m2_ef","etiquette_ges",
    "emission_ges_5_usages_par_m2","date_etablissement_dpe","methode_application_dpe", "Année_construction", "Période_construction","type_batiment",
    "surface_habitable_immeuble","surface_habitable_logement"
];
let nomColAPIv2Existant = ["geo_score","Adresse_brute","Nom__commune_(BAN)","Code_postal_(brut)","N°DPE","Etiquette_DPE","Conso_5_usages_par_m²_é_primaire",
    "Etiquette_GES","Emission_GES_5_usages_par_m²","Date_établissement_DPE","Méthode_application_DPE", "Année_construction", "Période_construction","Type_bâtiment"
    ,"Surface_habitable_logement","Surface_habitable_immeuble"
];

// Par défault : 
boutonDPETertiaire.className = classBoutonActiver;
boutonLogementNeuf.className = classBoutonDesactiver;
boutonLogementExistant.className = classBoutonDesactiver;
boutonAvant2021.className = classBoutonDesactiver;
boutonApres2021.className = classBoutonActiver;

function getChoixAPI(typeAPIf, periodeAPIf, num_ademe) {
    if (typeAPIf === 1 && periodeAPIf === 1) {
        urlGetf = `${urlDPETertiairev1}${num_ademe}&q_mode=simple&q_field=numero_dpe`;
    } else if (typeAPIf === 1 && periodeAPIf === 2) {
        urlGetf = `${urlDPETertiairev2}${num_ademe}&q_mode=simple&q_fields=N°DPE`;
    } else if (typeAPIf === 2 && periodeAPIf === 2) {
        urlGetf = `${urlDPENeufv2}${num_ademe}&q_mode=simple&q_fields=numero_dpe`;
    } else if (typeAPIf === 3 && periodeAPIf === 2) {
        urlGetf = `${urlDPEExistantv2}${num_ademe}&q_mode=simple&q_fields=N°DPE`;
    }
    return urlGetf
};

function getChoixColonneAPI(typeAPIf, periodeAPIf) {
    let listeColonneAPI = [];
    if (typeAPIf === 1 && periodeAPIf === 1) {
        listeColonneAPI = nomColAPIv2Tertiaire;
    } else if (typeAPIf === 1 && periodeAPIf === 2) {
        listeColonneAPI = nomColAPIv2Tertiaire;
    } else if (typeAPIf === 2 && periodeAPIf === 2) {
        listeColonneAPI = nomColAPIv2Neuf;
    } else if (typeAPIf === 3 && periodeAPIf === 2) {
        listeColonneAPI = nomColAPIv2Existant;
    }
    return listeColonneAPI
}


// Fonction pour aller récupérer les DPE associé au geo_id
async function getInfoDPE(num_ademe) {
    let urlGet = getChoixAPI(typeAPI, periodeAPI, num_ademe)
    let listeColonneAPI = getChoixColonneAPI(typeAPI, periodeAPI)
    const requete = await fetch(urlGet, {
        method: 'GET'
    });

    if (!requete.ok) {
        alert('Un problème est survenu, veuillez réessayer plus tard');
    } else {
        let donnees = await requete.json();
        console.log(donnees)
        ConteneurDesCartes.innerHTML = ""; 
        if (donnees.total == 0) {
            let msg = creationMessageVide();
            ConteneurDesCartes.appendChild(msg);
        } else {
            carteDPE = creationCarteDPE(donnees, listeColonneAPI);
            ConteneurDesCartes.appendChild(carteDPE);
        }
    }
};


function creationMessageVide() {
    const msg = document.createElement('p');
    msg.className = "flex justify-center text-2xl text-red-500";
    msg.textContent = "Ce numéro ADEME n'est pas récupèrable dans cette base de données";
    return msg
}

// Fonction pour ajouter une carte DPE
function creationCarteDPE(donnees, listeColonne) {

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
    cardDivDPECarte.id = `carte_numero_dpe`
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
    cardH1Titre.textContent = `DPE n°1 : ${donnees.results[0][listeColonne[0]]} - ${donnees.results[0][listeColonne[1]]}, ${donnees.results[0][listeColonne[2]]} ${donnees.results[0][listeColonne[3]]}`;
    cardPTitreDoneesSaisie.textContent = `N° ADEME : ${donnees.results[0][listeColonne[4]]}`;
    cardPEtiquetteDPE.textContent = `Etiquette DPE : ${donnees.results[0][listeColonne[5]]} - ${donnees.results[0][listeColonne[6]]} kWhep/m²/an`;
    cardPEtiquetteGES.textContent = `Etiquette GES : ${donnees.results[0][listeColonne[7]]} - ${donnees.results[0][listeColonne[8]]} kgCO2/m²/an`;
    cardPDateEtablissement.textContent = `Date DPE : ${donnees.results[0][listeColonne[9]]}`;
    cardPMethodeDPE.textContent = `Méthode du DPE : ${donnees.results[0][listeColonne[10]]}`;
    let anneeConstruction;
    if (!donnees.results[0][listeColonne[11]]) {
        anneeConstruction = donnees.results[0][listeColonne[12]];
    } else {
        anneeConstruction = donnees.results[0][listeColonne[11]];
    };

    cardPSecteurActivite.textContent = `Secteur d'activité : ${donnees.results[0][listeColonne[13]]}`;
    cardPAnneeConstruction.textContent = `Année de construction : ${anneeConstruction}`;
    cardPSurfaceShon.textContent = `Surface SHON : ${donnees.results[0][listeColonne[14]]}`;
    cardPSurfaceUtile.textContent = `Surface Utile : ${donnees.results[0][listeColonne[15]]}`;

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

button.addEventListener('click', (e) => {
    globalData = []
    let valueSend = input.value
    console.log(valueSend);
    if (isNaN(valueSend) == true && valueSend.length < 150) {
        getInfoDPE(valueSend)
    } else {
        alert("Veuillez saisir une adresse correcte");
    }
})
    ;

boutonDPETertiaire.addEventListener('click', (e) => {
    if (boutonDPETertiaire.className != classBoutonActiver) {
        boutonLogementNeuf.className = classBoutonDesactiver;
        boutonLogementExistant.className = classBoutonDesactiver;
        boutonDPETertiaire.className = classBoutonActiver;
        typeAPI = 1;
        boutonAvant2021.style.display = 'block';
    }
})

boutonLogementNeuf.addEventListener('click', (e) => {
    if (boutonLogementNeuf.className != classBoutonActiver) {
        boutonDPETertiaire.className = classBoutonDesactiver;
        boutonLogementExistant.className = classBoutonDesactiver;
        boutonLogementNeuf.className = classBoutonActiver;
        boutonAvant2021.style.display = 'none';
        boutonAvant2021.className = classBoutonDesactiver;
        boutonApres2021.className = classBoutonActiver;
        periodeAPI = 2;
        typeAPI = 2;
    }
})

boutonLogementExistant.addEventListener('click', (e) => {
    if (boutonLogementExistant.className != classBoutonActiver) {
        boutonDPETertiaire.className = classBoutonDesactiver;
        boutonLogementNeuf.className = classBoutonDesactiver;
        boutonLogementExistant.className = classBoutonActiver;
        boutonLogementExistant.className = classBoutonActiver;
        boutonAvant2021.style.display = 'none';
        boutonAvant2021.className = classBoutonDesactiver;
        boutonApres2021.className = classBoutonActiver;
        periodeAPI = 2;
        typeAPI = 3;
    }
})

boutonAvant2021.addEventListener('click', (e) => {
    if (boutonAvant2021.className != classBoutonActiver) {
        boutonApres2021.className = classBoutonDesactiver;
        boutonAvant2021.className = classBoutonActiver;
        periodeAPI = 1;
    }
})

boutonApres2021.addEventListener('click', (e) => {
    if (boutonApres2021.className != classBoutonActiver) {
        boutonAvant2021.className = classBoutonDesactiver;
        boutonApres2021.className = classBoutonActiver;
        periodeAPI = 2;
    }
})