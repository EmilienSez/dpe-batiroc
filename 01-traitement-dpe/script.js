// Définition des variables : 
const url = "https://api-adresse.data.gouv.fr/search/?q=";
const urlDPETertiairev2 = "https://data.ademe.fr/data-fair/api/v1/datasets/dpe-v2-tertiaire-2/lines?select=*&q=";
const urlDPETertiairev1 = "https://data.ademe.fr/data-fair/api/v1/datasets/dpe-tertiaire/lines?select=*&q=";
const urlDPENeufv2 = "https://data.ademe.fr/data-fair/api/v1/datasets/dpe02neuf/lines?select=*&q=";
const urlDPEExistantv2 = "https://data.ademe.fr/data-fair/api/v1/datasets/dpe-v2-logements-existants/lines?select=*&q=";
const urlAuditEnergetique = "https://data.ademe.fr/data-fair/api/v1/datasets/audit-opendata/lines?q=";

// Liste des DPE pour faire des tests : 
// DPE Tertiaire v2 : 2363T1680837R         |
// DPE Tertiaire v1 : 1330V8000001A         |
// DPE Logement Neuf : 2481N0172887C        |
// DPE Logement Existant : 2331E0473998Z    |
// DPE Audit Energétique :  A23770111876U   |

let button = document.getElementById('boutonMyForm');
let ConteneurDesCartes = document.getElementById('conteneur-des-cartes')
let buttonDlCsv = document.getElementById('download-csv');
// let realBoutonTelechargerCsv = document.getElementById('realBoutonTelechargerCsv');
let input = document.getElementById('myInput');

// Menue de paramètrage : 
let classBoutonActiver = "w-60 h-13 text-lg text-center mb-2 mt-2 px-2 py-2 border-4 border-yellow-400 text-gray-700 bg-yellow-400 rounded-xl hover:bg-yellow-400 transition";
let classBoutonDesactiver = "w-60 h-13 text-lg text-center mb-2 mt-2 px-2 py-2 border-4 border-yellow-400 text-gray-700 bg-[#fffade] rounded-xl hover:bg-yellow-400 transition";
let classLignePSimple = "block text-black-500 text-lg break-words line-clamp-1"
let boutonDPETertiaire = document.getElementById('boutonDPETertiaire');
let boutonLogementNeuf = document.getElementById('boutonLogementNeuf');
let boutonLogementExistant = document.getElementById('boutonLogementExistant');
let boutonAuditEnergetique = document.getElementById('boutonAuditEnergétique');
let boutonAvant2021 = document.getElementById('boutonAvant2021');
let boutonApres2021 = document.getElementById('boutonApres2021');

// Par défault : 
boutonDPETertiaire.className = classBoutonActiver
boutonLogementNeuf.className = classBoutonDesactiver
boutonLogementExistant.className = classBoutonDesactiver
boutonAuditEnergetique.className = classBoutonDesactiver
boutonAvant2021.className = classBoutonDesactiver
boutonApres2021.className = classBoutonActiver
let typeAPI = 1
let periodeAPI = 2

// Les informations : 
let cardContainer = document.getElementById('cardContainer');
let enfantcardContainer = document.getElementById('centrerLesCartes');
let cardAdresse = document.getElementById('carteAdresse');
let label = document.getElementById('label_adr');
let score = document.getElementById('score_adr');
let city = document.getElementById('city_adr');
let housenumber = document.getElementById('housenumber_adr');
let street = document.getElementById('street_adr');
let context = document.getElementById('context_adr');

let nomColAPIv2Tertiaire = ["Score_BAN", "Adresse_brute", "Nom__commune_(Brut)", "Code_postal_(brut)", "N°DPE", "Etiquette_DPE", "Conso_kWhep/m²/an", "Etiquette_GES",
  "Emission_GES_kgCO2/m²/an", "Date_établissement_DPE", "Méthode_du_DPE", "Année_construction", "Période_construction", "Secteur_activité", "Surface_(SHON)"
  , "Surface_utile"];

let nomColAPIv1Tertiaire = ["geo_score", "nom_rue", "commune", "code_postal", "numero_dpe", "classe_consommation_energie", "consommation_energie",
  "classe_estimation_ges", "estimation_ges", "date_etablissement_dpe", "nom_methode_dpe", "annee_construction", "annee_construction", "secteur_activite", "shon",
  "surface_utile"];

