const template = document.createElement("template")
template.innerHTML = `
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

        .cat-fact
        {
            // border: solid 2px red;
            border-radius: 5px;
            box-shadow: 0px 0px 5px rgba(0, 0, 0, .3);
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .carousel
        {
            font-family: sans-serif;
            scroll-snap-type: x mandatory;  
            display: flex;
            overflow-x: scroll;
            overflow-y: hidden;
            height: 200px;
        }

        .image-container
        {
            min-width: 100%;
            scroll-snap-align: start;
            text-align: center;
            position: relative;
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

        .favorited-fact
        {
            background-image: url("assets/favorite.svg");
            background-size: 100% 100%;
        }

        .not-favorited-fact
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

        .scroll-button-overlay
        {
            position: relative;
        }

        .hidden
        {
            display: none;
        }
        
        .fact
        {
            margin: 0;
            padding-left: 1rem;
            padding-right: 1rem;
            padding-top: .5rem;
            padding-bottom: .5rem;
            font-size: clamp(.5rem, 2.5vw, 1rem);
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .card-image
        {
            background-image: url("assets/transparent-cat.svg");
            background-repeat: space;
            background-size: contain;
            height: 2rem;
            bottom: 0;
        }
    </style>

    <div class="cat-fact">
        <div class="scroll-button-overlay">
            <button id="btn1" class="hidden"><</button>
            <button id="btn2">></button>
            <div class="carousel">
                <section class="image-container">
                    <div class="favorite-button-left not-favorited-fact"></div>
                    <slot name="first"></slot>
                </section>
                <section class="image-container">
                    <div class="favorite-button-right"></div>
                    <slot name="second"></slot>
                </section>
            </div>
        </div>
        <div class="fact">
            <slot name="fact"></slot>
            <div class="card-image"></div>
        </div>
    </div>   
`
class CatFactCard extends HTMLElement
{
    constructor()
    {
        super()
        const shadow = this.attachShadow({mode:"open"})
        shadow.append(template.content.cloneNode(true))

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
            favoriteButtonLeft.classList.toggle('favorited-fact')
            favoriteButtonLeft.classList.toggle('not-favorited-fact')
            favoriteButtonRight.classList.toggle('favorited-fact')
            favoriteButtonRight.classList.toggle('not-favorited-fact')
        })
        favoriteButtonRight.addEventListener('click', (e) => {
            favoriteButtonRight.classList.toggle('favorited-fact')
            favoriteButtonRight.classList.toggle('not-favorited-fact')
            favoriteButtonLeft.classList.toggle('favorited-fact')
            favoriteButtonLeft.classList.toggle('not-favorited-fact')
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

customElements.define("cat-fact", CatFactCard)