import GEO_IPIFY_API_KEY from './apikey.js';

var mymap = L.map('mapid', {
  zoomControl: false,
  center: [51.4934, 0.0098],
  zoom: 13,
});

L.tileLayer(
  'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      'pk.eyJ1IjoiaG5handhIiwiYSI6ImNrdGszaHpkbzFodTAydm51Ynl0b2QxODAifQ.6mTGS93_7ePXBTrbtV7Fvw',
  }
).addTo(mymap);

var myIcon = L.icon({
  iconUrl: './images/icon-location.svg',
  iconSize: [32, 41],
});

var marker = L.marker([51.4934, 0.0098], { icon: myIcon }).addTo(mymap);

async function initMap() {
  await fetchLatLong();

  let locationDetailsElm = document.querySelector('.location-details');
  locationDetailsElm.classList.remove('hidden');
}

function relocate(data) {
  const ip = data.ip;
  const isp = data.isp;
  const { lat, lng, timezone, city, region, postalCode } = data.location;

  mymap.setView([lat, lng]);
  marker.setLatLng([lat, lng]);

  document.getElementById('ipAddress').innerText = ip;
  document.getElementById(
    'location'
  ).innerText = `${city}, ${region} ${postalCode}`;
  document.getElementById('timezone').innerText = `UTC ${timezone}`;
  document.getElementById('isp').innerText = isp;
}

function search(event) {
  event.preventDefault();
  const ip = document.getElementById('ipInput').value;

  fetchLatLong(ip);
}

async function fetchLatLong(ipAddress) {
  const url = !ipAddress
    ? `https://geo.ipify.org/api/v1?apiKey=${GEO_IPIFY_API_KEY}`
    : `https://geo.ipify.org/api/v1?apiKey=${GEO_IPIFY_API_KEY}&ipAddress=${ipAddress}`;

  const response = await fetch(url);
  const data = await response.json();

  relocate(data);
}

initMap();
