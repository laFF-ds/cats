// FETCH URLs
const registerURL = "http://localhost:3000/register"
const loginURL = "http://localhost:3000/login"
const favoritesURL = "http://localhost:3000/user/favorites"
const userURL = "http://localhost:3000/user/users"
const infoURL = "https://api.thecatapi.com/v1/"
const factURL = "https://cat-fact.herokuapp.com/facts/"
// UI
const registrationForm = document.querySelector('.registration-form')
const loginForm = document.querySelector('.login-form')
const logoutButton = document.querySelector('.icon-container')
const catInfoContainer = document.querySelector('.info-container')
const catFactContainer = document.querySelector('.fact-container')
const catFavoritesInfoContainer = document.querySelector('.favorites-info-container')
const catFavoritesFactContainer = document.querySelector('.favorites-fact-container')
// USER INPUT 
const emailInput = document.getElementById('email')
const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')

let favoriteInfoButton
// console.log(document.cookie.match('cat')[0])

// if(document.cookie.match('cat')[0] === 'cat')
// {
//     console.log('Its a cat')
// }
// else
// {
//     console.log('its not a cat')
// }

// LOGIN & REGISTRATION 
function getCookie(name) 
{    
    let matches = document.cookie.match(new RegExp
        (
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
// console.log(getCookie('cat'))
// if(getCookie('cat'))
// {
//     logoutButton.insertAdjacentHTML('beforeend', "<a href='/logout'><img id='login-icon' class='header-icon' src='assets/login-cat.svg' alt=''>Logout</a>")
// }
// else
// {
//     logoutButton.insertAdjacentHTML('beforeend', "<a href='/login'><img id='login-icon' class='header-icon' src='assets/login-cat.svg' alt=''>Login</a>")
// }

// FETCH REQUESTS

// CREATE ACCOUNT
if(registrationForm)
{
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault()
        fetch(registerURL, 
        {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify
            ({
                email: emailInput.value,
                username: usernameInput.value,
                password: passwordInput.value,
                catFactID: [],
                catInfoID: []
            })
        })
        .then(() => window.location.href="/login")
        console.log("done?")
    })
}

// LOGIN
if(loginForm)
{
    loginForm.addEventListener('submit', (e) => {
        console.log('hi')
        e.preventDefault()
        fetch(loginURL, 
        {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify
            ({
                username: usernameInput.value,
                password: passwordInput.value
            })
        })
        .then(() => window.location.href="/")
        console.log("done?")
    })
}

// CAT INFO FUNCTIONS
async function getBreeds()
{
    const res = await fetch(infoURL + 'breeds',
    {
        method: "GET"
    })
    const data = await res.json()
    return data
}

async function getImages(id)
{
    const res = await fetch(infoURL + `images/search?breed_ids=${id}&limit=2`, 
    {
        method: "GET"
    })
    const data = await res.json()
    // console.log(data)
    return data
}

function displayInfoFavorites()
{
    fetch(favoritesURL, {
        method: "GET",
    })
    .then(res => res.json())
    .then(data => 
    {
        data.catInfoID.forEach(favorite => {
            fetch(`${infoURL}breeds/${favorite}`)
            .then(res => res.json())
            .then(async data => 
            {
                try 
                {
                    let seed = Math.floor(Math.random()*66)
                    const catImages = await getImages(data.id)
                    output =
                    `
                    <cat-info id="${data.id}" class="favorites-cat-info">
                            <img id="first-img" src=${catImages[0].url} slot="first"></img>
                            <img id="second-img" src=${catImages[1].url} slot="second"></img>
                            <p id="name-info" slot="name">${data.name}</p>
                            <p id="origin-info" slot="origin">${data.origin}</p>
                            <p id="weight-info" slot="weight">${data.weight.imperial} lbs</p>
                            <p id="life-span-info" slot="life-span">${data.life_span} yrs</p>
                            <p id="description-info" slot="description">${data.description}</p>
                            <p id="temperament-info" slot="temperament">${data.temperament}</p>
                    </cat-info>
                    `
                    if(window.location.href === "http://localhost:3000/")
                    {
                        catInfoContainer.insertAdjacentHTML('beforeend', output)
                    }
                    else if(window.location.href === "http://localhost:3000/favorites")
                    {
                        catFavoritesInfoContainer.insertAdjacentHTML('beforeend', output)
                    }
            
                    let favoriteInfoButton = document.querySelectorAll(".favorites-cat-info")
                    favoriteInfoButton.forEach(button => 
                    {
                        let favorite = button.shadowRoot.querySelector(".favorite-button-left")
                        let favoriteRight = button.shadowRoot.querySelector(".favorite-button-right")
                        favorite.classList.add("favorited-info")
                        favorite.classList.remove("not-favorited-info")
                        favoriteRight.classList.add("favorited-info")
                        favoriteRight.classList.remove("not-favorited-info")

                        favorite.addEventListener("click", (e) => 
                        {
                            e.stopImmediatePropagation()
                            // Becomes favorited onclick so check for not-favorited
                            if(getCookie("cat") && favorite.className.includes("not-favorited-info") === false)
                            {
                                console.log(`${catInfo[seed].id} has been added to favorites`)
                                fetch(favoritesURL, {
                                    method: "PATCH",
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        catInfoID: [`${catInfo[seed].id}`]
                                    })
                                })
                            }
                            else if(getCookie("cat") && favorite.className.includes("not-favorited-info") === true)
                            {
                                console.log(`${catInfo[seed].id} has been removed from favorites`)
                                fetch(favoritesURL, {
                                    method: "DELETE",
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        catInfoID: [`${catInfo[seed].id}`]
                                    })
                                })
                            }
                            else
                            {
                                console.log("please log in to favorite :)")
                            }
                        })
                    })
                } 
                catch (error) 
                {
                    console.log("cat info error: "+error)
                }
            })
        })
    })
}

