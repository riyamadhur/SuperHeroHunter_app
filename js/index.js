const searchSection = document.querySelector(".search-section");
const resultSection = document.querySelector(".result-section");
const favSection = document.querySelector(".fav-section");
const searchBtn = document.getElementById("srch");
const favouriteBtn = document.getElementById("favourite");
const taskList = document.getElementById("list");




// create a variable to store favorites locally
var favorites;

// variable to store fetched data from local storage
var listOfHeros;


// set search section as default in main page
localStorage.setItem("open", "search");

// IIFE function to call the function for choosing the section to be viewed
(function op1() {
  op2();
})();

// function for choosing the section to be viewed
function op2() {
  if (localStorage.getItem("open") == "search") {
    searchBtn.style.display = "none";
    favouriteBtn.style.display = "flex";
    openSearch();
  } else if (localStorage.getItem("open") == "favourite") {
    searchBtn.style.display = "flex";
    favouriteBtn.style.display = "none";
    openFav();
  }
}

// function to open search section
function openSearch() {
  searchSection.classList.remove("disp-none");
  resultSection.classList.remove("disp-none");
  favSection.classList.add("disp-none");
}

// check if previous data found in localstorage & accordingly set local favorites array
if (
  localStorage.getItem("favHeros") == "undefined" ||
  localStorage.getItem("favHeros") == null
) {
  console.log("No previous favorite list found.");
  favorites = [];
} else {
  console.log("previous favorite list found.");
  favorites = JSON.parse(localStorage.getItem("favHeros"));
}

//  Get Id from HTML File, & Search query with HTTP Request, then parse it
document.getElementById("search-form").addEventListener("keyup", function () {
  var url = getUrl();
  var xhrRequest = new XMLHttpRequest();
  xhrRequest.open("get", url, true);
  xhrRequest.send();
  xhrRequest.onload = function () {
    var data = JSON.parse(xhrRequest.responseText);
    display(data);
  };
});

// Get the URL from  API
function getUrl() {
  // pick the searched text.
  var searchQuery = document.getElementById("search-string").value;
  //  Set the main heading for user to know what he/she searched for.
  document.getElementById("querySection").innerHTML =
    "Showing results for : " + searchQuery;
  //  If search query matches the results then it will execute next function/command.
  if (!searchQuery) {
    console.log("Name cannot be empty!");
    return "http://gateway.marvel.com/v1/public/comics?ts=1&apikey=c2595c6e10b8e75e6bd3b3c61b14547c&hash=77964d9b5c2bef6213992685d7c2dfd4";
  } else {
    return `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${searchQuery}&apikey=c2595c6e10b8e75e6bd3b3c61b14547c&hash=77964d9b5c2bef6213992685d7c2dfd4&ts=1`;
  }
}

//  Get Canvas where the results will be printed
let canvas = document.getElementById("canvas");

// function to display searched data on screen
function display(data) {
  var superHeroList = document.getElementById("superhero-list");
  superHeroList.innerHTML = "";
  var results = data.data.results;

  // check if results found or not
  if (!results) {
    document.getElementById("search-character").value = "";
    window.alert("No super hero found!");
  } else {

    // create a for loop to print result one by one
    for (let result of results) {
      var templateCanvas = canvas.content.cloneNode(true);
      //  Get all the elemets from id and then changes its Inner HTMl
      templateCanvas.getElementById("thumb").innerHTML =
        ' <img src=" ' +
        result.thumbnail.path +
        "." +
        result.thumbnail.extension +
        '" alt="">';
      templateCanvas.getElementById("name").innerHTML =
        "<b>Name: </b> " + result.name;
      templateCanvas.getElementById("id").innerHTML =
        "<b>Hero ID: </b> " + result.id;
      templateCanvas.getElementById("comic").innerHTML =
        "<b>Comic Available: </b>" + result.comics.available;
      templateCanvas.getElementById("series").innerHTML =
        "<b>Series Available: </b>" + result.series.available;
      templateCanvas.getElementById("stories").innerHTML =
        "<b>Stories Available: </b>" + result.stories.available;

      //  Set Event listenet for Learn  more button
      templateCanvas
        .getElementById("learn-more")
        .addEventListener("click", function () {
          localStorage.setItem("id", result.id);
          window.location.assign("./about.html");
        });

      //  Set Event listenet for Fav button
      templateCanvas
        .getElementById("fav")
        .addEventListener("click", function (e) {
          function check(elem) {
            return elem.id === result.id;
          }

          // check if clicked item is present in list
          var present = null;
          if (favorites !== null) {
            present = favorites.find(check);
          }

          // if not item is present then add it to list
          if (present == null) {
            var data = JSON.stringify(result);
            var favoriteItem = { id: result.id, data: data };
            favorites.push(favoriteItem);
          } 
          // else print alert msg saying its alerdey present in list
          else {
            let snk = document.getElementById("snackbar");
            snk.innerHTML = "⚠️ ⚠️ ⚠️  Already in Favourite List  ⚠️ ⚠️ ⚠️";
            snk.style.backgroundColor = "red";
            snk.style.fontWeight = "600";
            setTimeout(function () {
              snk.innerHTML = "Succesfully! Added to Favourite";
              snk.style.backgroundColor = "green";
              snk.style.fontWeight = "600";
            }, 1500);
          }
        });

      // append this result in dom superHeroList
      superHeroList.appendChild(templateCanvas);
    }
  }
}

