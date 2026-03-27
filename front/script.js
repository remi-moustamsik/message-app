function fact(n) {
    if (n < 0) return "Erreur : n doit être positif";
    let resultat = 1;
    for (let i = 2; i <= n; i++) {
        resultat *= i;
    }
    return resultat;
}

function applique(f, tab) {
    const resultat = [];
    for (let i = 0; i < tab.length; i++) {
        resultat.push(f(tab[i]));
    }
    return resultat;
}

// ── URL du micro-service ─────────────────────────────────
var serverURL = "https://message-app-c86q.onrender.com";

let msgs = [
    { pseudo: "Admin", msg: "Bienvenue sur le chat !", date: new Date().toLocaleString() },
    { pseudo: "CatLover", msg: "I love cats", date: new Date().toLocaleString() }
];

function update(tableauMessages) {
    const messagesList = document.getElementById('messages-list');
    messagesList.innerHTML = '';
    tableauMessages.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <small style="color: #888;">[${item.date}]</small> 
            <strong>${item.pseudo}</strong> : 
            <span>${item.msg}</span>
        `;
        messagesList.appendChild(li);
    });
}

// ── Charge les messages depuis le micro-service ──────────
function chargerMessages() {
    fetch(serverURL + '/msg/getAll')
        .then(function(response) {
            return response.json();
        })
        .then(function(messages) {
            // On convertit le format du serveur vers le format local {pseudo, msg, date}
            msgs = messages.map(function(m) {
                // Si le message a été posté avec le format "[pseudo] msg | date"
                // on essaie de le parser, sinon on met des valeurs par défaut
                try {
                    var parsed = JSON.parse(m);
                    return parsed;
                } catch (e) {
                    return { pseudo: "?", msg: m, date: "" };
                }
            });
            update(msgs);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('send-btn');
    const updateBtn = document.getElementById('update-btn');
    const themeBtn = document.getElementById('theme-btn');
    const messageInput = document.getElementById('message-input');
    const messagesList = document.getElementById('messages-list');
    const pseudoInput = document.getElementById('pseudo-input');

    // ── Chargement initial depuis le serveur ─────────────
    chargerMessages();

    sendBtn.addEventListener('click', () => {
        const text = messageInput.value.trim();
        const pseudo = pseudoInput.value.trim() || "Anonyme";
        if (text) {
            const newMsg = {
                pseudo: pseudo,
                msg: text,
                date: new Date().toLocaleString()
            };
            msgs.push(newMsg);
            messageInput.value = '';

            // ── Envoi au micro-service ───────────────────
            var texteServeur = encodeURIComponent(JSON.stringify(newMsg));
            fetch(serverURL + '/msg/post/' + texteServeur)
                .then(function(response) { return response.json(); })
                .then(function(data) {
                    if (data.code === 1) {
                        chargerMessages(); // rafraîchit depuis le serveur
                    }
                });

            update(msgs);
        }
    });

    // Bouton Mise à jour
    updateBtn.addEventListener('click', () => {
        chargerMessages();
    });

    // Changement de thème
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
});

// ── Bouton "Connecter" pour changer d'URL ──────────
var btnConnect = document.getElementById('btn-connect');
if (btnConnect) {
    btnConnect.addEventListener('click', function() {
        serverURL = document.getElementById('server-url').value.trim();
        chargerMessages();
    });
}