function displayFactFavorites()
{
    fetch(favoritesURL, {
        method: "GET",
    })
    .then(res => res.json())
    .then(data => 
    {
        data.catFactID.forEach(favorite => {
            fetch(`${factURL}${favorite}`)
            .then(res => res.json())
            .then(async data => 
            {
                console.log(data)
                try 
                {
                    // const catFacts = await getFacts()
                    const catImages = await getImages2()
                    output = 
                    `
                    <cat-fact id="${data._id}" class="favorites-cat-facts">
                        <img id="first-img" src=${catImages[0].url} slot="first"></img>
                        <img id="second-img" src=${catImages[1].url} slot="second"></img>
                        <span slot="fact">${data.text}</span>
                    </cat-fact>
                    `
                    catFavoritesFactContainer.insertAdjacentHTML('beforeend', output)

                    let favoriteFactButton = document.querySelectorAll(".favorites-cat-facts")
        
                    favoriteFactButton.forEach(button => 
                    {
                        let favorite = button.shadowRoot.querySelector(".favorite-button-left")
                        let favoriteRight = button.shadowRoot.querySelector(".favorite-button-right")
                        favorite.classList.add("favorited-fact")
                        favorite.classList.remove("not-favorited-fact")
                        favoriteRight.classList.add("favorited-fact")
                        favoriteRight.classList.remove("not-favorited-fact")

                        favorite.addEventListener("click", (e) => 
                        {
                            e.stopImmediatePropagation()
                            // Becomes favorited onclick so check for not-favorited
                            if(getCookie("cat") && favorite.className.includes("not-favorited-fact") === false)
                            {
                                console.log(`${catFacts[i]._id} has been added to favorites`)
                                fetch(favoritesURL, {
                                    method: "PATCH",
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        catFactID: [`${catFacts[i]._id}`]
                                    })
                                })
                            }
                            else if(getCookie("cat") && favorite.className.includes("not-favorited-fact") === true)
                            {
                                console.log(`${catFacts[i]._id} has been removed from favorites`)
                                fetch(favoritesURL, {
                                    method: "DELETE",
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        catInfoID: [`${catFacts[i]._id}`]
                                    })
                                })
                            }
                            else
                            {
                                console.log("please log in to favorite :)")
                            }
                        })
                    })
            
                } 
                catch (error) 
                {
                    console.log("cat fact error: "+error)
                }
            })
        })
    })
}

// CAT FACTS FUNCTIONS
async function getFacts()
{
    let verifiedFacts = []
    const res = await fetch(factURL + 'random?amount=200', {
        method: "GET"
    })
    const data = await res.json()
    data.forEach(fact => {
        if(fact.status.verified === true)
        {
            verifiedFacts.push(fact)
        }
    })
    console.log(verifiedFacts)
    return verifiedFacts
}

async function getImages2()
{
    const res = await fetch(infoURL + `images/search?limit=2`, 
    {
        method: "GET"
    })
    const data = await res.json()
    return data
}

