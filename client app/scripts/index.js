// GET REFERENCE TO COMMODITIES AND PASS IT TO SNAPSHOT DATA
var items = db.collection("commodities").get().then(querySnapshot => {
    inputRates(querySnapshot.docs);
}, err => console.log(err.message));


// INPUT MARKET RATES
const grains = document.getElementById('grains');
const vegetables = document.getElementById('vegetables');
const fruits = document.getElementById('fruits');
const dairys = document.getElementById('dairy');
const others = document.getElementById('others');

const inputRates = (data) => {
data.forEach(doc => {
    const item = doc.data();
    const today = new Date();
    const created = new Date(item.on.toDate());
    const eta = Math.ceil((today - created) / (1000 * 60 * 60 * 24));
    function etaShower(eta){
        if (eta == 1){
            return "today";
        } else if (eta == 2){
            return "yesterday";
        } else {
            return eta + " days ago";
        }
    }
    function availablityShower(){
        if (item.availablity == false){
            return "outOfStock";
        }
    }
    function quantityShower(){
        if (item.perkilo == true){
            return " /kg";
        } else {
            return " /ltr";
        }
    }
    const li = document.createElement("LI");
    li.setAttribute("id", `${doc.id}`);
    li.classList.add(availablityShower());       
    li.innerHTML = `<p clas="detail"><span class="name">${item.name}</span><span class="rate">${item.rate + " ₹ " + quantityShower()}<span></p><p class="eta">Updated${" : " + etaShower(eta)}</p>`;
    if (item.catogary == "grain"){
        grains.appendChild(li);
    } else if (item.catogary == "vegetable"){
        vegetables.appendChild(li);
    } else if (item.catogary == "fruit"){
        fruits.appendChild(li);
    } else if (item.catogary == "dairy"){
        dairys.appendChild(li);
    } else if (item.catogary == "other"){
        others.appendChild(li);
    }
})
};
