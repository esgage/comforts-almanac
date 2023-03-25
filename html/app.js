const wrapper = document.getElementById('wrapper');
const searchInput = document.getElementById('search');
const autocompleteList = document.getElementById('autocomplete');

let popStateFired = 0;

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
    fetch('/fetch-search/' + query)
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

const loadSearchResults = (urlPathQuery) => {
    let query = urlPathQuery;
    if (!query){
        query = search.value;
    }
    fetch('/fetch-search/' + query)
        .then(response => {
            if(!response.ok) return;
            return response.json();
        })
        .then(searchResults => {
            if(searchResults.meals === null){
                autocompleteList.innerHTML = "No Results";
            }
            else{
                clearPage();
                if(!popStateFired){
                    history.pushState('search', null,'/search/' + query);
                }
                let i = 0;
                for(const meal of searchResults.meals){
                    if (i >= 10) return;
                    const sResult = document.createElement('a');
                    sResult.classList.add('sarch-result');
                    sResult.href = '';
                    sResult.setAttribute('onclick', 'getRecipe(' + meal.idMeal + '); return false;');
                    sResult.innerHTML = `<img src="${meal.strMealThumb}"><h2>${meal.strMeal}</h2>`;
                    wrapper.append(sResult);
                    i++;
                }
            }
        })
        .catch(err => console.log(err));
}


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
    fetch('/fetch-home')
        .then(response => response.json())
        .then(home => {
            if(!popStateFired){
                history.pushState('home', null, '/');
            }
            popStateFired = 0;
            document.title = 'Comforts Almanac';
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

    fetch('/fetch-areas')
        .then(response => response.json())
        .then(areaList =>{
            for(const area of areaList.meals){
                const itemLink = document.createElement('a');
                itemLink.classList.add('area');
                itemLink.innerHTML=area.strArea;
                itemLink.setAttribute('onclick', 'getArea(\'' + area.strArea + '\'); return false;');
                areas.append(itemLink);
            }
        })
        .catch(err => console.log(err));
}

const getCategory = (categoryId) => {
    fetch('/fetch-category/' + categoryId)
        .then(response => response.json())
        .then(category => {
            if(!popStateFired){
                history.pushState('category', null, `/category/${categoryId.toLowerCase()}`);
            }
            popStateFired = 0;
            document.title = categoryId;
            loadCategory(category);
        })
        .catch(err => console.log(err));
}

const getArea = (areaId) => {
    fetch('/fetch-areas/' + areaId)
        .then(response => response.json())
        .then(area => {
            if(!popStateFired){
                history.pushState('area', null, `/area/${areaId.toLowerCase()}`);
            }
            popStateFired = 0;
            document.title = areaId;
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
    fetch('/fetch-recipe/' + mealId)
        .then(response => response.json())
        .then(recipe => {
            loadRecipe(recipe);
        })
        .catch(err => console.log(err));
}

const loadRecipe = (recipe) => {
    clearPage();
    const meal = recipe.meals[0];
    if(!popStateFired){
        history.pushState('recipe', null, `/recipe/${meal.strMeal.replace(/ /g, '_').toLowerCase()}`);
    }
    popStateFired = 0;
    document.title = meal.strMeal;
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
 
 window.addEventListener('popstate', e => {
    popStateFired = 1;
    checkUriPath();
 });

const checkUriPath = () => {
    const uriPath = window.location.pathname.split('/');
    switch(uriPath[1]){
        case 'area':
            getArea(uriPath[2]);
        break;
        case 'category':
            getCategory(uriPath[2]);
        break;
        case 'recipe':
            const uriPathRecipe = uriPath[2].replace(/_/g, ' ');
            fetch('/fetch-search/' + uriPathRecipe)
                .then(response => response.json())
                .then(recipe => {
                    loadRecipe(recipe);
                })
                .catch(err => console.log(err));
        break;
        case 'search':
            loadSearchResults(uriPath[2]);
        break;
        default:
            getHomeContent();
    }
}

checkUriPath();

const searchSubmit = document.getElementById('search_submit').setAttribute('onpointerdown', 'loadSearchResults();');
document.getElementById('homeAnchor').setAttribute('onclick', 'getHomeContent(); return false;');