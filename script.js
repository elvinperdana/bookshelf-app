// Created By = Elvin Perdana

const library = [];
const rendering = 'loading';
const dataSaved = 'data-saved';
const dataMemory = 'daftarBuku';

document.addEventListener('DOMContentLoaded', function() {
    const submitBook = document.getElementById('inputBook');
    const searchBook = document.getElementById('searchBook');
    submitBook.addEventListener('submit', function(event) {
        addBook();
    });
    searchBook.addEventListener('submit', function(event) {
        event.preventDefault();
        bookSearch();
    }) 

    if(isStorageExist()){
        loadDataMemory();
    }
});

document.addEventListener(rendering, function() {
    console.log(library);
    const incompleteRead = document.getElementById('incompleteBookshelfList');
    const completeRead = document.getElementById('completeBookshelfList');
    completeRead.innerHTML = '';
    incompleteRead.innerHTML = '';
    for(const bookItem of library){
    const elementBook = addBookToLibrary(bookItem);
        if(bookItem.isComplete == false){
        incompleteRead.append(elementBook);
        } else{
        completeRead.append(elementBook);
        }
    }
});

document.addEventListener('dataSaved', function(){
    console.log(localStorage.getItem(dataMemory));
});

function bookSearch() {
    const filterBook = document.getElementById('searchBookTitle').value;
    const filter = filterBook.toUpperCase();
    const divBookIncomplete = document.getElementById("incompleteBookshelfList");
    const divBookComplete = document.getElementById("completeBookshelfList");
    const articleBookIncomplete = divBookIncomplete.querySelectorAll(".book_item");
    const articleBookComplete = divBookComplete.querySelectorAll(".book_item");
    for (let i = 0; i < articleBookIncomplete.length; i++) {
        const headerBookIncomplete = articleBookIncomplete[i].getElementsByTagName("h3")[0];
        const authorBookIncomplete = articleBookIncomplete[i].querySelectorAll(".penulisBook")[0];
        const yearBookIncomplete = articleBookIncomplete[i].querySelectorAll(".tahunBook")[0];
        let txtHeaderValueIncomplete = headerBookIncomplete.textContent || headerBookIncomplete.innerText;
        let txtParagrafFirstValueIncomplete = authorBookIncomplete.textContent || authorBookIncomplete.innerText;
        let txtParagrafSecondValueIncomplete = yearBookIncomplete.textContent || yearBookIncomplete.innerText;
        if (txtHeaderValueIncomplete.toUpperCase().indexOf(filter) > -1 || txtParagrafFirstValueIncomplete.toUpperCase().indexOf(filter) > -1 || txtParagrafSecondValueIncomplete.toUpperCase().indexOf(filter) > -1) {
            articleBookIncomplete[i].style.display = "";
        } else {
            articleBookIncomplete[i].style.display = "none";
        }
    }
    for (let i = 0; i < articleBookComplete.length; i++) {
        const headerBookComplete = articleBookComplete[i].getElementsByTagName("h3")[0];
        const authorBookComplete = articleBookComplete[i].querySelectorAll(".penulisBook")[0];
        const yearBookComplete = articleBookComplete[i].querySelectorAll(".tahunBook")[0];
        let txtHeaderValueComplete = headerBookComplete.textContent || headerBookComplete.innerText;
        let txtParagrafFirstValueComplete = authorBookComplete.textContent || authorBookComplete.innerText;
        let txtParagrafSecondValueComplete = yearBookComplete.textContent || yearBookComplete.innerText;
        if (txtHeaderValueComplete.toUpperCase().indexOf(filter) > -1 || txtParagrafFirstValueComplete.toUpperCase().indexOf(filter) > -1 || txtParagrafSecondValueComplete.toUpperCase().indexOf(filter) > -1) {
            articleBookComplete[i].style.display = "";
        } else {
            articleBookComplete[i].style.display = "none";
        }
    }
}

function generateID() {
    return +new Date();
}

function generateListBook(id,titleBook,authorBook,yearBook,isComplete) {
    return {
        id,
        titleBook,
        authorBook,
        yearBook,
        isComplete
    }
}

