
const banner = 
document.querySelector('.banner')

window.addEventListener("load",()=>{
    banner.classList.add("visible")
})

const cards =
document.querySelectorAll('.most-like-card')

console.log(cards)


const para1 = {
    rootMargin : "-40% 0px",
    treshold : 0
}

const observeCards = new IntersectionObserver(animCards,para1)

function animCards(entries)
{
entries.forEach(entry => {
    if (entry.isIntersecting) {
        entry.target.classList.add("visible")
    }
});
}

cards.forEach(card =>{
    observeCards.observe(card)
})