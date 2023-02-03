const wrapper = document.getElementById('wrapper');
const searchInput = document.getElementById('search');

const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

const getHomeContent = () => {
    clearPage();
    const categoriesDiv = document.createElement('div');
    const tenRandomDiv = document.createElement('div');
    wrapper.append(categoriesDiv);
    wrapper.append(tenRandomDiv);
    fetch('http://localhost:8000/home')
        .then(response => response.json())
        .then(home => {
            for(const meal of home.meals){
                const thumbnail = document.createElement('img');
                const itemLink = document.createElement('a');
                const itemTitle = document.createElement('h2');
                itemLink.classList.add('itemLink');
                itemLink.href = '';
                itemLink.setAttribute('onclick', 'getRecipe(' + meal.idMeal + '); return false;');
                thumbnail.src = meal.strMealThumb;
                itemTitle.textContent = meal.strMeal;
                itemLink.append(thumbnail);
                itemLink.append(itemTitle);
                tenRandomDiv.append(itemLink);
            }
        })
        .catch(err => console.log(err));

    fetch('http://localhost:8000/mealCategories')
        .then(response => response.json())
        .then(mealCategoryList =>{
            for(const category of mealCategoryList.categories){
                const thumbnail = document.createElement('img');
                const itemLink = document.createElement('a');
                const itemTitle = document.createElement('h2');
                thumbnail.src = category.strCategoryThumb;
                itemTitle.textContent = category.strCategory;
                itemLink.classList.add('itemLink');
                itemLink.append(thumbnail);
                itemLink.append(itemTitle);
                categoriesDiv.append(itemLink);
            }
        })
        .catch(err => console.log(err));
}

search.addEventListener('input', debounce(() => {
    const query = search.value;
    console.log(query);
}, 500));

const getRecipe = (mealId) => {
    fetch('http://localhost:8000/recipe/' + mealId)
        .then(response => response.json())
        .then(recipe => {
            loadRecipe(recipe);

        })
        .catch(err => console.log(err));
}

 const loadRecipe = (recipe) => {
    clearPage();
    const meal = recipe.meals[0];
    const recipeName = document.createElement('h1');
    const recipeImage = document.createElement('img');
    const cuisine = document.createElement('h2');
    const category = document.createElement('h2');
    const ingredients = document.createElement('ul');
    const instructions = document.createElement('p');

    recipeName.textContent = meal.strMeal;
    recipeImage.src = meal.strMealThumb;
    cuisine.textContent = 'Cuisine: ' + meal.strArea;
    category.textContent = 'Category: ' + meal.strCategory;
    instructions.textContent = meal.strInstructions;

    let x = 1;
    let ingredientX = 'strIngredient' + x;
    let measureX = 'strMeasure' + x;
    while(meal[ingredientX]){
        const ingredientItem = document.createElement('li');
        ingredientItem.textContent = meal[measureX] + ' - ' + meal[ingredientX];
        ingredients.append(ingredientItem);
        x++;
        ingredientX = 'strIngredient' + x;
        measureX = 'strMeasure' + x;
    }

    wrapper.append(recipeName);
    wrapper.append(recipeImage);
    wrapper.append(cuisine);
    wrapper.append(category);
    wrapper.append(ingredients);
    wrapper.append(instructions);
 }

 const clearPage = () => {
    wrapper.innerHTML = '';
 }
 
document.getElementById('homeAnchor').setAttribute('onclick', 'getHomeContent(); return false;');

getHomeContent();