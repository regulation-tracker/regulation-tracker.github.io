// 🔹 Firebase setup
const firebaseConfig = {
  apiKey: "AIzaSyDHhMC2BQCaW76Tn-l718CELkhCUEJf3h0",
  authDomain: "regulation-tracker-9b84f.firebaseapp.com",
  projectId: "regulation-tracker-9b84f",
  storageBucket: "regulation-tracker-9b84f.firebasestorage.app",
  messagingSenderId: "213728940720",
  appId: "1:213728940720:web:cafc4d4a037aaa23be6175",
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

let currentUser = null;

// 🔹 Auth functions
function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, pass).catch(alert);
}

function logout() {
  auth.signOut();
}

firebase.auth().onAuthStateChanged((user) => {
  currentUser = user;

  // Add or remove 'logged-in' class on body
  if (user) {
    document.body.classList.add("logged-in");
  } else {
    document.body.classList.remove("logged-in");
  }

  // Show/hide addFood section
  document.getElementById("addFood").style.display = user ? "block" : "none";

  // Re-render the grid
  renderGrid();
});

document.addEventListener("DOMContentLoaded", () => {
  const newFoodInput = document.getElementById("newFood");

  // Trigger addFood on Enter
  newFoodInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addFood();
    }
  });
});

function addFood() {
  const food = document.getElementById("newFood").value.trim();
  if (!food) return;

  const timestamp = Date.now(); // store creation time
  db.ref("foods/" + food).set({
    Andrew: 0,
    Nick: 0,
    Eric: 0,
    Geoff: 0,
    Gavin: 0,
    createdAt: timestamp,
  });

  document.getElementById("newFood").value = "";
}

// 🔹 Increment total
function increment(food, person) {
  if (!currentUser) return alert("Login required");
  const ref = db.ref(`foods/${food}/${person}`);
  ref.transaction((curr) => (curr || 0) + 1);
}

// 🔹 Decrement total
function decrement(food, person) {
  if (!currentUser) return alert("Login required");
  const ref = db.ref(`foods/${food}/${person}`);
  ref.transaction((curr) => {
    if (!curr || curr <= 0) return 0;
    return curr - 1;
  });
}

// 🔹 Delete food row with confirmation
function deleteFood(food) {
  if (!currentUser) return alert("Login required");
  const confirmDelete = confirm(`Are you sure you want to delete "${food}"? This cannot be undone.`);
  if (confirmDelete) {
    db.ref("foods/" + food).remove();
  }
}

// 🔹 Render grid
function renderGrid() {
  db.ref("foods").on("value", (snapshot) => {
    const foods = snapshot.val() || {};
    const grid = document.getElementById("grid");

    // Header row
    grid.innerHTML = `
      <div></div>
      <div class="regulation-member">Andrew</div>
      <div class="regulation-member">Nick</div>
      <div class="regulation-member">Eric</div>
      <div class="regulation-member">Geoff</div>
      <div class="regulation-member">Gavin</div>
      <div class="regulation-logged"></div>
    `;

    // Convert foods object to array and sort by createdAt
    const foodsArray = Object.keys(foods).map((key) => ({
      name: key,
      ...foods[key],
    }));
    foodsArray.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

    // Render each row
    foodsArray.forEach((food) => {
      grid.innerHTML += `
        <div class="regulation-item">${food.name}</div>
        ${["Andrew", "Nick", "Eric", "Geoff", "Gavin"]
          .map(
            (p) => `
            <div class="regulation-number">
              <span>${food[p] || 0}</span>
              ${
                currentUser
                  ? `
                  <div class="regulation-count">
                    <button onclick="increment('${food.name}','${p}')">+</button>
                    <button onclick="decrement('${food.name}','${p}')">-</button>
                  </div>
                `
                  : ""
              }
            </div>
          `
          )
          .join("")}
        <div class="regulation-number remove-btn">
          ${currentUser ? `<button onclick="deleteFood('${food.name}')">Remove Item</button>` : ""}
        </div>
      `;
    });
  });
}

renderGrid();
