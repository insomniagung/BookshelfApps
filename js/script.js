document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('form');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBookshelf();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBookshelf() {
  const titleBook = document.getElementById('titleBook').value; 
  const authorBook = document.getElementById('authorBook').value;
  const yearBook = document.getElementById('yearBook').value;
  const generatedIDBuku = generateId();
  const bookshelfObject = generateBookshelfObject(generatedIDBuku, titleBook, authorBook, yearBook, false);
  
  bookshelfs.push(bookshelfObject);
  alert("Berhasil submit buku ke 'Belum selesai dibaca'. ");

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  formReset();
}

function formReset(){
  document.getElementById("form").reset();
}

function generateId() {
  return +new Date();
}

function generateBookshelfObject(id, titleBook, authorBook, yearBook, isCompleted) {
  return {
    id,
    titleBook,
    authorBook,
    yearBook,
    isCompleted
  }
}

const bookshelfs = [];
const RENDER_EVENT = 'render-bookshelf'; 

document.addEventListener(RENDER_EVENT, function () {
  console.log(bookshelfs);
  const uncompletedBOOKSHELFList = document.getElementById('bookshelfs');
  uncompletedBOOKSHELFList.innerHTML = '';

  const completedBOOKSHELFList = document.getElementById('completed-bookshelfs');
  completedBOOKSHELFList.innerHTML = '';
   
  for (const bookshelfItem of bookshelfs) {
    const bookshelfElement = makeBookshelf(bookshelfItem);
    if (!bookshelfItem.isCompleted)
      uncompletedBOOKSHELFList.append(bookshelfElement);
    else
      completedBOOKSHELFList.append(bookshelfElement);
  }
});

function makeBookshelf(bookshelfObject) {
  const textTitle = document.createElement('h2');
  textTitle.innerText = bookshelfObject.titleBook;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = bookshelfObject.authorBook;

  const textYear = document.createElement('p');
  textYear.innerText = bookshelfObject.yearBook;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textAuthor, textYear);
   
  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', `bookshelf-${bookshelfObject.id}`);

  if (bookshelfObject.isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(bookshelfObject.id);
    });
      
    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(bookshelfObject.id);
    });
    
    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    checkButton.addEventListener('click', function () {
    addTaskToCompleted(bookshelfObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
    removeTaskFromCompleted(bookshelfObject.id);
    });   
    container.append(checkButton,trashButton);    
  } 
  return container;
}

function addTaskToCompleted (bookshelfId) {
  const bookshelfTarget = findBookshelf(bookshelfId);
  if (bookshelfTarget == null) return;

  bookshelfTarget.isCompleted = true;
  alert("Berhasil memindahkan ke 'Selesai dibaca'. ");
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookshelf(bookshelfId) {
  for (const bookshelfItem of bookshelfs) {
    if (bookshelfItem.id === bookshelfId) {
      return bookshelfItem;
    }
  }  
return null;
}

function undoTaskFromCompleted(bookshelfId) {
  const bookshelfTarget = findBookshelf(bookshelfId);
  if (bookshelfTarget == null) return;
   
  bookshelfTarget.isCompleted = false;
  alert("Berhasil mengembalikan ke 'Belum selesai dibaca'. ");
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(bookshelfId) {
  if(confirm("Yakin hapus buku?") == true){
    const bookshelfTarget = findBookshelfIndex(bookshelfId);
    if (bookshelfTarget === -1) return;

    bookshelfs.splice(bookshelfTarget, 1);
    alert("Berhasil dihapus.");
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }    
}

function findBookshelfIndex(bookshelfId) {
  for (const index in bookshelfs) {
    if (bookshelfs[index].id === bookshelfId) {
      return index;
    }
  }
return -1;
}

function saveData() {
  if (isStorageExist()) { 
    const parsed = JSON.stringify(bookshelfs);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = 'saved-bookshelf';
const STORAGE_KEY = 'BOOKSHELF_APPS';
 
function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser anda tidak mendukung local storage.');
    return false;
  }
return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const bookshelf of data) {
      bookshelfs.push(bookshelf);
    }
  }
 
document.dispatchEvent(new Event(RENDER_EVENT));
}