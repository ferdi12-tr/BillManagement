// Fatura sınıfın oluşturulması
class bill {
    constructor(billType, billName, billDate, billCost, isPaid) {
        this.billType = billType;
        this.billName = billName;
        this.billDate = billDate;
        this.billCost = billCost;
        this.isPaid = isPaid;
    }
}

// kullanıcı sınıfının oluşturulması
class user {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.amount = 0;
        this.billList = [];
    }

    // kullanıcılara özel fatura ekler.
    addBill(bill) {
        this.billList.push(bill);
    }
    editBill(index, editedbill) { // indexini aldığımız faturanın fatura listesinde güncelleme işlemini yapar
        this.billList.splice(index, 1, editedbill);
    }
}

let users = []; // 
users.push(new user("erhan", "1234"));
users.push(new user("ferdi", "1234"));
users.push(new user("adem", "1234"));
users.push(new user("yasir", "1234"));
users.push(new user("furkan", "1234"));
users.push(new user("fatih", "1234"));
users.push(new user("büşra", "1234"));

const username = document.getElementById("SignInUserName"); // login kullanıcı adı
const password = document.getElementById("SignInUserPassword"); // login parola
const newUsername = document.getElementById("signUpUserName"); // create user username
const newPassword = document.getElementById("signUpUserPassword"); // create user parola
const loginBtn = document.getElementById("signIn");
const newUserBtn = document.getElementById("signUp");

const loginMessage = document.getElementById("loginMessage");
const toggleRegister = document.getElementById("toggleRegister"); // giriş yap ve üye ol grubu
const toggleBill = document.getElementById("toggleBill"); // fatura ekle kısmı

const navButtonGroup = document.getElementById("navButtonGroup"); // navbar buton grubu 
const logOut = document.getElementById("logOut");

const billBtn = document.getElementById("billBtn"); // fatura ekle butonu

const billType = document.getElementById("billType");
const billName = document.getElementById("billName");
const billDate = document.getElementById("billDate");
const billCost = document.getElementById("billCost");
const isPaid = document.getElementById("isPaid");

const billTable = document.getElementById("billTable");

const popUpElement = document.getElementById("popUpOverlay");
const btnAmount = document.getElementById("btnAmount"); // popupdaki buton, bakiye ekleme paneline gider
const btnBill = document.getElementById("btnBill"); // popupdaki buton, fatura ekleme paneline gider
const sectionAmount = document.getElementById("sectionAmount"); //bakiye ekleme paneli
const sectionBill = document.getElementById("sectionBill"); // fatura ekleme ve listeleme paneli

const wallet = document.getElementById("wallet"); // güncel bakiye'deki bakiye miktarı için
const inputWallet = document.getElementById("inputWallet"); // bakiye ekleme işleminin alındığı input
const addWallet = document.getElementById("addWallet");
const nameOfAmount = document.getElementById("nameOfAmount"); // bakiye panelindeki kullanıcı adı kısmı
const navbarAmount = document.getElementById("navbarAmount"); // bakiye ekleme paneline geçen ve bakiyeyi gösteren navbar buton
const navbarBtnBill = document.getElementById("navbarBtnBill"); // fatura işlemleri paneline giden navbar buton
const creditCard = document.getElementById("creditCard"); // kredi kartı input alanı

const isPaidFilter = document.getElementById("isPaidFilter"); // ödenmiş ödenmemiş select kısmı için
var billIndex; // edit yapılan faturanın index bilgisini tutar
let currentUser; // giriş yapan kullanıcı objesini global değişken olarak tanımlanır.
initialState();

function initialState() {
    // sayfa açıldığındaki durum fonksiyonu, ilk çağrılması gerekir
    navButtonGroup.style.display = "none";
}

// kullanıcı sisteme giriş yaptığında çağrılan fonksiyon
function whenLogIn() {
    toggleRegister.style.display = "none";
    toggleBill.style.display = "block";
    navButtonGroup.style.display = "flex";
    popUpElement.style.display = "block";
}

// kullanıcı sistemden çıkış yaptığında çağrılacak fonksiyon
function whenLogOut() {
    navButtonGroup.style.display = "none";
    sectionAmount.style.display = "none";
    toggleBill.style.display = "none";
    sectionBill.style.display = "block";
    toggleRegister.style.display = "block";
    clearInput();
}

