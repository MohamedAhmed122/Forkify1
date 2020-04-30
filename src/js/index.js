import Search from './models/Search'
import * as SearchView from './View/SearchView'
import {
    elements,
    renderLoader,
    removeLoader
} from './View/base'
import Recipe from './models/recipe'

/*
 * Global state for the app
 * 1- search object
 * 2-current recipes
 * 3-shopping list
 * 4-liked recipes
 */
const state = {};

const controlSearch = async () => {

    //1) get query from the view
    const query = SearchView.getInput();

    if (query) {

        //2) new search object and add it to the state
        state.search = new Search(query);

        //prepare the UI
        SearchView.clearInput()
        SearchView.clearResults();
        renderLoader(elements.searchResult);


        //4) search for recipes
        await state.search.getResult();

        // 5) render result in UI
        removeLoader();

        SearchView.renderResults(state.search.result);

    }

}
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})
elements.Button.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    const goToPage = parseInt(btn.dataset.goto, 10);
    SearchView.clearBtn();
    SearchView.renderResults(state.search.result, goToPage)
})


const controlRecipe = async () => {
    // get the id from the URl
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        //prepare UI for changes

        //create new recipe object
        state.recipe = new Recipe(id);

        //get recipe from data
        await state.recipe.getRecipe();
        state.recipe.parseIndredients();

        //calculate time and serving
        state.recipe.calcTime();
        state.recipe.calcServings();

        //RenderRecipe
        console.log(state.recipe);
    }
}

// window.addEventListener('hashchange', controlRecipe)
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe))