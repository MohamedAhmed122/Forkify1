import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }
    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);

            //after Consling ............
            this.title = res.data.recipe.title;
            this.image = res.data.recipe.image_url;
            this.source = res.data.recipe.source_url;
            this.publisher = res.data.recipe.publisher;
            this.ingredients = res.data.recipe.ingredients;
            this.publisherUrl = res.data.recipe.publisher_url;

        } catch (error) {
            alert('something goes wrong with recipe fetching')
        }
    }
    calcTime() {
        //Assumingthat we need 15 mins for each 3 ingredients
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
            //uniform units
            let ingredient;
            ingredient = el.toLowerCase();
            //replace unitsLong with unitsShort
            unitsLong.forEach((unit, index) => {
                ingredient = ingredient.replace(unit, unitsShort[index]);
            })

            // remove pranthesise
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //parse ingredients into count,unit and  ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                // Ex. 4 cups, arrCount is [4]
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
                // There is NO unit, but 1st element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // There is NO unit and NO number in 1st position
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
}