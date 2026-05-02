const cors = require('cors');
const express = require('express');
const app = express();
const PORT = 3000;

let recipes = [];
let nextId = 1;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/recipes', (req, res) => {
    res.json(recipes);
});

app.post('/recipes', (req, res) => {
    const { title, time, type, description } = req.body;
    
    if (!title || !time || !type || !description) {
        return res.status(400).json({ 
            error: 'Все поля обязательны для заполнения' 
        });
    }
    
    const newRecipe = {
        id: nextId++,
        title,
        time: Number(time),
        type,
        description,
    };
    
    recipes.push(newRecipe);
    res.status(201).json(newRecipe);
});

app.put('/recipes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const recipe = recipes.find(r => r.id === id);
    
    if (!recipe) {
        return res.status(404).json({ error: 'Рецепт не найден' });
    }
    
    recipe.title = req.body.title || recipe.title;
    recipe.time = req.body.time || recipe.time;
    recipe.type = req.body.type || recipe.type;
    recipe.description = req.body.description || recipe.description;
    
    res.json(recipe);
});

app.delete('/recipes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = recipes.findIndex(r => r.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Рецепт не найден' });
    }
    
    recipes.splice(index, 1);
    res.json({ message: 'Рецепт удален' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
