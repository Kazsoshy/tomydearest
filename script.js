/* Simple interactive monthsary site JS */

/* ---------------------------------------
   CONFIG: list your image filenames here
-----------------------------------------*/
const IMAGES = [
  "images/01.jpg",
  "images/02.jpg",
  "images/03.jpg",
  "images/04.jpg",
  "images/05.jpg"
];

/* ---------------------------------------
   DEFAULT TIMELINE NOTES
-----------------------------------------*/
const DEFAULT_NOTES = [
  { month: "1", text: "I love you" },
  { month: "4", text: "I love you MOREEE" },
  { month: "3", text: "I lovee youuu INFINITEEEE" }
];

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------------
     INITIAL ELEMENT SETUP
  -----------------------------------------*/
  const gallery = document.getElementById("gallery");
  const slideImage = document.getElementById("slideImage");
  const slideCaption = document.getElementById("slideCaption");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const autoPlayCheckbox = document.getElementById("autoPlay");
  const speedRange = document.getElementById("speed");
  const celebrateBtn = document.getElementById("celebrateBtn");

  // Letter Modal Elements
  const letterBtn = document.getElementById("letterBtn");
  const letterModal = document.getElementById("letterModal");
  const closeLetterBtn = document.getElementById("closeLetterBtn");

  // Lightbox
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");

  // Timeline
  const timeline = document.getElementById("timeline");
  const noteForm = document.getElementById("noteForm");
  const noteMonth = document.getElementById("noteMonth");
  const noteText = document.getElementById("noteText");

  /* ---------------------------------------
     LETTER MODAL HANDLING
  -----------------------------------------*/
  letterBtn.addEventListener("click", () => {
    letterModal.classList.add("show");
  });

  closeLetterBtn.addEventListener("click", () => {
    letterModal.classList.remove("show");
  });

  letterModal.addEventListener("click", (e) => {
    if (e.target === letterModal) {
      letterModal.classList.remove("show");
    }
  });

  /* ---------------------------------------
     BUILD GALLERY THUMBNAILS
  -----------------------------------------*/
  IMAGES.forEach((src, i) => {
    const btn = document.createElement("button");
    btn.className = "thumb";
    btn.setAttribute("data-index", i);
    btn.innerHTML = `<img src="${src}" alt="Photo ${i+1}" loading="lazy">`;
    btn.addEventListener("click", () =>
      openLightbox(src, `Photo ${i+1}`)
    );
    gallery.appendChild(btn);
  });

  function openLightbox(src, caption = "") {
    lightboxImg.src = src;
    lightboxCaption.textContent = caption;
    lightbox.classList.add("show");
  }

  document.getElementById("closeLightbox").addEventListener("click", () => {
    lightbox.classList.remove("show");
  });

  /* ---------------------------------------
     SLIDESHOW
  -----------------------------------------*/
  let index = 0;

  function showIndex(i) {
    index = (i + IMAGES.length) % IMAGES.length;
    slideImage.src = IMAGES[index];
    slideCaption.textContent = `Photo ${index+1} of ${IMAGES.length}`;
  }

  prevBtn.addEventListener("click", () => showIndex(index - 1));
  nextBtn.addEventListener("click", () => showIndex(index + 1));
  showIndex(0);

  /* ---------------------------------------
     AUTOPLAY
  -----------------------------------------*/
  let autoplayTimer = null;

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => showIndex(index + 1), parseInt(speedRange.value, 10));
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  autoPlayCheckbox.addEventListener("change", (e) => {
    if (e.target.checked) startAutoplay();
    else stopAutoplay();
  });

  speedRange.addEventListener("change", () => {
    if (autoPlayCheckbox.checked) startAutoplay();
  });

  /* ---------------------------------------
     TIMELINE
  -----------------------------------------*/
  let notes = DEFAULT_NOTES.slice();

  function renderTimeline() {
    timeline.innerHTML = "";
    notes.forEach((n) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${escapeHTML(n.month)}</strong>
        <div class="meta">${escapeHTML(n.text)}</div>
      `;
      timeline.appendChild(li);
    });
  }

  noteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    notes.push({ month: noteMonth.value.trim(), text: noteText.value.trim() });
    noteMonth.value = "";
    noteText.value = "";
    renderTimeline();
  });

  renderTimeline();

  /* ---------------------------------------
     CONFETTI / HEARTS ANIMATION (CANVAS)
  -----------------------------------------*/
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");
  let particles = [];

  function resizeCanvas() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function runHearts() {
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -10 - Math.random() * 100,
        vx: (Math.random() - 0.5) * 2,
        vy: 1 + Math.random() * 3,
        r: 8 + Math.random() * 10,
        life: 80 + Math.random() * 60,
        color: `hsl(${Math.floor(Math.random()*360)},70%,60%)`,
        t: 0
      });
    }
    requestAnimationFrame(loop);
  }

  function drawHeart(x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 30, size / 30);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(0, -8, -12, -22, -24, -10);
    ctx.bezierCurveTo(-36, 2, -12, 24, 0, 40);
    ctx.bezierCurveTo(12, 24, 36, 2, 24, -10);
    ctx.bezierCurveTo(12, -22, 0, -8, 0, 0);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.t < p.life);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02;
      p.t++;
      drawHeart(p.x, p.y, p.r, p.color);
    });

    if (particles.length) requestAnimationFrame(loop);
  }

  /* ---------------------------------------
     🌸 FLOWERS + BOUQUET ANIMATION (NEW)
  -----------------------------------------*/
  const flowerContainer = document.getElementById("flowerContainer");
  const bouquetContainer = document.getElementById("bouquetContainer");

  const flowerEmojis = ["🌸", "🌺", "🌷", "🌹", "🌻"];

  celebrateBtn.addEventListener("click", () => {
    runHearts();   // original effect
    spawnFlowers();
    showBouquet();
  });

  // create multiple floating flowers
  function spawnFlowers() {
    for (let i = 0; i < 25; i++) {
      createFlower();
    }
  }

  function createFlower() {
    const f = document.createElement("div");
    f.classList.add("flower");
    f.textContent = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];

    f.style.left = Math.random() * 100 + "vw";
    f.style.fontSize = (Math.random() * 1.7 + 1.3) + "rem";

    flowerContainer.appendChild(f);

    setTimeout(() => f.remove(), 3200);
  }

  // show bouquet animation
  function showBouquet() {
    bouquetContainer.innerHTML = "";

    const b = document.createElement("div");
    b.classList.add("bouquet");
    b.textContent = "💐";

    bouquetContainer.appendChild(b);

    setTimeout(() => {
      bouquetContainer.style.transform = "translateX(-50%) scale(1)";
    }, 50);

    setTimeout(() => {
      bouquetContainer.style.transform = "translateX(-50%) scale(1.15)";
    }, 800);

    setTimeout(() => {
      bouquetContainer.style.transform = "translateX(-50%) scale(1)";
    }, 1300);
  }

  /* ---------------------------------------
     QUESTION GAME
  -----------------------------------------*/
  const questions = [
    {
      question: "When was our lock-in date?",
      options: ["April 19th", "April 20th"],
      correct: 0, // Index of correct answer
      feedback: {
        correct: "Yesss! Wowers sanaol na remember, I mean ofc ka remember pud ko bb. 💖",
        incorrect: "Nope, aray kohh gegegege. It was April 19th! 📅"
      }
    },
    {
      question: "What was the first movie series we watched together?",
      options: ["A Rom-Com 🤍", "Fantasy Action 🐲"],
      correct: 1,
      feedback: {
        correct: "Spot on! That fantasy action-packed night was epic. 🐲🐲🐲",
        incorrect: "It was a Fantasy Action flick! Next time, we'll pick a rom-com. 🎥"
      }
    },
    {
      question: "Do you love me?",
      options: ["Yes", "Yes"],
      correct: 0,
      feedback: {
        correct: "But I love you MOREEEEEE🏆📢🥰🥰",
        incorrect: "What do u expect? di ko musugot di ko nimo love bb :> 🤗"
      }
    },
    {
      question: "Did you like me first?",
      options: ["Noooo", "yes I liked you first my bb <3"],
      correct: 1,
      feedback: {
        correct: "Exactly! and I fell for you harder each day. 😍",
        incorrect: "we both know the truth mwehehhehe. You liked me first! 😘"
      }
    },
    {
      question: "What's the best part of our late-night convos?",
      options: ["The laughs", "Everything"],
      correct: 1,
      feedback: {
        correct: "Everything! You're my everything. 💖",
        incorrect: "It's everything, bb. The laughs are just the cherry on top. 🍒"
      }
    }
  ];

  let currentQuestionIndex = 0;
  let score = 0;
  const questionEl = document.getElementById('question');
  const option1El = document.getElementById('option1');
  const option2El = document.getElementById('option2');
  const resultEl = document.getElementById('result');
  const resetBtn = document.getElementById('resetGame');

  function loadQuestion() {
    if (currentQuestionIndex < questions.length) {
      const q = questions[currentQuestionIndex];
      questionEl.textContent = q.question;
      option1El.textContent = q.options[0];
      option2El.textContent = q.options[1];
      resultEl.textContent = '';
      resetBtn.style.display = 'none';
    } else {
      // Game over
      questionEl.textContent = '';
      option1El.style.display = 'none';
      option2El.style.display = 'none';
      resultEl.textContent = `Game over! You got ${score}/${questions.length} correct. I lovee youuu, Eriiiii! 💕`;
      resetBtn.style.display = 'block';
    }
  }

  function checkAnswer(selectedIndex) {
    const q = questions[currentQuestionIndex];
    if (selectedIndex === q.correct) {
      score++;
      resultEl.textContent = q.feedback.correct;
    } else {
      resultEl.textContent = q.feedback.incorrect;
    }
    currentQuestionIndex++;
    setTimeout(loadQuestion, 4000); // Auto-advance after 4 seconds
  }

  option1El.addEventListener('click', () => checkAnswer(0));
  option2El.addEventListener('click', () => checkAnswer(1));

  resetBtn.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    option1El.style.display = 'inline-block';
    option2El.style.display = 'inline-block';
    loadQuestion();
  });

  // Initialize the game
  loadQuestion();

  /* ---------------------------------------
     HTML ESCAPE UTILITY
  -----------------------------------------*/
  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, m => ({
      '&':'&amp;',
      '<':'&lt;',
      '>':'&gt;',
      '"':'&quot;',
      "'":'&#39;'
    }[m]));
  }

});

function createFlower() {
  const flowers = ["🌸", "💮", "🌼", "🌺", "🌷"];
  const flower = document.createElement("div");
  flower.classList.add("flower");
  flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];

  // random starting left position
  flower.style.left = Math.random() * 100 + "vw";

  // random duration for natural falling
  flower.style.animationDuration = 5 + Math.random() * 5 + "s";

  document.body.appendChild(flower);

  // remove after falling
  setTimeout(() => {
    flower.remove();
  }, 10000);
}

// continuous flowers
setInterval(createFlower, 800);