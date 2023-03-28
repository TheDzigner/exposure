

const cardsmostLikedCard =
document.querySelector('.most-liked-post')




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

    observeCards.observe(cardsmostLikedCard)