export const elements = {
    searchForm: document.querySelector('.search'),
    searchField: document.querySelector('.search__field'),
    searchList: document.querySelector('.results__list'),
    Button: document.querySelector('.results__pages'),
    searchResult: document.querySelector('.results')
};
export const elementStrings = {
    loader: 'loader'
};
export const renderLoader = parent => {
    const loader = `
    <div class="${elementStrings.loader}">
        <svg>
            <use href="img/icons.svg#icon-cw"></use>
        </svg>
    </div>
`;
    parent.insertAdjacentHTML('afterbegin', loader);
}
export const removeLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if (loader) {
        loader.parentElement.removeChild(loader);
    }
}