// 
if(window.location.href === "http://localhost:3000/")
{
    (async () => 
    {
        try 
        {
            const catInfo = await getBreeds()
            for(let i = 0; i < 4; i++)
            {
                let seed = Math.floor(Math.random()*66)
                const catImages = await getImages(catInfo[seed].id)
                output =
                `
                <cat-info id="${catInfo[seed].id}" class="cat-info">
                        <img id="first-img" src=${catImages[0].url} slot="first"></img>
                        <img id="second-img" src=${catImages[1].url} slot="second"></img>
                        <p id="name-info" slot="name">${catInfo[seed].name}</p>
                        <p id="origin-info" slot="origin">${catInfo[seed].origin}</p>
                        <p id="weight-info" slot="weight">${catInfo[seed].weight.imperial} lbs</p>
                        <p id="life-span-info" slot="life-span">${catInfo[seed].life_span} yrs</p>
                        <p id="description-info" slot="description">${catInfo[seed].description}</p>
                        <p id="temperament-info" slot="temperament">${catInfo[seed].temperament}</p>
                </cat-info>
                `
                if(window.location.href === "http://localhost:3000/")
                {
                    catInfoContainer.insertAdjacentHTML('beforeend', output)
                }
                else if(window.location.href === "http://localhost:3000/favorites")
                {
                    catFavoritesInfoContainer.insertAdjacentHTML('beforeend', output)
                }
        
                let favoriteInfoButton = document.querySelectorAll(".cat-info")
    
                favoriteInfoButton.forEach(button => 
                {
                    let favorite = button.shadowRoot.childNodes[3].querySelector(".not-favorited-info")
                    favorite.addEventListener("click", (e) => 
                    {
                        e.stopImmediatePropagation()
                        // Becomes favorited onclick so check for not-favorited
                        if(getCookie("cat") && favorite.className.includes("not-favorited-info") === false)
                        {
                            console.log(`${catInfo[seed].id} has been added to favorites`)
                            fetch(favoritesURL, {
                                method: "PATCH",
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    catInfoID: [`${catInfo[seed].id}`]
                                })
                            })
                        }
                        else if(getCookie("cat") && favorite.className.includes("not-favorited-info") === true)
                        {
                            console.log(`${catInfo[seed].id} has been removed from favorites`)
                            fetch(favoritesURL, {
                                method: "DELETE",
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    catInfoID: [`${catInfo[seed].id}`]
                                })
                            })
                        }
                        else
                        {
                            console.log("please log in to favorite :)")
                        }
                    })
                })
            }

            const catFacts = await getFacts()
            for(let i = 0; i < 8; i++)
            {
                const catImages = await getImages2()
                output = 
                `
                <cat-fact id="${catFacts[i]._id}" class="cat-fact">
                    <img id="first-img" src=${catImages[0].url} slot="first"></img>
                    <img id="second-img" src=${catImages[1].url} slot="second"></img>
                    <span slot="fact">${catFacts[i].text}</span>
                </cat-fact>
                `
                catFactContainer.insertAdjacentHTML('beforeend', output)

                let favoriteFactButton = document.querySelectorAll(".cat-fact")
    
                favoriteFactButton.forEach(button => 
                {
                    let favorite = button.shadowRoot.childNodes[3].querySelector(".not-favorited-fact")
                    favorite.addEventListener("click", (e) => 
                    {
                        e.stopImmediatePropagation()
                        // Becomes favorited onclick so check for not-favorited
                        if(getCookie("cat") && favorite.className.includes("not-favorited-fact") === false)
                        {
                            console.log(`${catFacts[i]._id} has been added to favorites`)
                            fetch(favoritesURL, {
                                method: "PATCH",
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    catFactID: [`${catFacts[i]._id}`]
                                })
                            })
                        }
                        else if(getCookie("cat") && favorite.className.includes("not-favorited-fact") === true)
                        {
                            console.log(`${catFacts[i]._id} has been removed from favorites`)
                            fetch(favoritesURL, {
                                method: "DELETE",
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    catInfoID: [`${catFacts[i]._id}`]
                                })
                            })
                        }
                        else
                        {
                            console.log("please log in to favorite :)")
                        }
                    })
                })
            }
        } 
        catch (error) 
        {
            console.log("cat info error: "+error)
        }
        
    })()
}
else if(window.location.href === "http://localhost:3000/favorites")
{
    displayInfoFavorites()
    displayFactFavorites()
}