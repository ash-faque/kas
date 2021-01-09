//TOAST MAKER
function toast(message){
    let msgBloack = document.getElementById('msgBlock');
    let msg = `<p>${message}</p>`;
    msgBloack.innerHTML = msg;
}

// GET REFERENCE TO COMMODITIES AND PASS IT TO SNAPSHOT DATA
var commodity = db.collection("commodities");
function getRates(commodity){
    commodity.get().then(querySnapshot => {
        toast('got commodities')
        inputRates(querySnapshot.docs);
    }, err => console.log(err.message));    
};

// INPUT MARKET RATES
const grains = document.getElementById('grains');
const vegetables = document.getElementById('vegetables');
const fruits = document.getElementById('fruits');
const dairys = document.getElementById('dairy');
const oils = document.getElementById('oils');
const others = document.getElementById('others');
const rateUls = [grains, vegetables, fruits, dairys, oils, others]
const inputRates = (data) => {
    rateUls.forEach(ul => ul.innerHTML = '');
    data.forEach(doc => {
        const item = doc.data();
        function quantityShower(){
            if (item.perkilo == true){
                return " ₹/kg";
            } else {
                return " ₹/ltr";
            }
        }
        function availablityShower(){
            if (item.availablity == true){
                return '<input class="checkbox-avl" type="checkbox" name="avl" checked>';
            } else {
                return '<input class="checkbox-avl" type="checkbox" name="avl">';
            }
        }
        const li = document.createElement("LI");
        li.setAttribute("data-id", `${doc.id}`);               
        li.innerHTML = `<form class="rate-show">
                            <div class="detail">
                                <label for="rate">${item.e_name}</label>
                                <input class="input-rate" type="number" name="rate" value="${item.rate}" required>
                                <span>${quantityShower()}</span>
                                ${availablityShower()}
                                <button class="expander" type="button" onclick="expandMore(this)">❇</button>
                                <div class="more-detail">
                                    <input type="text" name="e_name" class="name" placeholder="${item.e_name}" required>
                                    <input type="text" name="m_name" class="name" placeholder="${item.m_name}" required>
                                    <input type="text" name="h_name" class="name" placeholder="${item.h_name}" required>
                                    <input type="text" name="info" placeholder="${item.icon}">
                                    <input type="text" name="link" placeholder="${item.link}">
                                </div>
                            </div>
                            <button class="delete" id="${doc.id}" type="button" onclick="deleteItem(this);">✖</button>
                            <button class="update" type="button" onclick="updateItem(this);">✔</button>
                        </form>`;     
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
        }
    })
};

// ADD RATE
const addForm = document.querySelector('#add-form');
const catogaries = Array.from(document.getElementsByName('catogary'));
function catogarySelected(){
    if (catogaries[0].checked){
        return catogaries[0].value;
    } else if (catogaries[1].checked){
        return catogaries[1].value;
    } else if (catogaries[2].checked){
        return catogaries[2].value;
    } else if (catogaries[3].checked){
        return catogaries[3].value;
    } else if (catogaries[4].checked){
        return catogaries[4].value;
    } else if (catogaries[5].checked){
        return catogaries[5].value;
    } else {
        return "other";
    };
};
const qtys = Array.from(document.getElementsByName('qty'));
function qtySelected(){
    if (qtys[0].checked){
        return qtys[0].value;
    } else if (qtys[1].checked){
        return qtys[1].value;
    } else if (qtys[3].checked){
        return qtys[3].value;
    };
};
const avl = document.getElementById('availablity');
function checkedWhat(among){
    if(among.value == 'on'){
        return true;
    } else {
        return false;
    };
};
addForm.addEventListener('submit', (e) => {
  e.preventDefault();
   commodity.add({
    e_name: addForm.e_name.value,
    m_name: addForm.m_name.value,
    h_name: addForm.h_name.value,
    icon: addForm.info.value,
    link: addForm.link.value,
    rate: addForm.rate.value,
    per : qtySelected(),
    catogary : catogarySelected(),
    availablity : checkedWhat(avl),
    on : firebase.firestore.Timestamp.now()
  }).then(() => {
    addForm.reset();
    toast('item added succesfully');
    }).catch(err => {
    console.log(err.message, err);
  });
});

// EXPAND MORE
function expandMore(roma){
    let clicked = roma;
    if (clicked.nextElementSibling.style.display == 'none'){
        clicked.nextElementSibling.style.display = 'block';
    } else {
        clicked.nextElementSibling.style.display = 'none';
    };
};

// UPDATE RATE
function updateItem(seema){
   let docId = seema.parentElement.parentElement.getAttribute("data-id");
    function validKey(key){
        if (key.value == ""){
                return key.placeholder;
        } else {
                return key.value;
        };
    };
    commodity.doc(docId).update({
        rate : seema.parentElement[0].value,
        availablity : checkedWhat(seema.parentElement[1]),
        e_name: validKey(seema.parentElement[3]),
        m_name: validKey(seema.parentElement[4]),
        h_name: validKey(seema.parentElement[5]),
        icon: validKey(seema.parentElement[6]),
        link: validKey(seema.parentElement[7]),
        on : firebase.firestore.Timestamp.now()
    }).then(function() {
        toast('item successfully updated')
        commodity.doc(docId).get().then(doc => {
        console.log('got updated document');
        const item = doc.data();
        function availablityUpdater(){
            if (item.availablity == true){
                return 'on';
            } else {
                return '';
            }
        }
        let form = seema.parentElement
        console.log(form);
        form[0].innerHTML = `${item.rate}`;
        form[1].setAttribute('checked', availablityUpdater());
        }, err => console.log(err.message));
    }).catch(function(error) {
        console.error("Error updating document: ", error);
    });
};

// DELETE RATE
function deleteItem(rosy){
    let itemId = rosy.id;
    commodity.doc(itemId).delete().then(function() {
        toast("item successfully deleted");
        rosy.parentElement.parentElement.style.display = "none";
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
};