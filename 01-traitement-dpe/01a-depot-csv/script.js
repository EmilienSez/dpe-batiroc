// https://stackoverflow.com/questions/43262121/trying-to-use-fetch-and-pass-in-mode-no-cors

let boutonLancerTraitement = document.getElementById('lancer-traitement');
let boutonTelecharger = document.getElementById('download-csv');
let zoneLancementTraitement = document.getElementById('div-traitement');
let barre = document.getElementById("barre");
let barDeProgression = document.getElementById("progress-bar");

var resultGetInfoDPE = [];
var arrayCSV = [];
const url =  "https://data.ademe.fr/data-fair/api/v1/datasets/dpe01tertiaire/lines?select=*&q=";
const urlTertiairev1 = "https://data.ademe.fr/data-fair/api/v1/datasets/dpe-tertiaire/lines?select=*&q=";
const urlDPENeufv2 = "https://data.ademe.fr/data-fair/api/v1/datasets/dpe02neuf/lines?select=*&q=";
const urlDPEExistantv2 = "https://data.ademe.fr/data-fair/api/v1/datasets/dpe03existant/lines?select=*&q=";
const urlAuditEnergetique = "https://data.ademe.fr/data-fair/api/v1/datasets/audit-opendata/lines?q=";

let intervalId;
let traitementEnCours = false;


// Liste Colonne des différentes API : 
let nomColAPIv1Tertiaire = ["geo_score", "nom_rue", "commune", "code_postal", "numero_dpe", "classe_consommation_energie", "consommation_energie",
  "classe_estimation_ges", "estimation_ges", "date_etablissement_dpe", "nom_methode_dpe", "annee_construction", "annee_construction", "secteur_activite", "shon",
  "surface_utile", "tr001_modele_dpe_fichier_vierge", "Date_fin_validité_DPE", "Type_énergie_n°1", "Frais_annuel_énergie_n°1", "Conso_é_finale_énergie_n°1", "Conso_é_primaire_énergie_n°1"
  , "Type_énergie_n°2", "Frais_annuel_énergie_n°2", "Conso_é_finale_énergie_n°2", "Conso_é_primaire_énergie_n°2"
  , "Type_énergie_n°3", "Frais_annuel_énergie_n°3", "Conso_é_finale_énergie_n°3", "Conso_é_primaire_énergie_n°3"];

let nomColAPIv2Neuf = ["score_ban", "adresse_brut", "nom_commune_brut", "code_postal_brut", "numero_dpe", "etiquette_dpe", "conso_5_usages_par_m2_ef", "etiquette_ges",
  "emission_ges_5_usages_par_m2", "date_etablissement_dpe", "methode_application_dpe", "annee_construction", "periode_construction", "type_batiment",
  "surface_habitable_immeuble", "surface_habitable_logement", "modele_dpe", "date_fin_validite_dpe"
  , "type_energie_n1", "cout_total_5_usages_energie_n1", "conso_5_usages_ef_energie_n1", "conso_5_usages_ep"
  , "type_energie_n2", "cout_total_5_usages_energie_n2", "conso_5_usages_ef_energie_n2", "conso_5_usages_ep"
  , "type_energie_n3", "cout_total_5_usages_energie_n3", "conso_5_usages_ef_energie_n3", "conso_5_usages_ep"
];

let nomColAPIv2Existant = ["score_ban", "adresse_brut", "nom_commune_ban", "code_postal_brut", "numero_dpe", "etiquette_dpe", "conso_5_usages_par_m2_ep",
  "etiquette_ges", "emission_ges_5_usages_par_m2", "date_etablissement_dpe", "methode_application_dpe", "annee_construction", "periode_construction", "type_batiment"
  , "surface_habitable_logement", "surface_habitable_immeuble"
  , "modele_dpe", "date_fin_validite_dpe", "type_energie_n1", "cout_total_5_usages_energie_n1", "conso_5_usages_ef", "conso_5_usages_ep"
  , "type_energie_n2", "cout_total_5_usages_energie_n2", "conso_5_usages_ef", "conso_5_usages_ep"
  , "type_energie_n3", "cout_total_5_usages_energie_n3", "conso_5_usages_ef", "conso_5_usages_ep"
];


let nomColAPIv2Audit = ["score_ban", "adresse_brut", "nom_commune_brut", "code_postal_brut", "numero_dpe", "classe_bilan_dpe", "conso_5_usages_m2",
  "etiquette_ges", "emission_ges_5_usages_m2", "date_etablissement_audit", "methode_application_dpe", "annee_construction", "periode_constuction", "Type_bâtiment"
  , "surface_habitable_logement", "surface_ventilee", "categorie_scenario", "date_fin_validite_audit"
  , "type_energie_n1", "cout_5_usages_energie_n1", "conso_ef_5_usages_energie_n1", "ep_conso_5_usages"
  , "type_energie_n2", "cout_5_usages_energie_n2", "conso_ef_5_usages_energie_n2", "ep_conso_5_usages"
  , "type_energie_n3", "cout_5_usages_energie_n3", "conso_ef_5_usages_energie_n3", "ep_conso_5_usages"
];


