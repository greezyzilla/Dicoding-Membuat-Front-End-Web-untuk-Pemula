let books = [];

const mountBook = (book) => {
    const newBookDOM = document.getElementById('template-book').cloneNode(true);
    newBookDOM.removeAttribute('id');
    newBookDOM.style.display = 'flex';
    newBookDOM.querySelector('#title').innerHTML = book.title;
    newBookDOM.querySelector('#author').innerHTML = book.author;
    newBookDOM.querySelector('#year').innerHTML = book.year;
    newBookDOM.querySelector('#action-edit').addEventListener('click', handleEdit);
    newBookDOM.querySelector('#action-delete').addEventListener('click', handleDelete);
    newBookDOM.setAttribute('id', book.id);

    const moveButton = newBookDOM.querySelector('#action-completed');
    if (book.isComplete) {
        moveButton.setAttribute('id', 'action-uncompleted');
        moveButton.addEventListener('click', handleUncompleted);
        document.getElementById('completed-list').appendChild(newBookDOM);
    } else {
        moveButton.addEventListener('click', handleCompleted);
        document.getElementById('uncompleted-list').appendChild(newBookDOM);
    }
};

const mountBooks = (books, filter = '') => {
    let completedCount = 0;
    let uncompletedCount = 0;
    books.forEach((book) => {
        if (book.title.toLowerCase().includes(filter)) {
            book.isComplete === true ? completedCount++ : uncompletedCount++;
            mountBook(book);
        }
    });
    if (uncompletedCount === 0) document.getElementById('uncompleted-list').innerHTML = 'Empty';
    if (completedCount === 0) document.getElementById('completed-list').innerHTML = 'Empty';
};

const unmountBooks = (books) => {
    books.map((book) => {
        const bookDOM = document.getElementById(book.id);
        if (bookDOM) {
            const bookParent = bookDOM.parentNode;
            bookParent.removeChild(bookDOM);
        }
    });
    document.getElementById('uncompleted-list').innerHTML = '';
    document.getElementById('completed-list').innerHTML = '';
};

document.getElementById('form-search').addEventListener('submit', (event) => {
    event.preventDefault();
});

document.getElementById('form-search-input').addEventListener('input', (event) => {
    unmountBooks(books);
    mountBooks(books, event.target.value);
});

const handleCompleted = (event) => {
    const completedBookId = event.target.parentNode.parentNode.getAttribute('id');
    const completedBookIndex = books.findIndex((book) => book.id == completedBookId);

    unmountBooks(books);
    books[completedBookIndex].isComplete = true;
    localStorage.setItem('books', JSON.stringify(books));
    mountBooks(books);
};

const handleUncompleted = (event) => {
    const uncompletedbookId = event.target.parentNode.parentNode.getAttribute('id');
    const uncompletedBookIndex = books.findIndex((book) => book.id == uncompletedbookId);

    unmountBooks(books);
    books[uncompletedBookIndex].isComplete = false;
    localStorage.setItem('books', JSON.stringify(books));
    mountBooks(books);
};

const handleDelete = (event) => {
    const deleteId = event.target.parentNode.parentNode.getAttribute('id');
    const deletedBookIndex = books.findIndex((el) => el.id == deleteId);

    unmountBooks(books);
    books.splice(deletedBookIndex, 1);
    localStorage.setItem('books', JSON.stringify(books));
    mountBooks(books);
};

const handleEdit = (event) => {
    const editBookId = event.target.parentNode.parentNode.getAttribute('id');
    const editBook = books.find((book) => book.id == editBookId);
    const modal = document.getElementById('modal-edit');
    const backDrop = document.getElementById('backdrop');
    backDrop.style.display = 'block';
    modal.style.display = 'grid';
    modal.querySelector('#title').value = editBook.title;
    modal.querySelector('#author').value = editBook.author;
    modal.querySelector('#year').value = editBook.year;
    modal.querySelector('#isComplete').checked = editBook.isComplete;
    modal.querySelector('.form-edit-id').setAttribute('id', editBook.id);
};

document.getElementById('form-edit').addEventListener('submit', (event) => {
    const editBookId = event.target.querySelector('.form-edit-id').getAttribute('id');
    const editBookIndex = books.findIndex((book) => book.id == editBookId);

    unmountBooks(books);
    const newBookForm = event.target;
    books[editBookIndex].title = newBookForm.querySelector('#title').value;
    books[editBookIndex].author = newBookForm.querySelector('#author').value;
    books[editBookIndex].year = newBookForm.querySelector('#year').value;
    books[editBookIndex].isComplete = newBookForm.querySelector('#isComplete').checked;
    localStorage.setItem('books', JSON.stringify(books));
    mountBooks(books);

    const modal = document.getElementById('modal-edit');
    const backDrop = document.getElementById('backdrop');
    modal.style.display = 'none';
    backDrop.style.display = 'none';
    event.preventDefault();
});

document.getElementById('button-cta').addEventListener('click', () => {
    const modal = document.getElementById('modal-add');
    const backDrop = document.getElementById('backdrop');
    modal.style.display = 'grid';
    modal.querySelector('#title').value = null;
    modal.querySelector('#author').value = null;
    modal.querySelector('#year').value = null;
    modal.querySelector('#isComplete').checked = false;
    backDrop.style.display = 'block';
});

document.getElementById('form-add').addEventListener('submit', (event) => {
    const newBookForm = event.target;
    const newId = new Date();
    const newTitle = newBookForm.querySelector('#title').value;
    const newAuthor = newBookForm.querySelector('#author').value;
    const newYear = newBookForm.querySelector('#year').value;
    const newCompleted = newBookForm.querySelector('#isComplete').checked;
    const newBook = {
        id: newId.getTime(),
        title: newTitle,
        author: newAuthor,
        year: newYear,
        isComplete: newCompleted,
    };

    unmountBooks(books);
    books.push(newBook);
    localStorage.setItem('books', JSON.stringify(books));
    mountBooks(books);

    const modal = document.getElementById('modal-add');
    const backDrop = document.getElementById('backdrop');
    modal.style.display = 'none';
    backDrop.style.display = 'none';
    event.preventDefault();
});

document.getElementById('backdrop').addEventListener('click', (event) => {
    const backdrop = event.target;
    const modalEdit = document.getElementById('modal-edit');
    const modalAdd = document.getElementById('modal-add');
    backdrop.style.display = 'none';
    modalEdit.style.display = 'none';
    modalAdd.style.display = 'none';
});

window.addEventListener('load', () => {
    const localBooks = JSON.parse(localStorage.getItem('books'));
    books = localBooks || [];
    unmountBooks(books);
    mountBooks(books);
    console.log('rendering');
});
