 import {
     elements
 } from './base'

 export const getInput = () => elements.searchField.value;

 export const clearInput = () => elements.searchField.value = '';

 export const clearResults = () => {
     elements.searchList.innerHTML = '';
 }

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

 export const renderResults = recipes => {
     recipes.forEach(renderRecipes)
 }