const loginSection = document.querySelector('#loggedOunt');
const loggedinSection = document.querySelector('#loggedIn');

// listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        loginSection.setAttribute('style', 'display: none');
        loggedinSection.setAttribute('style', 'display: block');
    } else {
        loginSection.setAttribute('style', 'display: block');
        loggedinSection.setAttribute('style', 'display: none');
    }
});

// login
const loginForm = document.querySelector('#march-login');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // get user info
  const email = loginForm['e-mail'].value;
  const password = loginForm['password'].value;
  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    // close the signin modal & reset form
    loginSection.setAttribute('style', 'display: none');
    loggedinSection.setAttribute('style', 'display: block');
    loginForm.reset();
    loginForm.querySelector('.error').innerHTML = '';
  }).catch(err => {
    loginForm.querySelector('.error').innerHTML = err.message;
  });
});

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut();
});