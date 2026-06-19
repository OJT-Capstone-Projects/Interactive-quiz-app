/* ============================================================
   QUIZ APP – FULL SCREEN | STATE MANAGEMENT + TIMER + THEME
   ============================================================ */

'use strict';

// ============================================================
// STATE
// ============================================================
let userName             = '';
let selectedSubject      = '';
let currentQuestionIndex = 0;
let score                = 0;
let selectedAnswer       = null;
let quizCompleted        = false;
let timer                = null;
let timeLeft             = 15;
let isDarkMode           = false;

const TIME_PER_QUESTION  = 15;

// ============================================================
// QUIZ DATA  (3 subjects × 10 questions)
// ============================================================
const quizData = {
  javascript: [
    {
      question: "What is JavaScript primarily used for?",
      options: ["Styling web pages", "Database management", "Adding interactivity to web pages", "Server hardware setup"],
      answer: "Adding interactivity to web pages"
    },
    {
      question: "Which keyword declares a variable that cannot be reassigned?",
      options: ["var", "let", "const", "static"],
      answer: "const"
    },
    {
      question: "What does the '===' operator check?",
      options: ["Value only", "Type only", "Value and type", "Neither"],
      answer: "Value and type"
    },
    {
      question: "Which method adds an element to the END of an array?",
      options: ["push()", "pop()", "shift()", "unshift()"],
      answer: "push()"
    },
    {
      question: "What is the output of: typeof null?",
      options: ["null", "undefined", "object", "string"],
      answer: "object"
    },
    {
      question: "Which function prints output to the browser console?",
      options: ["print()", "echo()", "console.log()", "document.write()"],
      answer: "console.log()"
    },
    {
      question: "What does DOM stand for?",
      options: ["Document Object Model", "Data Object Module", "Document Order Map", "Dynamic Output Mode"],
      answer: "Document Object Model"
    },
    {
      question: "Which is NOT a JavaScript primitive data type?",
      options: ["String", "Boolean", "Float", "Undefined"],
      answer: "Float"
    },
    {
      question: "What is the correct syntax for an arrow function?",
      options: ["function() =>", "const fn = () => {}", "fn => function()", "arrow fn() {}"],
      answer: "const fn = () => {}"
    },
    {
      question: "What does 'NaN === NaN' return?",
      options: ["true", "false", "undefined", "error"],
      answer: "false"
    }
  ],

  html: [
    {
      question: "What does HTML stand for?",
      options: ["HyperText Markup Language", "High Tech Modern Language", "HyperText Modeling Language", "Home Tool Markup Language"],
      answer: "HyperText Markup Language"
    },
    {
      question: "Which tag creates a hyperlink?",
      options: ["<link>", "<a>", "<href>", "<url>"],
      answer: "<a>"
    },
    {
      question: "Which HTML tag creates the LARGEST heading?",
      options: ["<h6>", "<heading>", "<h1>", "<head>"],
      answer: "<h1>"
    },
    {
      question: "Which attribute specifies the URL of a hyperlink?",
      options: ["src", "link", "href", "url"],
      answer: "href"
    },
    {
      question: "Which tag embeds an image in HTML?",
      options: ["<image>", "<pic>", "<img>", "<src>"],
      answer: "<img>"
    },
    {
      question: "What tag wraps the main visible content of a page?",
      options: ["<main>", "<section>", "<body>", "<content>"],
      answer: "<body>"
    },
    {
      question: "Which creates a checkbox input?",
      options: ['<input type="check">', '<input type="checkbox">', '<checkbox>', '<check>'],
      answer: '<input type="checkbox">'
    },
    {
      question: "Which tag creates an unordered list?",
      options: ["<ol>", "<li>", "<ul>", "<list>"],
      answer: "<ul>"
    },
    {
      question: "What does the 'alt' attribute in <img> provide?",
      options: ["Image title", "Alternative text for the image", "Image link", "Image style"],
      answer: "Alternative text for the image"
    },
    {
      question: "Which HTML element is used for important/strong text?",
      options: ["<b>", "<em>", "<strong>", "<mark>"],
      answer: "<strong>"
    }
  ],

  css: [
    {
      question: "What does CSS stand for?",
      options: ["Cascading Style Sheets", "Creative Style System", "Computer Style Sheets", "Colorful Style Script"],
      answer: "Cascading Style Sheets"
    },
    {
      question: "Which CSS property changes the text color?",
      options: ["text-color", "font-color", "color", "foreground"],
      answer: "color"
    },
    {
      question: "How do you select an element with id='header' in CSS?",
      options: [".header", "#header", "*header", "header"],
      answer: "#header"
    },
    {
      question: "Which property sets the background color?",
      options: ["bg-color", "background-color", "color-background", "bgcolor"],
      answer: "background-color"
    },
    {
      question: "What is the DEFAULT value of the 'position' property?",
      options: ["relative", "absolute", "fixed", "static"],
      answer: "static"
    },
    {
      question: "Which property controls space INSIDE an element's border?",
      options: ["margin", "spacing", "padding", "border-space"],
      answer: "padding"
    },
    {
      question: "How do you target ALL <p> elements in CSS?",
      options: ["#p { }", ".p { }", "p { }", "*p { }"],
      answer: "p { }"
    },
    {
      question: "Which 'display' value makes an element a flex container?",
      options: ["block", "inline", "flex", "grid"],
      answer: "flex"
    },
    {
      question: "What does 'z-index' control?",
      options: ["Zoom level", "Stacking order of elements", "Element zoom index", "Text size"],
      answer: "Stacking order of elements"
    },
    {
      question: "Which CSS unit is relative to the ROOT element's font size?",
      options: ["em", "px", "rem", "%"],
      answer: "rem"
    }
  ]
};

