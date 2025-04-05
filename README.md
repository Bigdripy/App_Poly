Dans le backend il manque des informations dans le fichier credentials.json. Il manque également dans le fichier googleSheetsService.jsconst l'identifiant de la page sheet, donc sur la ligne :
SHEET_ID = "sheet id"; // remplacer sheet id par le bon id*

Pour obtenir un fichier credentials.json pour accéder à une Google Sheet via une API, tu dois passer par Google Cloud Console. Voici un guide simple étape par étape 👇
✅ Étapes pour générer credentials.json :
1. Créer un projet Google Cloud

    Va sur : https://console.cloud.google.com

    Clique sur "Select a project" > "New Project"

    Donne un nom à ton projet (ex: sheet-api-project) et crée-le

2. Activer l'API Google Sheets

    Une fois le projet sélectionné, va ici :
    👉 https://console.cloud.google.com/apis/library/sheets.googleapis.com

    Clique sur "Activer"

3. Créer des identifiants (credentials)

    Va sur : https://console.cloud.google.com/apis/credentials

    Clique sur "Créer des identifiants" > "Compte de service"

    Donne-lui un nom (ex: sheet-service-account)

    Clique sur "Créer", puis "Continuer", puis "Terminé"

4. Générer le fichier credentials.json

    Dans la page des comptes de service, clique sur celui que tu viens de créer

    Va dans l’onglet "Clés"

    Clique sur "Ajouter une clé" > "Créer une clé"

        Choisis JSON

        Télécharge le fichier — c’est ton credentials.json

5. Partager ta Google Sheet avec le compte de service

Dans le fichier JSON, tu verras une ligne comme ça :

"client_email": "your-service-account@your-project.iam.gserviceaccount.com"

📧 Copie cette adresse email et partage ta Google Sheet avec ce mail (comme si tu ajoutais un collaborateur en lecture/écriture).

Pour lancer le backend (serveur)  : node server.mjs
Pour lancer le frontend : npm run dev
