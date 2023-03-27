const switch_btns = document.querySelectorAll(".switch_btns button")
let activeBtn = 0

const signIn = document.getElementById("signin")
const signUp = document.getElementById("signup")

switch_btns.forEach((btn,index)=>{
  btn.addEventListener("click",()=>{
  switch_btns[activeBtn].classList.remove("active")
   activeBtn = index
   switch_btns[activeBtn].classList.add("active")

if (activeBtn == 0) {
  signUp.style.display = "none"
  signIn.style.display = "block"
}else if (activeBtn == 1) {
  signUp.style.display = "block"
  signIn.style.display = "none"
 
}

  })
})












 
// Sign up form submit event listener
signUp.addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.querySelector("#email-signup").value.trim();
  const password = document.querySelector("#password-signup").value.trim();
  const username = document.querySelector("#username-signup").value.trim();

  // Create user account
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const userId = userCredential.user.uid;
      const user = auth.currentUser;

      // Send verification email
      user.sendEmailVerification()
        .then(() => {
          alert("Email verification sent");
        })
        .catch((error) => {
          alert("Error sending email verification:", error);
        });

      // Store user data in database
      createUser(userId, email, username);
    })
    .catch((error) => {
      console.log("Error creating user account:", error);
      // Display error message to user
      alert(error.message);
    });
});

// Sign in form submit event listener
signIn.addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.querySelector("#email-signin").value.trim();
  const password = document.querySelector("#password-signin").value.trim();

  // Authenticate user
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const userId = userCredential.user.uid;
      welcome("Welcome back!");
    })
    .catch((error) => {
      console.log("Error signing in:", error);
      // Display error message to user
      alert(error.message);
    });
});

function createUser(userId, email, username) {
  const userRef = database.ref("users/");
  userRef.child(userId).set({
      email: email,
      username: username
    })
    .then(() => {
      alert("Account created");
    })
    .catch((error) => {
      alert("Error creating account:", error);
      // Display error message to user
      alert(error.message);
    });
}

let executed = false 

auth.onAuthStateChanged((user)=>{
const isVerified = auth.currentUser

if (!executed) {
  executed = true
  if (user) {
  if (isVerified && isVerified.emailVerified) {
    // alert("email verified")

  } else {
    alert("email not verified");
  }
} else {
   document.querySelector(".form_wrapper ").style.display = 'block'
}
}



})
