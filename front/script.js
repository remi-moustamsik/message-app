var serverURL = "https://message-app-1-jbnw.onrender.com";

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

// ── Charge les messages depuis le serveur ────────────────────────
function chargerMessages() {
    fetch(serverURL + '/msg/getAll')
        .then(function(response) {
            return response.json();
        })
        .then(function(messages) {
            msgs = messages.map(function(m) {
                try {
                    return JSON.parse(m);
                } catch(e) {
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

    // Chargement initial depuis le serveur
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

            // ── Envoi au serveur ─────────────────────────────────
            var texteServeur = encodeURIComponent(JSON.stringify(newMsg));
            fetch(serverURL + '/msg/post/' + texteServeur)
                .then(function(response) { return response.json(); })
                .then(function(data) {
                    if (data.code === 1) {
                        chargerMessages(); // rafraîchit depuis le serveur
                    }
                });

            messageInput.value = '';
        }
    });

    updateBtn.addEventListener('click', () => {
        chargerMessages();
    });

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
});

// ── Bouton Connecter (modularité 3.4) ────────────────────────────
var btnConnect = document.getElementById('btn-connect');
if (btnConnect) {
    btnConnect.addEventListener('click', function() {
        serverURL = document.getElementById('server-url').value.trim();
        chargerMessages();
    });
}