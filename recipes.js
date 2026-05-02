const categoryTranslate = {
    Beef: "Ужин",
    Chicken: "Обед",
    Dessert: "Десерт",
    Lamb: "Обед",
    Miscellaneous: "Завтрак",
    Pasta: "Ужин",
    Pork: "Обед",
    Seafood: "Ужин",
    Side: "Завтрак",
    Starter: "Закуска",
    Vegan: "Завтрак",
    Vegetarian: "Закуска",
    Breakfast: "Завтрак",
    Goat: "Обед"
};

const categoryMap = {
    all: { title: "Все рецепты", filter: "all" },
    breakfast: { title: "Завтраки", filter: "Завтрак" },
    lunch: { title: "Обеды", filter: "Обед" },
    dinner: { title: "Ужины", filter: "Ужин" },
    snack: { title: "Закуски", filter: "Закуска" },
    dessert: { title: "Десерты", filter: "Десерт" }
};


let allMeals = [];
let visibleCount = 0;
const STEP = 4;



function loadRecipes(filter = "all") {
    fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=")
        .then(res => res.json())
        .then(data => {
            let meals = data.meals || [];

            if (filter !== "all") {
                meals = meals.filter(meal =>
                    categoryTranslate[meal.strCategory] === filter
                );
            }

            allMeals = meals;
            visibleCount = 0;

            document.getElementById("recipeGrid").innerHTML = "";
            showMore();
        })
        .catch(() => {
            document.getElementById("recipeGrid").innerHTML = "Ошибка загрузки рецептов";
        });
}


function showMore() {
    const grid = document.getElementById("recipeGrid");
    const count = document.getElementById("recipeCount");
    const btn = document.getElementById("showMoreBtn");

    const nextMeals = allMeals.slice(visibleCount, visibleCount + STEP); 

    nextMeals.forEach(meal => {
        grid.innerHTML += `
        <div class="recipe-card">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
            <p>Категория: ${categoryTranslate[meal.strCategory] || meal.strCategory}</p>
        </div>`;
    });

    visibleCount += STEP;

    count.textContent = `Показано ${Math.min(visibleCount, allMeals.length)} из ${allMeals.length}`;

    if (visibleCount >= allMeals.length) {
        btn.style.display = "none";
    } else {
        btn.style.display = "block";
    }
}



function changeCategory(value) {
    const config = categoryMap[value];
    document.getElementById("recipeTitle").firstChild.textContent = config.title + " ";
    loadRecipes(config.filter);
}

document.querySelectorAll('input[name="mealType"]').forEach(radio => {
    radio.addEventListener("change", () => changeCategory(radio.value));
});


document.getElementById("showMoreBtn")
    .addEventListener("click", showMore);


const params = new URLSearchParams(window.location.search);
const category = params.get("category");

if (category && categoryMap[category]) {
    const radio = document.querySelector(`input[value="${category}"]`);
    if (radio){
        radio.checked = true;
    } 
    changeCategory(category);
} else {
    loadRecipes();
}