// LES DOSSIERS OUBLIÉS — connexion à Supabase

const SUPABASE_URL = "https://zgrayhnorvuqjalrjrbr.supabase.co";
const SUPABASE_KEY = "sb_publishable_1SIVdVtTK9e1PS3gGajUBw_lI7DoKIp";

async function chargerAffaires() {
  const conteneur = document.querySelector("#dossiers .cards");

  if (!conteneur) {
    console.error("Conteneur des dossiers introuvable.");
    return;
  }

  conteneur.innerHTML = "<p>Chargement des dossiers…</p>";

  try {
    const url = new URL("/rest/v1/affaires", SUPABASE_URL);
    url.searchParams.set(
      "select",
      "id,titre,slug,resume,statut,cree_le"
    );
    url.searchParams.set("publie", "eq.true");
    url.searchParams.set("order", "cree_le.desc");

    const reponse = await fetch(url, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!reponse.ok) {
      throw new Error(`Erreur Supabase : ${reponse.status}`);
    }

    const affaires = await reponse.json();

    if (affaires.length === 0) {
      conteneur.innerHTML = `
        <p class="message-vide">
          Les dossiers documentés seront bientôt disponibles.
        </p>
      `;
      return;
    }

    
conteneur.innerHTML = affaires.map(affaire => `
    <article class="carte-dossier">
        <small>DOSSIER ${affaire.id}</small>
        <h3>${echapperHTML(affaire.titre)}</h3>
        <p>${echapperHTML(affaire.resume || "")}</p>
        <hr>
        <small>Statut : ${echapperHTML(affaire.statut || "À vérifier")}</small>
        <p>
            <button
                type="button"
                class="ouvrir-dossier"
                data-id="${affaire.id}">
                Consulter le dossier →
            </button>
        </p>
    </article>
`).join("");

conteneur.querySelectorAll(".ouvrir-dossier").forEach(bouton => {
    bouton.addEventListener("click", () => {
        const id = bouton.dataset.id;
        window.location.href =
            `dossier.html?id=${encodeURIComponent(id)}`;
    });
});


  } catch (erreur) {
    console.error(erreur);
    conteneur.innerHTML = `
      <p>Impossible de charger les dossiers pour le moment.
      Réessaie ultérieurement.</p>
    `;
  }
}

function echapperHTML(texte) {
  return String(texte ?? "").replace(/[&<>"']/g, caractere => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[caractere]);
}

chargerAffaires();
