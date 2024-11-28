class LeafletMap {

    constructor(containerId, center, zoom) {
        this.map = L.map(containerId).setView(center, zoom);
        this.initTileLayer();
    }

    initTileLayer() {

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> WATERWISE '
        }).addTo(this.map);
    }

    addMarker(lat, long, message) {
        
        const marker = L.marker([lat, long]).addTo(this.map)
            .bindPopup(message);
    }

    loadMarkersFromJson(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                data.forEach(marker => {
                    this.addMarker(marker.latitude, marker.longitude, marker.message);
                });
            })
            .catch(error => console.error("Error Loading servers:", error));
    }



}
const Mymap = new LeafletMap('map', [8.379920, 124.922058], 17);


Mymap.loadMarkersFromJson('map.json');

document.addEventListener('DOMContentLoaded', () => {
    Mymap.displayLogCount();
    Mymap.loadMarkersFromJson('map.json');
});

class DataLogger{
    constructor(buttonId, cardContainerId, clearButtonId, logCountId){
        this.logButton = document.getElementById(buttonId);
        this.clearButton = document.getElementById(clearButtonId);
        this.idContainer = document.getElementById(cardContainerId);
        this.logCountElement = document.getElementById(logCountId);
        this.loggedData = [];     

        this.logButton.addEventListener('click', () => this.logData());
        this.clearButton.addEventListener('click', () => this.clearLogs());
    }
    
    logData(){
        const time = new Date().toLocaleString();
        this.loggedData.push(time);
        this.updateCardContainer();
    }
    clearLogs(){
        this.loggedData = []; 
        this.updateCardContainer();
    }
    undoLogs(){
        if (this.loggedData.length > 0) {
            // Remove the last log entry
            this.loggedData.pop();
            this.updateCardContainer();
        } else {
            console.log("No logs to undo.");
        }
    }
    updateCardContainer(){
        this.idContainer.innerHTML = '';
    
        this.loggedData.forEach(data => {       
            const card = document.createElement('div');
            card.className = 'card mb-2';
            card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">Logged Data</h5>
                    <p class="card-text">${data}</p>
                </div>
            `;
            this.idContainer.appendChild(card);
        });
        
        this.displayLogCount();
    }
    countLogs(){
      return this.loggedData.length;
    }
    displayLogCount() {
        const logCount = this.countLogs();
        this.logCountElement.innerHTML = `<p>Total Logs: ${logCount}</p>`; 
    }
}

    document.addEventListener('DOMContentLoaded', () => {
    new DataLogger('logButton', 'idContainer', 'clearButton', 'logCount'); 
    })