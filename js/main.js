// LINES TO FIX: 42, 

const cryptoApp = {

    config: {
        API_KEY: "CG-M3ddJzw2sxTATAdYL5RXKwb5", // COIN GECKO API
        CRYPTO_BASE_URL: "https://api.coingecko.com/api/v3/coins/markets",
        CRYPTO_FULL_LIST: "https://api.coingecko.com/api/v3/coins/list"
        //CRYPTO_TOP_TEN_URL_Query: "coins/markets?vs_currency=aud&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en&precision=2"
    },

        //testURL = https://api.coingecko.com/api/v3/coins/markets?vs_currency=aud&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en&precision=2&api_key=CG-M3ddJzw2sxTATAdYL5RXKwb5
                    
    dom: {},


    //coinExists: false,


    initUI() {

        this.dom = {
            searchForm: document.querySelector('#searchForm'),
            searchText: document.querySelector('#searchText'),
            //searchResults: document.querySelector('#results'),
            //reviewsDiv: document.querySelector('#reviews'),
            topTenCoinsDiv: document.querySelector('#topTen'),
            coinDetails: document.querySelector('#details'),

        };
    

        this.dom.searchText.focus();                                    // cursor appears in form


        this.dom.searchForm.addEventListener('submit', (ev) => {
            this.dom.topTenCoinsDiv.replaceChildren();                  // delete TOP 10 COIN LIST once form submitted
            //console.log(`Form submitted! ie BUTTON CLICKED`, Math.random());
            console.log('Value submitted:', this.dom.searchText.value); // user input
            ev.preventDefault();                                        // prevent form submit page reload upon user submit button
                                         
            this.loadCoinDetails(this.coinChecker(this.dom.searchText.value));      // run loadCoinDetails function which runs an AJAX request with 'a validated coin' as argument. coinChecker returns a valid or ERR ...need to FIX THIS
        });// addEventListener 'submit' event for submit form


        this.dom.topTenCoinsDiv.addEventListener('click', (ev) => {
            if (ev.target.nodeName === 'P'){
                console.log(`Top 10 coin clicked: `, ev.target.dataset.id);
            }
        }); // addEventListener 'CLICK' event for top 10 coins list

    }, // initUI()



    loadTopTen() {

        axios.get(this.config.CRYPTO_BASE_URL, {
            params: {
                api_key: this.config.API_KEY,
                vs_currency: 'aud',             // currency type
                order: 'market_cap_desc',       // list order by: type_descending/ascending
                per_page: 10,                   // results per page
                page: 1,                        // number of pages
                sparkline: false,               // use data over last 7 days only
                locale: 'en',                   // language
                precision: 2                    // number of decimals
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
        
        //console.log(`Array of top 10 coins: `, coins);                // array of top 10 coins by marketcap value passed to function
        let orderNumber = 1;
        for(const coin of coins){
            //console.log(coin.name);
            const pTag = document.createElement('p');
            pTag.innerHTML += (orderNumber + '. ' + coin.name + ': $' + coin.current_price);    // display coin and it's current price (top 10)
            pTag.dataset.id = coin.id;                                  // adds new attribute called "data-id" to the 'p' tag, which then stores the JSON key 'id' value of each coin. 'id' in this case is the name of the coin in lowerCase.
            orderNumber++;                                              // increment top 10 counter by 1
            
            this.dom.topTenCoinsDiv.appendChild(pTag);                  // this.dom.topTenCoinsDiv is a DOM node we can append CHILD (pTag) to 


        }

    }, // renderTopTen())

    
    
    coinChecker(inputData) { // this is necesary as a user may type 'BTC' or 'Bitcoin' or 'bitcoin' as searchText run through list 1st
        axios.get(this.config.CRYPTO_FULL_LIST, {
            params: {
                include_platform: false,        // include platform contract addresses
                api_key: this.config.API_KEY,
                vs_currency: 'aud',             // currency type
            }
        })
        .then( (res) => { 
            if (inputData === res.data.id || inputData === res.data.symbol || inputData === res.data.name){
                //this.coinExists = true;
                //return res.data.id;                 // returns the coin's id value ie lowercase name regardless of whether Ticker symbol or name entered.
                axios.get(this.config.CRYPTO_BASE_URL, {
                    params: {
                        api_key: this.config.API_KEY,
                        vs_currency: 'aud',             // currency type
                        per_page: 1,
                        locale: 'en',                   // language
                        precision: 2                    // number of decimals
                    }
                })
                .then( (result) => { 
                    console.log(`Coin found. Data following: `, result.data);  
                    return result.data; //RETURN the 'result.data' back to calling function
                }) // .then()
                .catch( (error) => {
                   console.log(`Error loading data for the selected coin...`, error);
                }) // .catch()
            } // if statement coin check exists
        }) //.then()
        .catch( (err) => {
           console.log(`This coin does not exist...`, err);
        }) //.catch()
    }, // coinChecker()
    


////////////////////////////////////////////////////////ABOVE COMPLETE/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//TODO:
////////////////////////////////////////////////////////////////////////////////////////////////////////
/// enter a coin and load results BELOW:


loadCoinDetails(coinName){

    console.log(`value submitted in form: `, coinName);                      // argument 'coinName' is value submitted in form by user (looking for id to match)
    //https://api.coingecko.com/api/v3/coins/markets?vs_currency=aud&ids=bitcoin&per_page=1&sparkline=false&price_change_percentage=24h&locale=en&precision=2
    axios.get(this.config.CRYPTO_BASE_URL, {
        params: {
            api_key: this.config.API_KEY,
            vs_currency: 'aud',
            ids: coinName,                  // currency type (input data)
            per_page: 1,                    // results per page
            locale: 'en',                   // language
            precision: 2                    // number of decimals 
        }
    })
    .then( (res) => {
        console.log(`Coin details Array of Objects:`, res.data);




        this.renderCoinDetails(res.data) // pass selected movie object to func renderMovieDetails()            
    }) //.then()
    .catch( (err) => {
        console.warn(`There was an error....`, err);
    }) //.catch()

}, // loadMovieDetails()



// renderCoinDetails(selectedCoin){};



} // cryptoApp

cryptoApp.initUI(); ///initialises ie the methods in the variable don't run automatically
cryptoApp.loadTopTen(); // run top 10 crypto

/*
ISSUES/TODO:
- when searching form input will have to be search against: 'data.id' and 'data.symbol' and 'data.name' to capture variations using params CREATE AN IF STATEMENT
if not found then it will be caught can do ERR : coin does not exist

- the search will also have to run again entire number of coins ie all pages to FIND or return NOT FOUND


- use '/coins/list' to list all available coins supported



- use 'BELOW' for coin details including link to IMG
https://api.coingecko.com/api/v3/coins/markets?vs_currency=aud&ids=bitcoin&per_page=1&sparkline=false&price_change_percentage=24h&locale=en&precision=2


- images: render in top 10 list & for coinDetails page

- create a coin list if cannot find coin OR render on main page at start


*/
