//TOAST MAKER
function toast(message){
    let toastBlock = document.getElementById('toastBlock');
    let msg = `<span>${message}</span>`;
    toastBlock.innerHTML = msg;
    setTimeout(function(){ toastBlock.innerHTML = ''; },3000);
};

// GET REFERENCE TO COMMODITIES AND GETRATE
var commodity = db.collection("commodities");
const server = { source: 'default' };
const cache = { source: 'cache' };
function getRates(from){
    commodity.get(from).then(querySnapshot => {
        toastSource(querySnapshot);
        inputRates(querySnapshot.docs);
    }, err => console.log(err.message));
};
window.onload = getRates(cache);
function triggerFetch(){
    if (localStorage.lft){
        var lft = localStorage.lft;
        var ct = new Date().getTime();
        const threshold = 1000*60*10;
        if ((ct - lft) < threshold){
            //get rate from cache
            getRates(cache);
        } else if ((ct - lft) > threshold){
            //get rate from server
            getRates(server);
        }
    } else {
        //get rate from server
        getRates(server);
    };
};
function toastSource(querySnapshot){
    if (querySnapshot.metadata.fromCache) {
        toast('got commodity lists from cache succesfully');
    } else {
        localStorage.lft = new Date().getTime();
        toast('got commodity lists from server succesfully');
    };
};

// INPUT MARKET RATES
const grains = document.getElementById('grains');
const vegetables = document.getElementById('vegetables');
const fruits = document.getElementById('fruits');
const dairys = document.getElementById('dairy');
const oils = document.getElementById('oils');
const others = document.getElementById('others');
const rateUls = [grains, vegetables, fruits, dairys, oils, others];

const inputRates = (data) => {
    rateUls.forEach(ul => ul.innerHTML = '');
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
        };
    };
    function availablityShower(){
        if (item.availablity == true){
            return '<span class="stock inStock">available for purchase</span>';
        } else {
            return '<span class="stock outOfStock">currently out of stock</span>';
        };
    };
    const li = document.createElement("LI");
    li.setAttribute("id", `${doc.id}`);
    li.innerHTML = `<p class="detail"><span class="name">${item.name}</span><span class="tag"><span class="rate">${item.rate}</span><span class="per">${item.per}</span></span></p>
                    <p class="status">${availablityShower()}<span class="eta">updated${" : " + etaShower(eta)}</span></p>`;
    if (item.catogary == "grain"){
        grains.appendChild(li);
    } else if (item.catogary == "vegetable"){
        vegetables.appendChild(li);
    } else if (item.catogary == "fruit"){
        fruits.appendChild(li);
    } else if (item.catogary == "dairy"){
        dairys.appendChild(li);
    } else if (item.catogary == "oil"){
        oils.appendChild(li);
    } else {
        others.appendChild(li);
    };
});
};
