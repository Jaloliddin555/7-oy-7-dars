const userForm = document.querySelector("#form");
const userInput = document.querySelector("#input");
const userBox = document.querySelector(".wrapper");
const sortButton = document.querySelector("#sort-btn");

const API_ALL = "https://restcountries.com/v3.1/all";
const API_SEARCH = "https://restcountries.com/v3.1/name/";

let countriesData = [];
let sortAscending = true;

async function fetchCountries(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        countriesData = data;
        sortAndDisplay();
    } catch (error) {
        console.error("Error fetching data:", error);
        userBox.innerHTML = `<p class="text-red-500 text-center">Bunday bayroq yo'q</p>`;
    }
}

function sortAndDisplay() {
    const sortedCountries = [...countriesData].sort((a, b) => {
        return sortAscending 
            ? a.name.common.localeCompare(b.name.common) 
            : b.name.common.localeCompare(a.name.common);
    });
    displayCountries(sortedCountries);
}

function displayCountries(countries) {
    userBox.innerHTML = "";
    countries.forEach(country => {
        userBox.innerHTML += `
        <div class="card bg-base-100 w-80 shadow-md p-4">
            <figure>
                <img class="w-full h-48 object-cover rounded-lg" src="${country.flags.png}" alt="${country.name.common}" />
            </figure>
            <div class="card-body">
                <h2 class="card-title">${country.name.common}</h2>
                <p class="text-sm">${country.name.official}</p>
                <p class="text-sm">Population: ${country.population.toLocaleString()}</p>
                <p class="text-sm">Region: ${country.region}</p>
                <div class="card-actions justify-end">
                    <button class="btn btn-primary">More</button>
                </div>
            </div>
        </div>`;
    });
}

fetchCountries(API_ALL);

userForm.addEventListener("submit", (event) => {
    event.preventDefault(); 
    const query = userInput.value.trim();
    if (query) {
        fetchCountries(API_SEARCH + query);
    } else {
        fetchCountries(API_ALL);
    }
});

sortButton.addEventListener("click", () => {
    sortAscending = !sortAscending;
    sortAndDisplay();
    sortButton.textContent = sortAscending ? "Sort by Name ↓" : "Sort by Name ↑";
});
