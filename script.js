// DOM Elements
const foodInput = document.getElementById("foodInput");
const calorieInput = document.getElementById("calorieInput");
const addBtn = document.getElementById("addBtn");
const foodList = document.getElementById("foodList");
const totalCaloriesEl = document.getElementById("totalCalories");
const resetBtn = document.getElementById("resetBtn");

let foods = JSON.parse(localStorage.getItem("foods")) || [];

// Load initial data
renderFoods();
updateTotal();

// Fetch calorie data (mock)
async function getCalories(foodName) {
  try {
    const res = await fetch("foods.json"); // local file
    const data = await res.json();
    return data[foodName.toLowerCase()] || 0;
  } catch (error) {
    console.error("Fetch error:", error);
    return 0;
  }
}

// Add food item
addBtn.addEventListener("click", async () => {
  const foodName = foodInput.value.trim();
  let calories = calorieInput.value.trim();

  if (!foodName) return alert("Please enter a food name");

  // If user didn't enter calories manually, try fetching from foods.json
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

// Remove food item
function removeFood(index) {
  foods.splice(index, 1);
  localStorage.setItem("foods", JSON.stringify(foods));
  renderFoods();
  updateTotal();
}

// Reset all data
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
      <button class="text-red-500" onclick="removeFood(${index})">X</button>
    `;
    foodList.appendChild(li);
  });
}

// Update total calories
function updateTotal() {
  const total = foods.reduce((sum, item) => sum + item.calories, 0);
  totalCaloriesEl.textContent = total;
}