function updateTable(filterCondition = "Hepsi") {
    billTable.innerHTML = "";
    var selectedList;

    // ödenme durumuna göre faturaların tabloda gösterilmesi sağlanır. kullanıcı ödenmiş, ödenmemiş ve tüm faturaları görüntüleyebilmektedir.
    if (filterCondition == "Ödenmiş Faturalar") {
        selectedList = currentUser.billList.filter((element) => element.isPaid == "Ödendi");
    } else if (filterCondition == "Ödenmemiş Faturalar") {
        selectedList = currentUser.billList.filter((element) => element.isPaid == "Ödenmedi");
    } else {
        selectedList = currentUser.billList;
    }
    isPaidFilter.value = filterCondition;
    createTableRow(selectedList);
}

// her bir tablo satırını fatura listesine göre oluşturan fonksiyon
function createTableRow(selectedList) {
    for (let i = 0; i < selectedList.length; i++) {
        var bill = selectedList[i]; // i'nci indexteki fatura objesi
        const tr = document.createElement("tr");

        const th = document.createElement("th");
        th.textContent = i + 1;
        const tdType = document.createElement("td");
        tdType.textContent = bill.billType;
        const tdName = document.createElement("td");
        tdName.textContent = bill.billName;
        const tdDate = document.createElement("td");
        tdDate.textContent = bill.billDate;
        const tdCost = document.createElement("td");
        tdCost.textContent = bill.billCost;
        const tdIsPaid = document.createElement("td");
        tdIsPaid.textContent = bill.isPaid;

        // kırmızı çarpı ve yeşil okey iconu için
        const iconIsPaid = document.createElement("i");
        if (bill.isPaid == "Ödendi") {
            iconIsPaid.className = "fa-solid fa-check tc-green";
        } else {
            iconIsPaid.className = "fa-solid fa-xmark tc-red";
        }

        // pay button
        const tdPayBtn = document.createElement("td");
        const payBtn = document.createElement("button");
        const payBtnIcon = document.createElement("i");
        payBtn.appendChild(payBtnIcon);
        tdPayBtn.appendChild(payBtn);
        tdPayBtn.className = "btn-settings";
        payBtn.className = "btn btn-pay"; // buton style ayarlanacak
        payBtnIcon.className = "fa-solid fa-money-check-dollar btn-icon";

        if (bill.isPaid == "Ödenmedi") {
            payBtn.addEventListener("click", () => {
                payBill(i);
            });
        } else {
            payBtn.disabled = true;
            payBtn.className = "";
        }

        // edit button
        const tdEditBtn = document.createElement("td");
        const editBtn = document.createElement("button");
        const editBtnIcon = document.createElement("i");
        editBtn.appendChild(editBtnIcon);
        tdEditBtn.appendChild(editBtn);
        tdEditBtn.className = "btn-settings";
        editBtn.className = "btn btn-edit";
        editBtnIcon.className = "fa-solid fa-pen-to-square btn-icon ";

        editBtn.addEventListener("click", () => {
            editBill(i);
            tr.className = "bg-table";
        });

        // delete button
        const tdDeleteBtn = document.createElement("td");
        const deleteBtn = document.createElement("button");
        const deleteBtnIcon = document.createElement("i");
        deleteBtn.appendChild(deleteBtnIcon);
        tdDeleteBtn.appendChild(deleteBtn);
        tdDeleteBtn.className = "btn-settings";
        deleteBtn.className = "btn btn-delete"; // buton style ayarlanacak ****** Yasir EKLENDİ
        deleteBtnIcon.className = "fa-solid fa-trash-can btn-icon";

        deleteBtn.addEventListener("click", () => {
            deleteBill(i);
        });

        tr.appendChild(th);
        tr.appendChild(tdType);
        tr.appendChild(tdName);
        tr.appendChild(tdDate);
        tr.appendChild(tdCost);
        tr.appendChild(tdIsPaid);
        tdIsPaid.appendChild(iconIsPaid);
        tr.appendChild(tdPayBtn);
        tr.appendChild(tdEditBtn);
        tr.appendChild(tdDeleteBtn);
        billTable.appendChild(tr);
    }
}

// ödeme iconuna tıklandığında event listenerin içinde çağrılan fonksiyon
function payBill(index) {
    const bill = currentUser.billList[index];
    if (Number(bill.billCost > currentUser.amount)) {
        alert("Yetersiz Bakiye \nLütfen Yükleme Yapınız!");
    } else {
        currentUser.amount -= Number(bill.billCost);
        bill.isPaid = "Ödendi";
    }
    updateAmount();
    updateTable(filterCondition = "Ödenmiş Faturalar");
}

// edit iconuna tıklandığında event listenerin içinde çağrılan fonksiyon
function editBill(index) {
    var bill = currentUser.billList[index];
    billType.value = bill.billType;
    billCost.value = bill.billCost;
    billDate.value = bill.billDate;
    billName.value = bill.billName;
    isPaid.checked = bill.isPaid == "Ödendi" ? true : false;
    billBtn.textContent = "Fatura Güncelle";
    billIndex = index;
}

