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
    const categoriesContainer = document.createElement('div');
    const tenRandomContainer = document.createElement('div');
    categoriesContainer.classList.add('categoriesContainer');
    tenRandomContainer.classList.add('tenRandomContainer');
    wrapper.append(categoriesContainer);
    wrapper.append(tenRandomContainer);
    fetch('http://localhost:8000/home')
        .then(response => response.json())
        .then(home => {
            for(const meal of home.meals){
                const itemLink = document.createElement('div');
                itemLink.classList.add('itemLink');
                itemLink.innerHTML = `<img src="${meal.strMealThumb}"><h2>${meal.strMeal}</h2>`;
                itemLink.addEventListener('click', () => {
                    getRecipe(meal.idMeal);
                });
                tenRandomContainer.append(itemLink);
            }
        })
        .catch(err => console.log(err));

    fetch('http://localhost:8000/mealCategories')
        .then(response => response.json())
        .then(mealCategoryList =>{
            for(const category of mealCategoryList.categories){
                const itemLink = document.createElement('div');
                itemLink.classList.add('itemLink');
                itemLink.innerHTML = `<img src="${category.strCategoryThumb}"><h2>${category.strCategory}<h2/>`;
                itemLink.addEventListener('click', () => {
                    getCategory(category.strCategory);
                });
                categoriesContainer.append(itemLink);
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
        const itemLink = document.createElement('div');
        itemLink.classList.add('itemLink');
        itemLink.innerHTML = `<img src="${meal.strMealThumb}"><h2>${meal.strMeal}</h2>`;
        itemLink.addEventListener('click', () => {
            getRecipe(meal.idMeal);
        });
        wrapper.append(itemLink);
    }
}

 const loadRecipe = (recipe) => {
    clearPage();
    const meal = recipe.meals[0];
    const ingredients = document.createElement('ul');
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

    const recipeContainer = document.createElement('div');
    recipeContainer.innerHTML = `
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}">
        <h2>Category: ${meal.strCategory}</h2>
        <h2>Cuisine: ${meal.strArea}</h2>
        ${ingredients.outerHTML}
        <p>${meal.strInstructions}</p>
    `;

    wrapper.append(recipeContainer);
 }

 const clearPage = () => {
    wrapper.innerHTML = '';
 }
 
document.getElementById('homeAnchor').setAttribute('onclick', 'getHomeContent(); return false;');

getHomeContent();