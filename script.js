// DOM Elements
const foodInput = document.getElementById("foodInput");
const calorieInput = document.getElementById("calorieInput");
const addBtn = document.getElementById("addBtn");
const foodList = document.getElementById("foodList");
const totalCaloriesEl = document.getElementById("totalCalories");
const resetBtn = document.getElementById("resetBtn");
const warningMessage = document.getElementById("warningMessage");

const calorieLimit = 2000; // daily limit
let foods = JSON.parse(localStorage.getItem("foods")) || [];

// Initial Load
renderFoods();
updateTotal();

// Fetch calories from mock API
async function getCalories(foodName) {
  try {
    const res = await fetch("foods.json");
    const data = await res.json();
    return data[foodName.toLowerCase()] || 0;
  } catch (error) {
    console.error("Fetch error:", error);
    return 0;
  }
}

// Add food
addBtn.addEventListener("click", async () => {
  const foodName = foodInput.value.trim();
  let calories = calorieInput.value.trim();

  if (!foodName) return alert("Please enter a food name");

  if (!calories) {
    calories = await getCalories(foodName);
  } else {
    calories = parseInt(calories, 10);
  }

  foods.push({ name: foodName, calories });
  localStorage.setItem("foods", JSON.stringify(foods));

  renderFoods();
  updateTotal();

  foodInput.value = "";
  calorieInput.value = "";
});

// Remove food
function removeFood(index) {
  foods.splice(index, 1);
  localStorage.setItem("foods", JSON.stringify(foods));
  renderFoods();
  updateTotal();
}

// Reset
resetBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to reset?")) {
    foods = [];
    localStorage.removeItem("foods");
    renderFoods();
    updateTotal();
  }
});

// Render list
function renderFoods() {
  foodList.innerHTML = "";
  foods.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "flex justify-between bg-gray-100 p-2 rounded";
    li.innerHTML = `
      <span>${item.name} - ${item.calories} cal</span>
      <button class="text-red-500 hover:underline" onclick="removeFood(${index})">X</button>
    `;
    foodList.appendChild(li);
  });
}

// Update total & warning
function updateTotal() {
  const total = foods.reduce((sum, item) => sum + item.calories, 0);
  totalCaloriesEl.textContent = total;

  if (total > calorieLimit) {
    warningMessage.classList.remove("hidden");
  } else {
    warningMessage.classList.add("hidden");
  }
}

//this the calorioes