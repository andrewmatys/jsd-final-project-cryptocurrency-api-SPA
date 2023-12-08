// coinmarketcap api_key = '7f07d733-d208-480d-856c-b4d39a6e3a82'

const cryptoApp = {

    config: {
        API_KEY: "CG-M3ddJzw2sxTATAdYL5RXKwb5", // COIN GECKO API
        CRYPTO_BASE_URL: "https://api.coingecko.com/api/v3/coins/markets",
        CRYPTO_FULL_LIST: "https://api.coingecko.com/api/v3/coins/list"
        //CRYPTO_TOP_TEN_URL_Query: "coins/markets?vs_currency=aud&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en&precision=2"
    },

        //testURL = https://api.coingecko.com/api/v3/coins/markets?vs_currency=aud&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en&precision=2&api_key=CG-M3ddJzw2sxTATAdYL5RXKwb5
                    
    dom: {},


    coinExists: false,


    initUI() {

        this.dom = {
            searchForm: document.querySelector('#searchForm'),
            searchText: document.querySelector('#searchText'),
            //searchResults: document.querySelector('#results'),
            //reviewsDiv: document.querySelector('#reviews'),
            topTenCoinsDiv: document.querySelector('.topTen'),
            coinDetails: document.querySelector('#coinDetails'),
            topTenHeading: document.querySelector('#topTenHeading')
        };
    

        this.dom.searchText.focus();                                    // cursor appears in form


        this.dom.searchForm.addEventListener('submit', (ev) => {
            //this.dom.topTenHeading.replaceChildren();// clear top10 heading. CHECK IF NEEDED
            this.dom.topTenCoinsDiv.replaceChildren();                  // delete TOP 10 COIN LIST once form submitted    CHECK IF NEEDED
            //console.log(`Form submitted! ie BUTTON CLICKED`, Math.random());
            console.log('Value submitted:', this.dom.searchText.value); // user input
            const coinId = this.dom.searchText.value.toLowerCase();         // to suit 'id' key value
            
            ev.preventDefault();                                        // prevent form submit page reload upon user submit button ALLOW TO RELOAD
        
            this.coinChecker(coinId);
        }); // addEventListener 'submit' event for submit form
   


        this.dom.topTenCoinsDiv.addEventListener('click', (ev) => {
            if (ev.target.nodeName === 'P'){
                console.log(`Top 10 coin clicked: `, ev.target.dataset.id);
            }
        this.loadCoinDetails(ev.target.dataset.id);
        }); // addEventListener 'CLICK' event for top 10 coins list

    }, // initUI()



    loadTopTen() {

        axios.get(this.config.CRYPTO_BASE_URL, {
            params: {
                vs_currency: 'aud',             // currency type
                order: 'market_cap_desc',       // list order by: type_descending/ascending
                per_page: 10,                   // results per page
                page: 1,                        // number of pages
                locale: 'en',                   // language
                precision: 2,                   // number of decimals
                api_key: this.config.API_KEY
            }
        })
        .then( (res) => {
            //console.log(`Top 10 crypto coins by marketcap: `, res.data);
            this.renderTopTen(res.data);                                // run renderTopTen function where the argument is an array of the top 10 coins as per URL criteria
        }) //.then()
        .catch( (err) => {
            console.warn(`There was an error loading top 10 currencies...`, err);
        }); //.catch()
      
    }, // loadTopTen()



    renderTopTen(coins) {
        
        //console.log(`Array of top 10 coins: `, coins);                    // array of top 10 coins by marketcap value passed to function
        let orderNumber = 1;
        for(const coin of coins){
            console.log('COIN URL', coin.image);
            const pTag = document.createElement('p');
            const imgNode = document.createElement('img');
            const lineBreak = document.createElement('br');

            pTag.innerHTML += (orderNumber + '. ' + coin.name + ': $' + coin.current_price);    // display coin and it's current price (top 10)
            pTag.dataset.id = coin.id;                                      // adds new attribute called "data-id" to the 'p' tag, which then stores the JSON key 'id' value of each coin. 'id' in this case is the name of the coin in lowerCase.
               

            
            imgNode.src = coin.image;    
            imgNode.alt = `Coin Image`;
            // dataset make a new att:
            // <img data-id="${movie.id)" src=...>
            imgNode.dataset.id = coin.id;   // new att added "data-id"     //  allocates 'id' to popular movies
            
            //this.dom.popularDiv is a DOM node we can append CHILD (img) to 
            


            orderNumber++;                                                 // increment top 10 counter by 1
            //console.log('Image URL:', this.generateImageURL(coin.id));
            this.dom.topTenCoinsDiv.appendChild(imgNode);                  // this.dom.topTenCoinsDiv is a DOM node we can append CHILD (imgTag) to 
            this.dom.topTenCoinsDiv.appendChild(lineBreak);                // this.dom.topTenCoinsDiv is a DOM node we can append CHILD (imgTag) to 
            this.dom.topTenCoinsDiv.appendChild(pTag);                     // this.dom.topTenCoinsDiv is a DOM node we can append CHILD (pTag) to 

        }

    }, // renderTopTen())

 

    coinChecker(inputData) {                               
        console.log('arg passed to coinChecker():', inputData);

        axios.get(this.config.CRYPTO_FULL_LIST, {
            params: {
                //include_platform: false,        // include platform contract addresses
                vs_currency: 'aud',             // currency type
                api_key: this.config.API_KEY
            }
        })
        .then( (res) => { 
            console.log('FULL list of coins: ', res.data);

            for (const coin of res.data){                   // AXIOS get list successful, now do coin match and if that is successful: load data for coin)  
                if (coin.id === inputData){        
                    //console.log('COIN MATCHED!!!:', inputData);
                    //console.log('coin.id KEY value: ', coin.id);
                    this.coinExists = true;                 // set global variable to true
                   
                }
            } // for loop 

            if (this.coinExists) {     
                //console.log('coinExists: status', this.coinExists);       //Check
                axios.get(this.config.CRYPTO_BASE_URL, {
                    params: {
                        ids: inputData,                 // coin name. Can use what the user entered or the coins id as have both ie 'inputData' OR 'coin.id'
                        vs_currency: 'aud',             // currency type
                        per_page: 1,
                        locale: 'en',                   // language
                        precision: 2,                   // number of decimals
                        api_key: this.config.API_KEY
                    }
                })
                .then( (result) => { 
                    console.log(`Since Coin exists. Data following: `, result.data);       //WRONG DATA if empty string OR invalid coin id entered...
                    this.loadCoinDetails(inputData); 
                }) // .then()
                .catch( (error) => {
                console.log(`Error loading data for the selected coin...`, error);
                }) // .catch()       
            } else {
                console.log('COIN DOES NOT EXIST in list!');  
                  // render to HTML //TODO   
            }
        }) //.then()
        .catch( (err) => {
           console.warn(`ERROR loading FULL list of coins`, err);
        }) //.catch()
    }, // coinChecker()
    


    loadCoinDetails(coinName){      

        console.log(`value submitted in form: `, coinName);                      // argument 'coinName' is value submitted in form by user that is verified as an existing coin by func coinchecker()
        //https://api.coingecko.com/api/v3/coins/markets?vs_currency=aud&ids=bitcoin&precision=2
        this.coinExists = false;                                // reset coinChecker()

        axios.get(this.config.CRYPTO_BASE_URL, {
            params: {
                vs_currency: 'aud',              // currency type (input data)
                ids: coinName,                  
                precision: 2,                    // number of decimals
                api_key: this.config.API_KEY
            }
        })
        .then( (res) => {

            console.log(`Coin details - Array of Objects:`, res.data);
            console.log('details to be printed:', res.data[0].id, res.data[0].symbol, res.data[0].name, res.data[0].market_cap, res.data[0].price_change_24h, res.data[0].price_change_percentage_24h, res.data[0].ath);

            this.renderCoinDetails(res.data) // pass selected movie object to func renderMovieDetails()            
        }) //.then()
        .catch( (err) => {
            console.warn(`There was an error....`, err);
        }) //.catch()

    }, // loadMovieDetails()



    renderCoinDetails(selectedCoin){
        console.log('Coin details in render function: ', selectedCoin); 

        //this.dom.topTenHeading.replaceChildren();// clear top10 heading
        this.dom.topTenCoinsDiv.replaceChildren();// clear top10 list
        this.dom.coinDetails.replaceChildren(); //clear if new search???????

        //this.dom.searchForm.style.display = 'none'; // hide searchbar KEEP FOR FURTHER SEARCHES???? CHECK

        //this.dom.coinDetails.style.display = 'block';  //CSS unhide movies
        //this.dom.coinDetails.replaceChildren(); //clear if new search???????

        const headingTag = document.createElement('h2'); 
        headingTag.classList.add('coinDetails'); // add class to h2

        console.log('coin id:', selectedCoin[0].id)
        headingTag.innerHTML = selectedCoin[0].name; // or coin.name????? (capitalised)

        this.dom.coinDetails.appendChild(headingTag);

        const imgTag = document.createElement('img');
        imgTag.classList.add('resultImage'); // add class to img
        imgTag.src = selectedCoin[0].image; 
        imgTag.alt = selectedCoin[0].name;
        // add IMG to DOM
        this.dom.coinDetails.appendChild(imgTag);

        const pTag = document.createElement('p');
        pTag.innerHTML = `SYMBOL: ${selectedCoin[0].symbol.toUpperCase()} <br/>`;
        pTag.innerHTML += `CURRENT PRICE: $${Number(selectedCoin[0].current_price.toFixed(2)).toLocaleString()} <br/>`;
        pTag.innerHTML += `MARKETCAP: $${selectedCoin[0].market_cap.toLocaleString()} <br/>`;
        pTag.innerHTML += `PRICE CHANGE LAST 24HRS: $${Number(selectedCoin[0].price_change_24h.toFixed(3))} <br/>`;
        pTag.innerHTML += `PRICE CHANGE % LAST 24HRS: ${Number(selectedCoin[0].price_change_percentage_24h.toFixed(2))}% <br/>`;
        pTag.innerHTML += `ALL TIME HIGH: $${Number(selectedCoin[0].ath.toFixed(2)).toLocaleString()} <br/>`;
    
        this.dom.coinDetails.appendChild(pTag);

    },// renderCoinDetails()




////////////////////////////////////////////////////////ABOVE COMPLETE////////////////////////////////////////////////////////

// -change so that generateIMG for top10 and coin details use the BELOW function::
////////////////////////////////////////////////////////WORK BELOW/////////////////////////////////////////////////////////////////



        
    generateImageURL(coinId){ 
        axios.get(this.config.CRYPTO_FULL_LIST, {
            params: {
                vs_currency: 'aud',             // currency type
                api_key: this.config.API_KEY
            }
        })
        .then( res => {
            console.log('coin URL: ', res.data[0].image);
            coinImage = res.data[0].image;
            return coinImage;
        })
        .catch( (err) => {
            console.warn(`There was an error loading image....`, err);
        }) //.catch()
        
    }, // generateImageURL(): returns URL of specific coin as a string

} // cryptoApp


cryptoApp.initUI(); ///initialises ie the methods in the variable don't run automatically
cryptoApp.loadTopTen(); // load and render top 10 crypto coins based on total marketcap





/*
TODO:
============================================================
- RENDER MESSAGE TO USER "coin does not exist" in HTML (not just console.log)

- make when click coin (top 10) CSS shadow dissappear??

- style with CSS
- remove unused CSS

- disable green highlight of info box on coin details screen

- check if need to add a dataset att

- incorporate generateImg function

CHALLENGES FACED:
===========================================================
- created coinChecker() 
- many coins had the same name values in different keys e.g.  (id:"bitcoin", symbol: "btc", name: "Bitcoin") VS (id:"elonXAIDogeMessi69PepeInu", symbol:"bitcoin", name:"ElonXAIDogeMessi69PepeInu") 
Therefore had to locate coins using 'id key' thus 'symbol' & 'name' had to be ignored. Also added a lowercase method to the user input in case typed e.g "Bitcoin".

new methods researched and used:
-Number(): (to round number)
-toLocaleString(): inserts commas into large numbers 
-lots of CSS!


*/
