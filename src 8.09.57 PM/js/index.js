import Search from "./models/Search";
import * as SearchView from "./View/SearchView";
import * as RecipeView from "./View/RecipeView";
import List from './models/List';
import * as ListView from './View/ListView';
import {
    elements,
    renderLoader,
    removeLoader
} from "./View/base";
import Recipe from "./models/recipe";

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
        SearchView.clearInput();
        renderLoader(elements.searchResult);
        SearchView.clearResults();

        //4) search for recipes
        await state.search.getResult();

        // 5) render result in UI
        removeLoader();

        SearchView.renderResults(state.search.result);
    }
};


elements.searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    controlSearch();
});

elements.Button.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-inline");
    const goToPage = parseInt(btn.dataset.goto, 10);
    //SearchView.clearBtn();
    SearchView.clearResults();

    SearchView.renderResults(state.search.result, goToPage);
});


const controlRecipe = async () => {
    // get the id from the URl
    const id = window.location.hash.replace("#", "");
    console.log(id);

    if (id) {
        //prepare UI for changes
        renderLoader(elements.recipe);
        if (state.search) SearchView.highLighted(id);

        //create new recipe object
        state.recipe = new Recipe(id);

        //get recipe from data
        await state.recipe.getRecipe();

        state.recipe.parseIndredients();

        //calculate time and serving
        state.recipe.calcTime();
        state.recipe.calcServings();

        //RenderRecipe
        removeLoader();
        RecipeView.clearOldResult();
        ListView.clearOldResult();
        ListView.clearOldResult();
        RecipeView.renderRecipe(state.recipe);
    }
};

// window.addEventListener('hashchange', controlRecipe)
// window.addEventListener('load', controlRecipe);
["hashchange", "load"].forEach((e) =>
    window.addEventListener(e, controlRecipe)
);


// handle recipe button click
elements.recipe.addEventListener('click', e => {

    //Decrese button was clicked
    if (e.target.matches('.btn-decrese , .btn-decrese *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            RecipeView.updateServingsIngredients(state.recipe);

        }

        //Decrese button was clicked
    } else if (e.target.matches('.btn-increse , .btn-increse *')) {
        state.recipe.updateServings('inc');
        RecipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn-add', '.recipe__btn-add *')) {
        controlList();
    }
})

//window.l = new List();

const controlList = () => {
    // create a new list if there is none yet
    if (!state.List) state.list = new List();

    // add each ingredients to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        ListView.renderItem(item);

    })
}

elements.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if (e.target.matches('.shopping__delete , .shopping__delete *')) {
        state.list.deleteItem(id);
        ListView.deleteItem(id);
    }
    if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        if (val > 2) {
            state.list.updateCount(id, val)
        }
    }

})