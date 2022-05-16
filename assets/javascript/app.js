// Create a questions, question's answer choices, question's answer storage
var storage = [
    {
        question: "What is the 2nd planet from the Sun?",
        answerChoices: [
            "Mars", "Venus", "Earth", "Mecury"
        ],
        answer: "Venus"
    }
];

// Grab the  location in the DOM to write this questionSet's content to
var questionsSection = document.getElementById("questions-section");
// write questions and question answer choices to DOM
storage.forEach(questionSet => {
    let oneQuestionSection = document.createElement("div");

    // Question
    let question = document.createElement("p");
    let questionText = document.createTextNode(`${questionSet.question}`);
    question.appendChild(questionText);

    // Add question to questionsSection
    oneQuestionSection.appendChild(question);

    // Answer choices for this question
    let answerChoicesSection = document.createElement("div");
    questionSet.answerChoices.forEach(answerChoice => {
        // Section for one answer choice
        let oneAnswerChoiceSection = document.createElement("div");

        // Create radio nutton for answer choice
        let oneAnswerChoiceRadio = document.createElement("input");
        oneAnswerChoiceRadio.setAttribute("type", "radio");
        oneAnswerChoiceRadio.setAttribute("id", `${answerChoice}`);
        oneAnswerChoiceRadio.setAttribute("name", `${questionSet.question}`);
        oneAnswerChoiceRadio.setAttribute("value", `${answerChoice}`);

        // Add text to this radio button
        let oneAnswerChoiceLabel = document.createElement("label");
        oneAnswerChoiceLabel.setAttribute("for", `${answerChoice}`);
        let labelText = document.createTextNode(`${answerChoice}`);
        oneAnswerChoiceLabel.appendChild(labelText);

        // Append all data for this answer choice to oneAnswerChoice section
        oneAnswerChoiceSection.appendChild(oneAnswerChoiceRadio);
        oneAnswerChoiceSection.appendChild(oneAnswerChoiceLabel);

        // Add this answer choice to the entire answerCHoicesSection for his question
        answerChoicesSection.appendChild(oneAnswerChoiceSection);
        //console.log("appenddd: " + `${answerChoice}`);
    });

    // Add all the answer choices for the quesetion to the DOM
    oneQuestionSection.appendChild(answerChoicesSection);

    // Add the one question to the entire questionsSection
    questionsSection.appendChild(oneQuestionSection);
});

// When Trivia submitted
    // Figure out which questions are right, wrong, and unanswered and overall score