let nomColAPIv2Neuf = ["score_ban", "adresse_brut", "nom_commune_brut", "code_postal_brut", "numero_dpe", "etiquette_dpe", "conso_5_usages_par_m2_ef", "etiquette_ges",
  "emission_ges_5_usages_par_m2", "date_etablissement_dpe", "methode_application_dpe", "Année_construction", "Période_construction", "type_batiment",
  "surface_habitable_immeuble", "surface_habitable_logement"
];

let nomColAPIv2Existant = ["Score_BAN", "Adresse_brute", "Nom__commune_(BAN)", "Code_postal_(brut)", "N°DPE", "Etiquette_DPE", "Conso_5_usages_par_m²_é_primaire",
  "Etiquette_GES", "Emission_GES_5_usages_par_m²", "Date_établissement_DPE", "Méthode_application_DPE", "Année_construction", "Période_construction", "Type_bâtiment"
  , "Surface_habitable_logement", "Surface_habitable_immeuble"
];

let nomColAPIv2Audit = ["score_ban", "adresse_brut", "nom_commune_brut", "code_postal_brut", "numero_dpe", "classe_bilan_dpe", "conso_5_usages_m2",
  "etiquette_ges", "emission_ges_5_usages_m2", "date_etablissement_audit", "methode_application_dpe", "annee_construction", "periode_constuction", "Type_bâtiment"
  , "surface_habitable_logement", "surface_ventilee"
];

// Gestion de la recherche Unique : 
let globalData = [];
// ConteneurDesCartes.innerHTML = '';
// buttonDlCsv.style.display = 'none';
// realBoutonTelechargerCsv.disabled = 'true'
// realBoutonTelechargerCsv.className = "text-white bg-grey-600 hover:text-white border border-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2 h-10 dark:border-gray-500 dark:text-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800 w-full cursor-not-allowed";

// Gestion de la recherche avec Dépôt de document :
// let formUploadCsv = document.getElementById('myFormCsv');
// formUploadCsv.action = "/dpe/upload_csv/";

// Fonction pour calculer une le changement de la couleur :
function interpolateColor(color1, color2, factor) {
  const result = color1.slice(); // Clone la couleur de départ
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  }
  return result;
}

// Récupérer la couleur en fonction du score de correspondance BANO
function getColor(randomValue) {
  const colors = [
    [202, 65, 19],      // rgba(202, 65, 19, 1)
    [202, 118, 34],     // rgba(202, 118, 34, 1)
    [217, 175, 52],     // rgba(217, 175, 52, 1)
    [230, 213, 93],     // rgba(230, 213, 93, 1)
    [147, 176, 32],     // rgba(147, 176, 32, 1)
    [75, 114, 33]       // rgba(75, 114, 33, 1)
  ];
  // Déterminer entre quelles couleurs nous interpolons
  const index1 = Math.floor(randomValue * (colors.length - 1));
  const index2 = index1 + 1 < colors.length ? index1 + 1 : index1;

  // Calculer le facteur d'interpolation
  const factor = (randomValue * (colors.length - 1)) - index1;

  // Interpoler entre les deux couleurs
  const interpolatedColor = interpolateColor(colors[index1], colors[index2], factor);

  // Retourner la couleur au format rgba
  return `rgba(${interpolatedColor[0]}, ${interpolatedColor[1]}, ${interpolatedColor[2]}, 1)`;
}

function telechargerCSV(data) {
  // Convertir les données en format CSV
  const csvContent = data.map(e => e.join(";")).join("\n");

  // Créer un Blob à partir du contenu CSV
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Créer un lien pour le téléchargement
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "dpe.csv");
  document.body.appendChild(link);

  // Simuler un clic sur le lien pour démarrer le téléchargement
  link.click();

  // Nettoyer
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Fonction pour obtenir le token CSRF
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Vérifiez si ce cookie commence par le nom que nous voulons
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Fonction pour obtenir le token CSRF
function getCSRFToken() {
  return document.querySelector("meta[name='csrf-token']").getAttribute("content");
}

