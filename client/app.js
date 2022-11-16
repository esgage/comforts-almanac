const getHomeResults = () => {
    fetch('http://localhost:8000/home')
        .then(response => response.json())
        .then(home => {
            const myJSON = JSON.stringify(home);
            console.log('home stringified: ' + myJSON);
            console.log('home object ' + home.meals[0].idMeal);
            
        })
        .catch(err => console.log(err));
}

getHomeResults();