// delete iconuna tıklandığında event listenerin içinde çağrılan fonksiyon
function deleteBill(index) {
    currentUser.billList.splice(index, 1);
    updateTable();
}

loginBtn.addEventListener("click", () => {
    let foundUser = findUser(username.value, password.value);
    if (foundUser) {
        whenLogIn();
        currentUser = foundUser;
        loginMessage.style.display = "none";
        updateAmount(); // kullanıcının bakiyesinin gösterildiği yerleri güncelleyen fonksiyon çağrısı
    } else {
        loginMessage.style.display = "block";
    }
    clearInput();
});

// Ödenmiş, ödenmemiş veya tüm faturaların tabloda gösterilmesi için select ile seçilen opsiyonun alınması 
isPaidFilter.addEventListener("change", (option) => {
    updateTable(option.target.value);
});

newUserBtn.addEventListener("click", () => {
    newUsername.value == "" || newPassword.value == ""
        ? alert("Lütfen boşlukları doldurunuz.")
        : checkUserName(newUsername.value)
            ? alert("Kullanıcı zaten mevcut.")
            : users.push(new user(newUsername.value, newPassword.value));
    clearInput();
});

logOut.addEventListener("click", () => {
    currentUser = null;
    billTable.innerHTML = ""; // çıkış yapıldığında fatura tablosunu sıfırlar
    whenLogOut();
});

// fatura ekle ya da fatura güncelle butonlarının tek buton üzerinden content'e göre işlevinin belirlendiği fonksiyon
billBtn.addEventListener("click", () => {
    if (billBtn.textContent == "Fatura Ekle") {
        createBill();
    } else if (billBtn.textContent == "Fatura Güncelle") {
        currentUser.editBill(
            billIndex,
            new bill(
                billType.value,
                billName.value,
                billDate.value,
                billCost.value,
                isPaid.checked ? "Ödendi" : "Ödenmedi"
            )
        );
        updateTable();
        billBtn.textContent = "Fatura Ekle";
        clearBillInputs();
    }
});

function createBill() {
    if (
        billCost.value >= 0 &&
        billCost.value != "" &&
        billName.value != "" &&
        billDate.value != ""
    ) {
        currentUser.addBill(
            new bill(
                billType.value,
                billName.value,
                billDate.value,
                billCost.value,
                isPaid.checked ? "Ödendi" : "Ödenmedi"
            )
        );
    } else {
        alert("Eksik değer girdiniz.");
    }
    updateTable();
    clearBillInputs();
}

function clearBillInputs() {
    billType.value = "Elektrik";
    billName.value = "";
    billDate.value = "";
    billCost.value = "";
    isPaid.checked = false;
}

// kullanıcı bulunduğunda kullanıcıyı döndürür bulamazsa undefined döndürür
function findUser(username, password) {
    return users.find(
        (user) => user.username == username && user.password == password
    );
}

// kullanıcı varsa true, yoksa false döndürür
function checkUserName(username) {
    return users.find((user) => user.username == username) ? true : false;
}

function clearInput() {
    username.value = "";
    password.value = "";
    newUsername.value = "";
    newPassword.value = "";
}

// popup buttonları

// amount butonu section amount'a yönlendirir
btnAmount.addEventListener("click", () => {
    popUpElement.style.display = "none";
    sectionAmount.style.display = "block";
    sectionBill.style.display = "none";
});

// bill butonu section bill'e yönlendirir
btnBill.addEventListener("click", () => {
    popUpElement.style.display = "none";
    sectionAmount.style.display = "none";
    sectionBill.style.display = "block";
});


const updateAmount = () => {

    // butonları ve wallet yazılarını güncelliyor
    wallet.innerText = currentUser.amount;
    nameOfAmount.innerText = currentUser.username;
    navbarAmount.innerText = "Bakiye: " + currentUser.amount;

    //clear input
    inputWallet.value = "";
    creditCard.value = "";
};

// giriş yapan kullanıcıya para ekliyor.
addWallet.addEventListener("click", () => {
    currentUser.amount += Number(inputWallet.value);
    updateAmount();
});

navbarBtnBill.addEventListener("click", () => {
    sectionAmount.style.display = "none";
    sectionBill.style.display = "block";
    updateTable(); //eklendi
});

navbarAmount.addEventListener("click", () => {
    sectionBill.style.display = "none";
    sectionAmount.style.display = "block";
});