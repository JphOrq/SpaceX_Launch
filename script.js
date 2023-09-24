var apiUrl = "https://api.spacexdata.com/v4/launches/";
var launchesDiv = document.getElementById("launches");
var loadingIndicator = document.getElementById("loading");
var noMoreDataMessage = document.getElementById("noMoreData");
var scrollThreshold = 1;
var isLoading = false;
var hasMoreData = true;
var page = 1;

function fetchData() {
  if (isLoading || !hasMoreData) {
    return;
  }

  isLoading = true;
  loadingIndicator.style.display = "block";

  fetch(apiUrl + "?page=" + page)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Network response was not successful");
      }
      return response.json();
    })
    .then(function (data) {
      loadingIndicator.style.display = "none";
      isLoading = false;

      if (data.length > 0) {
        displayLaunches(data);
        displayPagination();
        page++;
      } else {
        hasMoreData = false;
        noMoreDataMessage.style.display = "block";
      }
    })
    .catch(function (error) {
      loadingIndicator.style.display = "none";
      isLoading = false;
      console.error("An error occurred while fetching data:", error);
    });
}

fetchData();

window.addEventListener("scroll", function () {
  if (
    document.documentElement.scrollHeight -
      (window.innerHeight + window.scrollY) <
    scrollThreshold
  ) {
    if (!isLoading && hasMoreData) {
      fetchData();
    }
  }
});

function displayLaunches(launches) {
  launches.forEach(function (launch) {
    var launchCard = createLaunchCard(launch);
    launchesDiv.appendChild(launchCard);
  });
}

function createLaunchCard(launch) {
  var card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="card-image"><img src="Photos/Falcon9.jpg"></div>
    <div class="card-info">
        <h3>${launch.name}</h3>
        <p>Date: ${launch.date_utc}</p>
        <p>Rocket: ${launch.rocket}</p>
        <p>Success: ${launch.success ? "Yes" : "No"}</p>
        <hr>
    </div>
  `;
  return card;
}

fetchData();

function filterLaunches(keyword) {
  var filteredLaunches = launchesData.filter(function (launch) {
    return (
      launch.name.toLowerCase().includes(keyword.toLowerCase()) ||
      launch.details.toLowerCase().includes(keyword.toLowerCase())
    );
  });

  launchesDiv.innerHTML = "";

  if (filteredLaunches.length > 0) {
    displayLaunches(filteredLaunches);
  } else {
    launchesDiv.innerHTML = "<p>No matching launches found.</p>";
  }
}

var filterInput = document.getElementById("filterInput");

filterInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();

    var keyword = this.value.trim();

    filterAndDisplayLaunches(keyword);
  }
});
