// https://stackoverflow.com/questions/43262121/trying-to-use-fetch-and-pass-in-mode-no-cors

let boutonLancerTraitement = document.getElementById('lancer-traitement');
let boutonTelecharger = document.getElementById('download-csv');
let zoneLancementTraitement = document.getElementById('div-traitement');
let barre = document.getElementById("barre");
let barDeProgression = document.getElementById("progress-bar");

var resultGetInfoDPE = [];
var arrayCSV = [];
const url = "https://data.ademe.fr/data-fair/api/v1/datasets/dpe-v2-tertiaire-2/lines?select=*&q=";
let intervalId;
let traitementEnCours = false;

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
  console.log(resultGetInfoDPE);
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
      let numDPE = null;
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
        if (donnees["results"][0]["N°DPE"]) { numDPE = donnees["results"][0]["N°DPE"] } else { numDPE = null}
        if (donnees["results"][0]["Etiquette_DPE"]) { noteDPE = donnees["results"][0]["Etiquette_DPE"] } else { noteDPE = null}
        if (donnees["results"][0]["Etiquette_GES"]) { noteGES = donnees["results"][0]["Etiquette_GES"] } else { noteGES = null}
        if (donnees["results"][0]["Conso_kWhep/m²/an"]) { consoDPE = donnees["results"][0]["Conso_kWhep/m²/an"] } else { consoDPE = null}
        if (donnees["results"][0]["Emission_GES_kgCO2/m²/an"]) { consoGES = donnees["results"][0]["Emission_GES_kgCO2/m²/an"] } else { consoGES = null}
        if (donnees["results"][0]["Date_établissement_DPE"]) { dateEtabDPE = donnees["results"][0]["Date_établissement_DPE"] } else { dateEtabDPE = null}
        if (donnees["results"][0]["Date_fin_validité_DPE"]) { dateFinDPE = donnees["results"][0]["Date_fin_validité_DPE"] } else { dateFinDPE = null}
        if (donnees["results"][0]["Surface_utile"]) { surfaceUtile = donnees["results"][0]["Surface_utile"] } else { surfaceUtile = null}
        if (donnees["results"][0]["Surface_(SHON)"]) { shon = donnees["results"][0]["Surface_(SHON)"] } else { shon = null}
        if (donnees["results"][0]["Secteur_activité"]) { secteurActivite = donnees["results"][0]["Secteur_activité"] } else { secteurActivite = null}
        if (donnees["results"][0]["Période_construction"]) { prdConstruction = donnees["results"][0]["Période_construction"] } else { prdConstruction = null}
        if (donnees["results"][0]["Année_construction"]) { anneeConstruction = donnees["results"][0]["Année_construction"] } else { anneeConstruction = null}
        if (donnees["results"][0]["Adresse_brute"]) { adresseBrut = donnees["results"][0]["Adresse_brute"] + " " + donnees["results"][0]["Code_postal_(brut)"] + " " + donnees["results"][0]["Nom__commune_(Brut)"] } else { adresseBrut = null}
        if (donnees["results"][0]["Type_énergie_n°1"]) { typeEnergie1 = donnees["results"][0]["Type_énergie_n°1"] } else { typeEnergie1 = null}
        if (donnees["results"][0]["Frais_annuel_énergie_n°1"]) { coutEnergie1 = donnees["results"][0]["Frais_annuel_énergie_n°1"] } else { coutEnergie1 = null}
        if (donnees["results"][0]["Conso_é_finale_énergie_n°1"]) { consoEnergieFinale1 = donnees["results"][0]["Conso_é_finale_énergie_n°1"] } else { consoEnergieFinale1 = null}
        if (donnees["results"][0]["Conso_é_primaire_énergie_n°1"]) { consoEnergiePrimaire1 = donnees["results"][0]["Conso_é_primaire_énergie_n°1"] } else { consoEnergiePrimaire1 = null}
        if (donnees["results"][0]["Type_énergie_n°2"]) { typeEnergie2 = donnees["results"][0]["Type_énergie_n°2"] } else { typeEnergie2 = null}
        if (donnees["results"][0]["Frais_annuel_énergie_n°2"]) { coutEnergie2 = donnees["results"][0]["Frais_annuel_énergie_n°2"] } else { coutEnergie2 = null}
        if (donnees["results"][0]["Conso_é_finale_énergie_n°2"]) { consoEnergieFinale2 = donnees["results"][0]["Conso_é_finale_énergie_n°2"] } else { consoEnergieFinale2 = null}
        if (donnees["results"][0]["Conso_é_primaire_énergie_n°2"]) { consoEnergiePrimaire2 = donnees["results"][0]["Conso_é_primaire_énergie_n°2"] } else { consoEnergiePrimaire2 = null}
        if (donnees["results"][0]["Type_énergie_n°3"]) { typeEnergie3 = donnees["results"][0]["Type_énergie_n°3"] } else { typeEnergie3 = null}
        if (donnees["results"][0]["Frais_annuel_énergie_n°3"]) { typeEnergie3 = donnees["results"][0]["Frais_annuel_énergie_n°3"] } else { typeEnergie3 = null}
        if (donnees["results"][0]["Conso_é_finale_énergie_n°3"]) { consoEnergieFinale3 = donnees["results"][0]["Conso_é_finale_énergie_n°3"] } else { consoEnergieFinale3 = null}
        if (donnees["results"][0]["Conso_é_primaire_énergie_n°3"]) { consoEnergiePrimaire3 = donnees["results"][0]["Conso_é_primaire_énergie_n°3"] } else { consoEnergiePrimaire3 = null}
        
        adresseBrut = adresseBrut.replace("\n", " ");
        
        let arrayLine = [numeroAdeme, numDPE, noteDPE, noteGES, consoDPE, consoGES, dateEtabDPE, dateFinDPE, surfaceUtile, shon, secteurActivite, prdConstruction, anneeConstruction, adresseBrut, typeEnergie1, coutEnergie1, consoEnergieFinale1, consoEnergiePrimaire1, typeEnergie2, coutEnergie2, consoEnergieFinale2, consoEnergiePrimaire2, typeEnergie3, coutEnergie3, consoEnergieFinale3, consoEnergiePrimaire3];
        return arrayLine
      } else {
        let arrayLine = [numeroAdeme, numDPE, noteDPE, noteGES, consoDPE, consoGES, dateEtabDPE, dateFinDPE, surfaceUtile, shon, secteurActivite, prdConstruction, anneeConstruction, adresseBrut, typeEnergie1, coutEnergie1, consoEnergieFinale1, consoEnergiePrimaire1, typeEnergie2, coutEnergie2, consoEnergieFinale2, consoEnergiePrimaire2, typeEnergie3, coutEnergie3, consoEnergieFinale3, consoEnergiePrimaire3];
        return arrayLine;
      }
    }
  } catch (error) {
    console.error(`Erreur lors de la requête pour : ${error.message}`);
  }
}





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
  barDeProgression.className = `bg-[#a5b68d] text-xs font-medium text-gray-600 text-center p-0.5 leading-none rounded-full w-[${progressionPourcentage}%]`;
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
  const csvContent = data.map(e => e.join(",")).join("\n");

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