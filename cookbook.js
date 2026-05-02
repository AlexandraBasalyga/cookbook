const form = document.getElementById('formSection');
const recipesList = document.getElementById('myRecipesList');

async function loadRecipes() {
    try {
        const response = await fetch('http://localhost:3000/recipes');
        const recipes = await response.json();

        if (recipesList) {
            recipesList.innerHTML = recipes.map(recipe => `
            <div class="recipe-card" data-id="${recipe.id}">
            <h3>${recipe.title}</h3>
            <p>Тип: ${recipe.type}</p>
            <p>Время: ${recipe.time} мин</p>
            <p>Описание:${recipe.description}</p>
            <div class="card-buttons">
                <button onclick="editRecipe(${recipe.id})">Редактировать</button>
                <button onclick="deleteRecipe(${recipe.id})">Удалить</button>
            </div>
            </div>
            `).join('');
        }

    } catch (error) {
        console.error('Ошибка загрузки рецептов:', error);
    }
}

if (form) {
    form.addEventListener('submit', async (e) => { //

        e.preventDefault();

        const title = document.getElementById('title').value;
        const time = document.getElementById('time').value;
        const typeInput = document.querySelector('input[name="type"]:checked');
        const type = typeInput ? typeInput.value : null;
        const description = document.getElementById('description').value;

        if (!title) {
        alert("Введите название блюда");
        return;
        }

        if (!type) {
            alert("Выберите тип блюда");
            return;
        }

        if (!time) {
            alert("Введите время приготовления");
            return;
        }

        if (!description) {
            alert("Введите описание");
            return;
        }

        const recipe = {
            title: title,
            time: Number(time),
            type: type,
            description: description
        };

    try {
        const response = await fetch('http://localhost:3000/recipes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recipe)
        });

        if (response.ok) {
            form.reset();
            loadRecipes();
        }

    } catch (error) {
        console.error('Ошибка добавления:', error);
    }

        
    });
}

async function editRecipe(id) {
    const newTitle = prompt('Новое название:');
    if (newTitle === null) return;

    const newType = prompt('Новый тип:');
    const newTime = prompt('Новое время:');
    const newDescription = prompt('Новое описание:');

    try {
        const response = await fetch(`http://localhost:3000/recipes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: newTitle,
                type: newType,
                time: Number(newTime),
                description: newDescription
            })
        });

        if (response.ok) {
            loadRecipes();
        }

    } catch (error) {
        console.error('Ошибка редактирования:', error);
    }
}

async function deleteRecipe(id) {
    try {
        const response = await fetch(`http://localhost:3000/recipes/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadRecipes();
        }

    } catch (error) {
        console.error('Ошибка удаления:', error);
    }
}

loadRecipes();
