const search = document.getElementById('searchTicker');
const matchList = document.getElementById('match-list');

//updated
var allTickers = "https://timelessmarketapi.herokuapp.com/ticker";

//search heroku ticker site and filter it
const searchTickers = async searchText => {
    const res = await fetch(allTickers);
    const tickers = await res.json();
    console.log(tickers);

    //Get matches to current text input
    let matches = tickers.filter(ticker => {
        const regex = new RegExp(`^${searchText}`,'gi');
        return ticker.Symbol.match(regex) || ticker.SecurityName.match(regex);

    });
    if(searchText.length === 0){
        document.getElementById("match-list").style.display = "none";
        matches = [];
        matchList.innerHTML = '';
    }
    outputHtml(matches);
    console.log(matches);

};

//show results in HTML
const outputHtml = matches => {
if(matches.length > 0){
    matches = matches.slice(0,25); //reduce the max number of searches shown
    document.getElementById("match-list").style.display = "inline";
    var html = matches.map(match => `
    <tr value="${match.Symbol}" id="${match.Symbol}" onclick="dropdownSearch(this)">
    <td><b>${match.Symbol}</b></td>
    <td>${match.SecurityName}</td>
    </tr>
    `
    ).join('');
    html = '<table>' + html + '</table>';
    matchList.innerHTML = html;
}
}

search.addEventListener('input',() => searchTickers(search.value));
function dropdownSearch(elem){
    console.log(elem.id);
    document.getElementById("searchTicker").value = elem.id;
    document.getElementById("searchForm").submit();

}
