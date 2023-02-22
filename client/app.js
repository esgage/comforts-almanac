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

search.addEventListener('input', debounce(() => {
    const query = search.value;
    autocompleteList.innerHTML = "";
    autocompleteList.style.display = 'block';
    fetch('https://localhost:4000/search/' + query)
        .then(response => {
            if(!response.ok) return;
            return response.json();
        })
        .then(autocompleteResults => {
            if(autocompleteResults.meals === null){
                autocompleteList.innerHTML = "No Results";
            }
            else{
                let i = 0;
                for(const meal of autocompleteResults.meals){
                    if (i >= 10) return;
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


const hideAutoComplete = (event) => {
    if(event.target.matches('#search') || event.target.matches('#autocomplete a') || event.target.matches('#autocomplete')){
        console.log('match: - ' + event.target);
        return;
    }
    autocompleteList.style.display = 'none';
}
document.addEventListener('touchstart', hideAutoComplete);
document.addEventListener('click', hideAutoComplete);

const getHomeContent = () => {
    clearPage();
    const categoriesContainer = document.createElement('div');
    const tenRandomContainer = document.createElement('div');
    const areas = document.createElement('div');
    categoriesContainer.classList.add('categoriesContainer');
    tenRandomContainer.classList.add('tenRandomContainer');
    areas.classList.add('areasContainer');
    wrapper.append(categoriesContainer);
    wrapper.append(tenRandomContainer);
    wrapper.append(areas);
    fetch('https://localhost:4000/home')
        .then(response => response.json())
        .then(home => {
            for(const meal of home.meals){
                const itemLink = document.createElement('a');
                itemLink.classList.add('itemLink');
                itemLink.innerHTML = `<img src="${meal.strMealThumb}"><h2>${meal.strMeal}</h2>`;
                itemLink.addEventListener('click', () => {
                    getRecipe(meal.idMeal);
                });
                tenRandomContainer.append(itemLink);
            }
        })
        .catch(err => console.log(err));

    const mealCategories = `
        <a href="" onclick='getCategory("Beef"); return false;'>Beef</a>
        <a href="" onclick='getCategory("Pork"); return false;'>Pork</a>
        <a href="" onclick='getCategory("Lamb"); return false;'>Lamb</a>
        <a href="" onclick='getCategory("Seafood"); return false;'>Seafood</a>
        <a href="" onclick='getCategory("Chicken"); return false;'>Chicken</a>
        <a href="" onclick='getCategory("Miscellaneous"); return false;'>Miscellaneous</a>
        <a href="" onclick='getCategory("Pasta"); return false;'>Pasta</a>
        <a href="" onclick='getCategory("Dessert"); return false;'>Dessert</a>
        <a href="" onclick='getCategory("Breakfast"); return false;'>Breakfast</a>
        <a href="" onclick='getCategory("Side"); return false;'>Side</a>
        <a href="" onclick='getCategory("Vegan"); return false;'>Vegan</a>
        <a href="" onclick='getCategory("Vegetarian"); return false;'>Vegetarian</a>
    `;
    categoriesContainer.innerHTML = mealCategories;

    fetch('https://localhost:4000/areas')
        .then(response => response.json())
        .then(areaList =>{
            for(const area of areaList.meals){
                const itemLink = document.createElement('a');
                itemLink.classList.add('area');
                itemLink.innerHTML=area.strArea;
                itemLink.setAttribute('onclick', 'getArea(\'' + area.strArea + '\'); return false;');
                console.log(area.strArea);
                areas.append(itemLink);
            }
        })
        .catch(err => console.log(err));
}

const getCategory = (categoryId) => {
    fetch('https://localhost:4000/category/' + categoryId)
        .then(response => response.json())
        .then(category => {
            loadCategory(category);
        })
        .catch(err => console.log(err));
}

const getArea = (areaId) => {
    fetch('https://localhost:4000/areas/' + areaId)
        .then(response => response.json())
        .then(area => {
            loadArea(area);
        })
        .catch(err => console.log(err));
}

const loadArea = (area) =>{
    clearPage();
    for(const meal of area.meals){
        const itemLink = document.createElement('div');
        itemLink.classList.add('itemLink');
        itemLink.innerHTML = `<img src="${meal.strMealThumb}"><h2>${meal.strMeal}</h2>`;
        itemLink.addEventListener('click', () => {
            getRecipe(meal.idMeal);
        });
        wrapper.append(itemLink);
    }
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

const getRecipe = (mealId) => {
    fetch('https://localhost:4000/recipe/' + mealId)
        .then(response => response.json())
        .then(recipe => {
            loadRecipe(recipe);
        })
        .catch(err => console.log(err));
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
    autocomplete.style.display = 'none';
    wrapper.innerHTML = '';
    window.scrollTo(0,0);
 }
 
document.getElementById('homeAnchor').setAttribute('onclick', 'getHomeContent(); return false;');

getHomeContent();