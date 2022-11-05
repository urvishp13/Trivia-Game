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
    },
    {
        question: "What is the 5th planet from the Sun?",
        answerChoices: [
            "Jupiter", "Mercury", "Mars", "Uranus"
        ],
        answer: "Jupiter"
    },
    {
        question: "What is the 7th planet from the Sun?",
        answerChoices: [
            "Jupiter", "Uranus", "Saturn", "Mars"
        ],
        answer: "Saturn"
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

        let $oneQuestion = $("<div>")
            .attr("class","one-question");

        // Question
        let $question = $("<p>")
            .attr("class", "question")
            .text(`${questionSet.question}`);

        // Answer choices for this question
        let $answerChoices = $("<div>")
            .attr("class", "question-answer-choices");

        questionSet.answerChoices.forEach(answerChoice => {
            // Section for one answer choice
            let $oneAnswerChoice = $("<div>")

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

        // Append the question related content to $oneQuestion
        $oneQuestion.append($question);
        $oneQuestion.append($answerChoices);

        //console.log("answer choices in a set:");
        //console.log($("div.question-answer-choices")); // used to see if construnct of the answer choices set's HTMLis right
        
        // Append $oneQuestion to $questionsSection
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
        //console.log("got answer choices");
        let answersSubmitted = [];
        let answerChoicesSets = Object.values($('.question-answer-choices'));
        //console.log(answerChoicesSets);
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
    
        $content.html(`
            <p>Correct:     ${userCorrect}</p>
            <p>Wrong:       ${userWrong}</p>
            <p>Unasnwered:  ${userUnanswered}</p>
        `);
    }
    
}

var intervalID; // used to stop the timer

function startTimer(currentTime) { // currentTime is in s

    currentTime--;

    intervalID = setInterval(function () {
        var min = parseInt(currentTime / 60);
        var sec = parseInt(currentTime % 60);

        sec = sec < 10 ? "0" + sec : sec;
        $('#timer').text(min + ":" + sec);

        // If time runs out
        if (currentTime-- == 0) {
            // Show results
            results();
            $content.prepend(`
                <h2 id="status">Times Up</h1>
            `);
        }

    }, 1000);
    
}

var $content = $('body #display #content');
var $display = $('body #display');

$(document).ready(function () {
    $display.css({ // set the initial positioning of the display
        /* doing this simply to perfectly center the start button */
        "position":"absolute",
        "top":"50%",
        "left":"50%",
        "transform":"translate(-50%,-50%)"
    });
    $content
        .html('<button id="start">Start</button>') // #content's content is dynamically changing so to be consistent, thought it
                                                   // better to do it this way
        .css({ // give the #content height so Start button can be centered
            "min-height":`${$display.height() - $content.position().top}px`
        });
    $('#start').css({ // position the start button in the middle of the #display
        "position":"absolute", /* relative to #display */
        "top":"50%",
        "left":"50%",
        "transform":"translate(-50%,-50%)",

        "width":"50%",
        "border":"none",
        "font-size":"1em",
        "padding":"5px",
        "background":"#D6CDF1",
        "color":"#161032",
        "margin-bottom":"5px"
    });
});

//console.log("on load: " + $('#display').position().top);



// When Trivia started - need to use event delegation since #submit is added dynamically
$content.on('click', '#start', function () {
    // Set the HTML for the new content
    //console.log("after clicking start: " + $('#display').position().left);
    $display.css({ // get the position of the display and replace its percentage dimensions with concrete numbers to 
                   //   fix its positioning
        /* undo translation due to absolute positioning */
        "position":"", 
        "top":"",
        "left":"",
        "transform":"",

        "margin":"0 auto",
        "display": "flow-root" /* to get rid of the collapsing margin */
        
    });
    //console.log("after applying css to display: " + $('#display').position().top);
    $content.html(`
        <p>Time Remaining: <span id="timer">2:00</span></p>
        <div id="questions-section"></div>
        <button id="submit">Done</button>
    `);

    // Write the questions to the page
    $.ajax({
        url: "index.html"
    }).then(function() {
        // Add a 120s timer
        startTimer(2*60);
        // Write questions to page
        writeQuestions(storage);
        $('#submit').css({
            "width":"50%",
            "border":"none",
            "font-size":"1em",
            "padding":"5px",
            "background":"#D6CDF1",
            "color":"#161032",
            "margin-bottom":"5px"
        });
    });
});

// Need to use event delegation since #submit is added dynamically
$content.on('click', '#submit', function() {
    //console.log("event working");
    // Display results
    $.ajax({
        url: "index.html"
    }).then(function() {
        clearInterval(intervalID); // stop the timer
        results();
        $content.prepend(`
            <h2 id="status">All Done!</h1>
        `);
    });
});