// Fonction pour sélectionner l'API :
function getChoixAPI(typeAPIf, periodeAPIf, identifiant_bano) {
  if (typeAPIf === 1 && periodeAPIf === 1) {
    urlGetf = `${urlDPETertiairev1}${identifiant_bano}&q_mode=simple&q_field=geo_id`;
  } else if (typeAPIf === 1 && periodeAPIf === 2) {
    urlGetf = `${urlDPETertiairev2}${identifiant_bano}&q_mode=simple&q_fields=Identifiant__BAN`;
  } else if (typeAPIf === 2 && periodeAPIf === 2) {
    urlGetf = `${urlDPENeufv2}${identifiant_bano}&q_mode=simple&q_fields=identifiant_ban`;
  } else if (typeAPIf === 3 && periodeAPIf === 2) {
    urlGetf = `${urlDPEExistantv2}${identifiant_bano}&q_mode=simple&q_fields=Identifiant__BAN`;
  } else if (typeAPIf === 4 && periodeAPIf === 2) {
    urlGetf = `${urlAuditEnergetique}${identifiant_bano}&q_mode=simple&q_fields=identifiant_ban`;
  }
  return urlGetf
};

// Choix de la liste de données à Recup en fonction du choix de l'API
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
};

function traitementDataAdresse(data, input) {
  // console.log(data["properties"]["label"]);

  let labelAPI = null;
  let scoreAPI = null;
  if (data["properties"]["label"]) { labelAPI = data["properties"]["label"] } else { labelAPI = null }
  if (data["properties"]["score"]) { scoreAPI = data["properties"]["score"] } else { scoreAPI = null }
  let arrayLine = [input, labelAPI, scoreAPI];
  return arrayLine
}

