const readline = require('readline');
const axios = require('axios');

// Configuration de readline pour interagir avec l'utilisateur
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Liste des questions
const questions = [
  { question: "Comment décririez-vous votre niveau de satisfaction actuel dans la vie ?", options: ["Très satisfait(e)", "Plutôt satisfait(e)", "Neutre", "Plutôt insatisfait(e)", "Très insatisfait(e)"], name: "satisfaction" },
  { question: "Quel domaine de votre vie souhaiteriez-vous améliorer en priorité ?", options: ["Carrière", "Relations", "Santé", "Développement personnel", "Équilibre pro/perso"], name: "priority" },
  { question: "Quel est votre plus grand défi actuel ?", options: ["Gérer mon temps", "Surmonter mes peurs", "Atteindre mes objectifs", "Améliorer mes relations", "Trouver un sens"], name: "challenge" },
  { question: "Comment gérez-vous les obstacles ?", options: ["Je les évite", "Je me décourage", "J'apprends de mes erreurs", "Je demande de l’aide", "Je les vois comme une opportunité"], name: "obstacles" },
  { question: "Quel est votre niveau d’énergie au quotidien ?", options: ["Élevé", "Moyen", "Faible", "Variable", "Je me sens perdu(e)"], name: "energy" },
];

// Objet pour stocker les réponses
const responses = {};

// Fonction pour poser les questions
function askQuestion(index) {
  if (index >= questions.length) {
    rl.close();
    console.log("Merci pour vos réponses !");
    console.log("Réponses collectées :", responses);

    // Envoyer les réponses au serveur
    sendResponsesToServer(responses);
    return;
  }

  const q = questions[index];
  console.log(`\nQuestion ${index + 1}: ${q.question}`);
  q.options.forEach((option, i) => {
    console.log(`${i + 1}. ${option}`);
  });

  rl.question('Votre réponse (1-5) : ', (answer) => {
    const choice = parseInt(answer) - 1;
    if (choice >= 0 && choice < q.options.length) {
      responses[q.name] = q.options[choice];
      askQuestion(index + 1); // Passer à la question suivante
    } else {
      console.log("Choix invalide. Veuillez entrer un nombre entre 1 et 5.");
      askQuestion(index); // Revenir à la même question
    }
  });
}


// Démarrer le questionnaire
askQuestion(0);