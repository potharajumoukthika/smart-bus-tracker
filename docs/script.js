let busMarker;
let map;

const route = [
  { name: "Machilipatnam", coords: [16.3181, 81.1306] },
  { name: "Hussain Palem", coords: [16.3360, 81.1800] },
  { name: "Pedana", coords: [16.3450, 81.2200] },
  { name: "Nadupuru", coords: [16.3600, 81.2600] },
  { name: "Reddipalem", coords: [16.3750, 81.3000] },
  { name: "Vadlamannadu", coords: [16.3900, 81.3400] },
  { name: "Vemavaram", coords: [16.4050, 81.3800] },
  { name: "Kowtharam", coords: [16.4200, 81.4200] },
  { name: "Gudlavalleru", coords: [16.4429, 81.5046] }
];

function toggleCollegeId() {
  const role = document.getElementById('role').value;
  const container = document.getElementById('collegeIdContainer');
  container.style.display = (role === 'parent') ? 'none' : 'block';
}

function login() {
  const role = document.getElementById('role').value;
  const busNumber = document.getElementById('busNumber').value;
  const collegeId = document.getElementById('collegeId').value;
  const collegeName = document.getElementById('collegeName').value.trim();
  const stopName = document.getElementById('stopName').value;

  if (!collegeName || collegeName.toUpperCase() !== "SRGEC") {
    alert("College Name must be 'SRGEC'");
    return;
  }

  if ((role !== 'parent' && !collegeId) || !busNumber || !stopName) {
    alert("Please fill in all required fields");
    return;
  }

  document.getElementById('loginCard').style.display = 'none';
  document.getElementById('dashboardCard').style.display = 'block';
  document.getElementById('busStatus').innerText = `🚌 Bus No. ${busNumber} just departed from Machilipatnam`;

  initMap(stopName);
  simulateBusMovement(stopName);
}

function initMap(stopName) {
  map = L.map('map').setView(route[0].coords, 11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  route.forEach(stop => {
    L.marker(stop.coords).addTo(map).bindPopup(stop.name);
  });

  const redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  busMarker = L.marker(route[0].coords, { icon: redIcon }).addTo(map).bindPopup("🚌 Bus");
}

function simulateBusMovement(userStopName) {
  let index = 0;
  let lat = route[0].coords[0];
  let lng = route[0].coords[1];

  const userStop = route.find(stop => stop.name === userStopName);

  const interval = setInterval(() => {
    const target = route[index + 1];
    if (!target) {
      clearInterval(interval);
      return;
    }

    lat += (target.coords[0] - lat) * 0.2;
    lng += (target.coords[1] - lng) * 0.2;
    busMarker.setLatLng([lat, lng]);

    const distance = getDistance(lat, lng, userStop.coords[0], userStop.coords[1]);
    if (distance <= 5) {
      document.getElementById('notification').style.display = 'block';
    }

    if (Math.abs(lat - target.coords[0]) < 0.0005 && Math.abs(lng - target.coords[1]) < 0.0005) {
      index++;
    }
  }, 500); // Ultra-fast movement for quick alert detection
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
