
const cryptoApp = {

    config: {
        API_KEY: "CG-M3ddJzw2sxTATAdYL5RXKwb5", // COIN GECKO API
        CRYPTO_BASE_URL: "https://api.coingecko.com/api/v3/coins/markets",
        CRYPTO_FULL_LIST: "https://api.coingecko.com/api/v3/coins/list",
        CRYPTO_TRENDING_URL: "https://api.coingecko.com/api/v3/search/trending"
    },
    
                    
    dom: {},


    coinExists: false,


    initUI() {

        this.dom = {
            searchForm: document.querySelector('#searchForm'),
            searchText: document.querySelector('#searchText'),
     
            topTenHeadingDiv: document.querySelector('#topTenHeading'),
            topTenCoinsDiv: document.querySelector('.topTen'),
            coinDetailsDiv: document.querySelector('.coinDetails'), // was #coindetails
         
            navBar: document.querySelector('.navBar'),
            errorMessageDiv: document.querySelector('#error'),

            trendingDivHeading: document.querySelector('.trendingHeading'),
            trendingCoinsDiv: document.querySelector('#coinsTrending'),
            trendingNftsDiv: document.querySelector('#nftsTrending')
        };
    


        this.dom.searchText.focus();                                    // cursor appears in form


        // form submitted
        this.dom.searchForm.addEventListener('submit', (ev) => {
            //this.dom.topTenHeading.replaceChildren();// clear top10 heading. CHECK IF NEEDED
            this.dom.topTenCoinsDiv.replaceChildren();                 //does this deleta the heading for good ie top 10 coins div
            //console.log(`Form submitted! ie BUTTON CLICKED`, Math.random());
            console.log('Value submitted:', this.dom.searchText.value); // user input
            const coinId = this.dom.searchText.value.toLowerCase();         // to suit 'id' key value
            
            ev.preventDefault();                                        // prevent form submit page reload upon user submit button ALLOW TO RELOAD
        
            this.coinChecker(coinId);
        }); // addEventListener 'SUBMIT' event for submit form
   

        
        // Top 10 clicked
        this.dom.topTenCoinsDiv.addEventListener('click', (ev) => {
            if (ev.target.nodeName === 'P'){
                console.log(`Top 10 coin clicked: `, ev.target.dataset.id);
            }  
            
            console.log('this is passed to loadCoinDetails():', ev.target.dataset.id); // name of coin (data-id)

            this.loadCoinDetails(ev.target.dataset.id); 
        }); // addEventListener 'CLICK' event for top 10 coins list



        //Homepage/Trending NAVbar
        this.dom.navBar.addEventListener('click', (ev) => {
            // if (ev.target.nodeName === 'LI'){
            //     console.log(`Nav bar item clicked!`, ev.target);
            if(ev.target.id === 'home'){
                console.log(`Home clicked!`, ev.target);
                this.loadTopTen();
            } else if (ev.target.id === 'trending'){
                console.log(`Trending clicked!`, ev.target);
                this.loadTrending();
            }
        }); // addEventListener 'CLICK' event for Home/Trending NAVbar




// CREATE DATASET for TRENDING???
////////////////////////////////////////////////////////////////////////////////////
        // Top 10 clicked
        this.dom.trendingCoinsDiv.addEventListener('click', (ev) => {
            if (ev.target.nodeName === 'P'){
                console.log(`Trending coin clicked: `, ev.target.dataset.id);
            }  
            
            console.log('this is passed to loadCoinDetails():', ev.target.dataset.id); // name of coin (data-id) from trending list

            this.loadCoinDetails(ev.target.dataset.id); 
        }); // addEventListener 'CLICK' event for trending coins list







////////////////////////////////////////////////////////////////////////////////////
































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
            console.log(`Top 10 crypto coins by marketcap: `, res.data);
            this.renderTopTen(res.data);                             // run renderTopTen function where the argument is an array of the top 10 coins each element an object containing specific coin data
        }) //.then()
        .catch( (err) => {
            console.warn(`There was an error loading top 10 currencies...`, err);
        }); //.catch()
      
    }, // loadTopTen()




    renderTopTen(coins) {
        
        this.dom.topTenHeadingDiv.style.display = 'block';  
        this.dom.errorMessageDiv.style.display = 'none';           //clear any error messages YES
        this.dom.coinDetailsDiv.replaceChildren();                 //clear if homepage laoded from navbar YES
        this.dom.trendingDivHeading.style.display = 'none';        //hide headings for trending
        this.dom.topTenCoinsDiv.replaceChildren();
        
        console.log(`Array of top 10 coins: `, coins);             // array of top 10 coins by marketcap value passed to function. Contains an array of object details for each coin ie 10 object elements within array
       
        let orderNumber = 1;

        for(const coin of coins){
            console.log('COIN URL', coin.image);
            const pTag = document.createElement('p');
            const imgNode = document.createElement('img');
            const lineBreak = document.createElement('br');

            pTag.innerHTML += (orderNumber + '. ' + coin.name + ': $' + coin.current_price);    // display coin and it's current price (top 10)
            pTag.dataset.id = coin.id;                              // adds new attribute called "data-id" to the 'p' tag, which then stores the JSON key 'id' value of each coin. 'id' in this case is the name of the coin in lowerCase.
               
            imgNode.src = coin.image;    
            imgNode.alt = `Coin Image`;
       
            imgNode.dataset.id = coin.id;   // new att added "data-id"     //  allocates 'id' to top10coins
            
            orderNumber++;                                                 // increment top 10 counter by 1
            this.dom.topTenCoinsDiv.appendChild(imgNode);                  // this.dom.topTenCoinsDiv is a DOM node we can append CHILD (imgTag) to 
            this.dom.topTenCoinsDiv.appendChild(lineBreak);                
            this.dom.topTenCoinsDiv.appendChild(pTag);                     // this.dom.topTenCoinsDiv is a DOM node we can append CHILD (pTag) to 
        }

    }, // renderTopTen())

 


    coinChecker(inputData) {      

        console.log('arg passed to coinChecker():', inputData);

        axios.get(this.config.CRYPTO_FULL_LIST, {
            params: {
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
                    //this.loadCoinDetails(inputData); 
                    this.loadCoinDetails(result.data);  //send data arrray to load coin details/render (confirmed coin)

                }) // .then()
                .catch( (error) => {
                console.log(`Error loading data for the selected coin...`, error);
                }) // .catch()       
            } else {
                console.log('COIN DOES NOT EXIST in list!');  
                this.dom.errorMessageDiv.style.display = 'block';       // error message appears thus remove previous h2 and details of correct coin if any
                this.dom.coinDetailsDiv.replaceChildren();              //clear existing h2 and details of correct coin if any when error occurs YES
                this.dom.topTenHeadingDiv.style.display = 'none';       // hide top10Heading if error loads YES
                
                this.dom.trendingDivHeading.style.display = 'none';     //hide headings for trending
            }
        }) //.then()
        .catch( (err) => {
           console.warn(`ERROR loading FULL list of coins`, err);
        }) //.catch()

    }, // coinChecker()
    



    loadCoinDetails(coinName) {      

        console.log(`value submitted in form/passed from top10 click event: `, coinName);                      // argument 'coinName' is value submitted in form by user that is verified as an existing coin by func coinchecker()
         
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
            console.log(`Coin details - Array of Objects of entered coin:`, res.data);
            console.log('details to be printed:', res.data[0].id, res.data[0].symbol, res.data[0].name, res.data[0].market_cap, res.data[0].price_change_24h, res.data[0].price_change_percentage_24h, res.data[0].ath);
            this.renderCoinDetails(res.data) // pass selected movie object to func renderMovieDetails()            
        }) //.then()
        .catch( (err) => {
            console.warn(`There was an error....`, err);
        }) //.catch()
}, // loadCoinDetails()




    renderCoinDetails(selectedCoin) {

        console.log('Coin details in render function: ', selectedCoin);  // contains the array with all object data of specified coin.
     
        this.dom.topTenHeadingDiv.style.display = 'none';
        this.dom.topTenCoinsDiv.replaceChildren();// clear top10 list INCLUDES 'H3' AND 'P'... YES
        
        this.dom.coinDetailsDiv.replaceChildren(); //clear if new search ... YES
        this.dom.errorMessageDiv.style.display = 'none'; //clear any error messages... YES
        this.dom.trendingDivHeading.style.display = 'none';                //hide headings for trending (TEST) and also add the 2x coins/NFTS trending replaceChildren()


        const headingTag = document.createElement('h2'); // create the heading for a SELECTED individual coin
        headingTag.classList.add('coinDetails'); // add class to h2

        console.log('coin id:', selectedCoin[0].id)
        headingTag.innerHTML = selectedCoin[0].name; // or coin.name????? (capitalised)

        this.dom.coinDetailsDiv.appendChild(headingTag);

        const imgTag = document.createElement('img');
        imgTag.classList.add('resultImage'); // add class to img
        imgTag.src = selectedCoin[0].image; 
        imgTag.alt = selectedCoin[0].name;
        // add IMG to DOM
        this.dom.coinDetailsDiv.appendChild(imgTag);

        const pTag = document.createElement('p');
        pTag.innerHTML = `SYMBOL: ${selectedCoin[0].symbol.toUpperCase()} <br/>`;
        pTag.innerHTML += `CURRENT PRICE: $${Number(selectedCoin[0].current_price.toFixed(2)).toLocaleString()} <br/>`;
        pTag.innerHTML += `MARKETCAP: $${selectedCoin[0].market_cap.toLocaleString()} <br/>`;
        pTag.innerHTML += `PRICE CHANGE LAST 24HRS: $${Number(selectedCoin[0].price_change_24h.toFixed(3))} <br/>`;
        pTag.innerHTML += `PRICE CHANGE % LAST 24HRS: ${Number(selectedCoin[0].price_change_percentage_24h.toFixed(2))}% <br/>`;
        pTag.innerHTML += `ALL TIME HIGH: $${Number(selectedCoin[0].ath.toFixed(2)).toLocaleString()} <br/>`;
    
        this.dom.coinDetailsDiv.appendChild(pTag);
                
    },// renderCoinDetails()



        
    loadTrending() {

        axios.get(this.config.CRYPTO_TRENDING_URL, {
            params: {
                api_key: this.config.API_KEY
            }
        })
        .then( (res) => {
        //let trendingArray = res.data.coins.filter( (element, index, arr) => index < 20);
            console.log(`Top Trending Coins by activity: `, res.data.coins);
            console.log(`Top Trending NFTs by activity: `, res.data.nfts);
            this.renderTrending(res.data.coins,  res.data.nfts);               
        }) //.then()
        .catch( (err) => {
            console.warn(`There was an error loading trending...`, err);
        }); //.catch()
    
    }, // loadTrending()




    renderTrending(coins, nfts) {
        
        this.dom.trendingCoinsDiv.replaceChildren();    // replace any EXISTING trending coins
        this.dom.trendingNftsDiv.replaceChildren();      // replace any EXISTING trending NFTs

        this.dom.errorMessageDiv.style.display = 'none'; //clear any error messages YES

        this.dom.topTenHeadingDiv.style.display = 'none';
        this.dom.topTenCoinsDiv.replaceChildren();// clear top10 list INCLUDES 'H3' AND 'P'... YES
        this.dom.coinDetailsDiv.replaceChildren(); //clear if new search ... YES   
       
        this.dom.trendingDivHeading.style.display = 'block'; // show headings for trending

              
        console.log(`Array of trending coins: `, coins);             
        console.log(`Array of trending NFTs: `, nfts);              
        
        //trendingCoins
        for(const coin of coins){
            console.log('COIN URL', coin.item.large);
            const pTag = document.createElement('p');
            const imgNode = document.createElement('img');
            const lineBreak = document.createElement('br');

            pTag.innerHTML += (coin.item.name);                     // display coin 
            pTag.dataset.id = coin.item.id;                         // adds new attribute called "data-id" to the 'p' tag, which then stores the JSON key 'id' value of each coin. 'id' in this case is the name of the coin in lowerCase.
            
            imgNode.src = coin.item.large;    
            imgNode.alt = `Coin Image`;
          
            imgNode.dataset.id = coin.item.id;                               // new att added "data-id"     
            
            this.dom.trendingCoinsDiv.appendChild(imgNode);                  // this.dom.topTenCoinsDiv is a DOM node we can append CHILD (imgTag) to 
            this.dom.trendingCoinsDiv.appendChild(lineBreak);                
            this.dom.trendingCoinsDiv.appendChild(pTag);                     // this.dom.topTenCoinsDiv is a DOM node we can append CHILD (pTag) to 

        }

        //trendingNFTs
        for(const nft of nfts){
            console.log('NFT URL:', nft.thumb);
            const pTag = document.createElement('p');
            const imgNode = document.createElement('img');
            const lineBreak = document.createElement('br');

            pTag.innerHTML += (nft.name);                     // display NFT
            pTag.dataset.id = nft.id;                         // adds new attribute called "data-id" to the 'p' tag, which then stores the JSON key 'id' value of each NFT. 'id' in this case is the name of the NFT in lowerCase.
               
            imgNode.src = nft.thumb;    
            imgNode.alt = `NFT Image`;
         
            imgNode.dataset.id = nft.id;                                    //  new att added "data-id" to trending NFTs
        
            this.dom.trendingNftsDiv.appendChild(imgNode);                  // this.dom.topTenCoinsDiv is a DOM node we can append CHILD (imgTag) to 
            this.dom.trendingNftsDiv.appendChild(lineBreak);                
            this.dom.trendingNftsDiv.appendChild(pTag);                     // this.dom.topTenCoinsDiv is a DOM node we can append CHILD (pTag) to 
        }

    }, // renderTopTen())

} // cryptoApp


