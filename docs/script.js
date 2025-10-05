function login() {
  const role = document.getElementById('role').value;
  const collegeId = document.getElementById('collegeId').value;
  const busNumber = document.getElementById('busNumber').value;
  const stopLocation = document.getElementById('stopLocation').value;

  if (!collegeId || !busNumber || !stopLocation) {
    alert("Please fill all fields");
    return;
  }

  // Show dashboard and map
  document.getElementById('loginCard').style.display = 'none';
  document.getElementById('dashboardCard').style.display = 'block';
  document.getElementById('busInfo').innerText = busNumber;

  // Simulate backend output
  alert(`Bus No. ${busNumber} just departed from college 🚍`);

  // Initialize map
  initMap();
}

function checkDistance() {
  const distance = parseFloat(document.getElementById('distance').innerText);
  if (distance <= 5) {
    document.getElementById('notification').style.display = 'block';
  } else {
    alert("Bus is more than 5KM away.");
  }
}

function initMap() {
  const college = [16.4429, 81.5046]; // Gudlavalleru
  const bus1 = [16.3181, 81.1306];    // Machilipatnam
  const bus2 = [16.3651, 81.2762];    // Pedana

  const map = L.map('map').setView(college, 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  L.marker(college).addTo(map).bindPopup("College").openPopup();
  L.marker(bus1).addTo(map).bindPopup("Bus 9218");
  L.marker(bus2).addTo(map).bindPopup("Bus 9219");
}
