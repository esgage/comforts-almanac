const wrapper = document.getElementById('wrapper');
const searchInput = document.getElementById('search');
const autocompleteList = document.getElementById('autocomplete');

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
                itemLink.setAttribute('onclick', 'getCategory("' + category.strCategory + '"); return false;');
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
    autocompleteList.innerHTML = "";
    fetch('http://localhost:8000/search/' + query)
        .then(response => {
            if(!response.ok) return;
            return response.json();
        })
        .then(autocompleteResults => {
            if(autocompleteResults.meals === null){
                autocompleteList.innerHTML = "No Results";
                console.log('autocomplete.meals = null');
            }
            else{
                let i = 0;
                for(const meal of autocompleteResults.meals){
                    if (i >= 10) return;
                    console.log(meal.strMeal);
                    const acLink = document.createElement('a');
                    acLink.classList.add('acLink');
                    acLink.href = '';
                    acLink.setAttribute('onclick', 'getRecipe(' + meal.idMeal + '); return false;');
                    acLink.textContent = meal.strMeal;
                    autocompleteList.append(acLink);
                    i++;
                }
            }
        })
        .catch(err => console.log(err));
}, 300));

const getRecipe = (mealId) => {
    fetch('http://localhost:8000/recipe/' + mealId)
        .then(response => response.json())
        .then(recipe => {
            loadRecipe(recipe);
        })
        .catch(err => console.log(err));
}

const getCategory = (categoryId) => {
    console.log(categoryId);
    fetch('http://localhost:8000/category/' + categoryId)
        .then(response => response.json())
        .then(category => {
            loadCategory(category);
        })
        .catch(err => console.log(err));
}

const loadCategory = (category) =>{
    clearPage();
    for(const meal of category.meals){
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
        wrapper.append(itemLink);
    }
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