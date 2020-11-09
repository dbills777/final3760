addButton = document.querySelector('#add-recipe')
allRecipeLink = document.querySelector('#all-recipes')
addButton.addEventListener('click',(e)=>{
    // console.log('clicked')
    window.location.href = 'newrecipe.html';
})
allRecipeLink.addEventListener('click',(e)=>{
    // console.log('clicked')
    window.location.href = 'index.html';
})