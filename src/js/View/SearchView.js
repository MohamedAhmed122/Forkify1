 import {
     elements
 } from './base'

 export const getInput = () => elements.searchField.value;

 export const clearInput = () => elements.searchField.value = '';

 export const clearResults = () => {
     elements.searchList.innerHTML = '';
     elements.Button.innerHTML = '';
 }

 export const highLighted = id => {
     const arrayResult = Array.from(document.querySelectorAll('.results__link'));
     arrayResult.forEach(el => {
         el.classList.remove('results__link--active');
     })
     document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
 };

 const renderRecipes = (recipe) => {
     const markup = `
                <li>
                    <a class="results__link " href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${recipe.title}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>`;

     elements.searchList.insertAdjacentHTML('beforeend', markup);
 }
 const createButton = (page, type) =>
     `
         <button class="btn-inline results__btn--${type}" data-goto=${(type ===  'prev' ?  page - 1 : page + 1)}>
            <span>Page ${(type ===  'prev' ?  page - 1 : page + 1)}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${(type === 'prev'? 'left':'right')}"></use>
            </svg>
        </button>`;

 const renderButton = (page, numResults, resPerPage) => {
     const pages = Math.ceil(numResults / resPerPage);

     let button;
     if (page === 1 && pages > 1) {
         // Only button to go to next page
         button = createButton(page, 'next');
     } else if (page < pages) {
         // Both buttons
         button = `
                    ${createButton(page, 'prev')}
                    ${createButton(page, 'next')}
                `;
     } else if (page === pages && pages > 1) {
         // Only button to go to prev page
         button = createButton(page, 'prev');
     }

     elements.Button.insertAdjacentHTML('afterbegin', button);
 };

 //Button

 export const renderResults = (recipes, page = 1, rePerPage = 10) => {

     const start = (page - 1) * rePerPage;
     const end = page * rePerPage;
     recipes.slice(start, end).forEach(renderRecipes)
     renderButton(page, recipes.length, rePerPage);
 }