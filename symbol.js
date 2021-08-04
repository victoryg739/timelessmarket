//Get ticker from url link
function getTicker(){
    const urlParams = new URLSearchParams(window.location.search);
    const ticker = urlParams.get('ticker');
    return ticker;
}

//function for the Read more button
function moreAboutFunction() {
  var dots = document.getElementById("dots");
  var moreText = document.getElementById("completeAbout");
  var btnText = document.getElementById("readMoreBtn");

  if (dots.style.display === "none") {
    dots.style.display = "inline";
    btnText.innerHTML = "Read more";
    moreText.style.display = "none";
  } else {
    dots.style.display = "none";
    btnText.innerHTML = "Read less";
    moreText.style.display = "inline";
  }
}

function createTable(tableData,elementID) {
    var table = document.createElement('table');
    var tableBody = document.createElement('tbody');

    tableData.forEach(function(rowData) {
    var row = document.createElement('tr');

    rowData.forEach(function(cellData) {
      var cell = document.createElement('td');
      cell.appendChild(document.createTextNode(cellData));
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    document.getElementById(elementID).appendChild(table);
}


function createTableTmx(dateData,tableData,elementID) {
    var table = document.createElement('table');
    table.id = "tmxTable";
    var tableBody = document.createElement('tbody');
    var row = document.createElement('tr');
    var cell = document.createElement('td');
    cell.appendChild(document.createTextNode(""));
    row.appendChild(cell);
    dateData.forEach(function(i){
    var cell = document.createElement('td');
    cell.appendChild(document.createTextNode(i));
    row.appendChild(cell);


    });
    tableBody.appendChild(row);


    for(var key in tableData){
        var row = document.createElement('tr');
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode(key));
        cell.setAttribute('class', key);

        row.appendChild(cell);
        for(var i=0;i<tableData[key].length;i++){
            var cell = document.createElement('td');
            cell.appendChild(document.createTextNode(tableData[key][i]));
            row.appendChild(cell).innerHTML;
        }
        tableBody.appendChild(row);

    }

    table.appendChild(tableBody);
    document.getElementById(elementID).appendChild(table);
}

//Function to slice the array
function alterArray(array,startNo,stopNo){
    var finalArray = [];
    finalArray.push(array[0]);
    while(startNo< stopNo){
       finalArray.push(array[startNo]);
       startNo++
    }
    return finalArray;

}

//Function to check if object key is avalaible
function checkObjKey(objpath,key){
    try{
        if(!(key in objpath)){
            return "N/A"
        }
        return objpath[key];

    }catch(err){
        return "N/A";
    }

}

	var ticker = getTicker();
	var mstarFundamental_url = "https://timelessmarketapi.herokuapp.com/fundamental/"+ticker;



 	fetch(mstarFundamental_url).then(function (response) {
		return response.json();
	}).then(function(obj){
	console.log(obj);

       createChart(obj,"myChart");
        //createTable(alterArray(obj,1,5),"mstar-fundamental-income-statement");
	    createTable(alterArray(obj,5,9),"mstar-fundamental-solvency");
	    createTable(alterArray(obj,9,12),"mstar-fundamental-profitability");
	    createTable(alterArray(obj,12,16),"mstar-fundamental-margin");
	    createTable(alterArray(obj,16,18),"mstar-fundamental-cash-flow");
	    createTable(alterArray(obj,18,20),"mstar-fundamental-dividends");

	}).catch(function(error) {
		console.error("something went wrrong retrieving data");
	});


    var tmx_annual_url = "https://timelessmarketapi.herokuapp.com/tm/annual/"+ticker;

    fetch(tmx_annual_url).then(function (response) {
        return response.json();
    }).then(function(obj){
        createTableTmx(obj[0],obj[1],"tmx-income-statement-annual");
        console.log(obj[1]);
        createTableTmx(obj[0],obj[2],"tmx-balance-sheet-annual");
        createTableTmx(obj[0],obj[3],"tmx-cash-flow-annual");


	}).catch(function(error) {
		console.error("something went retrieving data");
	});

    var tmx_quarter_url = "https://timelessmarketapi.herokuapp.com/tm/quarter/"+ticker;

    fetch(tmx_quarter_url).then(function (response) {
        return response.json();
    }).then(function(obj){
        createTableTmx(obj[0],obj[1],"tmx-income-statement-quarterly");
        createTableTmx(obj[0],obj[2],"tmx-balance-sheet-quarterly");
        createTableTmx(obj[0],obj[3],"tmx-cash-flow-quarterly");


	}).catch(function(error) {
		console.error("something went retrieving data");
	});

   var yahoofin_url = "https://timelessmarketapi.herokuapp.com/yahoofin/"+ticker;

 	fetch(yahoofin_url).then(function (response) {
		return response.json();
	}).then(function(obj){


	baseObj = obj['QuoteSummaryStore'];


	earningsdate = [[checkObjKey(baseObj['earnings']['earningsChart']['quarterly'][0],"date")]];
	earningsdate.push([checkObjKey(baseObj['earnings']['earningsChart']['quarterly'][1],"date")]);
	earningsdate.push([checkObjKey(baseObj['earnings']['earningsChart']['quarterly'][2],"date")]);
	earningsdate.push([checkObjKey(baseObj['earnings']['earningsChart']['quarterly'][3],"date")]);
    earningsdate.push([checkObjKey(baseObj['earnings']['earningsChart'],"currentQuarterEstimateDate") + checkObjKey(baseObj['earnings']['earningsChart'],"currentQuarterEstimateYear")]);
    earnings = [];
    earnings.push(earningsdate);

    // Error right here
    earningsActual = [[checkObjKey(baseObj['earnings']['earningsChart']['quarterly'][0]["actual"],"fmt")]];
    earningsEstimate = ([checkObjKey(baseObj['earnings']['earningsChart']['quarterly'][0]["estimate"],"fmt")]);
    earningsActual.push([checkObjKey(baseObj['earnings']['earningsChart']['quarterly'][1]["actual"],"fmt")]);
    earningsEstimate.push([checkObjKey(baseObj['earnings']['earningsChart']['quarterly'][1]["estimate"],"fmt")]);
    earningsActual.push([checkObjKey(baseObj['earnings']['earningsChart']['quarterly'][2]["actual"],"fmt")]);
    earningsEstimate.push([checkObjKey(baseObj['earnings']['earningsChart']['quarterly'][2]["estimate"],"fmt")]);
    earningsActual.push([checkObjKey(baseObj['earnings']['earningsChart']['quarterly'][3]["actual"],"fmt")]);
    earningsEstimate.push([checkObjKey(baseObj['earnings']['earningsChart']['quarterly'][3]["estimate"],"fmt")]);
    earningsEstimate.push([checkObjKey(baseObj['earnings']['earningsChart']['currentQuarterEstimate'],"fmt")]);

    earnings.push(earningsEstimate);
    earnings.push(earningsActual);
    createEarningsChart(earnings,"earningsChart");

    //Chart for analyst price target
    priceTarget= [[checkObjKey(baseObj['financialData']['targetLowPrice'],"fmt")]];
    priceTarget.push([checkObjKey(baseObj['financialData']['targetMeanPrice'],"fmt")]);
    priceTarget.push([[checkObjKey(baseObj['financialData']['currentPrice'],"fmt")]]);
    priceTarget.push([checkObjKey(baseObj['financialData']['targetHighPrice'],"fmt")]);
    createPriceTargetChart(priceTarget,"pricetargetChart");



	document.getElementById("stockLongName").innerHTML =obj["QuoteSummaryStore"]["quoteType"]["longName"];
	aboutLeftArray=[["Symbol",checkObjKey(baseObj["quoteType"],"symbol")]];
	aboutLeftArray.push(["Exchange",checkObjKey(baseObj["price"],"exchangeName")]);
	aboutLeftArray.push(["Sector",checkObjKey(baseObj["summaryProfile"],"sector")]);
	aboutLeftArray.push(["Industry",checkObjKey(baseObj["summaryProfile"],"industry")]);
	aboutLeftArray.push(["Market Cap",checkObjKey(baseObj["price"]["marketCap"],"fmt")]);
	aboutLeftArray.push(["Shares Outstanding",checkObjKey(baseObj["defaultKeyStatistics"]["sharesOutstanding"],"fmt")]);
    aboutLeftArray.push(["Shares Float",checkObjKey(baseObj["defaultKeyStatistics"]["floatShares"],"fmt")]);

	createTable(aboutLeftArray,"aboutLeft")
    var strAbout = obj["QuoteSummaryStore"]["summaryProfile"]["longBusinessSummary"];

    if(strAbout.length < 500){
        document.getElementById("readMoreBtn").style.display = "none";
        document.getElementById("dots").style.display = "none";

    }
    document.getElementById("stockAbout").innerHTML = strAbout.substring(0,500);
    document.getElementById("completeAbout").innerHTML = strAbout.substring(500,strAbout.length);


    aboutRightArray = [["Earnings Per Share (TTM)",checkObjKey(baseObj["defaultKeyStatistics"]["trailingEps"],"fmt")]];
    aboutRightArray.push(["Price To Earning (TTM)",checkObjKey(baseObj["summaryDetail"]["trailingPE"],"fmt")]);
    aboutRightArray.push(["PEG Ratio",checkObjKey(baseObj["defaultKeyStatistics"]["pegRatio"],"fmt")]);
    aboutRightArray.push(["Price To Book (TTM)",checkObjKey(baseObj["defaultKeyStatistics"]["priceToBook"],"fmt")]);
	aboutRightArray.push(["Price To Sales (TTM)",checkObjKey(baseObj["summaryDetail"]["priceToSalesTrailing12Months"],"fmt")]);
    aboutRightArray.push(["Payout Ratio",checkObjKey(baseObj["summaryDetail"]["payoutRatio"],"fmt")]);
    aboutRightArray.push(["Beta",checkObjKey(baseObj["defaultKeyStatistics"]["beta"],"fmt")]);



    createTable(aboutRightArray,"aboutRight");





	}).catch(function(error) {
		console.error(error  + "something went retrieving data");
	});


function createChart(array,elementID){
    var ctx = document.getElementById(elementID).getContext('2d');
    var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: array[0].slice(1,20),
        datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: array[1].slice(1,20),
            //pointBorderColor: 'rgb(0, 0, 0)',
            //pointBackgroundColor: 'rgb(0, 0, 0)',

            pointRadius: 5,
            pointHoverRadius:10
        }]
    },

    // Configuration options go here
    options: {
        responsive: true,
    maintainAspectRatio: false
    }
    });
    chart.render();
    $("#chart-selector").change(function(){
    chart.reset();
        var selectedDataNo = $("#chart-selector option:selected").text();
        chart.data.datasets[0].data = array[selectedDataNo].slice(1,20);
        chart.update();
    })
}

