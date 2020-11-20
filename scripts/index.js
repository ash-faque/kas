// GET REFERENCE TO COMMODITIES AND PASS IT TO SNAPSHOT DATA
var items = db.collection("commodities").get().then(querySnapshot => {
        console.log(querySnapshot.docs)
        inputRates(querySnapshot.docs)
}, err => console.log(err.message));


// INPUT MARKET RATES
const rateList = document.getElementById('rate-list');
const inputRates = (data) => {
    let initial = '';
    data.forEach(doc => {
        const item = doc.data();
        const li =  ` <li class="collection-item"> ${item.name} <span class="secondary-content"> ${item.rate} </span></li> `;
        initial += li;
    })
    rateList.innerHTML = initial
};
  

// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var fab = document.querySelectorAll('.fixed-action-btn');
  M.FloatingActionButton.init(fab);

  var collapsible = document.querySelectorAll('.collapsible');
  M.Collapsible.init(collapsible);
  
});