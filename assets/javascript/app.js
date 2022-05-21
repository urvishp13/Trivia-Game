// Create a questions, question's answer choices, question's answer storage
var storage = [
    {
        questionNumber: "question1",
        question: "What is the 2nd planet from the Sun?",
        answerChoices: [
            "Mars", "Venus", "Earth", "Mercury"
        ],
        answer: "Venus"
    },
    {
        questionNumber: "question2",
        question: "What is the 4th planet from the Sun?",
        answerChoices: [
            "Mars", "Venus", "Earth", "Mercury"
        ],
        answer: "Mars"
    }
];

// Grab the  location in the DOM to write this questionSet's content to
var questionsSection = document.getElementById("questions-section");
// write questions and question answer choices to DOM
storage.forEach(questionSet => {
    let oneQuestion = document.createElement("div");

    // Question
    let question = document.createElement("p");
    question.setAttribute("class", "question");
    let questionText = document.createTextNode(`${questionSet.question}`);
    question.appendChild(questionText);

    // Add question to questionsSection
    oneQuestion.appendChild(question);

    // Answer choices for this question
    let answerChoices = document.createElement("div");
    answerChoices.setAttribute("class", "question-answer-choices");

    questionSet.answerChoices.forEach(answerChoice => {
        // Section for one answer choice
        let oneAnswerChoice = document.createElement("div");

        // Create radio nutton for answer choice
        let oneAnswerChoiceRadio = document.createElement("input");
        oneAnswerChoiceRadio.setAttribute("type", "radio");
        oneAnswerChoiceRadio.setAttribute("id", `${questionSet.questionNumber}.${answerChoice}`);
        oneAnswerChoiceRadio.setAttribute("name", `${questionSet.question}`);
        oneAnswerChoiceRadio.setAttribute("value", `${answerChoice}`);

        // Add text to this radio button
        let oneAnswerChoiceLabel = document.createElement("label");
        oneAnswerChoiceLabel.setAttribute("for", `${questionSet.questionNumber}.${answerChoice}`);
        let labelText = document.createTextNode(`${answerChoice}`);
        oneAnswerChoiceLabel.appendChild(labelText);

        // Append all data for this answer choice to oneAnswerChoice section
        oneAnswerChoice.appendChild(oneAnswerChoiceRadio);
        oneAnswerChoice.appendChild(oneAnswerChoiceLabel);

        // Add this answer choice to the entire answerCHoicesSection for his question
        answerChoices.appendChild(oneAnswerChoice);
        //console.log("appenddd: " + `${answerChoice}`);
    });

    // Add all the answer choices for the quesetion to the DOM
    oneQuestion.appendChild(answerChoices);

    // Add the one question to the entire questionsSection
    questionsSection.appendChild(oneQuestion);
});

//console.log($('.question-answer-choices'));

function results() {
    
    writeResults();
    
    function getSubmittedAnswers() {
        let answersSubmitted = [];
        let answerChoicesSets = Object.values($('.question-answer-choices'));
        console.log(answerChoicesSets);
        for (let i = 0; i < answerChoicesSets.length; i++) {
            var answerChoicesSet = answerChoicesSets[i];
            
            // If went through all the answer choice sets
            if (answerChoicesSet == storage.length) {
                //console.log(answersSubmitted);
                 return answersSubmitted;
            }
            
            // If question unanswered
            if ($(answerChoicesSet).find('input[type="radio"]:checked').length != 1) {
                answersSubmitted.push(null);
            }
            else {
                answersSubmitted.push($(answerChoicesSet).find('input[type="radio"]:checked').val());
            }
        }
    
    }
    
    // generator function
    function* getResults(userSubmittedAnswers) {
        // Figure out which questions are right, wrong, and unanswered and overall score, and write them to DOM
        var correctAnswers = storage.map(questionSet => questionSet.answer);
        var userCorrect = 0;
        var userWrong = 0;
        var userUnanswered = 0;
        for (let i = 0; i < storage.length; i++) {
            if (userSubmittedAnswers[i] == null) { // if this question is unanswered
                userUnanswered++;
            }
            else {
                if (userSubmittedAnswers[i] == correctAnswers[i]) { // if this answer is correct
                    userCorrect++;
                }
                else {
                    userWrong++;
                }
            }
        }
    
        yield userCorrect;
        yield userWrong;
        return userUnanswered;
    }
    
    // Write results to DOM
    function writeResults() {
        var userSubmittedAnswers = getSubmittedAnswers();
        const iterator = getResults(userSubmittedAnswers);
        var userCorrect = iterator.next().value;
        var userWrong = iterator.next().value;
        var userUnanswered = iterator.next().value;
    
        document.getElementById("display").innerHTML = `
            <p>Correct:     ${userCorrect}</p>
            <p>Wrong:       ${userWrong}</p>
            <p>Unasnwered:  ${userUnanswered}</p>
        `;
    }
    
}

var display = document.getElementById("display");

// Add a 120s timer
window.onload = function () {
    var currentTime = 2 * 60;
    startTimer(currentTime);
};

function startTimer(currentTime) { // currentTime is in s
    
    currentTime--; // reduce the time by 1s to account for the 1s delay from written "2:00min" to 1:59min

    setInterval(function () {
        var min = parseInt(currentTime / 60);
        var sec = parseInt(currentTime % 60);

        sec = sec < 10 ? "0" + sec : sec;
        document.getElementById('timer').textContent = min + ":" + sec;

        // If time runs out
        if (--currentTime == 0) {
            // Show results
            results();
            display.innerHTML = "<h1>Times Up</h1>" + display.innerHTML;
        }

    }, 1000);
    
}


// When Trivia submitted or timer runs out
$('#submit').on('click', () => {
    results();
    display.innerHTML = "<h1>All Done!</h1>" + display.innerHTML;
});