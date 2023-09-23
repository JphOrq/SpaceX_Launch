const apiUrl = "https://api.spacexdata.com/v4/launches/";
const launchesDiv = document.getElementById("launches");
const loadingIndicator = document.getElementById("loading");
const noMoreDataMessage = document.getElementById("noMoreData");
const scrollThreshold = 1;
let isLoading = false;
let hasMoreData = true;
let page = 1;

function fetchData() {
  if (isLoading || !hasMoreData) {
    return;
  }

  isLoading = true;
  loadingIndicator.style.display = "block";

  fetch(apiUrl + `?page=${page}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not successful");
      }
      return response.json();
    })
    .then((data) => {
      loadingIndicator.style.display = "none";
      isLoading = false;

      if (data.length > 0) {
        displayLaunches(data);
        page++;
      } else {
        hasMoreData = false;

        noMoreDataMessage.style.display = "block";
      }
    })
    .catch((error) => {
      loadingIndicator.style.display = "none";
      isLoading = false;
      console.error("An error occurred while fetching data:", error);
    });
}

fetchData();

if (!hasMoreData) {
  noMoreDataMessage.style.display = "block";
}

window.addEventListener("scroll", () => {
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
  launches.forEach((launch) => {
    const launchInfo = document.createElement("div");
    launchInfo.className = "launch-info";
    launchInfo.innerHTML = `
      <h3>${launch.name}</h3>
      <p>Date: ${launch.date_utc}</p>
      <p>Rocket: ${launch.rocket}</p>
      <p>Success: ${launch.success ? "Yes" : "No"}</p>
      <hr>
    `;
    launchesDiv.appendChild(launchInfo);
  });
}

fetchData();

function filterLaunches(keyword) {
  const filteredLaunches = launchesData.filter(
    (launch) =>
      launch.name.toLowerCase().includes(keyword.toLowerCase()) ||
      launch.details.toLowerCase().includes(keyword.toLowerCase())
  );

  launchesDiv.innerHTML = "";

  if (filteredLaunches.length > 0) {
    displayLaunches(filteredLaunches);
  } else {
    launchesDiv.innerHTML = "<p>No matching launches found.</p>";
  }
}

const filterInput = document.getElementById("filterInput");

filterInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();

    const keyword = this.value.trim();

    filterAndDisplayLaunches(keyword);
  }
});
