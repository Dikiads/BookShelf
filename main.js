const datBook = [];
const RENDER_BOOK = 'render-book';

function addBook(){
    const title = document.getElementById('title').value.toUpperCase();
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    const idBook = generateId();
    const objectBook = bookObject(idBook, title, author, year, false);
    datBook.push(objectBook);
    document.dispatchEvent(new Event(RENDER_BOOK));
    saveData();
};

function generateId() {
    return +new Date();
};

function bookObject(id, title, author, year, iscomplete) {
    return {id, title, author, year, iscomplete};
};

function makeBookShelf(objectBook) {
    const textTitle = document.createElement('h3')
    textTitle.innerText = objectBook.title;
    const textAuthor = document.createElement('p');
    textAuthor.innerText = objectBook.author;
    const textYear = document.createElement('p');
    textYear.innerText = objectBook.year;
    const datContainer = document.createElement('div');
    datContainer.classList.add('datas');
    datContainer.append(textTitle, textAuthor, textYear);
    const imageBook = document.createElement('img');
    imageBook.setAttribute('src', './style/asset/Martz90-Circle-Books.ico');
    imageBook.setAttribute('width', '100%');
    // imageBook.setAttribute('height', '50%');
    const divImage = document.createElement('div');
    divImage.classList.add('image-book');
    divImage.append(imageBook);
        
    const textContainer = document.createElement('div');
    textContainer.classList.add('items');
    textContainer.append(divImage, datContainer)
    const container = document.createElement('div');
    container.classList.add('group-items')
    container.setAttribute('id', `bookId-${objectBook.id}`)
    container.append(textContainer);
    if(objectBook.iscomplete) {
        const undoButton = document.createElement('img');
        undoButton.classList.add('undo-btn');
        undoButton.setAttribute('src', './style/asset/Franksouza183-Fs-Actions-undo.ico');
        undoButton.setAttribute('width', '8.5%');
        undoButton.addEventListener('click', function(){
            undoToComplete(objectBook.id)
        })
        const removeButton = document.createElement('img');
        removeButton.classList.add('remove-btn');
        removeButton.setAttribute('src', './style/asset/Saki-NuoveXT-2-Actions-close.ico');
        removeButton.setAttribute('width', '8%');
        removeButton.addEventListener('click', ()=> {
            removeBook(objectBook.id);
        })
        container.append(undoButton,removeButton)
    } else { 
        const checkButton = document.createElement('img');
        checkButton.classList.add('check-btn');
        checkButton.setAttribute('src', './style/asset/Matiasam-Ios7-Style-Clear-Tick.ico');
        checkButton.setAttribute('width', '7%');
        checkButton.addEventListener('click', ()=> {
            addToComplete(objectBook.id);
            
        })

        const removeButton = document.createElement('img');
        removeButton.classList.add('remove-btn');
        removeButton.setAttribute('src', './style/asset/Saki-NuoveXT-2-Actions-close.ico');
        removeButton.setAttribute('width', '8%');
        removeButton.addEventListener('click', ()=> {
            removeBook(objectBook.id);
        })
        container.append(checkButton, removeButton);
    }
    return container;
};

function addToComplete(bookId) {
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;
   
    bookTarget.iscomplete = true;
    console.log(bookTarget.iscomplete);
    document.dispatchEvent(new Event(RENDER_BOOK));
    saveData();
};

function findBook(bookId) {
    for (const bookItem of datBook) {
        if(bookItem.id === bookId){
            return bookItem;
        }
    }
    return null;
};

function removeBook(bookId){
    const bookTarget = findIndexBook(bookId);
    if(bookTarget === -1) return;
    datBook.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_BOOK));
    saveData();
};

function findIndexBook(bookId) {
    for (const index in datBook) {
        if(datBook[index].id === bookId) {
            return index;
        }
    }
    return -1;
};

function undoToComplete(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;
   
    bookTarget.iscomplete = false;
    console.log(bookTarget.iscomplete);
    document.dispatchEvent(new Event(RENDER_BOOK));
    saveData();
}

document.addEventListener(RENDER_BOOK,() => {
    const uncompleteBookShelf = document.getElementById('shelf2-items');
    uncompleteBookShelf.innerHTML = '';

    const completeBookShelf = document.getElementById('shelf1-items');
    completeBookShelf.innerHTML = '';
    for ( const bookItem of datBook) {
        const bookElement = makeBookShelf(bookItem);
        if(bookItem.iscomplete) {
            completeBookShelf.append(bookElement);
        } else {
            uncompleteBookShelf.append(bookElement);
        }
    } 

});

document.addEventListener('DOMContentLoaded', () => {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addBook();
    })
    if (isStorageExist()) {
        loadDataFromStorage();
      }
});

const search = document.getElementById('search');
const filter = search.value.toLowerCase();
const datas = document.querySelectorAll('.datas')
const searchBtn = document.getElementById('search-book');
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];
searchBtn.addEventListener('click', ()=> {
    for (const arrayItem of datBook) {
        if(search.value.toUpperCase() == arrayItem.title) {
            modal.style.display = 'block';
        }
    }
});
span.onclick = function() {
    modal.style.display = "none";
  };
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
};
function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(datBook);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  };

  const SAVED_EVENT = 'saved-todo';
  const STORAGE_KEY = 'TODO_APPS';
   
  function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  };
  document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });
  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const book of data) {
        datBook.push(book);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_BOOK));
  }