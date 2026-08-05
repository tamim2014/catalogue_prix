
// =========================
// Données en LocalStorage
// =========================

// HC = Haute Consommation
// PN = Première Nécessité
let HC = JSON.parse(localStorage.getItem("produits_HC")) || [];
let PN = JSON.parse(localStorage.getItem("produits_PN")) || [];

// =========================
// Fonction d'affichage
// =========================

function afficher(type) {
    // type = "HC" ou "PN"
    let data = (type === "HC") ? HC : PN;
    let tbody = document.getElementById("tbody" + type);
    tbody.innerHTML = "";

    data.forEach((p, index) => {
        let tr = document.createElement("tr");
        tr.id = `${type}-row-${index}`;

        tr.innerHTML = `
            <td>${p.nom}</td>
            <td>${formatPrix(p.prix)}</td>
            <td>${p.duree}</td>
            <td>${p.categorie}</td>
            <td id="action_${type}_${index}">
                <button class="btn btn-sm btn-warning me-1"
                        onclick="activerEdition(${index}, '${type}')">✏️</button>
                <button id="btnDel_${type}_${index}"
                        class="btn btn-sm btn-danger d-none"
                        onclick="supprimerLigne('${type}',${index})">🗑️</button>
            </td>
        `;

        tbody.appendChild(tr);
    });

    // Met à jour le résumé après chaque affichage
    mettreAJourResume(type);
}

// Affichage initial
afficher("HC");
afficher("PN");

// =========================
// Ajout d'un produit
// =========================

function ajouter(type) {
    // Récupération des champs dynamiquement selon le type
    let nom = document.getElementById("produit" + type).value;
    let prix = document.getElementById("prix" + type).value;
    let duree = document.getElementById("duree" + type).value;
    let categorie = document.getElementById("categorie" + type).value;

    let obj = { nom, prix, duree, categorie };

    if (type === "HC") {
        HC.push(obj);
        localStorage.setItem("produits_HC", JSON.stringify(HC));
    } else {
        PN.push(obj);
        localStorage.setItem("produits_PN", JSON.stringify(PN));
    }

    afficher(type);
}

// Gestion des formulaires
document.getElementById("formHC").onsubmit = e => {
    e.preventDefault();
    ajouter("HC");
    e.target.reset();
};

document.getElementById("formPN").onsubmit = e => {
    e.preventDefault();
    ajouter("PN");
    e.target.reset();
};

// =========================
// Édition complète d'une ligne
// =========================

