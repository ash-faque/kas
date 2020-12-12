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
        function quantityShower(){
            if (item.perkilo == true){
                return " /kg";
            } else {
                return " /ltr";
            }
        }



function availablityShower(){
    if (item.availablity == true){
        return '<label for="avl"><span>avl?</span><input type="checkbox" name="" id="avl" checked></label>';
    } else {
        return '<label for="avl"><span>avl?</span><input type="checkbox" name="" id="avl"></label>';
    }
}

        const li = document.createElement("LI");
        li.setAttribute("id", `${doc.id}`);               
        li.innerHTML = `<form class="rate-show">
                            <button class="delete" type="button" onclick="deleteItem();">🗑</button>
                            <div class="detail">
                                <label for="rate">${item.name}</label>                  
                                <input type="number" name="rate" value="${item.rate + " ₹ " + quantityShower()}">
                                ${availablityShower()}
                            </div>
                            <button class="update" type="submit" onclick="deleteItem();">⬆</button>
                        </form>`;
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
