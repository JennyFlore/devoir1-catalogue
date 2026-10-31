// Catalogue de bibliothèque : affichage, recherche, filtres, tri,
// ajout, suppression, validation du formulaire et sauvegarde (localStorage).

const CLE_STOCKAGE = "catalogue-livres";
const ANNEE_MIN = 1450;
const CHAMPS_FORMULAIRE = ["titre", "auteur", "annee", "categorie"];

// ---------- Données et sauvegarde ----------

// Copie des livres de départ. Les objets sont copiés un par un : sans cela,
// emprunter un livre modifierait aussi le tableau de départ.
function copierLivresDeDepart() {
  return livresDeDepart.map((livre) => ({ ...livre }));
}

// Lit la liste sauvegardée ; sinon (ou si elle est illisible), données de départ
function chargerLivres() {
  try {
    const sauvegarde = JSON.parse(localStorage.getItem(CLE_STOCKAGE));
    if (Array.isArray(sauvegarde)) return sauvegarde;
  } catch {
    // JSON invalide ou localStorage indisponible : on repart de zéro
  }
  return copierLivresDeDepart();
}

function sauvegarderLivres() {
  try {
    localStorage.setItem(CLE_STOCKAGE, JSON.stringify(livres));
  } catch {
    // Stockage plein ou bloqué : l'application continue sans sauvegarde
  }
}

let livres = chargerLivres();

// ---------- Éléments de la page ----------

const conteneurLivres = document.getElementById("liste-livres");
const champRecherche = document.getElementById("recherche");
const filtreCategorie = document.getElementById("filtre-categorie");
const filtreDisponibles = document.getElementById("filtre-disponibles");
const selectTri = document.getElementById("tri");
const compteur = document.getElementById("compteur");
const messageVide = document.getElementById("message-vide");
const formulaire = document.getElementById("formulaire-ajout");
const boutonReinitialiser = document.getElementById("bouton-reinitialiser");

// ---------- Recherche, filtres et tri ----------

// Met en minuscules et retire les accents : "Étranger" -> "etranger"
function normaliser(texte) {
  return texte
    .normalize("NFD")                 // sépare la lettre et son accent
    .replace(/[̀-ͯ]/g, "")  // supprime les accents
    .toLowerCase();
}

// Garde seulement les livres qui respectent les trois critères en même temps
function filtrerLivres() {
  const recherche = normaliser(champRecherche.value.trim());
  const categorie = filtreCategorie.value;
  const seulementDisponibles = filtreDisponibles.checked;

  return livres.filter((livre) => {
    const texteLivre = normaliser(`${livre.titre} ${livre.auteur}`);
    const correspondRecherche = texteLivre.includes(recherche);
    const correspondCategorie = categorie === "" || livre.categorie === categorie;
    const correspondDispo = !seulementDisponibles || livre.disponible;
    return correspondRecherche && correspondCategorie && correspondDispo;
  });
}

// Renvoie une copie triée (la valeur du select est par ex. "titre-asc")
function trierLivres(liste) {
  const [critere, sens] = selectTri.value.split("-");
  const facteur = sens === "asc" ? 1 : -1;

  return [...liste].sort((a, b) => {
    if (critere === "titre") {
      return a.titre.localeCompare(b.titre, "fr") * facteur;
    }
    return (a.annee - b.annee) * facteur;
  });
}

// ---------- Affichage ----------

// Construit une carte (élément <article>) pour un livre, avec le DOM
function creerCarte(livre) {
  const carte = document.createElement("article");
  carte.className = "carte";

  const titre = document.createElement("h3");
  titre.className = "carte__titre";
  titre.textContent = livre.titre;

  const auteur = document.createElement("p");
  auteur.className = "carte__auteur";
  auteur.textContent = livre.auteur;

  const meta = document.createElement("p");
  meta.className = "carte__meta";
  meta.textContent = `${livre.annee} · ${livre.categorie}`;

  const etiquette = document.createElement("span");
  etiquette.className = livre.disponible
    ? "etiquette etiquette--disponible"
    : "etiquette etiquette--emprunte";
  etiquette.textContent = livre.disponible ? "Disponible" : "Emprunté";

  const boutonEmprunter = document.createElement("button");
  boutonEmprunter.type = "button";
  boutonEmprunter.textContent = "Emprunter";
  boutonEmprunter.disabled = !livre.disponible; // grisé si déjà emprunté
  boutonEmprunter.addEventListener("click", () => emprunterLivre(livre.id));

  const boutonSupprimer = document.createElement("button");
  boutonSupprimer.type = "button";
  boutonSupprimer.className = "bouton-danger";
  boutonSupprimer.textContent = "Supprimer";
  boutonSupprimer.setAttribute("aria-label", `Supprimer ${livre.titre}`);
  boutonSupprimer.addEventListener("click", () => supprimerLivre(livre.id));

  const actions = document.createElement("div");
  actions.className = "carte__actions";
  actions.append(boutonEmprunter, boutonSupprimer);

  carte.append(titre, auteur, meta, etiquette, actions);
  return carte;
}

