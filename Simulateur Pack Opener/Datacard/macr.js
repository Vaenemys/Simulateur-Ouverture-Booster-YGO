class Card {
    constructor(element) {
        this.id = element.id;
        this.name = element.name;
        this.type = element.type;
        this.desc = element.desc;
        this.atk = element.atk;
        this.def = element.def;
        this.level = element.level;
        this.race = element.race;
        this.attribute = element.attribute;
        this.archetype = element.archetype;
        this.image = element.card_images[0].image_url_small;
        for (let set in element.card_sets) {
            if (element.card_sets[set].set_name === "Maximum Crisis") {
                this.rarity = element.card_sets[set].set_rarity;
            }
        }
    }
}

var boosterOpened = 0
function openBooster() { // Fonction qui permet de supprimer les éventuels cartes présentes pour en afficher 9 nouvelles

    let suppr = document.getElementById('#open')
    if (suppr != null) {
        suppr.innerHTML = "";
    }
    cardsData();
    sleep(500);
}

const sleep = (milliseconds) => { // Fonction pour créer une pause
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function cardsData() { // Récupération de données d'API
    fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?cardset=maximum%20crisis')
        .then(response => {return response.json()})
        .then(json => makeSet(json.data));
}

function makeSet(data) {
    let set = [];
    for (let element in data) {
        let card = new Card(data[element]);
        set.push(card);
    }
    boosterChance(set);
}

var boosterOpened
boosterOpened == 0


function boosterChance(set) {

    boosterOpened++
    if (boosterOpened == 4 || boosterOpened == 8)
        makeUltraBooster(set);
    
    else if (boosterOpened == 12){
        makeSecretBooster(set);
    }
    else
        makeBooster(set);
    if (boosterOpened == 13)
        boosterOpened = 1;
    console.log(boosterOpened)
}


function makeBooster(set) {
    let booster = [];
    for (let i = 0; i < 7; i++) {
        let pushedCard = null;
        while (pushedCard == null) {
            let card = set[Math.floor(Math.random() * set.length)];
            if (card.rarity === "Common") {
                pushedCard = card;
            }
        }
        booster.push(pushedCard);
    }

    let pushedCard = null;
    while (pushedCard == null) {
        let card = set[Math.floor(Math.random() * set.length)];
        if (card.rarity === "Rare") {
            pushedCard = card;
        }

    }
    booster.push(pushedCard);

    let pushedSuperCard = null;
    while (pushedSuperCard == null) {
        let card = set[Math.floor(Math.random() * set.length)];
        if (card.rarity === "Super Rare") {
            pushedSuperCard = card;
        }

    }
    booster.push(pushedSuperCard);

    displayBooster(booster);
}

function makeUltraBooster(set) {
    let booster = [];
    for (let i = 0; i < 7; i++) {
        let pushedCard = null;
        while (pushedCard == null) {
            let card = set[Math.floor(Math.random() * set.length)];
            if (card.rarity === "Common") {
                pushedCard = card;
            }
        }
        booster.push(pushedCard);
    }
    
    let pushedCard = null;
    while (pushedCard == null) {
        let card = set[Math.floor(Math.random() * set.length)];
        if (card.rarity === "Rare") {
            pushedCard = card;
        }

    }
    booster.push(pushedCard);

    let pushedUltraCard = null;
    while (pushedUltraCard == null) {
        let card = set[Math.floor(Math.random() * set.length)];
        if (card.rarity === "Ultra Rare") {
            pushedUltraCard = card;
        }

    }
    booster.push(pushedUltraCard);

    displayBooster(booster);
}

function makeSecretBooster(set) {
    let booster = [];
    for (let i = 0; i < 7; i++) {
        let pushedCard = null;
        while (pushedCard == null) {
            let card = set[Math.floor(Math.random() * set.length)];
            if (card.rarity === "Common") {
                pushedCard = card;
            }
        }
        booster.push(pushedCard);
    }
    
    let pushedCard = null;
    while (pushedCard == null) {
        let card = set[Math.floor(Math.random() * set.length)];
        if (card.rarity === "Rare") {
            pushedCard = card;
        }

    }
    booster.push(pushedCard);

    let pushedSecretCard = null;
    while (pushedSecretCard == null) {
        let card = set[Math.floor(Math.random() * set.length)];
        if (card.rarity === "Secret Rare") {
            pushedSecretCard = card;
        }

    }
    booster.push(pushedSecretCard);

    displayBooster(booster);
}

function displayBooster(booster) { // Affiche le contenu du booster
    let div = document.querySelector('#open');
    div.innerHTML = ""
    let ul = document.createElement('ul');
    for (let card in booster) {
        let li = document.createElement('li');
        li.setAttribute('id','card');
        let cardText = document.createElement('p');
        let cardTextNode = document.createTextNode("Nom de la carte :" + booster[card].name +
            "\n Carte :" + booster[card].type +
            "\n Type : " + booster[card].race +
            "\n Attribut : " + booster[card].attribute +
            "\n Niveau : " + booster[card].level +
            "\n Attaque : " + booster[card].atk +
            "\n Défense : " + booster[card].def +
            "\n Echelle pendule : " + booster[card].scale +
            "\n Classification lien : " + booster[card].linkval +
            "\n Marqueurs lien : " + booster[card].linkmarkers +
            "\n Effet : " + booster[card].desc +
            "\n ID : " + booster[card].id +
            "\n Rareté : " + booster[card].rarity);
        cardText.appendChild(cardTextNode);
        let cardImage = document.createElement('img');
        cardImage.setAttribute("src", booster[card].image);
        li.appendChild(cardText);
        li.appendChild(cardImage);
        ul.appendChild(li);
    }
    div.appendChild(ul);
}

function chosen() { // Fonction qui permet de déplacer le nom de la carte choisie dans le tableau
    let tr = document.querySelector('#choseme');
    let td = document.createTextNode(card.name + " | ");
    tr.appendChild(td);
}