// function to show Alert msg 
function addFunction() {
  var x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 1500);
}

// function to open favorite section
function openFav() {
  console.log("fav clicked");
  localStorage.setItem("favHeros", JSON.stringify(favorites));
  listOfHeros = JSON.parse(localStorage.getItem("favHeros"));
  searchSection.classList.add("disp-none");
  resultSection.classList.add("disp-none");
  favSection.classList.remove("disp-none");
  if (listOfHeros !== null) {
    renderList(listOfHeros);
  }
}

// function to handle the click on favourite and search button on top right corner
function handleClick(e) {
  if (e.target.id === "favourite") {
    localStorage.setItem("open", "favourite");
  } else if (e.target.id === "srch") {
    localStorage.setItem("open", "search");
  }
  op2();
}
document.addEventListener("click", handleClick);

// function to go through the favorite heros list
function renderList(listOfHeros) {
  console.log("task List", taskList);
  taskList.innerHTML = "";
  for (let i = 0; i < listOfHeros.length; i++) {
    let a1 = listOfHeros[i];
    let myStorage = JSON.parse(a1.data);
    addtaskToDOM(myStorage);
  }
}

// add super heros to dom one by one
function addtaskToDOM(task) {
  const li = document.createElement("li");

  li.innerHTML = `
    <div id="fav-info">
      <div id="fav-thumb"><img src="${task.thumbnail.path}.${task.thumbnail.extension}" alt=""></div>
      <div id="fav-name">Name - ${task.name}</div>
      <div id="fav-id">ID - ${task.id}</div>
      <div id="fav-comic">Comics - ${task.comics.available}</div>
      <div id="fav-series">series - ${task.series.available}</div>
      <div id="fav-stories">stories - ${task.stories.available}</div>
      <div id="fav-btns">
        <button class="btn btn-outline-primary btn-sm" id="fav-delete" data-id="${task.id}"> Remove </button>
        <button class="btn btn-primary btn-sm" id="fav-learn-more" data-id="${task.id}"> Learn Info </button>
      </div>
    </div>
  `;

  taskList.append(li);
}

// function for learnmore btn
function learnmore(taskId) {
  localStorage.setItem("id", taskId);
  window.location.assign("./about.html");
}

// function for remove from favorites list btn
function deleteTask(taskId) {
  console.log("deleted ", taskId);
  const newTasks = favorites.filter((task) => {
    return task.id != taskId;
  });
  favorites = newTasks;
  localStorage.setItem("favHeros", JSON.stringify(favorites));
  listOfHeros = JSON.parse(localStorage.getItem("favHeros"));

  renderList(listOfHeros);
}

// handle click on learmore or remove from favorites button
function handleBtnClickListener(e) {
  const target = e.target;
  if (target.id === "fav-delete") {
    const taskId = target.dataset.id;
    deleteTask(taskId);
    return;
  } else if (target.id === "fav-learn-more") {
    const taskId = target.dataset.id;
    learnmore(taskId);
    return;
  }
}
document.addEventListener("click", handleBtnClickListener);           