// ============================================================
// THEME SWITCHER
// ============================================================
const toggleTheme = () => {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode', isDarkMode);

  const icon  = document.getElementById('theme-icon');
  const label = document.getElementById('theme-label');

  if (isDarkMode) {
    icon.innerText  = '☀️';
    label.innerText = 'Light Mode';
  } else {
    icon.innerText  = '🌙';
    label.innerText = 'Dark Mode';
  }
};

// ============================================================
// SCREEN SWITCHING
// ============================================================
const showScreen = (id) => {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
};

// ============================================================
// SCREEN 1 – NAME HANDLING
// ============================================================
const handleNameSubmit = () => {
  try {
    const input   = document.getElementById('name-input');
    const errorEl = document.getElementById('name-error');
    const name    = input.value.trim();

    if (!name) {
      errorEl.innerText = 'Please enter your name to continue.';
      input.focus();
      return;
    }

    errorEl.innerText = '';
    userName = name;
    document.getElementById('greeting-text').innerText = `Hey ${userName}!`;
    showScreen('screen-subject');
  } catch (e) {
    console.error('Name submit error:', e);
  }
};

// Enter key support on name field
document.getElementById('name-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleNameSubmit();
});

// ============================================================
// SCREEN 2 – SUBJECT SELECTION
// ============================================================
const selectSubject = (subject) => {
  try {
    const valid = ['javascript', 'html', 'css'];
    if (!valid.includes(subject)) {
      console.error('Invalid subject:', subject);
      return;
    }
    selectedSubject = subject;
    startQuiz();
  } catch (e) {
    console.error('Subject select error:', e);
  }
};

// ============================================================
// SCREEN 3 – QUIZ
// ============================================================
const startQuiz = () => {
  try {
    currentQuestionIndex = 0;
    score                = 0;
    quizCompleted        = false;
    selectedAnswer       = null;

    // Subject pill label
    const labels = { javascript: 'JS', html: 'HTML', css: 'CSS' };
    document.getElementById('subject-label').innerText = labels[selectedSubject];
    document.getElementById('score-display').innerText = '0';

    showScreen('screen-quiz');
    loadQuestion();
  } catch (e) {
    console.error('Start quiz error:', e);
  }
};

const loadQuestion = () => {
  try {
    const questions = quizData[selectedSubject];
    const total     = questions.length;
    const current   = questions[currentQuestionIndex];

    selectedAnswer = null;

    // Counter & progress
    document.getElementById('question-counter').innerText = `${currentQuestionIndex + 1} / ${total}`;
    document.getElementById('question-num-label').innerText = `Question ${currentQuestionIndex + 1}`;
    const pct = (currentQuestionIndex / total) * 100;
    document.getElementById('progress-bar').style.width = `${pct}%`;

    // Question text
    document.getElementById('question-text').innerText = current.question;

    // Clear feedback
    const fbEl = document.getElementById('feedback-msg');
    fbEl.innerText  = '';
    fbEl.className  = 'feedback-msg';

    // Build option buttons
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    current.options.forEach((opt) => {
      const btn       = document.createElement('button');
      btn.className   = 'option-btn';
      btn.innerText   = opt;
      btn.onclick     = () => selectAnswer(opt);
      container.appendChild(btn);
    });

    // Reset Next button
    const nextBtn     = document.getElementById('btn-next');
    nextBtn.disabled  = true;
    nextBtn.innerText = 'Next Question →';

    // Start countdown
    startTimer();
  } catch (e) {
    console.error('Load question error:', e);
  }
};

// ============================================================
// ANSWER SELECTION
// ============================================================
const selectAnswer = (chosen) => {
  try {
    if (selectedAnswer !== null) return;   // already answered
    selectedAnswer = chosen;
    resetTimer();

    const correct   = quizData[selectedSubject][currentQuestionIndex].answer;
    const isCorrect = chosen === correct;

    if (isCorrect) score++;
    document.getElementById('score-display').innerText = score;

    // Highlight buttons
    document.querySelectorAll('.option-btn').forEach((btn) => {
      btn.disabled = true;
      if (btn.innerText === correct) {
        btn.classList.add(isCorrect ? 'correct' : 'reveal');
      }
      if (btn.innerText === chosen && !isCorrect) {
        btn.classList.add('wrong');
      }
    });

    // Feedback message
    const fbEl = document.getElementById('feedback-msg');
    if (isCorrect) {
      fbEl.innerText  = 'Correct! Well done!';
      fbEl.className  = 'feedback-msg correct';
    } else {
      fbEl.innerText  = `Wrong! Correct answer: "${correct}"`;
      fbEl.className  = 'feedback-msg wrong';
    }

    // Enable Next
    document.getElementById('btn-next').disabled = false;
  } catch (e) {
    console.error('Select answer error:', e);
  }
};

