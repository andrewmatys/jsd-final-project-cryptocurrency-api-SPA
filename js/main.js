
const cryptoApp = {

    config: {
        API_KEY: "CG-M3ddJzw2sxTATAdYL5RXKwb5", // COIN GECKO API
        CRYPTO_BASE_URL: "https://api.coingecko.com/api/v3/",
        //CRYPTO_TOP_TEN_URL_Query: "coins/markets?vs_currency=aud&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en&precision=2"
    },

        //testURL = https://api.coingecko.com/api/v3/coins/markets?vs_currency=aud&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en&precision=2&api_key=CG-M3ddJzw2sxTATAdYL5RXKwb5
                    
    dom: {},


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
            this.loadSearchResults(this.dom.searchText.value);          // run loadSearchResult function which runs an AJAX request with 'value submitted' as argument
        });// addEventListener 'submit' event for submit form


        this.dom.topTenCoinsDiv.addEventListener('click', (ev) => {
            if (ev.target.nodeName === 'P'){
                console.log(`Top 10 coin clicked: `, ev.target.dataset.id);
            }
        }); // addEventListener 'CLICK' event for top 10 coins list

    }, // initUI()



    loadTopTen() {

        axios.get(this.config.CRYPTO_BASE_URL + 'coins/markets/', {
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



    renderTopTen(coins){
        
        //console.log(`Array of top 10 coins: `, coins);                // array of top 10 coins by marketcap value passed to function
        let orderNumber = 1;
        for(const coin of coins){
            //console.log(coin.name);
            const pTag = document.createElement('p');
            pTag.innerHTML += (orderNumber + '. ' + coin.name + ': $' + coin.current_price);
            pTag.dataset.id = coin.id;                  // adds new attribute called "data-id" to the 'p' tag, which then stores the JSON key 'id' value of each coin. 'id' in this case is the name of the coin in lowerCase.
            orderNumber++;                              // increment top 10 counter by 1
            this.dom.topTenCoinsDiv.appendChild(pTag);  // this.dom.topTenCoinsDiv is a DOM node we can append CHILD (pTag) to 

        }

    }, // renderTopTen())


////////////////////////////////////////////////////////ABOVE COMPLETE/////////////////////////////////////////////////////////////////////////////////////////////////////////////////













////////////////////////////////////////////////////////////////////////////////////////////////////////
/// enter a coin and load results BELOW:










} // cryptoApp

cryptoApp.initUI(); ///initialises ie the methods in the variable don't run automatically
cryptoApp.loadTopTen(); // run top 10 crypto

/*
ISSUES:
- when searching form input will have to be search against: 'data.id' and 'data.symbol' and 'data.name' to capture variations using params
if not found then it will be caught can do ERR : coin does not exist

- the search will also have to run again entire number of coins ie all pages to FIND or return NOT FOUND







*/
