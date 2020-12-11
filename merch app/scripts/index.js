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
        const li = document.createElement("LI");
        li.setAttribute("id", `${doc.id}`);               
        li.innerHTML = `<form>
                            <label for="rate">${item.name}</label>                  
                            <input type="number" name="rate" id="" value="${item.rate}">
                            <p>updated ${etaShower(eta)}</p>
                            <button type="submit">update</button>
                        </form>
                        <button type="button" onclick="deleteItem();">delete item</button>`;
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
