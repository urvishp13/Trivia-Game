// Add a 120s timer
window.onload = function () {
    var currentTime = 2 * 60;
    startTimer(currentTime);
};

// Create a questions, question's answer choices, question's answer storage
var storage = [
    {
        question: "What is the 2nd planet from the Sun?",
        answerChoices: [
            "Mars", "Venus", "Earth", "Mercury"
        ],
        answer: "Venus"
    },
    {
        question: "What is the 4th planet from the Sun?",
        answerChoices: [
            "Mars", "Venus", "Earth", "Mercury"
        ],
        answer: "Mars"
    },
    {
        question: "What is the 3rd planet from the Sun?",
        answerChoices: [
            "Mars", "Venus", "Earth", "Mercury"
        ],
        answer: "Earth"
    }
];

//console.log("after event: " + (new Date).getTime());
//console.log(storage);

function writeQuestions(storage) {

    // Grab the  location in the DOM to write this questionSet's content to
    var $questionsSection = $("body #display #questions-section");

    var questionNumber = 0;
    // write questions and question answer choices to DOM
    storage.forEach(questionSet => {
        questionNumber++;

        let $oneQuestion = $("<div>");

        // Question
        let $question = $("<p>")
            .attr("class", "question")
            .text(`${questionSet.question}`);

        // Answer choices for this question
        let $answerChoices = $("<div>")
            .attr("class", "question-answer-choices");

        questionSet.answerChoices.forEach(answerChoice => {
            // Section for one answer choice
            let $oneAnswerChoice = $("<div>");

            // Create radio nutton for answer choice
            let $oneAnswerChoiceRadio = $("<input>")
                .attr("type", "radio")
                .attr("id", `question:${questionNumber} - ${answerChoice}`)
                .attr("name", `${questionSet.question}`)
                .attr("value", `${answerChoice}`);

            // Add text to this radio button
            let $oneAnswerChoiceLabel = $("<label>")
                .attr("for", `question:${questionNumber} - ${answerChoice}`)
                .text(`${answerChoice}`);
            
            // Append this answer choice's content
            $oneAnswerChoice.append($oneAnswerChoiceRadio);
            $oneAnswerChoice.append($oneAnswerChoiceLabel);

            // Append this answer choice to the $answerChoices div
            $answerChoices.append($oneAnswerChoice);

            //console.log("answer choice:");
            //console.log($("div.question-answer-choices div")); // used to see if construnt of answer choice's HTML is right

        });

        // Append the answer choices to $question
        $question.append($answerChoices);
        $oneQuestion.append($question);

        //console.log("answer choices in a set:");
        //console.log($("div.question-answer-choices")); // used to see if construnct of the answer choices set's HTMLis right
        
        // Append question's content to $questionsSection
        $questionsSection.append($oneQuestion);
    });

    //console.log("answer choices:");
    //console.log($("div.question-answer-choices"));

    //console.log("questions section");
    //console.log($("body#questions-page #questions-section"));

}

//console.log($('.question-answer-choices'));

function results() {
    
    writeResults();
    
    function getSubmittedAnswers() {
        console.log("got answer choices");
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
    
        display.html(`
            <p>Correct:     ${userCorrect}</p>
            <p>Wrong:       ${userWrong}</p>
            <p>Unasnwered:  ${userUnanswered}</p>
        `);
    }
    
}

var intervalID; // used to stop the timer

function startTimer(currentTime) { // currentTime is in s

    intervalID = setInterval(function () {
        var min = parseInt(currentTime / 60);
        var sec = parseInt(currentTime % 60);

        sec = sec < 10 ? "0" + sec : sec;
        $('#timer').text(min + ":" + sec);

        // If time runs out
        if (--currentTime == 0) {
            // Show results
            results();
            display.prepend('<h1 id="status">Times Up</h1>');
        }

    }, 1000);
    
}

var display = $('body #display');

// When Trivia started
$(display).on('click', '#start', function () {
    // Set the HTML for the new content
    display.html(`
        <h1 id="heading">Trivia Game</h1>
        <p id="timer">2:00</p>
        <div id="questions-section"></div>
        <button id="submit">Done</button>
    `);

    // Write the questions to the page
    $.ajax({
        url: "index.html"
    }).then(function() {
        writeQuestions(storage);
    });
});

// Need to use event delegation since #submit is added dynamically
$(display).on('click', '#submit', function() {
    //console.log("event working");
    // Display results
    $.ajax({
        url: "index.html"
    }).then(function() {
        clearInterval(intervalID); // stop the timer
        results();
        display.prepend('<h1 id="status">All Done!</h1>');
    });
});