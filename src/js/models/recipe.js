import axios from 'axios';

export const clearResults = () => {
    elements.Recipe.innerHTML = '';
}
export default class Recipe {
    constructor(id) {
        this.id = id;
    }
    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);

            this.url = res.data.recipe.url;
            this.title = res.data.recipe.title;
            this.image = res.data.recipe.image_url;
            this.source = res.data.recipe.source_url;
            this.publisher = res.data.recipe.publisher;
            this.ingredients = res.data.recipe.ingredients;

        } catch (error) {
            alert('something goes wrong with recipe fetching')
        }
    }
    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }
    calcServings() {
        this.servings = 4;
    }
    parseIndredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'cups', 'ounces', 'ounce', 'pounds', 'teaspoons', 'teaspoon'];
        const unitsShort = ['tbsp', 'tbsp', 'cup', 'oz', 'oz', 'pound', 'tsp', 'tsp'];
        const units = [...unitsShort, 'kg', 'g'];


        const newIngredients = this.ingredients.map(el => {
            let ingredient;
            ingredient = el.toLowerCase();

            unitsLong.forEach((unit, index) => {
                ingredient = ingredient.replace(unit, unitsShort[index]);
            })

            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {

                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0], 10)) {

                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;
        })
        this.ingredients = newIngredients;
    }


    updateServings(type) {
        const newServing = type === 'dec' ? this.servings - 1 : this.servings + 1;
        this.ingredients.forEach(ing => {
            ing.count *= (newServing / this.servings);
        })

        this.servings = newServing;
    }
}