// Menue de paramètrage : 
let classBoutonActiver = "w-70 p-3 shadow-md text-lg text-center border-3 border-yellow-400 text-gray-700 bg-[#fffade] rounded-xl hover:bg-yellow-400 transition";
let classBoutonDesactiver = "w-70 p-3 shadow-md bg-[#DBDBDB] hover:text-white text-lg text-center border-3 border-gray-500 focus:ring-4 hover:bg-gray-500 text-lg rounded-xl inline-flex transition items-center cursor-not-allowed focus:ring-gray-300"
//let classBoutonDesactiver ="w-1/2 p-3 mr-4 text-white bg-grey-600 hover:text-white border-3 border-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-lg text-center inline-flex items-center cursor-not-allowed";
let classBoutonActiverTelechargerCSV = "w-70 p-3 bg-[#fffade] text-lg text-[#a5b68d] shadow-md hover:text-white border-3 border-[#a5b68d] hover:bg-[#a5b68d] focus:ring-4 focus:outline-none focus:ring-[#a5b68d] rounded-xl text-center inline-flex items-center"
boutonTelecharger.className = classBoutonDesactiver;
boutonLancerTraitement.className = classBoutonDesactiver;
zoneLancementTraitement.style.display = "none";


// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------- Gestion du dépôt de document ---------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  const dropArea = document.getElementById('drop-area');
  const fileInput = document.getElementById('csvFile');

  // Prévenir le comportement par défaut de l'événement de glisser-déposer
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Gérer la sélection de fichier via l'input
  fileInput.addEventListener('change', function (event) {
    const files = event.target.files;
    handleFiles(files);
  });

  // Gérer le dépôt du fichier
  dropArea.addEventListener('drop', handleDrop, false);

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    handleFiles(files);
  }

  function handleFiles(files) {
    const file = files[0]; // On prend le premier fichier déposé
    if (file && file.type === "text/csv") {
      // fileInfo.innerHTML = `Fichier déposé : ${file.name}`;
      readFile(file);
    } else {
      // fileInfo.innerHTML = "Veuillez déposer un fichier CSV.";
    }
  }

  function readFile(file) {
    const reader = new FileReader();

    reader.onload = function (event) {
      const content = event.target.result;
      // Utilisation de TextDecoder pour décoder le contenu en UTF-8
      const decoder = new TextDecoder();
      const decodedContent = decoder.decode(new Uint8Array(content));
      // console.log(decodedContent)
      const rows = decodedContent.split('\r\n');
      // console.log(rows)
      arrayCSV.push(rows)
      arrayCSV = arrayCSV[0]
      boutonLancerTraitement.className = classBoutonActiver;
    };

    // Lire le fichier en tant que ArrayBuffer
    reader.readAsArrayBuffer(file);
  }
});

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------- Fonctions  : -----------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Avant de passer à la gestion de l'asynchrone : 
boutonLancerTraitement.addEventListener('click', (e) => {
  // console.log(arrayCSV);
  callBatchAPI(arrayCSV);
});

