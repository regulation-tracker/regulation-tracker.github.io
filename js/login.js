// Firebase setup
const firebaseConfig = {
  apiKey: "AIzaSyDHhMC2BQCaW76Tn-l718CELkhCUEJf3h0",
  authDomain: "regulation-tracker-9b84f.firebaseapp.com",
  projectId: "regulation-tracker-9b84f",
  storageBucket: "regulation-tracker-9b84f.firebasestorage.app",
  messagingSenderId: "213728940720",
  appId: "1:213728940720:web:cafc4d4a037aaa23be6175",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Ensure DOM is loaded before manipulating elements
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login");
  const loggedInMessage = document.getElementById("logged-in-message");
  const errorDiv = document.getElementById("error");

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  // Detect if already logged in
  auth.onAuthStateChanged((user) => {
    if (user) {
      loginForm.style.display = "none";
      loggedInMessage.style.display = "block";
    } else {
      loginForm.style.display = "flex";
      loggedInMessage.style.display = "none";
    }
  });

  // Login
  window.login = () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        //alert("Login successful! Return to tracker to edit.");
        window.location.href = "https://regulation-tracker.github.io/";
      })
      .catch((err) => {
        errorDiv.innerText = err.message;
      });
  };

  // Logout
  window.logout = () => {
    auth.signOut().then(() => {
      // Redirect back to tracker page after logout
      window.location.href = "https://regulation-tracker.github.io/";
    });
  };

  // Trigger login on Enter key
  [emailInput, passwordInput].forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        // By default, pressing Enter triggers login
        login();
      }
    });
  });
});