// dataAdresseDPE = traitementDataDPE(donnees.results[index], dataAdresse)
// globalData.push(dataAdresseDPE);
function traitementDataDPE(data, dataprev, nbrDPE) {
  dataprev.push(nbrDPE);
  console.log(dataprev)
  let numDPE ;
  let typeDPE ;
  let methodeDPE ;
  let noteDPE ;
  let noteGES ;
  let consoDPE ;
  let consoGES ;
  let dateEtabDPE ;
  let dateFinDPE ;
  let surfaceUtile ;
  let shon ;
  let secteurActivite ;
  let prdConstruction ;
  let anneeConstruction ;
  let adresseBrut ;
  let typeEnergie1 ;
  let coutEnergie1 ;
  let consoEnergieFinale1 ;
  let consoEnergiePrimaire1 ;
  let typeEnergie2 ;
  let coutEnergie2 ;
  let consoEnergieFinale2 ;
  let consoEnergiePrimaire2 ;
  let typeEnergie3 ;
  let coutEnergie3 ;
  let consoEnergieFinale3 ;
  let consoEnergiePrimaire3 ;

  if (data["N°DPE"]) {                        numDPE                  = data["N°DPE"] } else { numDPE = null}
  if (data["Modèle_DPE"]) {                   typeDPE                 = data["Modèle_DPE"] } else { typeDPE = null}
  if (data["Méthode_du_DPE"]) {               methodeDPE              = data["Méthode_du_DPE"] } else { methodeDPE = null}
  if (data["Etiquette_DPE"]) {                noteDPE                 = data["Etiquette_DPE"] } else { noteDPE = null}
  if (data["Etiquette_GES"]) {                noteGES                 = data["Etiquette_GES"] } else { noteGES = null}
  if (data["Conso_kWhep/m²/an"]) {            consoDPE                = data["Conso_kWhep/m²/an"] } else { consoDPE = null}
  if (data["Emission_GES_kgCO2/m²/an"]) {     consoGES                = data["Emission_GES_kgCO2/m²/an"] } else { consoGES = null}
  if (data["Date_établissement_DPE"]) {       dateEtabDPE             = data["Date_établissement_DPE"] } else { dateEtabDPE = null}
  if (data["Date_fin_validité_DPE"]) {        dateFinDPE              = data["Date_fin_validité_DPE"] } else { dateFinDPE = null}
  if (data["Surface_utile"]) {                surfaceUtile            = data["Surface_utile"] } else { surfaceUtile = null}
  if (data["Surface_(SHON)"]) {               shon                    = data["Surface_(SHON)"] } else { shon = null}
  if (data["Secteur_activité"]) {             secteurActivite         = data["Secteur_activité"] } else { secteurActivite = null}
  if (data["Période_construction"]) {         prdConstruction         = data["Période_construction"] } else { prdConstruction = null}
  if (data["Année_construction"]) {           anneeConstruction       = data["Année_construction"] } else { anneeConstruction = null}
  if (data["Adresse_brute"]) {                adresseBrut             = data["Adresse_brute"] + " " + data["Code_postal_(brut)"] + " " + data["Nom__commune_(Brut)"] } else { adresseBrut = null}
  if (data["Type_énergie_n°1"]) {             typeEnergie1            = data["Type_énergie_n°1"] } else { typeEnergie1 = null}
  if (data["Frais_annuel_énergie_n°1"]) {     coutEnergie1            = data["Frais_annuel_énergie_n°1"] } else { coutEnergie1 = null}
  if (data["Conso_é_finale_énergie_n°1"]) {   consoEnergieFinale1     = data["Conso_é_finale_énergie_n°1"] } else { consoEnergieFinale1 = null}
  if (data["Conso_é_primaire_énergie_n°1"]) { consoEnergiePrimaire1   = data["Conso_é_primaire_énergie_n°1"] } else { consoEnergiePrimaire1 = null}
  if (data["Type_énergie_n°2"]) {             typeEnergie2            = data["Type_énergie_n°2"] } else { typeEnergie2 = null}
  if (data["Frais_annuel_énergie_n°2"]) {     coutEnergie2            = data["Frais_annuel_énergie_n°2"] } else { coutEnergie2 = null}
  if (data["Conso_é_finale_énergie_n°2"]) {   consoEnergieFinale2     = data["Conso_é_finale_énergie_n°2"] } else { consoEnergieFinale2 = null}
  if (data["Conso_é_primaire_énergie_n°2"]) { consoEnergiePrimaire2   = data["Conso_é_primaire_énergie_n°2"] } else { consoEnergiePrimaire2 = null}
  if (data["Type_énergie_n°3"]) {             typeEnergie3            = data["Type_énergie_n°3"] } else { typeEnergie3 = null}
  if (data["Frais_annuel_énergie_n°3"]) {     coutEnergie3            = data["Frais_annuel_énergie_n°3"] } else { coutEnergie3 = null}
  if (data["Conso_é_finale_énergie_n°3"]) {   consoEnergieFinale3     = data["Conso_é_finale_énergie_n°3"] } else { consoEnergieFinale3 = null}
  if (data["Conso_é_primaire_énergie_n°3"]) { consoEnergiePrimaire3   = data["Conso_é_primaire_énergie_n°3"] } else { consoEnergiePrimaire3 = null}
        
  adresseBrut = adresseBrut.replace("\n", " ");

  dataprev.push(numDPE) ;
  dataprev.push(typeDPE) ;
  dataprev.push(methodeDPE) ;
  dataprev.push(noteDPE) ;
  dataprev.push(noteGES) ;
  dataprev.push(consoDPE) ;
  dataprev.push(consoGES) ;
  dataprev.push(dateEtabDPE) ;
  dataprev.push(dateFinDPE) ;
  dataprev.push(surfaceUtile) ;
  dataprev.push(shon) ;
  dataprev.push(secteurActivite) ;
  dataprev.push(prdConstruction) ;
  dataprev.push(anneeConstruction) ;
  dataprev.push(adresseBrut) ;
  dataprev.push(typeEnergie1) ;
  dataprev.push(coutEnergie1) ;
  dataprev.push(consoEnergieFinale1) ;
  dataprev.push(consoEnergiePrimaire1) ;
  dataprev.push(typeEnergie2) ;
  dataprev.push(coutEnergie2) ;
  dataprev.push(consoEnergieFinale2) ;
  dataprev.push(consoEnergiePrimaire2) ;
  dataprev.push(typeEnergie3) ;
  dataprev.push(coutEnergie3) ;
  dataprev.push(consoEnergieFinale3) ;
  dataprev.push(consoEnergiePrimaire3) ;
  return dataprev
}


  // Fonction pour aller récupérer les adresses en fonction de la saisie de l'utilisateur : 
  async function getInfoAdresse(adresse) {
    let urlGet = `${url}${adresse}`
    const requete = await fetch(urlGet, {
      method: 'GET'
    });

    if (!requete.ok) {
      alert('Un problème est survenu, veuillez réessayer plus tard');
    } else {
      ConteneurDesCartes.innerHTML = '';
      let donnees = await requete.json();

      for (let index = 0; index < donnees.features.length; index++) {

        // Créer des éléments de la nouvelle Carte : 
        const CarteAdresse = document.createElement('div');
        const cardDiv1 = document.createElement('div');
        const cardDiv2 = document.createElement('div');
        const cardH1 = document.createElement('h1');
        const cardH3 = document.createElement('h3');
        const cardDiv3 = document.createElement('div');
        const cardImg1 = document.createElement('img');
        const cardDiv4 = document.createElement('div');
        const cardDiv5 = document.createElement('div');
        const cardp1 = document.createElement('p');
        const cardp2 = document.createElement('p');
        const cardp3 = document.createElement('p');
        const cardp4 = document.createElement('p');
        const cardp5 = document.createElement('p');
        const cardA = document.createElement('a');
        const cardImg2 = document.createElement('img');

        const DivAllDPE = document.createElement('div');
        const UlDPE = document.createElement('ul');

        // Changement des ID :
        CarteAdresse.id = `carte_numero_${index}`;
        UlDPE.id = `espace_dpe_${index}`;
        cardA.id = `button_${index}`
        cardH1.id = `nom_adresse_${index}`
        // Changement des classes :
        CarteAdresse.className = "dropdown"
        cardDiv1.className = "mt-8 flex justify-center"
        cardDiv2.className = "bg-[#a5b68d] rounded-2xl overflow-hidden shadow-md flex flex-col p-2 w-[60%] h-auto border-4 border-[#fffade]"
        cardH1.className = "text-center font-bold text-2xl "
        cardH3.className = "text-center font-bold text-xl mb-2"
        cardDiv3.className = "flex items-center"
        cardImg1.className = "w-20 h-20 mr-2 object-cover hidden sm:block"
        cardDiv4.className = "flex-1"
        cardDiv5.className = "m-2 flex-1"
        cardp1.className = "block text-black-500 text-lg break-words line-clamp-1"
        cardp2.className = "block text-black-500 text-lg break-words line-clamp-1"
        cardp3.className = "block text-black-500 text-lg break-words line-clamp-1"
        cardp4.className = "block text-black-500 text-lg break-words line-clamp-1"
        cardp5.className = "block text-black-500 text-lg break-words line-clamp-1"
        cardA.className = "toggleButton"
        cardImg2.className = "w-4 h-4 mt-17 mr-2 object-cover hidden sm:block menu"
        DivAllDPE.className = "content hiddenessaie";

        // Changement des source des Images : 
        cardImg1.src = "../static/Localisation.png"
        cardImg2.src = "../static/arrow.png"

        // Ajout du Href :
        cardA.href = "#"
        // Changement du style : 
        const CouleurCarte = getColor(Number(donnees.features[index].properties.score));
        cardDiv2.style.backgroundColor = CouleurCarte;

        // Changement des informations : 
        cardH1.textContent = `Adresse : ${donnees.features[index].properties.label}`;
        cardH3.textContent = `Score de Correspondance : ${Math.round(donnees.features[index].properties.score * 100)} %`
        cardp1.textContent = `Type d'adresse : ${donnees.features[index].properties.type}`
        cardp2.textContent = `Voie : ${donnees.features[index].properties.housenumber}, ${donnees.features[index].properties.street}`
        cardp3.textContent = `Ville : ${donnees.features[index].properties.city}`
        cardp4.textContent = `Département :  ${donnees.features[index].properties.context}`
        cardp5.textContent = `Région : ${donnees.features[index].properties.context}`

        // Création de la carte : 
        cardDiv5.appendChild(cardp4);
        cardDiv5.appendChild(cardp5);

        cardDiv4.appendChild(cardp1);
        cardDiv4.appendChild(cardp2);
        cardDiv4.appendChild(cardp3);

        cardA.appendChild(cardImg2);

        cardDiv3.appendChild(cardImg1);
        cardDiv3.appendChild(cardDiv4);
        cardDiv3.appendChild(cardDiv5);
        cardDiv3.appendChild(cardA);

        cardDiv2.appendChild(cardH1);
        cardDiv2.appendChild(cardH3);
        cardDiv2.appendChild(cardDiv3);

        cardDiv1.appendChild(cardDiv2);

        CarteAdresse.appendChild(cardDiv1);

        DivAllDPE.appendChild(UlDPE);
        CarteAdresse.appendChild(DivAllDPE);
        // Ajouter la Carte au conteneur :
        ConteneurDesCartes.appendChild(CarteAdresse);
        dataAdresse = traitementDataAdresse(donnees.features[index], adresse);
        // Lancement du second traitement : 
        getInfoDPE(index, donnees.features[index].properties.id, dataAdresse);
      };
      // buttonDlCsv.style.display = 'block';
      // ActiverBouton();
    }
  };


  // Fonction pour aller récupérer les DPE associé au geo_id
  async function getInfoDPE(numero_id, geo_id, dataAdresse) {
    let urlGet = getChoixAPI(typeAPI, periodeAPI, geo_id)
    // console.log(typeAPI)
    // console.log(periodeAPI)
    // console.log(geo_id)
    // console.log(urlGet)
    // globalData.push(dataAdresse)
    const requete = await fetch(urlGet, {
      method: 'GET'
    });

    if (!requete.ok) {
      alert('Un problème est survenu, veuillez réessayer plus tard');
    } else {
      let donnees = await requete.json();
      liste = getChoixColonneAPI(typeAPI, periodeAPI)
      console.log(donnees);
      // console.log(donnees.results.length)
      let buttonAdresseActuel = document.getElementById(`button_${numero_id}`);
      // globalData.push(donnees);
      // sauvegarderDonnees(donnees)
      // console.log(`dpe stockées :  ${donnees.total}`)
      // console.log(Object.keys(donnees.results[0]))
      if (donnees.total == 0) {
        buttonAdresseActuel.remove();
        globalData.push(dataAdresse);
      } else {
        for (let index = 0; index < donnees.results.length; index++) {
          let idx = index;
          // Récupération de la carte pour ajout : 
          let carteActuelle = document.getElementById(`espace_dpe_${numero_id}`);
          // Lancement des DPE
          carteDPE = creationCarteDPE(donnees, liste, index, idx);
          carteActuelle.appendChild(carteDPE);
          if (index === 11 && donnees.total > 12) {
            boutonRequeteSup = creationBoutonRequeteSup(donnees.next, typeAPI, periodeAPI, numero_id, index)
            carteActuelle.appendChild(boutonRequeteSup);
          }
          // dataAdresseDPE = traitementDataDPE(donnees.results[index], dataAdresse, donnees.total)
          globalData.push(dataAdresse);
        }
        let nomAdresseActuelle = document.getElementById(`nom_adresse_${numero_id}`);
        nomAdresseActuelle.textContent = `${nomAdresseActuelle.textContent} (${donnees.total} DPE)`
      }
    }
  };

  // Fonction pour ajouter une carte DPE
  function creationCarteDPE(donnees, listeColonne, index, idx) {

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
    const CouleurCarte = getColor(Number(donnees.results[index][listeColonne[0]]));
    cardDivDPECarte.style.backgroundColor = CouleurCarte;

    // Source de l'image :
    cardImgDPE.src = "../static/DPE.png"

    // Changement du texte :
    cardH1Titre.textContent = `DPE n°${idx + 1} : ${Math.round(donnees.results[index][listeColonne[0]] * 100)} % - ${donnees.results[index][listeColonne[1]]}, ${donnees.results[index][listeColonne[2]]} ${donnees.results[index][listeColonne[3]]}`;
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

  // Fonction pour créer un bouton supplémentaire : 
  function creationBoutonRequeteSup(donnees, type, prd, numero_id, index) {
    const liCardDPE = document.createElement('li');
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    const p = document.createElement('a');

    div1.className = "flex justify-center";
    div2.className = "ml-[5%] rounded-2xl overflow-hidden shadow-md flex flex-col w-[55%] h-auto border-4 border-[#fffade] hover:bg-[#fffade] cursor-pointer";
    p.className = "text-5xl text-center";

    div2.setAttribute('data-api-url', donnees);
    div2.addEventListener('click', (e) => {
      getInfoDPESupplementaire(donnees, type, prd, numero_id, index);
      liCardDPE.remove()
    })
    p.textContent = "+"

    div2.appendChild(p);
    // a.appendChild(div2);
    div1.appendChild(div2);

    liCardDPE.appendChild(div1);

    return liCardDPE
  }

  async function getInfoDPESupplementaire(urlGet, typeAPI, periodeAPI, numero_id, idx) {
    const requete = await fetch(urlGet, {
      method: 'GET'
    });
    console.log(numero_id)
    if (!requete.ok) {
      alert('Un problème est survenu, veuillez réessayer plus tard');
    } else {
      let donnees = await requete.json();
      liste = getChoixColonneAPI(typeAPI, periodeAPI)
      for (let index = 0; index < donnees.results.length; index++) {
        idx++
        console.log(idx)
        // Récupération de la carte pour ajout : 
        let carteActuelle = document.getElementById(`espace_dpe_${numero_id}`);
        // Lancement des DPE
        carteDPE = creationCarteDPE(donnees, liste, index, idx);
        carteActuelle.appendChild(carteDPE);
        if (index === 11 && donnees.results.length === 12) {
          boutonRequeteSup = creationBoutonRequeteSup(donnees.next)
          carteActuelle.appendChild(boutonRequeteSup);
        }
      }
    }
  };

  // Ecouteur d'événement : 
  button.addEventListener('click', (e) => {
    globalData = []
    let valueSend = input.value
    valueSend = valueSend.replaceAll(",", " ").toLowerCase();
    valueSend = valueSend.replaceAll(" ", "+");
    valueSend = valueSend.replaceAll("-", "+");
    valueSend = valueSend.replaceAll("++", "+");
    // console.log(valueSend);
    if (isNaN(valueSend) == true && valueSend.length < 150) {
      getInfoAdresse(valueSend)
    } else {
      alert("Veuillez saisir une adresse correcte");
    }
  })
    ;

  buttonDlCsv.addEventListener('click', (e) => {
    console.log(globalData)
    telechargerCSV(globalData)
  });

  // Partie bouton de paramètrage : 
  boutonDPETertiaire.addEventListener('click', (e) => {
    if (boutonDPETertiaire.className != classBoutonActiver) {
      boutonLogementNeuf.className = classBoutonDesactiver;
      boutonLogementExistant.className = classBoutonDesactiver;
      boutonAuditEnergetique.className = classBoutonDesactiver;
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
      boutonAuditEnergetique.className = classBoutonDesactiver;
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
      boutonAuditEnergetique.className = classBoutonDesactiver;
      boutonAvant2021.style.display = 'none';
      boutonAvant2021.className = classBoutonDesactiver;
      boutonApres2021.className = classBoutonActiver;
      periodeAPI = 2;
      typeAPI = 3;
    }
  });

  boutonAuditEnergetique.addEventListener('click', (e) => {
    if (boutonAuditEnergetique.className != classBoutonActiver) {
      boutonDPETertiaire.className = classBoutonDesactiver;
      boutonLogementNeuf.className = classBoutonDesactiver;
      boutonLogementExistant.className = classBoutonDesactiver;
      boutonAuditEnergetique.className = classBoutonActiver;
      boutonAvant2021.style.display = 'none';
      boutonAvant2021.className = classBoutonDesactiver;
      boutonApres2021.className = classBoutonActiver;
      periodeAPI = 2;
      typeAPI = 4;
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


  // Pour les tests : 5 Rue Louis-Jacques Daguerre 35136 Saint-Jacques-de-la-Lande


  // Sélectionnez un parent qui existe déjà au moment du chargement
  ConteneurDesCartes.addEventListener('click', function (event) {
    event.preventDefault();
    const button = event.target.closest('.toggleButton'); // Vérifie si l'élément cliqué est un bouton toggle

    if (button) {
      event.preventDefault(); // Empêche le comportement par défaut du bouton

      let content;

      if (!button.closest('.dropdown').querySelector('.content.hiddenessaie')) {
        content = button.closest('.dropdown').querySelector('.content.show');
      } else {
        content = button.closest('.dropdown').querySelector('.content.hiddenessaie');
      }
      // console.log(content);

      if (content.classList.contains('hiddenessaie')) {
        content.classList.remove('hiddenessaie'); // Retire la classe cachée
        setTimeout(() => {
          content.classList.add('show'); // Ajoute la classe pour afficher le contenu après un court délai
        }, 10); // Un court délai pour permettre la transition
      } else {
        content.classList.remove('show'); // Retire la classe pour cacher le contenu
        // Attendre la fin de la transition avant d'ajouter 'hidden'
        content.addEventListener('transitionend', function handleTransitionEnd() {
          content.classList.add('hiddenessaie'); // Ajoute la classe cachée après la transition
          content.removeEventListener('transitionend', handleTransitionEnd); // Nettoie l'écouteur
        });
      }
    }
  });
