import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './view/recipeview.js'; 
import searchView from './view/searchview.js'; 
import resultsView from './view/resultsview.js';
import paginationView from './view/pagination.js';
import bookmarkView from './view/bookmarkView.js';
import addRecipeView from './view/addRecipeView.js';
import chatbotView from './view/chatbot.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

 

const controlRecipe = async function() {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);  

    if (!id) return;

    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());

    bookmarkView.update(model.state.bookmarks);

    // Load the recipe from the model
    await model.loadRecipe(id);

    // Ensure that the recipe exists before rendering
    if (model.state.recipe) {
      recipeView.render(model.state.recipe);
      // console.log(model.state.recipe);
    }

  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchRecipe = async function () {
  try {

    resultsView.renderSpinner();
  
    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResults(query);
    // console.log(model.state.search.results)
    resultsView.render(model.getSearchResultsPage());

    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err); 
  }
};

const controlServings = function(newServings){
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
  
}

const controlPagination = function(gotoPage){
  resultsView.render(model.getSearchResultsPage(gotoPage));

  paginationView.render(model.state.search);
}

const controlAddBookmark = function(){
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  recipeView.update(model.state.recipe);
  bookmarkView.render(model.state.bookmarks);
}

const controlBookmarks = function(){
  bookmarkView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe){
  try{

    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();

    bookmarkView.render(model.state.bookmarks);

    window.history.pushState(null,'',`${model.state.recipe.id}`);

    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC*1000);
  }
  catch(err){
    addRecipeView.renderError(err.message);
  }
}

const controlChatbot = function () {
  chatbotView.toggleWindow();
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchRecipe);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();