function activerEdition(index, type) {
    const data = (type === "HC") ? HC : PN;
    const p = data[index];

    const ligne = document.getElementById(`${type}-row-${index}`);
    if (!ligne) return;

    ligne.innerHTML = `
        <td><input type="text" id="edit-nom-${index}" value="${p.nom}" class="form-control form-control-sm" /></td>

        <td><input type="number" step="0.01"
                   id="edit-prix-${index}" value="${p.prix}" class="form-control form-control-sm" /></td>

        <td><input type="text" id="edit-duree-${index}" value="${p.duree}" class="form-control form-control-sm" /></td>

        <td>
            <select id="edit-categorie-${index}" class="form-select form-select-sm">
                <option value="Alimentation" ${p.categorie === "Alimentation" ? "selected" : ""}>Alimentation</option>
				<option value="Animaux" ${p.categorie === "Animaux" ? "selected" : ""}>Animaux</option>
				<option value="Beauté/Cosmétique" ${p.categorie === "Beauté/Cosmétique" ? "selected" : ""}>Beauté/Cosmétique</option>
				<option value="Bébé" ${p.categorie === "Bébé" ? "selected" : ""}>Bébé</option>
                <option value="Boisson" ${p.categorie === "Boisson" ? "selected" : ""}>Boisson</option>
               
			    <option value="Cuisine" ${p.categorie === "Cuisine" ? "selected" : ""}>Cuisine</option>
				<option value="Divers/Quotidien" ${p.categorie === "Divers/Quotidien" ? "selected" : ""}>Divers/Quotidien</option>
				<option value="Energie/carburant" ${p.categorie === "Energie/carburant" ? "selected" : ""}>Energie/carburant</option>
				<option value="Entretien/Nettoyage" ${p.categorie === "Entretien/Nettoyage" ? "selected" : ""}>Entretien/Nettoyage</option>
			    
				<option value="Frais/Surgelés" ${p.categorie === "Frais/Surgelés" ? "selected" : ""}>Frais/Surgelés</option>
                <option value="Fruits et légumes" ${p.categorie === "Fruits et légumes" ? "selected" : ""}>Fruits et légumes</option>
                <option value="Hygiène" ${p.categorie === "Hygiène" ? "selected" : ""}>Hygiène</option>
				<option value="Maison" ${p.categorie === "Maison" ? "selected" : ""}>Maison</option>
				
				<option value="Scolaire/Bureau" ${p.categorie === "Scolaire/Bureau" ? "selected" : ""}>Scolaire/Bureau</option>
				<option value="Santé/Parapharmacie" ${p.categorie === "Santé/Parapharmacie" ? "selected" : ""}>Santé/Parapharmacie</option>
				<option value="Sport" ${p.categorie === "Sport" ? "selected" : ""}>Sport</option>
				
				<option value="Téléphonie/Numérique courant" ${p.categorie === "Téléphonie/Numérique courant" ? "selected" : ""}>Téléphonie/Numérique courant</option>
				<option value="Transport & Energie" ${p.categorie === "Transport & Energie" ? "selected" : ""}>Transport & Energie</option>
				
				<option value="Vêtement enfant" ${p.categorie === "Vêtement enfant" ? "selected" : ""}>Vêtement enfant</option>
				<option value="Vêtement femme" ${p.categorie === "Vêtement femme" ? "selected" : ""}>Vêtement femme</option>
				<option value="Vêtement homme" ${p.categorie === "Vêtement homme" ? "selected" : ""}>Vêtement homme</option>
				
				<option value="Autre" ${p.categorie === "Autre" ? "selected" : ""}>Autre</option>
            </select>
        </td>

        <td>
            <button class="btn btn-sm btn-success me-1"
                    onclick="enregistrerEdition(${index}, '${type}')">💾</button>
            <button class="btn btn-sm btn-secondary"
                    onclick="annulerEdition('${type}')">❌</button>
        </td>
    `;
}

function enregistrerEdition(index, type) {
    const data = (type === "HC") ? HC : PN;

    data[index] = {
        nom: document.getElementById(`edit-nom-${index}`).value,
        prix: parseFloat(document.getElementById(`edit-prix-${index}`).value),
        duree: document.getElementById(`edit-duree-${index}`).value,
        categorie: document.getElementById(`edit-categorie-${index}`).value
    };

    if (type === "HC") {
        HC = data;
        localStorage.setItem("produits_HC", JSON.stringify(HC));
    } else {
        PN = data;
        localStorage.setItem("produits_PN", JSON.stringify(PN));
    }

    afficher(type);
}

function annulerEdition(type) {
    afficher(type);
}

// =========================
// Suppression d'une ligne
// =========================

function supprimerLigne(type, index) {
    if (!confirm("Supprimer ce produit ?")) return;

    if (type === "HC") {
        HC.splice(index, 1);
        localStorage.setItem("produits_HC", JSON.stringify(HC));
        afficher("HC");
    } else {
        PN.splice(index, 1);
        localStorage.setItem("produits_PN", JSON.stringify(PN));
        afficher("PN");
    }
}

// =========================
// Export Excel
// =========================

function exportExcel(type) {
    let data = (type === "HC") ? HC : PN;
    let ws = XLSX.utils.json_to_sheet(data);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Produits");
    XLSX.writeFile(wb, "produits_" + type + ".xlsx");
}

