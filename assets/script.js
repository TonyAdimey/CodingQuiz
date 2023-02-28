var startBtn = document.querySelector('#start-button');
var timerEl = document.querySelector('#timer');
var mainEl = document.querySelector('#main');
var homeLi = document.querySelector('#home');
var highscoreLi = document.querySelector('#highscore');

const affirmations = [
  "Great job!", 
  "Well done!", 
  "Amazing!", 
  "Keep it up!", 
  "Nice work!", 
  "You're killing it!", 
  "Fantastic!", 
  "Awesome!"
];

const questions = [
  {
    question: "What does HTML stand for?",
    answers: ["Hypertext Markup Language", "Hypertext Missing Language", "How To Make Lemonade", "Hypertea Markup Language"],
    correctAnswer: "Hypertext Markup Language",
  },
  {
    question: "What does CSS stand for?",
    answers: ["Central Style Sheets", "Cascading Simple Sheets", "Cascading Style Sheets", "Carl Smells Chipotle"],
    correctAnswer: "Cascading Style Sheets"
  },
  {
    question: "What does # identify as?",
    answers: ["Class", "ID", "Number", "Hashtag"],
    correctAnswer: "ID",
  },
  {
    question: "What does . identify as?",
    answers: ["Period", "Dot", "Class", "Comma"],
    correctAnswer: "Class",
  },
  {
    question: "Inside which HTML element do we put the JavaScript?",
    answers: ["<script>", "<javascript>", "<js>", "<scripting>"],
    correctAnswer: "<script>",
  },
];

let quizQuestions;
let quizAnswers;

function init() {
  renderHome();
}

homeLi.addEventListener("click", renderHome);
highscoreLi.addEventListener("click", renderScoreBoard);

function initializeTimer() {
  secondsLeft = 75;
  if (!timerInterval) {
    timerInterval = setInterval(function () {
      secondsLeft--;
      timerEl.textContent = secondsLeft;
      if (secondsLeft <= 0) {
        endQuiz();
      }
    }, 1000);
  }
}

function stopTime() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  secondsLeft = 0;
  timerEl.textContent = secondsLeft;
}

function renderHome() {
  resetQuiz();
  if (timerInterval) {
    stopTime();
  }

  mainEl.textContent = '';
  renderTitle("Coding Quiz Challenge");

  let par = document.createElement('p');
  par.textContent = "Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your score/time by ten seconds.";

  let startButton = document.createElement("button");
    startButton.textContent = "Start Quiz";
    startButton.setAttribute("id", "start-button");
    startButton.addEventListener("click", startQuiz);

    mainEl.appendChild(par);
    mainEl.appendChild(categoryDiv);
    mainEl.appendChild(startButton);
}

function renderScoreBoard() {
    mainEl.textContent = '';
    resetQuiz();

    if(timerInterval) {
        stopTime();
    }

    let scoreboard = JSON.parse(localStorage.getItem("scoreboard"));

    renderTitle("Leaderboard")

    if(!scoreboard) {
        let par = document.createElement("p");
        par.textContent = "It looks like there are no high scores yet."
        mainEl.appendChild(par);

        let button = document.createElement("button");
        button.textContent = "Back to Home";
        button.addEventListener("click", renderHome);
        mainEl.appendChild(button)

        return
    }


    let playerUl = document.createElement("ul");
    playerUl.classList.add("scoreboard-list");

    for (let i = 0; i < scoreboard.length; i++) {
        let playerLi = document.createElement("li");
        playerLi.classList.add("scoreboard-item");
        playerLi.textContent = `${scoreboard[i].name} -- ${scoreboard[i].score}`;
        playerUl.appendChild(playerLi);
    }

    let homeButton = document.createElement("button");
    homeButton.textContent = "Back to Home";
    homeButton.addEventListener("click", renderHome);

    let resetButton = document.createElement("button");
    resetButton.textContent = "Reset Highscores"
    resetButton.addEventListener("click", function() {
        localStorage.clear();
        renderScoreboard();
    });

    mainEl.appendChild(playerUl);
    mainEl.appendChild(homeButton);
    mainEl.appendChild(resetButton);
}

