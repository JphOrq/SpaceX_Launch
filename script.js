var apiUrl = "https://api.spacexdata.com/v4/launches/";
var launchesDiv = document.getElementById("launches");
var loadingIndicator = document.getElementById("loading");
var noMoreDataMessage = document.getElementById("noMoreData");
var scrollToTopButton = document.getElementById("scrollToTopButton");
var isLoading = false;
var hasMoreData = true;
var page = 1;

function showNoMoreDataMessage() {
  noMoreDataMessage.style.display = "";
  noMoreDataMessage.innerHTML = "No more data available";
}

function hideNoMoreDataMessage() {
  noMoreDataMessage.style.display = "none";
  noMoreDataMessage.innerHTML = "";
}

//fetch data from the API
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
        page++;
      } else {
        hasMoreData = false;
        showNoMoreDataMessage();
      }
    })
    .catch(function (error) {
      loadingIndicator.style.display = "none";
      isLoading = false;
      console.error("An error occurred while fetching data:", error);
    });
}

fetchData();

var lastScrollPosition = 0;

window.addEventListener("scroll", function () {
  var currentScrollPosition = window.scrollY;

  if (
    currentScrollPosition > lastScrollPosition &&
    window.innerHeight + currentScrollPosition >=
      document.body.offsetHeight - 1 &&
    !isLoading &&
    hasMoreData
  ) {
    showNoMoreDataMessage();
  }

  if (currentScrollPosition < lastScrollPosition) {
    hideNoMoreDataMessage();
  }

  lastScrollPosition = currentScrollPosition;
});

// Function to scroll to the top with smooth animation
function scrollToTop() {
  var currentY = window.scrollY;

  function animateScroll() {
    // Calculate the step for smooth animation
    var step = Math.max(currentY / 20, 20);

    // Calculate the new scroll position
    currentY = currentY - step;

    // Scroll to the new position
    window.scrollTo(0, currentY);

    // Continue the animation until reaching the top
    if (currentY > 0) {
      requestAnimationFrame(animateScroll);
    }
  }

  // Start the smooth scroll animation
  requestAnimationFrame(animateScroll);
}

// Show or hide the button based on scroll position
window.addEventListener("scroll", function () {
  if (window.scrollY > 300) {
    scrollToTopButton.style.display = "block";
  } else {
    scrollToTopButton.style.display = "none";
  }
});

// Scroll to the top when the button is clicked
scrollToTopButton.addEventListener("click", function () {
  scrollToTop();
});

// display the launches
function displayLaunches(launches) {
  launches.forEach(function (launch) {
    var launchCard = createLaunchCard(launch);
    launchesDiv.appendChild(launchCard);
  });
}

// display the launch info
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

// filter keyword on-progress
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
