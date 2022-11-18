const wrapper = document.getElementById('wrapper');

const getHomeResults = () => {
    fetch('http://localhost:8000/home')
        .then(response => response.json())
        .then(home => {
            const myJSON = JSON.stringify(home);
            //console.log('home stringified: ' + myJSON);
            //console.log('home object ' + home.meals[0].idMeal);
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
        itemLink.href = '#DONTFORGETTOADDMELATER';
        thumbnail.src = meal.strMealThumb;
        itemTitle.textContent = meal.strMeal;
        itemLink.append(thumbnail);
        itemLink.append(itemTitle);
        console.log(meal.strMeal);
        wrapper.append(itemLink);
    }
}