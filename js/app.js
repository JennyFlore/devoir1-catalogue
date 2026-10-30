// Affichage minimal des cartes (version de la Partie 2).
// Les parties 3 et 4 ajouteront recherche, tri, ajout, suppression et localStorage.

const conteneurLivres = document.getElementById("liste-livres");

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

  const bouton = document.createElement("button");
  bouton.type = "button";
  bouton.textContent = "Emprunter";
  bouton.disabled = !livre.disponible; // désactivé si déjà emprunté

  carte.append(titre, auteur, meta, etiquette, bouton);
  return carte;
}

// Vide le conteneur puis affiche une carte par livre
function afficherLivres(livres) {
  conteneurLivres.replaceChildren(...livres.map(creerCarte));
}

afficherLivres(livresDeDepart);