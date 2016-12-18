/**
 * Created by suzanne on 12/18/16.
 */
var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero:true
        }
      }]
    }
  }
});


function chartResults(pollID)
{
  var theUrl = "/results/" + pollID;
  console.log(theUrl);

  function httpGetAsync(theUrl, callback) {
    // xhr object initialization
    var xmlHttp = new XMLHttpRequest();
    // checking for ready state
    xmlHttp.onreadystatechange = function () {
      // if headers looks cool
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      // doing some good work
        callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    // sending null coz in get req nothin is send ,
    // but in post req u can send some data
  }
}

  //console.log("Poll data from client side:", poll);