function addHighScore() {
    let scoreboard = JSON.parse(localStorage.getItem("scoreboard"));
    if (scoreboard == null) {
        scoreboard = [];
    }

    let playerName = document.getElementById("initials-input").ariaValueMax.toUpperCase();
    let playerScore = secondsLeft;

    let player = {
        "name": playerName,
        "score": playerScore
    };

    scoreboard.push(player);
    scoreboard.sort((a, b) => b.score - a.score);
    localStorage.setItem("scoreboard", JSON.stringify(scoreboard));
}

function startQuiz() {
    setQuiz();
    mainEl.textContent = '';
    initializeTimer();
    renderQuestion();
}

function resetQuiz() {
    quizQuestions = null;
    quizAnswers = null;
    resetTimer();
}

function endQuiz() {
    if (secondsLeft < 0) {
        secondsLeft = 0;
        timerEl.textContent = secondsLeft;
    }
    stopTime();

    let pageTitle = document.createElement("h1");
    pageTitle.textContent = "Quiz Over";

    let quizResults = document.createElement("p");
    quizResults.textContent = `You scored ${secondsLeft} points. ${affirmations[randomNumber(affirmations.length)]}`;

    let initialsPrompt = document.createElement("p");
    initialsPrompt.textContent = "Please enter your initials:"
    initialsPrompt.classList.add("enter-initials")

    let initialsInput = document.createElement("input");
    initialsInput.classList.add("initials-inputs");
    initialsInput.setAttribute("id", "initials-input");
    initialsInput.maxLength = 3;
    initialsInput.size = 4;

    let highscoreButton = document.createElement("button");
    highscoreButton.textContent = "Go to Highscores";

    highscoreButton.addEventListener("click", function() {
        if (initialsInput.value) {
            addHighScore();
            resetQuiz();
            renderScoreboard();
        }
    })
    mainEl.textContent = '';
    mainEl.appendChild(pageTitle);
    mainEl.appendChild(quizResults);
    mainEl.appendChild(initialsPrompt);
    mainEl.appendChild(initialsInput);
    mainEl.appendChild(highscoreButton);
}

function renderQuestion() {
    if (quizQuestions.length === 0) {
        return endQuiz();
    }

    mainEl.textContent = '';

    let card = document.createElement("div");
    card.classList.add("card");

    let icon = document.createElement("i");
    icon.classList.add("fas");
    icon.classList.add("fa-question-circle");
    icon.classList.add("fa-4x");
    card.appendChild(icon);

    randomNum = randomNumber(quizQuestions.length);
    card.appendChild(renderQuestionTitle(quizQuestions[randomNum]));

    let listOptions = document.createElement("ol");

    for (let i = 0; i < quizAnswers[randomNum].length; i++) {
        listOptions.appendChild(createAnswerChoice(randomNum, i));
    }

    card.appendChild(listOptions);

    mainEl.appendChild(card);
}

function createAnswerChoice(randomNum, index) {
    let answer = document.createElement("li");

    answer.classList.add("answer-choice");
    answer.addEventListener("click", checkAnswer);
    answer.textContent = quizAnswers[randomNum][index][0];
    answer.dataset.answer = quizAnswers[randomNum][index][1];

    return answer;
}

class checkAnswer {
    constructor() {
        if (this.dataset.answer === 'true') {
            this.classList.add('correct');

            quizQuestions.splice(randomNum, 1);
            quizAnswers.splice(randomNum, 1);

            setTimeout(renderQuestion, 500);
        } else {
            if (!this.textContent.endsWith("Wrong")) {
                this.textContent = `${thistextContent} Wrong`;
                secondsLeft -= 15;
            }
        }
    }
}

function randomNumber(max) {
    return Math.floor(Math.random() * max);
}

function renderTitle(titleContent) {
    let title = document.createElement('h1');
    title.textContent = titleContent;
    title.classList.add('page-title');

    mainEl.appendChild(title);
}

function renderQuestionTitle(titleContent) {
    let title = document.createElement('h2');
    title.textContent = titleContent;
    title.classList.add('question-title');

    return title;
}

init();
