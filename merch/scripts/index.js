// GET REFERENCE TO COMMODITIES AND PASS IT TO SNAPSHOT DATA
var commodity = db.collection("commodities");
function getRates(commodity){
    commodity.get().then(querySnapshot => {
        inputRates(querySnapshot.docs);
    }, err => console.log(err.message));    
};





/* function toast(message){
    let msgBloack = document.getElementById('message');
    let msg = `<p>${message}</p>`;
    msgBloack.appendChild(msg);

} */







// INPUT MARKET RATES
const grains = document.getElementById('grains');
const vegetables = document.getElementById('vegetables');
const fruits = document.getElementById('fruits');
const dairys = document.getElementById('dairy');
const others = document.getElementById('others');
const rateUls = [grains, vegetables, fruits, dairys, others]
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
                            <button class="delete" id="${doc.id}" type="button" onclick="deleteItem(this);">✖</button>
                            <div class="detail">
                                <label for="rate">${item.name}</label>                  
                                <input type="number" name="rate" value="${item.rate}" required>
                                <span>${quantityShower()}</span>
                                ${availablityShower()}
                            </div>
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
    } else {
        return "other";
    }
};
const perWhat = document.getElementById('perKilo');
const avl = document.getElementById('availablity');
function checkedWhat(among){
    if(among.value == 'on'){
        return true;
    } else {
        return false;
    }
};

addForm.addEventListener('submit', (e) => {
  e.preventDefault();
   commodity.add({
    name: addForm.name.value,
    rate: addForm.rate.value,
    catogary : catogarySelected(),
    availablity : checkedWhat(avl),
    perkilo : checkedWhat(perWhat),
    on : firebase.firestore.Timestamp.now()
  }).then(() => {
    // close the create modal & reset form
    addForm.reset();
     }).catch(err => {
    console.log(err.message);
  });
});

// UPDATE RATE
function updateItem(seema){
   let docId = seema.parentElement.parentElement.getAttribute("data-id");
    commodity.doc(docId).update({
        rate : seema.parentElement[1].value,
        availablity : checkedWhat(seema.parentElement[2]),
        on : firebase.firestore.Timestamp.now()
    }).then(function() {
        console.log("Document successfully updated!");
    }).catch(function(error) {
        console.error("Error updating document: ", error);
    });
};

    
// DELETE RATE
function deleteItem(rosy){
    let itemId = rosy.id;
    commodity.doc(itemId).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
};