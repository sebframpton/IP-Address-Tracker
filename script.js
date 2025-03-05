let map = L.map("map", { zoomControl: false }).setView([51.505, -0.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let myIcon = L.icon({
  iconUrl: "./images/icon-location.svg",
  iconSize: [50, 60],
  iconAnchor: [25, 30],
});

const zoom = L.control.zoom({
  zoomControl: false,
});

const form = document.querySelector("#form");
const button = document.querySelector("#sendButton");
const input = document.querySelector("#adressInput");

const ipMask = () => {
  if (isNaN(input.value[0])) {
    input.removeAttribute("maxlength");
    input.setAttribute("maxlength", "40");
  } else {
    input.removeAttribute("maxlength");
    input.setAttribute("maxlength", "15");
    input.value = input.value
      .toString()
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/( \d{3})\d+?$/, "$1");
  }
  return input.value;
};

window.addEventListener("load", () => {
  tracker("");
});

input.addEventListener("input", ipMask);

button.addEventListener("click", function (e) {
  tracker(ipMask());
  e.preventDefault();
});

async function tracker(input) {
  let apiUrl;
  if (input === "") {
    apiUrl = `https://geo.ipify.org/api/v2/country,city?apiKey=at_2t69o7Xx7oNMZAQZE1vvIz7bIXBJC&domain=`;
  } else if (isNaN(input[0])) {
    apiUrl = `https://geo.ipify.org/api/v2/country,city?apiKey=at_2t69o7Xx7oNMZAQZE1vvIz7bIXBJC&domain=${input}`;
  } else {
    apiUrl = `https://geo.ipify.org/api/v2/country,city?apiKey=at_2t69o7Xx7oNMZAQZE1vvIz7bIXBJC&ipAddress=${input}`;
  }
  let getLocation = await fetch(apiUrl);
  let data = await getLocation.json();
  displayData(data);
}

function displayData(data) {
  let ip = document.querySelector("#ip");
  let locationS = document.querySelector("#location");
  let timezone = document.querySelector("#timezone");
  let isp = document.querySelector("#isp");

  ip.innerHTML = data.ip;
  locationS.innerHTML = `${data.location.city}, ${data.location.region}`;
  timezone.innerHTML = data.location.timezone;
  isp.innerHTML = data.isp;
  L.marker([data.location.lat, data.location.lng], { icon: myIcon }).addTo(map);
  map.setView([data.location.lat, data.location.lng], 16);
}
