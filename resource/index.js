//TOAST MAKER
function toast(message){
    let toastBlock = document.getElementById('toastBlock');
    let msg = `<span>${message}</span>`;
    toastBlock.innerHTML = msg;
    setTimeout(function(){ toastBlock.innerHTML = ''; }, 1500);
};

// GET REFERENCE TO COMMODITIES AND GETRATE
var commodity = db.collection("commodities");
const server = { source: 'default' };
const cache = { source: 'cache' };
if (localStorage.lft){
    window.onload = getRates(cache);
} else {
    window.onload = getRates(server);
};

function chooseLn(ln){
    localStorage.ln = ln;
    console.log(ln);
    location.reload();
};
const lnSelection = document.getElementById('ln_selector');
if (localStorage.ln){
    if (localStorage.ln == "e"){
        lnSelection.children[1].style.display = 'none';
    } else if (localStorage.ln == "m"){
        lnSelection.children[2].style.display = 'none';
    } else if (localStorage.ln == "h"){
        lnSelection.children[3].style.display = 'none';
    };
} else {
    localStorage.ln = "h";
};

function getRates(from){
    commodity.get(from).then(querySnapshot => {
        toastSource(querySnapshot);
        inputRates(querySnapshot.docs);
    }, err => console.log(err.message));
};
function triggerFetch(){
    if (localStorage.lft){
        var lft = localStorage.lft;
        var ct = new Date().getTime();
        const threshold = (1000*60) * 1; //minutes to wait
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
        toast('got commodity lists from cache');
    } else {
        localStorage.lft = new Date().getTime();
        toast('got commodity lists from server');
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
    function nameThrow(){
        if (localStorage.ln == "e"){
            return item.e_name;
        } else if ((localStorage.ln == "m") && item.m_name != ""){
            return item.m_name;
        } else if ((localStorage.ln == "h") && item.h_name != ""){
            return item.h_name;
        } else if (item.m_name == ""){
            return item.e_name;
        } else if (item.h_name == ""){
            return item.e_name;
        };
    };
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
            return '<span class="stock inStock">available</span>';
        } else {
            return '<span class="stock outOfStock">out of stock</span>';
        };
    };
    const li = document.createElement("LI");
    li.setAttribute("id", `${doc.id}`);
    li.innerHTML = `<p class="detail">
                        <span class="info" onclick="showInfo(this);">${item.icon != '' ? item.icon: '✨'}</span>
                        <span class="name searchable">${nameThrow()}</span>
                    </p>
                    <div class="more-info" style="display: none; transition: 500ms;">
                        <img src="${item.link}" alt="image of ${item.e_name}">
                        <p>${item.e_name}</p>
                        <p>${item.m_name}</p>
                        <p>${item.h_name}</p>
                        <p onclick="closeCard(this)">✖</p>
                    </div>
                    <p class="tag">
                        <span class="rate">${item.rate}</span>
                        <span class="per">${item.per}</span>
                    </p>
                    <p class="status">
                        ${availablityShower()}
                        <span class="eta">updated${" : " + etaShower(eta)}</span>
                    </p><hr>`;
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

setInterval(triggerFetch, 1000*60);

let input = document.getElementById('search');
function search(){
    window.scrollTo(0,90);
    let searchKey = input.value.toUpperCase();
    let searchables = Array.from((document.getElementsByClassName('searchable')));
    const contains = Array.from(document.querySelectorAll('.container'));
    if (input.value.length > 0){
        contains.forEach(contain => contain.firstElementChild.style.display = 'none');
        for (i = 0; i < searchables.length; i++) {
        let searchInst = searchables[i].textContent.toUpperCase();
            if (searchInst.indexOf(searchKey) > -1) {
                searchables[i].parentElement.parentElement.style.display = 'block';
            } else {
                searchables[i].parentElement.parentElement.style.display = 'none';
            };
        };
    } else {
        contains.forEach(contain => contain.firstElementChild.style.display = 'block');
        searchables.forEach(searchable => searchable.parentElement.parentElement.style.display = 'block');
    };
};

function showInfo(marry){
    let clicked = marry
    clicked.parentElement.nextElementSibling.style.display = 'block';
};
function closeCard(lisa){
    let clicked = lisa
    clicked.parentElement.style.display = 'none';
};