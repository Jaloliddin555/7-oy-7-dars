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
                <p><strong>Languages:</strong> ${country.languages ? Object.values(country.languages).join(", ") : "N/A"}</p>
                <div class="card-actions justify-end">
<button class="btn" 
    onclick="openModal('${country.name.common}', 
                        '${country.flags.png}', 
                        '${country.name.official}', 
                        '${country.population}', 
                        '${country.continents[0]}', 
                        '${country.capital?.[0] || 'Mavjud emas'}')">
    Open Modal
</button>


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

function openModal(name, flag, official, population, continent, capital) {
    const modal = document.getElementById("my_modal_3");
    
    if (!modal) {
        console.error("Modal not found!");
        return;
    }

    modal.querySelector(".text-lg").innerText = name;
    modal.querySelector(".py-4").innerHTML = `
        <img src="${flag}" class="w-full h-40 object-cover rounded-lg" />
        <p><strong>Rasmiy nomi:</strong> ${official}</p>
        <p><strong>Aholisi:</strong> ${Number(population).toLocaleString()} kishi</p>
        <p><strong>Qit'asi:</strong> ${continent}</p>
        <p><strong>Poytaxti:</strong> ${capital}</p>
        
    `;

    try {
        modal.showModal();
    } catch {
        modal.style.display = "block"; // Qo‘shimcha yechim
    }
}



sortButton.addEventListener("click", () => {
    sortAscending = !sortAscending;
    sortAndDisplay();
    sortButton.textContent = sortAscending ? "Sort by Name ↓" : "Sort by Name ↑";
});

const themeToggle = document.getElementById("theme-toggle");
const htmlElement = document.documentElement;

function setTheme(theme) {
    if (theme === "dark") {
        htmlElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "Light Mode";
    } else {
        htmlElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "Dark Mode";
    }
}

// Check and apply saved theme
const savedTheme = localStorage.getItem("theme") || "dark";
setTheme(savedTheme);

themeToggle.addEventListener("click", () => {
    setTheme(htmlElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