// ============================================================
// NEXT QUESTION
// ============================================================
const nextQuestion = () => {
  try {
    const total = quizData[selectedSubject].length;
    currentQuestionIndex++;
    if (currentQuestionIndex >= total) {
      showResult();
    } else {
      loadQuestion();
    }
  } catch (e) {
    console.error('Next question error:', e);
  }
};

// ============================================================
// TIMER
// ============================================================
const startTimer = () => {
  try {
    resetTimer();
    timeLeft = TIME_PER_QUESTION;
    updateTimerDisplay();

    timer = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      if (timeLeft <= 0) handleTimerExpiry();
    }, 1000);
  } catch (e) {
    console.error('Start timer error:', e);
  }
};

const resetTimer = () => {
  try {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
    const timerEl = document.getElementById('timer-box');
    timerEl.classList.remove('warning', 'danger');
  } catch (e) {
    console.error('Reset timer error:', e);
  }
};

const updateTimerDisplay = () => {
  document.getElementById('timer-display').innerText = `${timeLeft}s`;
  const timerEl = document.getElementById('timer-box');
  timerEl.classList.remove('warning', 'danger');
  if (timeLeft <= 5) {
    timerEl.classList.add('danger');
  } else if (timeLeft <= 8) {
    timerEl.classList.add('warning');
  }
};

const handleTimerExpiry = () => {
  try {
    resetTimer();
    if (selectedAnswer !== null) return;   // already answered

    selectedAnswer = '__timeout__';

    const correct = quizData[selectedSubject][currentQuestionIndex].answer;

    document.querySelectorAll('.option-btn').forEach((btn) => {
      btn.disabled = true;
      if (btn.innerText === correct) btn.classList.add('reveal');
    });

    const fbEl = document.getElementById('feedback-msg');
    fbEl.innerText = `Time's up! Correct answer: "${correct}"`;
    fbEl.className = 'feedback-msg wrong';

    document.getElementById('btn-next').disabled = false;

    // Auto-advance after 2.5 s
    setTimeout(() => { nextQuestion(); }, 2500);
  } catch (e) {
    console.error('Timer expiry error:', e);
  }
};

// ============================================================
// SCREEN 4 – RESULTS
// ============================================================
const calculateScore = () => {
  const total   = quizData[selectedSubject].length;
  const percent = Math.round((score / total) * 100);
  return { correct: score, total, percent };
};

const showResult = () => {
  try {
    resetTimer();
    quizCompleted = true;

    // Full progress
    document.getElementById('progress-bar').style.width = '100%';

    const { correct, total, percent } = calculateScore();

    document.getElementById('result-username').innerText  = `${userName}'s result`;
    document.getElementById('result-correct').innerText   = correct;
    document.getElementById('result-total').innerText     = total;
    document.getElementById('result-percent').innerText   = `${percent}%`;

    const emojiEl = document.getElementById('result-emoji');
    const perfEl  = document.getElementById('performance-msg');
    perfEl.className = 'performance-msg';

    if (percent >= 80) {
      emojiEl.innerText = '';
      perfEl.innerText  = 'Excellent! You nailed it — outstanding performance!';
      perfEl.classList.add('excellent');
    } else if (percent >= 50) {
      emojiEl.innerText = '';
      perfEl.innerText  = 'Good job! A bit more practice and you\'ll ace it!';
      perfEl.classList.add('good');
    } else {
      emojiEl.innerText = '';
      perfEl.innerText  = 'Needs Improvement. Keep learning — you\'ve got this!';
      perfEl.classList.add('needs-improvement');
    }

    showScreen('screen-result');
  } catch (e) {
    console.error('Show result error:', e);
  }
};

// ============================================================
// RESTART
// ============================================================
const restartQuiz = () => {
  try {
    resetTimer();
    selectedSubject      = '';
    currentQuestionIndex = 0;
    score                = 0;
    selectedAnswer       = null;
    quizCompleted        = false;

    document.getElementById('greeting-text').innerText = `Welcome back ${userName}!`;
    showScreen('screen-subject');
  } catch (e) {
    console.error('Restart error:', e);
  }
};

// ============================================================
// START OVER  – full reset back to name input screen
// ============================================================
const startOver = () => {
  try {
    resetTimer();
    userName             = '';
    selectedSubject      = '';
    currentQuestionIndex = 0;
    score                = 0;
    selectedAnswer       = null;
    quizCompleted        = false;

    // Clear the name field and any error so it's fresh
    document.getElementById('name-input').value = '';
    document.getElementById('name-error').innerText = '';

    showScreen('screen-name');
  } catch (e) {
    console.error('Start over error:', e);
  }
};
