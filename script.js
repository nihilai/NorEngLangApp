let flashCards = [];
let currentCard = 0;
let showingFront = true;
let score = 0;
let total = 0;

window.resetProgress = function () {
  score = 0;
  total = 0;
  document.getElementById("score").textContent = "Score: 0 / 0";
  document.getElementById("answer").value = "";
};

function startFlashcards() {
  currentCard = Math.floor(Math.random() * flashCards.length);
  total = 0;
  updateCard(
    flashCards[currentCard].norwegian,
    flashCards[currentCard].english
  );
  updateScore();
}

/*document.getElementById("menu").addEventListener("click", () => {
  document.getElementById("icon").classList.toggle("open");
});*/

function nextCard() {
  const userAnswer = document
    .getElementById("answer")
    .value.trim()
    .toLowerCase();
  const correctAnswer = flashCards[currentCard].english.toLowerCase();

  if (userAnswer === "") {
    alert("Please type in the English word.");
    return;
  } else if (userAnswer === correctAnswer) {
    score++;
    currentCard = Math.floor(Math.random() * flashCards.length);
    updateCard(
      flashCards[currentCard].norwegian,
      flashCards[currentCard].english
    );
    const cards = document.querySelectorAll("#cardFront, #cardBack");
    const blueBorder = "#332926";
    cards.forEach((card) => {
      card.style.border = `10px solid ${blueBorder}`;
    });

    setTimeout(() => {
      cards.forEach((card) => {
        card.style.border = `10px solid floralwhite`;
      });
    }, 1500);
    if (score % 5 === 0 && score > 0) {
      document.getElementById("answer").style.display = "none";
      document.getElementById("submit").style.display = "none";
      document.getElementById("alternatives").classList.add("show");

      const altButtons = document.querySelectorAll(".altbuttons");
      const correct = flashCards[currentCard].english.toLowerCase();
      const alternatives = flashCards
        .filter((card) => card.english.toLowerCase() !== correct)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((card) => card.english);
      const options = [...alternatives, correct].sort(
        () => 0.5 - Math.random()
      );

      altButtons.forEach((button, index) => {
        button.textContent = options[index];
        button.onclick = () => {
          if (button.textContent === correct) {
            total++;
            score++;
            updateScore();
            setTimeout(() => {
              document.getElementById("answer").focus();
            }, 10);

            currentCard = Math.floor(Math.random() * flashCards.length);
            updateCard(
              flashCards[currentCard].norwegian,
              flashCards[currentCard].english
            );
            const cards = document.querySelectorAll("#cardFront, #cardBack");
            const blueBorder = "#332926";
            cards.forEach((card) => {
              card.style.border = `10px solid ${blueBorder}`;
            });

            setTimeout(() => {
              cards.forEach((card) => {
                card.style.border = `10px solid floralwhite`;
              });
            }, 1500);
          } else if (button.textContent !== correct) {
            total++;
            updateScore();
            setTimeout(() => {
              document.getElementById("answer").focus();
            }, 10);

            flipCard();
            const cards = document.querySelectorAll("#cardFront, #cardBack");
            const redBorder = "#1e1817";
            cards.forEach((card) => {
              card.style.border = `10px solid ${redBorder}`;
            });

            setTimeout(() => flipCard(), 1700);

            setTimeout(() => {
              cards.forEach((card) => {
                card.style.border = `10px solid floralwhite`;
              });
              currentCard = Math.floor(Math.random() * flashCards.length);
              updateCard(
                flashCards[currentCard].norwegian,
                flashCards[currentCard].english
              );
            }, 1850);
          }
          document.getElementById("answer").style.display = "inline-block";
          document.getElementById("submit").style.display = "inline-block";
          document.getElementById("alternatives").classList.remove("show");
        };
      });
    }
  } else {
    flipCard();
    const cards = document.querySelectorAll("#cardFront, #cardBack");
    const redBorder = "#1e1817";
    cards.forEach((card) => {
      card.style.border = `10px solid ${redBorder}`;
    });

    setTimeout(() => flipCard(), 1700);

    setTimeout(() => {
      cards.forEach((card) => {
        card.style.border = `10px solid floralwhite`;
      });
      currentCard = Math.floor(Math.random() * flashCards.length);
      updateCard(
        flashCards[currentCard].norwegian,
        flashCards[currentCard].english
      );
    }, 1850);
  }

  if (score % 50 === 0 && score > 0) {
    alert(
      `Congratulations! You've answered ${score} questions correctly! Score added to leaderboard.`
    );
    const leaderboardList = document.getElementById("leaderboardList");
    const li = document.createElement("li");
    li.textContent = `${new Date().toLocaleDateString()}: ${score} / ${total} correct.`;
    leaderboardList.prepend(li);
  }

  document.getElementById("answer").value = "";
  total++;
  updateScore();
} // End of nextCard function

document.getElementById("submit").addEventListener("click", nextCard);

document.addEventListener("keydown", (event) => {
  if (window.isLoggedIn && event.key === "Enter") {
    nextCard();
  }
});

function updateScore() {
  document.getElementById("score").textContent = `Score: ${score} / ${total}`;
}

function flipCard() {
  document.getElementById("flashcard").classList.toggle("flipped");
  showingFront = !showingFront;
}

const scoreboard = document.getElementById("scoreboard");
const personalScoresList = document.getElementById("personalScoresList");

scoreboard.addEventListener("click", () => {
  scoreboard.classList.toggle("flipped");
});

document.getElementById("add").addEventListener("click", () => {
  const li = document.createElement("li");
  li.textContent = `${new Date().toLocaleDateString()}: ${score} / ${total} correct.`;
  personalScoresList.prepend(li);

  while (personalScoresList.children.length > 10) {
    personalScoresList.removeChild(personalScoresList.lastChild);
  }
});

function updateCard(nor, eng) {
  document.getElementById("cardFront").textContent = nor;
  document.getElementById("cardBack").textContent = eng;
}

fetch("words.json")
  .then((response) => response.json())
  .then((data) => {
    flashCards = data;
    startFlashcards();
  })
  .catch((error) => console.error("Error loading JSON:", error));

const images = [
  { url: "pics/natur1.jpg", position: "center center" },
  { url: "pics/viking6f.jpg", position: "center 70%" },
  { url: "pics/natur4.jpg", position: "center center" },
];

let index = 0;

images.forEach(({ url }) => {
  const img = new Image();
  img.src = url;
});

function changeBackground() {
  const bg = images[index];
  const pictures = document.querySelector(".pictures");
  pictures.style.backgroundImage = `url('${bg.url}')`;
  pictures.style.backgroundPosition = bg.position;
  index = (index + 1) % images.length;
}

changeBackground();
setInterval(changeBackground, 3000);