cryptoApp.initUI(); ///initialises ie the methods in the variable don't run automatically
cryptoApp.loadTopTen(); // load and render top 10 crypto coins based on total marketcap

////////////////////////////////////////////////////////ABOVE COMPLETE////////////////////////////////////////////////////////

/*
TODO:
============================================================
1- allow clicking of coins in TRENDING LIST (not NFTS)
2- CSS (Trending page)





X- remove unused CSS

X- how host SAP in GitHub

X- SAVE a JSON of the data to show in class (to avoid CORS lockout i.e. minimise API requests)


CHALLENGES FACED:
===========================================================
- some coins were worth 1000ths of a cent, however i didnt change output to view these values of junk coins.. values are rounded to 2 decimals for easier viewing.
- created coinChecker():
many coins had the same name values in different keys e.g.  (id:"bitcoin", symbol: "btc", name: "Bitcoin") VS (id:"elonXAIDogeMessi69PepeInu", symbol:"bitcoin", name:"ElonXAIDogeMessi69PepeInu") 
Therefore had to locate coins using 'id key' thus 'symbol' & 'name' had to be ignored. Also added a lowercase method to the user input in case typed e.g "Bitcoin".

new methods researched and used:
-Number(): (to round number)
-toLocaleString(): inserts commas into large numbers 
-lots of CSS!




====================================================================
A README.md file in your GitHub repository that includes:

   - A link to the live app so people can try it out!
   - An overview of your idea, with a description of the key features
   - Any wireframes or diagrams you used during the planning stage
   - A screenshot or two of the app is nice to have
   - Explain a technical hurdle (something you struggled with)
   - Explain some things you learned (something you enjoyed)
   - If you used technology that we haven't covered in class, provide an overview of that
   - Where next? What will you add? (i.e. Wishlist / Future Features)



*/
