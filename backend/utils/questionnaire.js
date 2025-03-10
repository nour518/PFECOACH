const readline = require('readline');
const axios = require('axios');

// Configuration de readline pour interagir avec l'utilisateur
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Liste des questions
const questions = [
  { category: "Clarification de la Situation", questions: [
    { question: "Qu'est-ce qui vous apporte aujourd'hui ?", name: "current_concern" },
    { question: "Où êtes-vous actuellement ?", name: "current_location" },
    { question: "Comment décririez-vous votre situation en ce moment ?", name: "current_situation" },
    { question: "Qu'est-ce qui fonctionne bien dans votre vie actuellement ?", name: "positive_aspects" },
    { question: "Qu'est-ce qui ne fonctionne pas comme vous le souhaitez ?", name: "negative_aspects" },
    { question: "Quelles sont les trois choses que vous aimez vraiment dans votre vie ?", name: "three_likes" },
    { question: "Que ressentez-vous quand vous pensez à cette situation ?", name: "feelings_about_situation" },
    { question: "Qu'est-ce qui vous manque aujourd'hui pour vous sentir épanoui ?", name: "missing_elements" },
    { question: "Sur quoi vous basez-vous pour dire cela ?", name: "basis_for_assessment" },
    { question: "Quelle est votre plus grande préoccupation actuellement ?", name: "biggest_concern" }
  ]}
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