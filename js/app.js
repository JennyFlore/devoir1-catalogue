// Catalogue de bibliothèque : affichage, recherche, filtres, tri,
// ajout et suppression. (Validation et localStorage : Partie 4.)

// ---------- Données et éléments de la page ----------

// Copie du tableau de départ : on modifie la copie, jamais l'original
let livres = [...livresDeDepart];

const conteneurLivres = document.getElementById("liste-livres");
const champRecherche = document.getElementById("recherche");
const filtreCategorie = document.getElementById("filtre-categorie");
const filtreDisponibles = document.getElementById("filtre-disponibles");
const selectTri = document.getElementById("tri");
const compteur = document.getElementById("compteur");
const messageVide = document.getElementById("message-vide");
const formulaire = document.getElementById("formulaire-ajout");

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

// ---------- Actions : emprunter, supprimer, ajouter ----------

function emprunterLivre(id) {
  const livre = livres.find((l) => l.id === id);
  if (livre) {
    livre.disponible = false;
    mettreAJourAffichage();
  }
}

function supprimerLivre(id) {
  const livre = livres.find((l) => l.id === id);
  if (!livre) return;

  // confirm() ouvre une boîte Oui/Non ; on s'arrête si l'utilisateur refuse
  if (!confirm(`Supprimer « ${livre.titre} » du catalogue ?`)) return;

  livres = livres.filter((l) => l.id !== id);
  mettreAJourAffichage();
}

// Nouvel identifiant = plus grand id existant + 1
function genererId() {
  return livres.reduce((max, l) => Math.max(max, l.id), 0) + 1;
}

function ajouterLivre(evenement) {
  evenement.preventDefault(); // empêche le rechargement de la page

  livres.push({
    id: genererId(),
    titre: document.getElementById("titre").value.trim(),
    auteur: document.getElementById("auteur").value.trim(),
    annee: Number(document.getElementById("annee").value),
    categorie: document.getElementById("categorie").value,
    disponible: document.getElementById("disponible").checked
  });

  formulaire.reset();
  mettreAJourAffichage();
}

// ---------- Écouteurs d'événements ----------

// "input" se déclenche à chaque lettre tapée : recherche en temps réel
champRecherche.addEventListener("input", mettreAJourAffichage);
filtreCategorie.addEventListener("change", mettreAJourAffichage);
filtreDisponibles.addEventListener("change", mettreAJourAffichage);
selectTri.addEventListener("change", mettreAJourAffichage);
formulaire.addEventListener("submit", ajouterLivre);

// Premier affichage au chargement de la page
mettreAJourAffichage();