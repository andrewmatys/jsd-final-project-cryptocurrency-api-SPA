# jsd-final-project
# My final project for General Assembly's JavaScript Development class. 
# A single page app (SPA) utilising HTML/CSS/JavaScript for the frontend and API endpoints to populate a cryptocurrency based webpage using various JSON data via AXIOS.

# LINK: xxxxxxxx

# OVERVIEW: 
#         - On startup, this Cryptocurrency App loads a search form AND, a top 10 by Marketcap list of coins on the homepage. 
#         - The user can then either click on one of the listed coin's name/image OR, enter a coin name in the search form. Either action will load the chosen coin and display more details.
#         - User will be notified if coin is non-existent (if search form used).
#         - Once in details page, further searches on other coins can be carried out using the search form.
#         - Navigation by clicking on 'Home' re-renders top 10 list and search form.
#         - Clicking on 'Trending (Coins/NFTs)' displays the top 15 coins by market Activity (which can be clicked on for more details) and a list of currently trending NFTs.

# TECHNICAL HURDLES:
#         - some coins were worth 1000ths of a cent, however i didnt change output to view these values of junk coins.. values are rounded to 2 decimals for easier viewing.
#         - many coins had the same name values in different keys e.g.  (id:"bitcoin", symbol: "btc", name: "Bitcoin") VS (id:"elonXAIDogeMessi69PepeInu", symbol:"bitcoin", name:"ElonXAIDogeMessi69PepeInu").
#            Therefore had to locate coins using 'id' KEY. 'symbol' & 'name' were not used. Since the values of 'id' were in lowercase, I had to add a lowercase method to the user input, to cover input such as "Bitcoin" etc.
#         - new methods researched and used:
#               -Number(): (to round number).
#               -toLocaleString(): inserts commas into large numbers.
#               -CSS.
            
# WHERE NEXT: - make code more DRY and convert to REACT.js
