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


const loginSection = document.querySelector('#loggedOunt');
const loggedinSection = document.querySelector('#loggedIn');

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut();
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

// UPDATE RATE




// DELETE RATE



// ADD RATE
/* const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
  e.preventDefault();
  db.collection('guides').add({
    title: createForm.title.value,
    content: createForm.content.value
  }).then(() => {
    // close the create modal & reset form
    const modal = document.querySelector('#modal-create');
    M.Modal.getInstance(modal).close();
    createForm.reset();
  }).catch(err => {
    console.log(err.message);
  });
}); */