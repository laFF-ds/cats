const catInfoTemplate = document.createElement("template")
catInfoTemplate.innerHTML = `
    <style>
        *
        {
            box-sizing: border-box;
        }

        :host
        {
            text-align: left;
            line-height: 1.5rem;
        }

        .cat-info
        {
            display: flex;
            // border: solid 2px red;
            border-radius: 5px;
            box-shadow: 0px 0px 5px rgba(0, 0, 0, .3);
            height: 100%;
        }

        .cat-info > *:nth-child(1)
        {
            flex: 1 1 55%;
        }

        .cat-info > *:nth-child(2)
        {
            flex: 1 1 45%;
        }

        .carousel
        {
            font-family: sans-serif;
            scroll-snap-type: x mandatory;  
            display: flex;
            overflow-x: scroll;
            overflow-y: hidden;
            height: 100%;
        }

        .image-container
        {
            position: relative;
            min-width: 100%;
            scroll-snap-align: start;
            text-align: center;
        }

        .favorite-button-left
        {
            position: absolute;
            z-index: 3;
            height: 1rem;
            width: 1rem;
            left: 2.5%;
            top: 2.5%;
        }

        .favorite-button-right
        {
            position: absolute;
            z-index: 3;
            height: 1rem;
            width: 1rem;
            right: 2.5%;
            top: 2.5%;
        }

        .favorited-info
        {
            background-image: url("assets/favorite.svg");
            background-size: 100% 100%;
        }

        .not-favorited-info
        {
            background-image: url("assets/not-saved.svg");
            background-size: 100% 100%;
        }

        ::slotted(img)
        {
            height: 100%;
            width: 100%;
            object-fit: fill;
        }

        #btn1
        {
            position: absolute;
            left: 0;
            z-index: 2;
            min-height: 100%;
            background-color:rgba(0,0,0,0);
            color: rgba(0,0,0,0);
            border: none;
        }

        #btn1:hover
        {
            background-color:rgba(0,0,0,0.5);
            color: rgba(0,0,0,1);
        }

        #btn2
        {
            position: absolute;
            right: 0;
            z-index: 2;
            min-height: 100%;
            background-color:rgba(0,0,0,0);
            color: rgba(0,0,0,0);
            border: none;
        }

        #btn2:hover
        {
            background-color:rgba(0,0,0,0.5);
            color: rgba(0,0,0,1);
        }

        .scroll-button
        {
            height: 1rem;
        }

        .flip-image
        {
            transform: scaleX(-1);
        }

        .scroll-button-overlay
        {
            position: relative;
        }

        .hidden
        {
            display: none;
        }
        
        .info
        {
            margin: 0;
            padding-left: 1rem;
            padding-right: 1rem;
            padding-top: .5rem;
            padding-bottom: .5rem;
            font-size: clamp(.5rem, 1vw, 1rem);
            display: flex;
            flex-direction: column;
            
        }

        .card-image
        {
            background-image: url("assets/transparent-cat.svg");
            background-repeat: space;
            background-size: contain;
            height: 2rem;
            margin-top: auto;
        }
    
    </style>

    <div class="cat-info">
        <div class="scroll-button-overlay">
            <button id="btn1" class="hidden flip-image"><img class="scroll-button" src="assets/next.svg"></img></button>
            <button id="btn2"><img class="scroll-button" src="assets/next.svg"></img></button>
            <div class="carousel">
                <section class="image-container">
                    <div class="favorite-button-left not-favorited-info"></div>
                    <slot name="first"></slot>
                </section>
                <section class="image-container">
                    <div class="favorite-button-right not-favorited-info"></div>
                    <slot name="second"></slot>
                </section>
            </div>
        </div>
        <div class="info">
            <slot name="name"></slot>
            <slot name="origin"></slot>
            <slot name="weight"></slot>
            <slot name="life-span"></slot>
            <slot name="description"></slot>
            <slot name="temperament"></slot>
            <div class="card-image"></div>
        </div>
    </div>   
`
class CatInfoCard extends HTMLElement
{
    constructor()
    {
        super()
        const shadow = this.attachShadow({mode:"open"})
        shadow.append(catInfoTemplate.content.cloneNode(true))

        let favoriteButtonLeft = this.shadowRoot.querySelector('.favorite-button-left')
        let favoriteButtonRight = this.shadowRoot.querySelector('.favorite-button-right')
        

        let btn1 = this.shadowRoot.querySelector('#btn1')
        let btn2 = this.shadowRoot.querySelector('#btn2')
        let carousel = this.shadowRoot.querySelector('.carousel')
        let firstImage = shadow.host.querySelector('#first-img')
        let secondImage = shadow.host.querySelector('#second-img')
        let stopPropagation = false
        let scrollValue = 0

        // Reset first carousel to first image on load 
        // firstImage.scrollIntoView
        // ({
        //     behavior: 'smooth',
        //     inline:   'nearest',
        //     block:    'nearest',
        // })

        favoriteButtonLeft.addEventListener('click', (e) => {
            favoriteButtonLeft.classList.toggle('favorited-info')
            favoriteButtonLeft.classList.toggle('not-favorited-info')
            favoriteButtonRight.classList.toggle('favorited-info')
            favoriteButtonRight.classList.toggle('not-favorited-info')
        })
        favoriteButtonRight.addEventListener('click', (e) => {
            favoriteButtonRight.classList.toggle('favorited-info')
            favoriteButtonRight.classList.toggle('not-favorited-info')
            favoriteButtonLeft.classList.toggle('favorited-info')
            favoriteButtonLeft.classList.toggle('not-favorited-info')
        })
        carousel.addEventListener('scrollend', (e) => 
        {
            // prevents scrollend event firing with click event
            if (stopPropagation) {e.stopPropagation(); return false;}

            if (carousel.scrollLeft !== scrollValue)
            {
                btn1.classList.toggle('hidden')
                btn2.classList.toggle('hidden')
            }
            scrollValue = carousel.scrollLeft
        })

        btn1.addEventListener('click', (e) => 
        {
            setTimeout(() => 
            {
                stopPropagation = true 
                firstImage.scrollIntoView
                ({
                    behavior: 'smooth',
                    inline:   'center',
                    block:    'nearest',
                })
                btn1.classList.toggle('hidden')
                btn2.classList.toggle('hidden')
            })    
        })

        btn2.addEventListener('click', (e) => 
        {
            setTimeout(() => 
            {
                stopPropagation = true        
                secondImage.scrollIntoView
                ({
                    behavior: 'smooth',
                    inline:   'center',
                    block:    'nearest',
                })
                btn2.classList.toggle('hidden')
                btn1.classList.toggle('hidden')
            })
        })
    }
}

customElements.define("cat-info", CatInfoCard)