// Recalcule la liste à afficher et met à jour toute la page
function mettreAJourAffichage() {
  const resultats = trierLivres(filtrerLivres());

  conteneurLivres.replaceChildren(...resultats.map(creerCarte));

  const n = resultats.length;
  compteur.textContent = `${n} livre${n > 1 ? "s" : ""} trouvé${n > 1 ? "s" : ""}`;
  messageVide.hidden = n !== 0;
}

// Après toute modification des données : sauvegarder puis réafficher
function enregistrerEtAfficher() {
  sauvegarderLivres();
  mettreAJourAffichage();
}

// ---------- Actions : emprunter, supprimer, réinitialiser ----------

function emprunterLivre(id) {
  const livre = livres.find((l) => l.id === id);
  if (livre) {
    livre.disponible = false;
    enregistrerEtAfficher();
  }
}

function supprimerLivre(id) {
  const livre = livres.find((l) => l.id === id);
  if (!livre) return;

  // confirm() ouvre une boîte Oui/Non ; on s'arrête si l'utilisateur refuse
  if (!confirm(`Supprimer « ${livre.titre} » du catalogue ?`)) return;

  livres = livres.filter((l) => l.id !== id);
  enregistrerEtAfficher();
}

function reinitialiserLivres() {
  if (!confirm("Remettre les livres de départ ? Vos ajouts et suppressions seront perdus.")) return;

  livres = copierLivresDeDepart();
  enregistrerEtAfficher();
}

// ---------- Formulaire : validation et ajout ----------

// Valeur d'un champ du formulaire, sans espaces au début ni à la fin
function lireChamp(idChamp) {
  return document.getElementById(idChamp).value.trim();
}

// Affiche (ou efface, si message vide) l'erreur sous un champ
function afficherErreur(idChamp, message) {
  document.getElementById(`erreur-${idChamp}`).textContent = message;
  document.getElementById(idChamp).setAttribute("aria-invalid", message ? "true" : "false");
}

// Renvoie un objet { champ: message } ; il est vide si tout est valide
function validerFormulaire() {
  const erreurs = {};
  const anneeCourante = new Date().getFullYear();

  if (lireChamp("titre").length < 2) {
    erreurs.titre = "Le titre est obligatoire (au moins 2 caractères).";
  }
  if (lireChamp("auteur").length < 2) {
    erreurs.auteur = "L'auteur est obligatoire (au moins 2 caractères).";
  }

  const anneeSaisie = lireChamp("annee");
  const annee = Number(anneeSaisie);
  if (anneeSaisie === "" || !Number.isInteger(annee) || annee < ANNEE_MIN || annee > anneeCourante) {
    erreurs.annee = `L'année doit être comprise entre ${ANNEE_MIN} et ${anneeCourante}.`;
  }

  if (lireChamp("categorie") === "") {
    erreurs.categorie = "Veuillez choisir une catégorie.";
  }

  return erreurs;
}

function ajouterLivre(evenement) {
  evenement.preventDefault(); // empêche le rechargement de la page

  const erreurs = validerFormulaire();
  CHAMPS_FORMULAIRE.forEach((id) => afficherErreur(id, erreurs[id] || ""));

  // Au moins une erreur : on met le curseur sur le premier champ fautif
  const premierChampInvalide = CHAMPS_FORMULAIRE.find((id) => erreurs[id]);
  if (premierChampInvalide) {
    document.getElementById(premierChampInvalide).focus();
    return;
  }

  livres.push({
    id: genererId(),
    titre: lireChamp("titre"),
    auteur: lireChamp("auteur"),
    annee: Number(lireChamp("annee")),
    categorie: lireChamp("categorie"),
    disponible: document.getElementById("disponible").checked
  });

  formulaire.reset();
  enregistrerEtAfficher();
}

// Nouvel identifiant = plus grand id existant + 1
function genererId() {
  return livres.reduce((max, l) => Math.max(max, l.id), 0) + 1;
}

// ---------- Écouteurs d'événements ----------

// "input" se déclenche à chaque lettre tapée : recherche en temps réel
champRecherche.addEventListener("input", mettreAJourAffichage);
filtreCategorie.addEventListener("change", mettreAJourAffichage);
filtreDisponibles.addEventListener("change", mettreAJourAffichage);
selectTri.addEventListener("change", mettreAJourAffichage);
formulaire.addEventListener("submit", ajouterLivre);
boutonReinitialiser.addEventListener("click", reinitialiserLivres);

// Premier affichage au chargement de la page
mettreAJourAffichage();