async function callBatchAPI(data) {
  zoneLancementTraitement.style.display = "block";
  lancerTraitement(data.length);
  for (index = 0; index < data.length; index++) {
    const numADEME = data[index];
    // console.log(numADEME)
    let arrayoutputCall = await getInfoDPE(numADEME);
    // console.log(arrayoutputCall)
    resultGetInfoDPE.push(arrayoutputCall);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  // console.log(resultGetInfoDPE);
  boutonTelecharger.className = classBoutonActiverTelechargerCSV;
};

async function getInfoDPE(numeroAdeme) {
  let urlGet = `${url}${numeroAdeme}`;
  // console.log(urlGet)
  try {
    const requete = await fetch(urlGet, {
      method: 'GET',
      headers: { 'User-Agent': "experimentationGitHub/1.0 (emilien.sezestre@gmail.com)" },
    });

    if (!requete.ok) {
      alert('Un problème est survenu, veuillez réessayer plus tard');
    } else {
      let donnees = await requete.json();
      if (donnees.total == 0) {
        let arrayLine = getInfoDPETertiairev1(numeroAdeme);
        return arrayLine
      } else {
        // console.log(donnees);
        let numDPE = null;
        let typeDPE = null;
        let methodeDPE = null;
        let noteDPE = null;
        let noteGES = null;
        let consoDPE = null;
        let consoGES = null;
        let dateEtabDPE = null;
        let dateFinDPE = null;
        let surfaceUtile = null;
        let shon = null;
        let secteurActivite = null;
        let prdConstruction = null;
        let anneeConstruction = null;
        let adresseBrut = null;
        let typeEnergie1 = null;
        let coutEnergie1 = null;
        let consoEnergieFinale1 = null;
        let consoEnergiePrimaire1 = null;
        let typeEnergie2 = null;
        let coutEnergie2 = null;
        let consoEnergieFinale2 = null;
        let consoEnergiePrimaire2 = null;
        let typeEnergie3 = null;
        let coutEnergie3 = null;
        let consoEnergieFinale3 = null;
        let consoEnergiePrimaire3 = null;
        if (donnees["total"] == 1) {
          if (donnees["results"][0]["numero_dpe"]) { numDPE = donnees["results"][0]["numero_dpe"] } else { numDPE = null }
          if (donnees["results"][0]["modele_dpe"]) { typeDPE = donnees["results"][0]["modele_dpe"] } else { typeDPE = null }
          if (donnees["results"][0]["methode_dpe"]) { methodeDPE = donnees["results"][0]["methode_dpe"] } else { methodeDPE = null }
          if (donnees["results"][0]["etiquette_dpe"]) { noteDPE = donnees["results"][0]["etiquette_dpe"] } else { noteDPE = null }
          if (donnees["results"][0]["etiquette_ges"]) { noteGES = donnees["results"][0]["etiquette_ges"] } else { noteGES = null }
          if (donnees["results"][0]["conso_kwhep_m2_an"]) { consoDPE = donnees["results"][0]["conso_kwhep_m2_an"] } else { consoDPE = null }
          if (donnees["results"][0]["emission_ges_kg_co2_m2_an"]) { consoGES = donnees["results"][0]["emission_ges_kg_co2_m2_an"] } else { consoGES = null }
          if (donnees["results"][0]["date_etablissement_dpe"]) { dateEtabDPE = donnees["results"][0]["date_etablissement_dpe"] } else { dateEtabDPE = null }
          if (donnees["results"][0]["date_fin_validite_dpe"]) { dateFinDPE = donnees["results"][0]["date_fin_validite_dpe"] } else { dateFinDPE = null }
          if (donnees["results"][0]["surface_utile"]) { surfaceUtile = donnees["results"][0]["surface_utile"] } else { surfaceUtile = null }
          if (donnees["results"][0]["surface_shon"]) { shon = donnees["results"][0]["surface_shon"] } else { shon = null }
          if (donnees["results"][0]["secteur_activite"]) { secteurActivite = donnees["results"][0]["secteur_activite"] } else { secteurActivite = null }
          if (donnees["results"][0]["periode_construction"]) { prdConstruction = donnees["results"][0]["periode_construction"] } else { prdConstruction = null }
          if (donnees["results"][0]["annee_construction"]) { anneeConstruction = donnees["results"][0]["annee_construction"] } else { anneeConstruction = null }
          if (donnees["results"][0]["adresse_brut"]) { adresseBrut = donnees["results"][0]["adresse_brut"] + " " + donnees["results"][0]["code_postal_brut"] + " " + donnees["results"][0]["nom_commune_brut"] } else { adresseBrut = null }
          if (donnees["results"][0]["type_energie_n1"]) { typeEnergie1 = donnees["results"][0]["type_energie_n1"] } else { typeEnergie1 = null }
          if (donnees["results"][0]["frais_annuel_energie_n1"]) { coutEnergie1 = donnees["results"][0]["frais_annuel_energie_n1"] } else { coutEnergie1 = null }
          if (donnees["results"][0]["conso_ef_energie_n1"]) { consoEnergieFinale1 = donnees["results"][0]["conso_ef_energie_n1"] } else { consoEnergieFinale1 = null }
          if (donnees["results"][0]["conso_ep_energie_n1"]) { consoEnergiePrimaire1 = donnees["results"][0]["conso_ep_energie_n1"] } else { consoEnergiePrimaire1 = null }
          if (donnees["results"][0]["type_energie_n2"]) { typeEnergie2 = donnees["results"][0]["type_energie_n2"] } else { typeEnergie2 = null }
          if (donnees["results"][0]["frais_annuel_energie_n2"]) { coutEnergie2 = donnees["results"][0]["frais_annuel_energie_n2"] } else { coutEnergie2 = null }
          if (donnees["results"][0]["conso_ef_energie_n2"]) { consoEnergieFinale2 = donnees["results"][0]["conso_ef_energie_n2"] } else { consoEnergieFinale2 = null }
          if (donnees["results"][0]["conso_ep_energie_n2"]) { consoEnergiePrimaire2 = donnees["results"][0]["conso_ep_energie_n2"] } else { consoEnergiePrimaire2 = null }
          if (donnees["results"][0]["type_energie_n3"]) { typeEnergie3 = donnees["results"][0]["type_energie_n3"] } else { typeEnergie3 = null }
          if (donnees["results"][0]["frais_annuel_energie_n3"]) { coutEnergie3 = donnees["results"][0]["frais_annuel_energie_n3"] } else { coutEnergie3 = null }
          if (donnees["results"][0]["conso_ef_energie_n3"]) { consoEnergieFinale3 = donnees["results"][0]["conso_ef_energie_n3"] } else { consoEnergieFinale3 = null }
          if (donnees["results"][0]["conso_ep_energie_n3"]) { consoEnergiePrimaire3 = donnees["results"][0]["conso_ep_energie_n3"] } else { consoEnergiePrimaire3 = null }

          adresseBrut = adresseBrut.replace("\n", " ");

          let arrayLine = [numeroAdeme, numDPE, typeDPE, methodeDPE, noteDPE, noteGES, consoDPE, consoGES, dateEtabDPE, dateFinDPE, surfaceUtile, shon, secteurActivite, prdConstruction, anneeConstruction, adresseBrut, typeEnergie1, coutEnergie1, consoEnergieFinale1, consoEnergiePrimaire1, typeEnergie2, coutEnergie2, consoEnergieFinale2, consoEnergiePrimaire2, typeEnergie3, coutEnergie3, consoEnergieFinale3, consoEnergiePrimaire3];
          return arrayLine
        } else {
          let arrayLine = [numeroAdeme, numDPE, typeDPE, methodeDPE, noteDPE, noteGES, consoDPE, consoGES, dateEtabDPE, dateFinDPE, surfaceUtile, shon, secteurActivite, prdConstruction, anneeConstruction, adresseBrut, typeEnergie1, coutEnergie1, consoEnergieFinale1, consoEnergiePrimaire1, typeEnergie2, coutEnergie2, consoEnergieFinale2, consoEnergiePrimaire2, typeEnergie3, coutEnergie3, consoEnergieFinale3, consoEnergiePrimaire3];
          return arrayLine;
        }
      }
    }
  } catch (error) {
    console.error(`Erreur lors de la requête pour : ${error.message}`);
  }
};

async function getInfoDPETertiairev1(numeroAdeme) {
  let urlGet = `${urlTertiairev1}${numeroAdeme}`;
  // console.log(urlGet)
  try {
    const requete = await fetch(urlGet, {
      method: 'GET',
      headers: { 'User-Agent': "experimentationGitHub/1.0 (emilien.sezestre@gmail.com)" },
    });

    if (!requete.ok) {
      alert('Un problème est survenu, veuillez réessayer plus tard');
    } else {
      let donnees = await requete.json();
      if (donnees.total == 0) {
        let arrayLine = getInfoDPENeufv2(numeroAdeme);
        return arrayLine
      } else {
        let numDPE = null;
        let typeDPE = null;
        let methodeDPE = null;
        let noteDPE = null;
        let noteGES = null;
        let consoDPE = null;
        let consoGES = null;
        let dateEtabDPE = null;
        let dateFinDPE = null;
        let surfaceUtile = null;
        let shon = null;
        let secteurActivite = null;
        let prdConstruction = null;
        let anneeConstruction = null;
        let adresseBrut = null;
        let typeEnergie1 = null;
        let coutEnergie1 = null;
        let consoEnergieFinale1 = null;
        let consoEnergiePrimaire1 = null;
        let typeEnergie2 = null;
        let coutEnergie2 = null;
        let consoEnergieFinale2 = null;
        let consoEnergiePrimaire2 = null;
        let typeEnergie3 = null;
        let coutEnergie3 = null;
        let consoEnergieFinale3 = null;
        let consoEnergiePrimaire3 = null;

        if (donnees["total"] == 1) {
          if (donnees["results"][0][nomColAPIv1Tertiaire[4]]) { numDPE = donnees["results"][0][nomColAPIv1Tertiaire[4]] } else { numDPE = null }
          if (donnees["results"][0][nomColAPIv1Tertiaire[16]]) { typeDPE = donnees["results"][0][nomColAPIv1Tertiaire[16]] } else { typeDPE = null }
          if (donnees["results"][0][nomColAPIv1Tertiaire[10]]) { methodeDPE = donnees["results"][0][nomColAPIv1Tertiaire[10]] } else { methodeDPE = null }
          if (donnees["results"][0][nomColAPIv1Tertiaire[5]]) { noteDPE = donnees["results"][0][nomColAPIv1Tertiaire[5]] } else { noteDPE = null }
          if (donnees["results"][0][nomColAPIv1Tertiaire[7]]) { noteGES = donnees["results"][0][nomColAPIv1Tertiaire[7]] } else { noteGES = null }
          if (donnees["results"][0][nomColAPIv1Tertiaire[6]]) { consoDPE = donnees["results"][0][nomColAPIv1Tertiaire[6]] } else { consoDPE = null }
          if (donnees["results"][0][nomColAPIv1Tertiaire[8]]) { consoGES = donnees["results"][0][nomColAPIv1Tertiaire[8]] } else { consoGES = null }
          if (donnees["results"][0][nomColAPIv1Tertiaire[9]]) { dateEtabDPE = donnees["results"][0][nomColAPIv1Tertiaire[9]] } else { dateEtabDPE = null }
          if (donnees["results"][0][nomColAPIv1Tertiaire[17]]) { dateFinDPE = donnees["results"][0][nomColAPIv1Tertiaire[17]] } else { dateFinDPE = null }
          if (donnees["results"][0][nomColAPIv1Tertiaire[15]]) { surfaceUtile = donnees["results"][0][nomColAPIv1Tertiaire[15]] } else { surfaceUtile = null }
          if (donnees["results"][0][nomColAPIv1Tertiaire[14]]) { shon = donnees["results"][0][nomColAPIv1Tertiaire[14]] } else { shon = null }
          if (donnees["results"][0][nomColAPIv1Tertiaire[13]]) { secteurActivite = donnees["results"][0][nomColAPIv1Tertiaire[13]] } else { secteurActivite = null }
          if (donnees["results"][0][nomColAPIv1Tertiaire[12]]) { prdConstruction = donnees["results"][0][nomColAPIv1Tertiaire[12]] } else { prdConstruction = null }
          if (donnees["results"][0][nomColAPIv1Tertiaire[11]]) { anneeConstruction = donnees["results"][0][nomColAPIv1Tertiaire[11]] } else { anneeConstruction = null }
          if (donnees["results"][0][nomColAPIv1Tertiaire[1]]) { adresseBrut = donnees["results"][0][nomColAPIv1Tertiaire[1]] + " " + donnees["results"][0][nomColAPIv1Tertiaire[3]] + " " + donnees["results"][0][nomColAPIv1Tertiaire[2]] } else { adresseBrut = null }
          if (donnees["results"][0][nomColAPIv1Tertiaire[18]]) { typeEnergie1 = donnees["results"][0][nomColAPIv1Tertiaire[18]] } else { typeEnergie1 = null }
          if (donnees["results"][0][nomColAPIv1Tertiaire[19]]) { coutEnergie1 = donnees["results"][0][nomColAPIv1Tertiaire[19]] } else { coutEnergie1 = null }
          if (donnees["results"][0][nomColAPIv1Tertiaire[20]]) { consoEnergieFinale1 = donnees["results"][0][nomColAPIv1Tertiaire[20]] } else { consoEnergieFinale1 = null }
          if (donnees["results"][0][nomColAPIv1Tertiaire[21]]) { consoEnergiePrimaire1 = donnees["results"][0][nomColAPIv1Tertiaire[21]] } else { consoEnergiePrimaire1 = null }
          if (donnees["results"][0][nomColAPIv1Tertiaire[22]]) { typeEnergie2 = donnees["results"][0][nomColAPIv1Tertiaire[22]] } else { typeEnergie2 = null }
          if (donnees["results"][0][nomColAPIv1Tertiaire[23]]) { coutEnergie2 = donnees["results"][0][nomColAPIv1Tertiaire[23]] } else { coutEnergie2 = null }
          if (donnees["results"][0][nomColAPIv1Tertiaire[24]]) { consoEnergieFinale2 = donnees["results"][0][nomColAPIv1Tertiaire[24]] } else { consoEnergieFinale2 = null }
          if (donnees["results"][0][nomColAPIv1Tertiaire[25]]) { consoEnergiePrimaire2 = donnees["results"][0][nomColAPIv1Tertiaire[25]] } else { consoEnergiePrimaire2 = null }
          if (donnees["results"][0][nomColAPIv1Tertiaire[26]]) { typeEnergie3 = donnees["results"][0][nomColAPIv1Tertiaire[26]] } else { typeEnergie3 = null }
          if (donnees["results"][0][nomColAPIv1Tertiaire[27]]) { coutEnergie3 = donnees["results"][0][nomColAPIv1Tertiaire[27]] } else { coutEnergie3 = null }
          if (donnees["results"][0][nomColAPIv1Tertiaire[28]]) { consoEnergieFinale3 = donnees["results"][0][nomColAPIv1Tertiaire[28]] } else { consoEnergieFinale3 = null }
          if (donnees["results"][0][nomColAPIv1Tertiaire[29]]) { consoEnergiePrimaire3 = donnees["results"][0][nomColAPIv1Tertiaire[29]] } else { consoEnergiePrimaire3 = null }

          adresseBrut = adresseBrut.replace("\n", " ");

          let arrayLine = [numeroAdeme, numDPE, typeDPE, methodeDPE, noteDPE, noteGES, consoDPE, consoGES, dateEtabDPE, dateFinDPE, surfaceUtile, shon, secteurActivite, prdConstruction, anneeConstruction, adresseBrut, typeEnergie1, coutEnergie1, consoEnergieFinale1, consoEnergiePrimaire1, typeEnergie2, coutEnergie2, consoEnergieFinale2, consoEnergiePrimaire2, typeEnergie3, coutEnergie3, consoEnergieFinale3, consoEnergiePrimaire3];
          return arrayLine
        } else {
          let arrayLine = [numeroAdeme, numDPE, typeDPE, methodeDPE, noteDPE, noteGES, consoDPE, consoGES, dateEtabDPE, dateFinDPE, surfaceUtile, shon, secteurActivite, prdConstruction, anneeConstruction, adresseBrut, typeEnergie1, coutEnergie1, consoEnergieFinale1, consoEnergiePrimaire1, typeEnergie2, coutEnergie2, consoEnergieFinale2, consoEnergiePrimaire2, typeEnergie3, coutEnergie3, consoEnergieFinale3, consoEnergiePrimaire3];
          return arrayLine;
        }
      }
    }
  } catch (error) {
    console.error(`Erreur lors de la requête pour : ${error.message}`);
  }
};

async function getInfoDPENeufv2(numeroAdeme) {
  let urlGet = `${urlDPENeufv2}${numeroAdeme}`;
  // console.log(urlGet)
  try {
    const requete = await fetch(urlGet, {
      method: 'GET',
      headers: { 'User-Agent': "experimentationGitHub/1.0 (emilien.sezestre@gmail.com)" },
    });

    if (!requete.ok) {
      alert('Un problème est survenu, veuillez réessayer plus tard');
    } else {
      let donnees = await requete.json();
      if (donnees.total == 0) {
        let arrayLine = getInfoDPEExistantv2(numeroAdeme);
        return arrayLine
      } else {
        //console.log(donnees);
        let numDPE = null;
        let typeDPE = null;
        let methodeDPE = null;
        let noteDPE = null;
        let noteGES = null;
        let consoDPE = null;
        let consoGES = null;
        let dateEtabDPE = null;
        let dateFinDPE = null;
        let surfaceUtile = null;
        let shon = null;
        let secteurActivite = null;
        let prdConstruction = null;
        let anneeConstruction = null;
        let adresseBrut = null;
        let typeEnergie1 = null;
        let coutEnergie1 = null;
        let consoEnergieFinale1 = null;
        let consoEnergiePrimaire1 = null;
        let typeEnergie2 = null;
        let coutEnergie2 = null;
        let consoEnergieFinale2 = null;
        let consoEnergiePrimaire2 = null;
        let typeEnergie3 = null;
        let coutEnergie3 = null;
        let consoEnergieFinale3 = null;
        let consoEnergiePrimaire3 = null;

        if (donnees["total"] == 1) {
          if (donnees["results"][0][nomColAPIv2Neuf[4]]) { numDPE = donnees["results"][0][nomColAPIv2Neuf[4]] } else { numDPE = null }
          if (donnees["results"][0][nomColAPIv2Neuf[16]]) { typeDPE = donnees["results"][0][nomColAPIv2Neuf[16]] } else { typeDPE = null }
          if (donnees["results"][0][nomColAPIv2Neuf[10]]) { methodeDPE = donnees["results"][0][nomColAPIv2Neuf[10]] } else { methodeDPE = null }
          if (donnees["results"][0][nomColAPIv2Neuf[5]]) { noteDPE = donnees["results"][0][nomColAPIv2Neuf[5]] } else { noteDPE = null }
          if (donnees["results"][0][nomColAPIv2Neuf[7]]) { noteGES = donnees["results"][0][nomColAPIv2Neuf[7]] } else { noteGES = null }
          if (donnees["results"][0][nomColAPIv2Neuf[6]]) { consoDPE = donnees["results"][0][nomColAPIv2Neuf[6]] } else { consoDPE = null }
          if (donnees["results"][0][nomColAPIv2Neuf[8]]) { consoGES = donnees["results"][0][nomColAPIv2Neuf[8]] } else { consoGES = null }
          if (donnees["results"][0][nomColAPIv2Neuf[9]]) { dateEtabDPE = donnees["results"][0][nomColAPIv2Neuf[9]] } else { dateEtabDPE = null }
          if (donnees["results"][0][nomColAPIv2Neuf[17]]) { dateFinDPE = donnees["results"][0][nomColAPIv2Neuf[17]] } else { dateFinDPE = null }
          if (donnees["results"][0][nomColAPIv2Neuf[15]]) { surfaceUtile = donnees["results"][0][nomColAPIv2Neuf[15]] } else { surfaceUtile = null }
          if (donnees["results"][0][nomColAPIv2Neuf[14]]) { shon = donnees["results"][0][nomColAPIv2Neuf[14]] } else { shon = null }
          if (donnees["results"][0][nomColAPIv2Neuf[13]]) { secteurActivite = donnees["results"][0][nomColAPIv2Neuf[13]] } else { secteurActivite = null }
          if (donnees["results"][0][nomColAPIv2Neuf[12]]) { prdConstruction = donnees["results"][0][nomColAPIv2Neuf[12]] } else { prdConstruction = null }
          if (donnees["results"][0][nomColAPIv2Neuf[11]]) { anneeConstruction = donnees["results"][0][nomColAPIv2Neuf[11]] } else { anneeConstruction = null }
          if (donnees["results"][0][nomColAPIv2Neuf[1]]) { adresseBrut = donnees["results"][0][nomColAPIv2Neuf[1]] + " " + donnees["results"][0][nomColAPIv2Neuf[3]] + " " + donnees["results"][0][nomColAPIv2Neuf[2]] } else { adresseBrut = null }
          if (donnees["results"][0][nomColAPIv2Neuf[18]]) { typeEnergie1 = donnees["results"][0][nomColAPIv2Neuf[18]] } else { typeEnergie1 = null }
          if (donnees["results"][0][nomColAPIv2Neuf[19]]) { coutEnergie1 = donnees["results"][0][nomColAPIv2Neuf[19]] } else { coutEnergie1 = null }
          if (donnees["results"][0][nomColAPIv2Neuf[20]]) { consoEnergieFinale1 = donnees["results"][0][nomColAPIv2Neuf[20]] } else { consoEnergieFinale1 = null }
          if (donnees["results"][0][nomColAPIv2Neuf[21]]) { consoEnergiePrimaire1 = donnees["results"][0][nomColAPIv2Neuf[21]] } else { consoEnergiePrimaire1 = null }
          if (donnees["results"][0][nomColAPIv2Neuf[22]]) { typeEnergie2 = donnees["results"][0][nomColAPIv2Neuf[22]] } else { typeEnergie2 = null }
          if (donnees["results"][0][nomColAPIv2Neuf[23]]) { coutEnergie2 = donnees["results"][0][nomColAPIv2Neuf[23]] } else { coutEnergie2 = null }
          if (donnees["results"][0][nomColAPIv2Neuf[24]]) { consoEnergieFinale2 = donnees["results"][0][nomColAPIv2Neuf[24]] } else { consoEnergieFinale2 = null }
          if (donnees["results"][0][nomColAPIv2Neuf[25]]) { consoEnergiePrimaire2 = donnees["results"][0][nomColAPIv2Neuf[25]] } else { consoEnergiePrimaire2 = null }
          if (donnees["results"][0][nomColAPIv2Neuf[26]]) { typeEnergie3 = donnees["results"][0][nomColAPIv2Neuf[26]] } else { typeEnergie3 = null }
          if (donnees["results"][0][nomColAPIv2Neuf[27]]) { coutEnergie3 = donnees["results"][0][nomColAPIv2Neuf[27]] } else { coutEnergie3 = null }
          if (donnees["results"][0][nomColAPIv2Neuf[28]]) { consoEnergieFinale3 = donnees["results"][0][nomColAPIv2Neuf[28]] } else { consoEnergieFinale3 = null }
          if (donnees["results"][0][nomColAPIv2Neuf[29]]) { consoEnergiePrimaire3 = donnees["results"][0][nomColAPIv2Neuf[29]] } else { consoEnergiePrimaire3 = null }

          adresseBrut = adresseBrut.replace("\n", " ");

          let arrayLine = [numeroAdeme, numDPE, typeDPE, methodeDPE, noteDPE, noteGES, consoDPE, consoGES, dateEtabDPE, dateFinDPE, surfaceUtile, shon, secteurActivite, prdConstruction, anneeConstruction, adresseBrut, typeEnergie1, coutEnergie1, consoEnergieFinale1, consoEnergiePrimaire1, typeEnergie2, coutEnergie2, consoEnergieFinale2, consoEnergiePrimaire2, typeEnergie3, coutEnergie3, consoEnergieFinale3, consoEnergiePrimaire3];
          return arrayLine
        } else {
          let arrayLine = [numeroAdeme, numDPE, typeDPE, methodeDPE, noteDPE, noteGES, consoDPE, consoGES, dateEtabDPE, dateFinDPE, surfaceUtile, shon, secteurActivite, prdConstruction, anneeConstruction, adresseBrut, typeEnergie1, coutEnergie1, consoEnergieFinale1, consoEnergiePrimaire1, typeEnergie2, coutEnergie2, consoEnergieFinale2, consoEnergiePrimaire2, typeEnergie3, coutEnergie3, consoEnergieFinale3, consoEnergiePrimaire3];
          return arrayLine;
        }
      }
    }
  } catch (error) {
    console.error(`Erreur lors de la requête pour : ${error.message}`);
  }
};

async function getInfoDPEExistantv2(numeroAdeme) {
  let urlGet = `${urlDPEExistantv2}${numeroAdeme}`;
  // console.log(urlGet)
  try {
    const requete = await fetch(urlGet, {
      method: 'GET',
      headers: { 'User-Agent': "experimentationGitHub/1.0 (emilien.sezestre@gmail.com)" },
    });

    if (!requete.ok) {
      alert('Un problème est survenu, veuillez réessayer plus tard');
    } else {
      let donnees = await requete.json();
      // console.log(donnees.total)
      if (donnees.total == 0) {
        // console.log(donnees)
        let arrayLine = getInfoDPEAuditEnergetique(numeroAdeme);
        return arrayLine
      } else {
        // console.log(donnees);
        let numDPE = null;
        let typeDPE = null;
        let methodeDPE = null;
        let noteDPE = null;
        let noteGES = null;
        let consoDPE = null;
        let consoGES = null;
        let dateEtabDPE = null;
        let dateFinDPE = null;
        let surfaceUtile = null;
        let shon = null;
        let secteurActivite = null;
        let prdConstruction = null;
        let anneeConstruction = null;
        let adresseBrut = null;
        let typeEnergie1 = null;
        let coutEnergie1 = null;
        let consoEnergieFinale1 = null;
        let consoEnergiePrimaire1 = null;
        let typeEnergie2 = null;
        let coutEnergie2 = null;
        let consoEnergieFinale2 = null;
        let consoEnergiePrimaire2 = null;
        let typeEnergie3 = null;
        let coutEnergie3 = null;
        let consoEnergieFinale3 = null;
        let consoEnergiePrimaire3 = null;

        if (donnees["total"] == 1) {
          if (donnees["results"][0][nomColAPIv2Existant[4]]) { numDPE = donnees["results"][0][nomColAPIv2Existant[4]] } else { numDPE = null }
          if (donnees["results"][0][nomColAPIv2Existant[16]]) { typeDPE = donnees["results"][0][nomColAPIv2Existant[16]] } else { typeDPE = null }
          if (donnees["results"][0][nomColAPIv2Existant[10]]) { methodeDPE = donnees["results"][0][nomColAPIv2Existant[10]] } else { methodeDPE = null }
          if (donnees["results"][0][nomColAPIv2Existant[5]]) { noteDPE = donnees["results"][0][nomColAPIv2Existant[5]] } else { noteDPE = null }
          if (donnees["results"][0][nomColAPIv2Existant[7]]) { noteGES = donnees["results"][0][nomColAPIv2Existant[7]] } else { noteGES = null }
          if (donnees["results"][0][nomColAPIv2Existant[6]]) { consoDPE = donnees["results"][0][nomColAPIv2Existant[6]] } else { consoDPE = null }
          if (donnees["results"][0][nomColAPIv2Existant[8]]) { consoGES = donnees["results"][0][nomColAPIv2Existant[8]] } else { consoGES = null }
          if (donnees["results"][0][nomColAPIv2Existant[9]]) { dateEtabDPE = donnees["results"][0][nomColAPIv2Existant[9]] } else { dateEtabDPE = null }
          if (donnees["results"][0][nomColAPIv2Existant[17]]) { dateFinDPE = donnees["results"][0][nomColAPIv2Existant[17]] } else { dateFinDPE = null }
          if (donnees["results"][0][nomColAPIv2Existant[15]]) { surfaceUtile = donnees["results"][0][nomColAPIv2Existant[15]] } else { surfaceUtile = null }
          if (donnees["results"][0][nomColAPIv2Existant[14]]) { shon = donnees["results"][0][nomColAPIv2Existant[14]] } else { shon = null }
          if (donnees["results"][0][nomColAPIv2Existant[13]]) { secteurActivite = donnees["results"][0][nomColAPIv2Existant[13]] } else { secteurActivite = null }
          if (donnees["results"][0][nomColAPIv2Existant[12]]) { prdConstruction = donnees["results"][0][nomColAPIv2Existant[12]] } else { prdConstruction = null }
          if (donnees["results"][0][nomColAPIv2Existant[11]]) { anneeConstruction = donnees["results"][0][nomColAPIv2Existant[11]] } else { anneeConstruction = null }
          if (donnees["results"][0][nomColAPIv2Existant[1]]) { adresseBrut = donnees["results"][0][nomColAPIv2Existant[1]] + " " + donnees["results"][0][nomColAPIv2Existant[3]] + " " + donnees["results"][0][nomColAPIv2Existant[2]] } else { adresseBrut = null }
          if (donnees["results"][0][nomColAPIv2Existant[18]]) { typeEnergie1 = donnees["results"][0][nomColAPIv2Existant[18]] } else { typeEnergie1 = null }
          if (donnees["results"][0][nomColAPIv2Existant[19]]) { coutEnergie1 = donnees["results"][0][nomColAPIv2Existant[19]] } else { coutEnergie1 = null }
          if (donnees["results"][0][nomColAPIv2Existant[20]]) { consoEnergieFinale1 = donnees["results"][0][nomColAPIv2Existant[20]] } else { consoEnergieFinale1 = null }
          if (donnees["results"][0][nomColAPIv2Existant[21]]) { consoEnergiePrimaire1 = donnees["results"][0][nomColAPIv2Existant[21]] } else { consoEnergiePrimaire1 = null }
          if (donnees["results"][0][nomColAPIv2Existant[22]]) { typeEnergie2 = donnees["results"][0][nomColAPIv2Existant[22]] } else { typeEnergie2 = null }
          if (donnees["results"][0][nomColAPIv2Existant[23]]) { coutEnergie2 = donnees["results"][0][nomColAPIv2Existant[23]] } else { coutEnergie2 = null }
          if (donnees["results"][0][nomColAPIv2Existant[24]]) { consoEnergieFinale2 = donnees["results"][0][nomColAPIv2Existant[24]] } else { consoEnergieFinale2 = null }
          if (donnees["results"][0][nomColAPIv2Existant[25]]) { consoEnergiePrimaire2 = donnees["results"][0][nomColAPIv2Existant[25]] } else { consoEnergiePrimaire2 = null }
          if (donnees["results"][0][nomColAPIv2Existant[26]]) { typeEnergie3 = donnees["results"][0][nomColAPIv2Existant[26]] } else { typeEnergie3 = null }
          if (donnees["results"][0][nomColAPIv2Existant[27]]) { coutEnergie3 = donnees["results"][0][nomColAPIv2Existant[27]] } else { coutEnergie3 = null }
          if (donnees["results"][0][nomColAPIv2Existant[28]]) { consoEnergieFinale3 = donnees["results"][0][nomColAPIv2Existant[28]] } else { consoEnergieFinale3 = null }
          if (donnees["results"][0][nomColAPIv2Existant[29]]) { consoEnergiePrimaire3 = donnees["results"][0][nomColAPIv2Existant[29]] } else { consoEnergiePrimaire3 = null }

          adresseBrut = adresseBrut.replace("\n", " ");

          let arrayLine = [numeroAdeme, numDPE, typeDPE, methodeDPE, noteDPE, noteGES, consoDPE, consoGES, dateEtabDPE, dateFinDPE, surfaceUtile, shon, secteurActivite, prdConstruction, anneeConstruction, adresseBrut, typeEnergie1, coutEnergie1, consoEnergieFinale1, consoEnergiePrimaire1, typeEnergie2, coutEnergie2, consoEnergieFinale2, consoEnergiePrimaire2, typeEnergie3, coutEnergie3, consoEnergieFinale3, consoEnergiePrimaire3];
          return arrayLine
        } else {
          let arrayLine = [numeroAdeme, numDPE, typeDPE, methodeDPE, noteDPE, noteGES, consoDPE, consoGES, dateEtabDPE, dateFinDPE, surfaceUtile, shon, secteurActivite, prdConstruction, anneeConstruction, adresseBrut, typeEnergie1, coutEnergie1, consoEnergieFinale1, consoEnergiePrimaire1, typeEnergie2, coutEnergie2, consoEnergieFinale2, consoEnergiePrimaire2, typeEnergie3, coutEnergie3, consoEnergieFinale3, consoEnergiePrimaire3];
          return arrayLine;
        }
      }
    }
  } catch (error) {
    console.error(`Erreur lors de la requête pour : ${error.message}`);
  }
};

async function getInfoDPEAuditEnergetique(numeroAdeme) {
  let urlGet = `${urlAuditEnergetique}${numeroAdeme}`;
  // console.log(urlGet)
  try {
    const requete = await fetch(urlGet, {
      method: 'GET',
      headers: { 'User-Agent': "experimentationGitHub/1.0 (emilien.sezestre@gmail.com)" },
    });

    if (!requete.ok) {
      alert('Un problème est survenu, veuillez réessayer plus tard');
    } else {

      let donnees = await requete.json();
      if (donnees.total == 0) {
        // console.log(donnees)
        let numDPE = null;
        let typeDPE = null;
        let methodeDPE = null;
        let noteDPE = null;
        let noteGES = null;
        let consoDPE = null;
        let consoGES = null;
        let dateEtabDPE = null;
        let dateFinDPE = null;
        let surfaceUtile = null;
        let shon = null;
        let secteurActivite = null;
        let prdConstruction = null;
        let anneeConstruction = null;
        let adresseBrut = null;
        let typeEnergie1 = null;
        let coutEnergie1 = null;
        let consoEnergieFinale1 = null;
        let consoEnergiePrimaire1 = null;
        let typeEnergie2 = null;
        let coutEnergie2 = null;
        let consoEnergieFinale2 = null;
        let consoEnergiePrimaire2 = null;
        let typeEnergie3 = null;
        let coutEnergie3 = null;
        let consoEnergieFinale3 = null;
        let consoEnergiePrimaire3 = null;
        let arrayLine = [numeroAdeme, numDPE, typeDPE, methodeDPE, noteDPE, noteGES, consoDPE, consoGES, dateEtabDPE, dateFinDPE, surfaceUtile, shon, secteurActivite, prdConstruction, anneeConstruction, adresseBrut, typeEnergie1, coutEnergie1, consoEnergieFinale1, consoEnergiePrimaire1, typeEnergie2, coutEnergie2, consoEnergieFinale2, consoEnergiePrimaire2, typeEnergie3, coutEnergie3, consoEnergieFinale3, consoEnergiePrimaire3];
        return arrayLine
      } else {
        let numAdeme = donnees["results"][0][nomColAPIv2Audit[4]]
        let arrayLine = getInfoDPE(numAdeme);
        return arrayLine;
      }
    }
  } catch (error) {
    console.error(`Erreur lors de la requête pour : ${error.message}`);
  }
};


// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------- Gestion de la barre de Progression : -----------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function lancerTraitement(nbRepetition) {
  if (!traitementEnCours) {
    intervalId = setInterval(() => {
      // Code du traitement à exécuter toutes les 1 secondes
      val = Math.round((index / nbRepetition) * 100);
      // console.log(val)
      changementProgresseBar(val);
      if (index == nbRepetition) {
        arreterTraitement();
      }
    }, 1000);
    traitementEnCours = true;
  }
};

function arreterTraitement() {
  if (traitementEnCours) {
    clearInterval(intervalId);
    traitementEnCours = false;
  }
};

function changementProgresseBar(progressionPourcentage) {
  barDeProgression.className = `bg-[#a5b68d] text-xs font-medium text-gray-600 text-center p-0.5 leading-none rounded-full w-${progressionPourcentage / 100 * 120}`;
  barDeProgression.textContent = `${progressionPourcentage} %`;
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------- Téléchargement des données Format CSV : -----------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

boutonTelecharger.addEventListener('click', (e) => {
  telechargerCSV(resultGetInfoDPE); // Appel de la fonction principal
});

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
