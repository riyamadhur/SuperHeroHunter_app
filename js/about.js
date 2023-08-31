// fetch the id of the hero to be displayed
var resultId = localStorage.getItem("id");

// Fetch the data
fetch();

// Get all the data from Fetch
function fetch() {
  var Request = new XMLHttpRequest();
  var url = `https://gateway.marvel.com/v1/public/characters/${resultId}?apikey=c2595c6e10b8e75e6bd3b3c61b14547c&hash=77964d9b5c2bef6213992685d7c2dfd4&ts=1`;
  Request.open("get", url, true);
  Request.send();
  Request.onload = function () {
    // store datas in a variable
    var response = JSON.parse(Request.response);

    // distribute it in page to be displayed
    document.getElementById("thumb").innerHTML =
      ' <img src=" ' +
      response.data.results[0].thumbnail.path +
      "." +
      response.data.results[0].thumbnail.extension +
      '" alt="">';
    document.getElementById("name").innerHTML =
      "About " + response.data.results[0].name;
    document.getElementById("id").innerHTML =
      "<b>Hero ID: </b> " + response.data.results[0].id;
    document.getElementById("desc").innerHTML =
      "<b>Description: </b> " + response.data.results[0].description;
    document.getElementById("comic").innerHTML =
      "<b>Comic Available: </b>" + response.data.results[0].comics.available;
    document.getElementById("series").innerHTML =
      "<b>Series Available: </b>" + response.data.results[0].series.available;
    document.getElementById("stories").innerHTML =
      "<b>Stories Available: </b>" + response.data.results[0].stories.available;
    document.getElementById("count").innerHTML =
      "<b>Count: </b>" + response.data.count;
    document.getElementById("modified").innerHTML =
      "<b>Modified: </b>" + response.data.results[0].modified;
    document.getElementById("status").innerHTML =
      "<b>Status: </b>" + response.status;
    document.getElementById("total").innerHTML =
      "<b>Total: </b>" + response.data.total;
    document.getElementById("limit").innerHTML =
      "<b>Limit: </b>" + response.data.limit;
    document.getElementById("offset").innerHTML =
      "<b>Offset: </b>" + response.data.offset;
    document.getElementById("code").innerHTML = "<b>Code: </b>" + response.code;
  };
}
