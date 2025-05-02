class searchView {
    _parentElemenet = document.querySelector('.search');

    getQuery() {
        const query =  this._parentElemenet.querySelector('.search__field').value;
        this._clearInput();
        return query;
    }
    
    _clearInput(){
        this._parentElemenet.querySelector('.search__field').value = '';
    }

    addHandlerSearch(handler) { 
        this._parentElemenet.addEventListener('submit', function (e) {
            e.preventDefault();
            handler();
        });
    }
}

export default new searchView();