// =========================
// Import Excel
// =========================

function importExcel(event, type) {
    let file = event.target.files[0];
    let reader = new FileReader();

    reader.onload = function(e) {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, { type: "array" });
        let sheet = workbook.Sheets[workbook.SheetNames[0]];
        let json = XLSX.utils.sheet_to_json(sheet);

        if (type === "HC") {
            HC = json;
            localStorage.setItem("produits_HC", JSON.stringify(HC));
        } else {
            PN = json;
            localStorage.setItem("produits_PN", JSON.stringify(PN));
        }

        afficher(type);
    };

    reader.readAsArrayBuffer(file);
}

// =========================
// Résumé (total, moyenne…)
// =========================

// Formate un prix avec 2 décimales
function formatPrix(val) {
    let n = parseFloat(val || 0);
    return n.toFixed(2) + " €";
}

function mettreAJourResume(type) {
    let data = (type === "HC") ? HC : PN;
    let div = document.getElementById("resume" + type);

    if (!data.length) {
        div.innerHTML = "Résumé : aucun produit pour le moment.";
        return;
    }

    let total = 0;
    data.forEach(p => {
        total += parseFloat(p.prix || 0);
    });

    let nb = data.length;
    let moyenne = total / nb;

    div.innerHTML = `
        <strong>Résumé :</strong><br>
        - Nombre de produits : ${nb}<br>
        - Total des prix : ${total.toFixed(2)} €<br>
        - Prix moyen : ${moyenne.toFixed(2)} €
    `;
}

// Listener HC
document.getElementById("resumeHC").onclick = function() {
    let boutons = document.querySelectorAll('[id^="btnDel_HC_"]');
    boutons.forEach(btn => btn.classList.remove("d-none"));
};

// Listener PN
document.getElementById("resumePN").onclick = function() {
    let boutons = document.querySelectorAll('[id^="btnDel_PN_"]');
    boutons.forEach(btn => btn.classList.remove("d-none"));
};

// =========================
// Auto-tri par catégorie
// =========================

function regrouperParCategorie() {
    const tbody = document.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    rows.forEach(r => {
        if (r.classList.contains("category-header")) r.remove();
    });

    const produits = rows.filter(r => !r.classList.contains("category-header"));

    produits.sort((a, b) => {
        const catA = a.children[3].innerText.trim().toLowerCase();
        const catB = b.children[3].innerText.trim().toLowerCase();
        return catA.localeCompare(catB);
    });

    tbody.innerHTML = "";

    let categorieActuelle = "";

    produits.forEach(row => {
        const categorie = row.children[3].innerText.trim();

        if (categorie !== categorieActuelle) {
            categorieActuelle = categorie;

            const header = document.createElement("tr");
            header.classList.add("category-header");
            header.dataset.open = "false";

            const td = document.createElement("td");
            td.colSpan = row.children.length;
            td.innerHTML = `<span class="toggle">▼</span> ${categorie}`;

            header.appendChild(td);
            tbody.appendChild(header);
        }

        tbody.appendChild(row);
    });

    document.querySelectorAll(".category-header").forEach(header => {
        header.classList.add("closed");
        header.dataset.open = "false";

        let row = header.nextElementSibling;

        while (row && !row.classList.contains("category-header")) {
            row.style.display = "none";
            row = row.nextElementSibling;
        }
    });

    document.querySelectorAll(".category-header").forEach(header => {
        header.addEventListener("click", () => {
            const isOpen = header.dataset.open === "true";
            header.dataset.open = isOpen ? "false" : "true";
            header.classList.toggle("closed", !isOpen);

            let row = header.nextElementSibling;

            while (row && !row.classList.contains("category-header")) {
                row.style.display = isOpen ? "none" : "";
                row = row.nextElementSibling;
            }
        });
    });
}




