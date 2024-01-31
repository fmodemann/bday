const stations = {
    "1": "München",
    "2": "Frankfurt",
    "3": "Hamburg",
    "4": "Köln-Düsseldorf",
    "5": "Stuttgart",
    "6": "Berlin",
    "7": "Hannover",
    "8": "Leipzig",
    "9": "Freiburg-Basel",
    "10": "Konstanz",
    "11": "Nürnberg",
    "12": "Paris Süd (Orly)",
    "13": "Bordeaux",
    "15": "Lyon",
    "16": "Aix-Marseille",
    "17": "Barcelona",
    "18": "Lissabon",
    "19": "Faro",
    "20": "Madrid",
    "21": "Malaga",
    "22": "Marburg",
    "24": "Bochum",
    "25": "Chemnitz",
    "26": "Münster-Senden",
    "27": "Murnau",
    "28": "Trier",
    "29": "Genf-Pays de Gex",
    "30": "Toulouse",
    "31": "Nantes",
    "32": "Amsterdam",
    "33": "Rotterdam",
    "34": "Mailand",
    "35": "Rom",
    "36": "Wien",
    "37": "Graz",
    "38": "Valencia",
    "39": "Sevilla",
    "40": "Bilbao",
    "41": "Porto",
    "42": "Brüssel",
    "43": "Pop Up Station Hannover",
    "45": "Wien-Süd",
    "46": "Innsbruck",
    "47": "Antwerpen",
    "48": "Paris Flughafen CDG",
    "49": "Straßburg",
    "50": "München-Süd",
    "51": "Berlin-Schönefeld",
    "52": "Köln-Bonn",
    "53": "Stuttgart-Esslingen",
    "54": "Mainz",
    "55": "Bremen",
    "56": "Dresden",
    "57": "Bologna",
    "58": "Turin",
    "59": "Stockholm",
    "60": "Malmö",
    "61": "Zürich",
    "62": "London-Nord",
    "63": "London",
    "64": "Edinburgh",
    "65": "Hamburg Airport",
    "66": "Bürstner, Kehl",
    "67": "Knaus, Jandelsbrunn",
    "68": "Westfalia, Rheda-Wiedenbrück",
    "69": "VW, Hannover",
    "70": "Hymer, Bad Waldsee",
    "71": "VW, Lisbon",
    "72": "Los Angeles",
    "74": "Thor Industries, Elkhart",
    "75": "San Francisco",
    "76": "Las Vegas",
    "77": "Göteborg",
    "78": "Venedig",
    "79": "Heidelberg",
    "80": "Florenz",
    "81": "Winnebago Industries",
    "82": "Pt Roberts",
    "83": "Vancouver",
    "84": "Calgary",
    "85": "Salzburg",
    "86": "Split",
    "87": "Lille",
    "88": "Nizza",
    "89": "Regensburg",
    "90": "Erfurt",
    "91": "Bielefeld",
    "92": "Kassel",
    "93": "Dublin",
    "94": "Bergamo",
    "95": "Bergen",
    "96": "Oslo",
    "97": "Bern",
    "98": "Bristol",
    "99": "Manchester",
    "100": "LMC Caravan"
}

// Define a function to make API calls with different station numbers
async function fetchReturns(stationNumber) {
    try {
        const stationUrl = `https://booking.roadsurfer.com/api/de/rally/stations/${stationNumber}`;
        const stationResponse = await fetch(stationUrl);

        if (stationResponse.ok) {
            const stationData = await stationResponse.json();
            const returnStations = stationData.returns;

            for (const returnStation of returnStations) {
                const tripUrl = `https://booking.roadsurfer.com/api/de/rally/timeframes/${stationNumber}-${returnStation}`;
                const tripResponse = await fetch(tripUrl);

                if (tripResponse.ok) {
                    const tripData = await tripResponse.json();
                    displayData(stationData.id, returnStation, tripData[0].startDate, tripData[0].endDate, tripUrl);
                } else {
                    console.error(`Error fetching data for station ${stationNumber} to ${returnStation}: ${tripResponse.status}`);
                }
            }
        } else {
            console.warn(`Error fetching data for station ${stationNumber}: ${stationResponse.status}`);
        }
    } catch (error) {
        console.error(`Error fetching data for station ${stationNumber}:`, error);
    }
}

// Function to format a date string as "DD.MM.YYYY"
function formatDate(dateString, region) {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(region, options);
}

// Function to display data as a Kachel
function displayData(startStation, endStation, startDate, endDate) {
    const link = `https://booking.roadsurfer.com/rally/pick?pickup_date=${formatDate(startDate, 'fr-CA')}&return_date=${formatDate(endDate, 'fr-CA')}&currency=EUR&startStation=${startStation}&endStation=${endStation}`
    const dataContainer = document.getElementById("dataContainer");
    const kachel = document.createElement("a");
    kachel.href = link;
    kachel.target = "_blank"; // Open in new tab
    kachel.classList.add("kachel");
    kachel.innerHTML = `
            <h3>${stations[startStation]} </br> ${stations[endStation]}</h3>
            <p>${formatDate(startDate, 'de-DE')} bis ${formatDate(endDate, 'de-DE')}</p>
        `;
    dataContainer.appendChild(kachel);
}

// Function to refresh the data
function refreshData() {
    const dataContainer = document.getElementById("dataContainer");
    dataContainer.innerHTML = ""; // Clear the container
    for (const stationNumber in stations) {
        setTimeout(() => {
            fetchReturns(stationNumber);
        }, Math.floor(stationNumber / 2) * 1000);
    }
}

// Add a click event listener to the refresh button
// const refreshButton = document.getElementById("refreshButton");
// refreshButton.addEventListener("click", refreshData);

// Initially fetch the data when the page loads
refreshData();