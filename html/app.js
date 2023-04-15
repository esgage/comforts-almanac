const contentContainer = document.getElementById('content-container');
const searchInput = document.getElementById('search');
const autocompleteList = document.getElementById('autocomplete');
const body = document.querySelector('body');
let popStateFired = 0;
let navToggled = 0;

const navToggleBtn = document.getElementById('hamburger-tgl');
const navWrapper = document.getElementById('nav-wrapper');
const toggleNav = () => {
    navToggleBtn.classList.toggle('x');
    navWrapper.classList.toggle('open');
    scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.paddingRight = scrollbarWidth + 'px';
    navToggleBtn.style.paddingRight = scrollbarWidth + 'px';
    body.classList.toggle('overflow-hidden');
    if(!navToggled){
        navToggled = 1;
    } else {
        navToggled = 0;
    }
}

navToggleBtn.addEventListener('click', ()=>{
    toggleNav();
});

const exitNav = (event) => {
    if(event.target.matches('#nav-wrapper *')){
        return;
    }
    toggleNav();
}

navWrapper.addEventListener('click', exitNav);

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
            clearPage();
            if(!popStateFired){
                history.pushState('search', null,'/search/' + query);
            }
            popStateFired = 0;
            document.title = `Results for: "${query}"`;
            const searchResultsContainer = document.createElement('div');
            const searchResultsHeading = document.createElement('h2');
            searchResultsContainer.classList.add('search-results-container');
            searchResultsHeading.classList.add('search-results-heading');
            searchResultsHeading.innerText = `Results for "${query}"`;
            contentContainer.append(searchResultsHeading)
            contentContainer.append(searchResultsContainer);
            if(searchResults.meals === null){
                autocompleteList.innerHTML = "No Results";
                searchResultsHeading.innerText = `Sorry! It looks like we have no results for "${query}"`;
            }
            else{
                let i = 0;
                for(const meal of searchResults.meals){
                    if (i >= 30) return;
                    const sResult = document.createElement('a');
                    sResult.classList.add('itemLink');
                    sResult.href = '';
                    sResult.setAttribute('onclick', 'getRecipe(' + meal.idMeal + '); return false;');
                    sResult.innerHTML = `<img src="${meal.strMealThumb}" alt="${meal.strMeal}" height="600" width="600"><h2>${meal.strMeal}</h2>`;
                    searchResultsContainer.append(sResult);
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
    const tenRandomContainer = document.createElement('div');
    const areas = document.createElement('div');
    tenRandomContainer.classList.add('tenRandom-container');
    areas.classList.add('areas-container');
    contentContainer.append(tenRandomContainer);
    contentContainer.append(areas);
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
                itemLink.innerHTML = `<img src="${meal.strMealThumb}" alt="${meal.strMeal}" height="600" width="600"><h2>${meal.strMeal}</h2>`;
                itemLink.addEventListener('click', () => {
                    getRecipe(meal.idMeal);
                });
                tenRandomContainer.append(itemLink);
            }
        })
        .catch(err => console.log(err));

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
        .catch(err => {
            console.log('error = ' + err);
            const errorNotice = document.createElement('h1');
            errorNotice.innerHTML = `Uh oh.. <br>It looks like our database may be down. Please give us some time and try again later!`;
            contentContainer.append(errorNotice);
        });
}

const getCategory = (categoryId) => {
    fetch('/fetch-category/' + categoryId)
        .then(response => response.json())
        .then(category => {
            if(!popStateFired){
                history.pushState('category', null, `/category/${categoryId.toLowerCase()}`);
            }
            popStateFired = 0;
            clearPage();
            document.title = categoryId;
            const categoryHeading = document.createElement('h1');
            categoryHeading.classList.add('category-heading');
            categoryHeading.innerText = categoryId;
            contentContainer.append(categoryHeading);
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
            clearPage();
            const areaHeading = document.createElement('h1');
            areaHeading.classList.add('area-heading');
            areaHeading.innerText = areaId;
            contentContainer.append(areaHeading);
            document.title = areaId;
            loadArea(area);
        })
        .catch(err => console.log(err));
}

const loadArea = (area) =>{
    const areaContainer = document.createElement('div');
    areaContainer.classList.add('area-container');
    for(const meal of area.meals){
        const itemLink = document.createElement('div');
        itemLink.classList.add('itemLink');
        itemLink.innerHTML = `<img src="${meal.strMealThumb}" alt="${meal.strMeal}" height="600" width="600"><h2>${meal.strMeal}</h2>`;
        itemLink.addEventListener('click', () => {
            getRecipe(meal.idMeal);
        });
        areaContainer.append(itemLink);
    }
    contentContainer.append(areaContainer);
}

const loadCategory = (category) =>{
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category-container');
    for(const meal of category.meals){
        const itemLink = document.createElement('div');
        itemLink.classList.add('itemLink');
        itemLink.innerHTML = `<img src="${meal.strMealThumb}" alt="${meal.strMeal}" height="600" width="600"><h2>${meal.strMeal}</h2>`;
        itemLink.addEventListener('click', () => {
            getRecipe(meal.idMeal);
        });
        categoryContainer.append(itemLink);
    }
    contentContainer.append(categoryContainer);
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
    const formattedInstructions = meal.strInstructions.replace(/\. /g, '.</li><li>');
    const recipeContainer = document.createElement('div');  
    recipeContainer.classList.add('recipe-container');
    recipeContainer.innerHTML = `
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" height="600" width="600">
        <h2>Category: <a href="" onClick='getCategory("${meal.strCategory}"); return false;'>${meal.strCategory}</a></h2>
        <h2>Cuisine: <a href="" onClick='getArea("${meal.strArea}"); return false;'>${meal.strArea}</a></h2>
        ${ingredients.outerHTML}
        <ol><li>${formattedInstructions}</li></ol>
    `;

    contentContainer.append(recipeContainer);
 }

const clearPage = () => {
    if(navToggled){
        toggleNav();
    }
    autocomplete.style.display = 'none';
    contentContainer.innerHTML = '';
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

const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    loadSearchResults();
});
document.getElementById('header-logo').setAttribute('onclick', 'getHomeContent(); return false;');