function createEarningsChart(array,elementID){
     var ctx = document.getElementById(elementID).getContext('2d');
     var mixedChart = new Chart(ctx, {
        type: 'bar',
        data: {
            datasets: [{
                label: 'EPS Estimate',
                backgroundColor: 'rgba(199, 60, 60,0.6)',
                borderColor: 'rgba(255, 0, 0,1)',
                borderWidth: 1,
                data: array[1]
            }, {
                label: 'EPS Actual',
                backgroundColor: 'rgba(22, 191, 0,0.6)',
                borderColor: 'rgba(13, 110, 0,1)',
                borderWidth: 1,
                data: array[2],

                // Changes this dataset to become a line
                type: 'bar'
            }],
            labels: array[0]
        },
        options :{

              title: {
            display: true,
            text: 'Earnings per Share (quartely)'
          },
        scales: {
            xAxes: [{
                ticks:{
                    min:0
                }

            }],
            yAxes: [{
                ticks:{
                }
            }]
        }
    }
    });
}

//function to show and hide whichever of the three financial statements when the selected button is pressed
function finBtnFunc(id){

    if(id=="btnIncomeStatement"){
        displayNoFinTable();
        document.getElementById("titleIncomeStatement").style.display = "inline";
        if(document.getElementById('btnAnnual').checked) {
            document.getElementById("tmx-income-statement-annual").style.display = "inline";
        }
        if(document.getElementById('btnQuarter').checked) {
            document.getElementById("tmx-income-statement-quarterly").style.display = "inline";
        }
    }
    if(id=="btnBalanceSheet"){
        displayNoFinTable();
        document.getElementById("titleBalanceSheet").style.display = "inline";
        if(document.getElementById('btnAnnual').checked) {
            document.getElementById("tmx-balance-sheet-annual").style.display = "inline";
        }
        if(document.getElementById('btnQuarter').checked) {
            document.getElementById("tmx-balance-sheet-quarterly").style.display = "inline";
        }
    }

    if(id=="btnCashFlow"){
        displayNoFinTable();
        document.getElementById("titleCashFlow").style.display = "inline";
        if(document.getElementById('btnAnnual').checked) {
            document.getElementById("tmx-cash-flow-annual").style.display = "inline";
        }
        if(document.getElementById('btnQuarter').checked) {
            document.getElementById("tmx-cash-flow-quarterly").style.display = "inline";
        }
    }

    if(id=="btnAnnual"){
         if(document.getElementById('btnIncomeStatement').checked) {
                displayNoFinTable();
                document.getElementById("titleIncomeStatement").style.display = "inline";
                document.getElementById("tmx-income-statement-annual").style.display = "inline";
            }
            if(document.getElementById('btnBalanceSheet').checked) {
                displayNoFinTable();
                document.getElementById("titleBalanceSheet").style.display = "inline";
                document.getElementById("tmx-balance-sheet-annual").style.display = "inline";
            }
            if(document.getElementById('btnCashFlow').checked) {
                displayNoFinTable();
                document.getElementById("titleCashFlow").style.display = "inline";
                document.getElementById("tmx-cash-flow-annual").style.display = "inline";
            }

        }
    if(id=="btnQuarter"){
     if(document.getElementById('btnIncomeStatement').checked) {
            displayNoFinTable();
            document.getElementById("titleIncomeStatement").style.display = "inline";
            document.getElementById("tmx-income-statement-quarterly").style.display = "inline";
        }
        if(document.getElementById('btnBalanceSheet').checked) {
            displayNoFinTable();
            document.getElementById("titleBalanceSheet").style.display = "inline";
            document.getElementById("tmx-balance-sheet-quarterly").style.display = "inline";
        }
        if(document.getElementById('btnCashFlow').checked) {
            displayNoFinTable();
            document.getElementById("titleCashFlow").style.display = "inline";
            document.getElementById("tmx-cash-flow-quarterly").style.display = "inline";
        }
    }
    document.getElementById("headerFinancials").scrollIntoView();

}
function displayNoFinTable(){
    document.getElementById("titleIncomeStatement").style.display = "none";
    document.getElementById("titleBalanceSheet").style.display = "none";
    document.getElementById("titleCashFlow").style.display = "none";

    document.getElementById("tmx-income-statement-annual").style.display = "none";
    document.getElementById("tmx-balance-sheet-annual").style.display = "none";
    document.getElementById("tmx-cash-flow-annual").style.display = "none";
    document.getElementById("tmx-income-statement-quarterly").style.display = "none";
    document.getElementById("tmx-balance-sheet-quarterly").style.display = "none";
    document.getElementById("tmx-cash-flow-quarterly").style.display = "none";

}


function createPriceTargetChart(array,elementID){

    new Chart(document.getElementById(elementID), {
        type: 'horizontalBar',
        data: {

            datasets: [
              {
                label: 'Low',
                data: array[0],
     backgroundColor: 'rgba(22, 191, 0,0.6)',
                borderColor: 'rgba(13, 110, 0,1)',
                borderWidth: 1

              },

              {
                label: 'Current Price',
                data: array[2],
             backgroundColor: 'rgba(0, 0, 102,0.6)',
                borderColor: 'rgba(20, 0, 51,1)',
                borderWidth: 1,


              },
              {
                label: 'Average',
                data: array[1],
                backgroundColor: 'rgba(255, 255, 0,0.6)',
                borderColor: 'rgba(204, 204, 0,1)',
                borderWidth: 1,

              },
              {
                label: 'High',
                data: array[3],
                backgroundColor: 'rgba(199, 60, 60,0.6)',
                borderColor: 'rgba(255, 0, 0,1)',
                borderWidth: 1,

              }
            ]
        },
        options: {

          legend: { display: true },
          title: {
            display: true,
            text: 'Analyst Price Target'
          }
        }
    });
}