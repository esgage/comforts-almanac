const wrapper = document.getElementById('wrapper');

const getHomeResults = () => {
    fetch('http://localhost:8000/home')
        .then(response => response.json())
        .then(home => {
            //const myJSON = JSON.stringify(home);
            populateHome(home);
            
        })
        .catch(err => console.log(err));
}

getHomeResults();

const populateHome = (home) => {
    for(const meal of home.meals){
        const thumbnail = document.createElement('img');
        const itemLink = document.createElement('a');
        const itemTitle = document.createElement('h2');
        itemLink.classList.add('itemLink');
        itemLink.href = '';
        itemLink.setAttribute('onclick', 'fetchRecipe(' + meal.idMeal + '); return false;');
        thumbnail.src = meal.strMealThumb;
        itemTitle.textContent = meal.strMeal;
        itemLink.append(thumbnail);
        itemLink.append(itemTitle);
        wrapper.append(itemLink);
    }
}

const fetchRecipe = (mealId) => {
    fetch('http://localhost:8000/recipe/' + mealId)
        .then(response => response.json())
        .then(recipe => {
            console.log("recipe: " + recipe);

        })
        .catch(err => console.log(err));
}

 const loadRecipe = (recipe) => {
    
 }