function addBook() {
    const titleBook = document.getElementById('inputBookTitle').value;
    const authorBook = document.getElementById('inputBookAuthor').value;
    const yearBook = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;
    const id = generateID();
    const listBook = generateListBook(id,titleBook,authorBook,yearBook,isComplete);
    library.push(listBook);
    document.dispatchEvent(new Event(rendering));
    databaseStorage();
    alert("Buku Anda Telah Ditambahkan Ke Rak");
}

function addBookToLibrary(listBook) {
    const titleBookText = document.createElement('h3');
    titleBookText.innerText = listBook.titleBook;

    const authorBookText = document.createElement('p');
    authorBookText.innerText = "Penulis: ";
    const authorBookTextSpan = document.createElement('span');
    authorBookTextSpan.classList.add('penulisBook');
    authorBookTextSpan.innerText = `${listBook.authorBook}`;
    authorBookText.append(authorBookTextSpan);
    

    const yearBookText = document.createElement('p');
    yearBookText.innerText = "Tahun: ";
    const yearBookTextSpan = document.createElement('span');
    yearBookTextSpan.classList.add('tahunBook');
    yearBookTextSpan.innerText = `${listBook.yearBook}`;
    yearBookText.append(yearBookTextSpan);

    const containerButton = document.createElement('div');
    containerButton.classList.add('action');
    
    const textBookContainer = document.createElement('article');
    textBookContainer.classList.add('book_item');
    textBookContainer.append(titleBookText,authorBookText,yearBookText,containerButton);

    if(listBook.isComplete){
        const undoButton = document.createElement('button');
        undoButton.classList.add('green');
        undoButton.innerText = 'Belum Selesai dibaca';

        undoButton.addEventListener('click', function(){
            undoFromCompleteReading(listBook.id);
        });

        const editButton = document.createElement('button');
        editButton.classList.add('blue');
        editButton.innerText = 'Edit Buku';

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus buku';
     
        trashButton.addEventListener('click', function () {
            removeBookFromList(listBook.id);
        });

        containerButton.append(undoButton,trashButton);
    } else{
        const finishButton = document.createElement('button');
        finishButton.classList.add('green');
        finishButton.innerText = 'Selesai dibaca';

        finishButton.addEventListener('click', function(){
            finishCompleteReading(listBook.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus buku';
     
        trashButton.addEventListener('click', function () {
            removeBookFromList(listBook.id);
        });

        containerButton.append(finishButton,trashButton);
    }

    return textBookContainer;
}

function findBook(bookID) {
    for(const bookItem of library){
        if(bookItem.id === bookID){
            return bookItem;
        }
    }
    return null;
}

function finishCompleteReading(bookID) {
    const targetBook = findBook(bookID);

    if(targetBook == null) return;

    targetBook.isComplete = true;
    document.dispatchEvent(new Event(rendering));
    databaseStorage()
    alert(`Buku Anda Telah Dipindahkan Ke Rak ~Selesai Dibaca~`);
}

function undoFromCompleteReading(bookID) {
    const targetBook = findBook(bookID);

    if(targetBook == null) return;

    targetBook.isComplete = false;
    document.dispatchEvent(new Event(rendering));
    databaseStorage()
    alert(`Buku Anda Telah Dipindahkan Ke Rak ~Belum Selesai Dibaca~`);
}

function removeBookFromList(bookID) {
    const targetBook = findIndexBook(bookID);
    if (targetBook === -1) return;
    if (confirm("Apakah Anda Yakin Ingin Menghapus Buku ?")) {
        library.splice(targetBook, 1);
        document.dispatchEvent(new Event(rendering));
        databaseStorage()
      } else {
        return false;
      }
}

function confirmation(){
    var result = confirm("Are you sure to delete?");
    if(result){
      console.log("Deleted")
    }
  }

function findIndexBook(bookID) {
    for (const indexBook in library) {
        if (library[indexBook].id === bookID) {
          return indexBook;
        }
      }
    return -1;
}

function databaseStorage() {
    if(isStorageExist()) {
        const parseData = JSON.stringify(library);
        localStorage.setItem(dataMemory, parseData);
        document.dispatchEvent(new Event(dataSaved))
    }
}

function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
}

function loadDataMemory(){
    const renderData = localStorage.getItem(dataMemory);
    let parseDataObject = JSON.parse(renderData);

    if(parseDataObject !== null){
        for(const dataLibrary of parseDataObject){
            library.push(dataLibrary);
        }
    }

    document.dispatchEvent(new Event(rendering));
}

// Created By = Elvin Perdana
