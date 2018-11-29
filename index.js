let user1 = {id: 100, username: "mike"}

document.addEventListener("DOMContentLoaded", function() {
  fetchBooks()
});

function fetchBooks(){
  fetch('http://localhost:3000/books')
    .then(resp => resp.json())
    .then(json => {
      json.forEach(makeBook)
    })
}

function makeBook(book){
  let bookLi = document.createElement('li')
  bookLi.innerText = book.title
  getBookList().appendChild(bookLi)

  bookLi.addEventListener('click', function(){
    getBookDiv().innerHTML = ""
    let bookTitle = document.createElement('h3')
    bookTitle.innerText = book.title
    getBookDiv().appendChild(bookTitle)

    let bookImage = document.createElement('img')
    bookImage.src = book.img_url
    getBookDiv().appendChild(bookImage)

    let bookDesc = document.createElement('p')
    bookDesc.innerText = book.description
    getBookDiv().appendChild(bookDesc)

    let readList = document.createElement('ul')
    readList.classList.add('read-list')
      for(let i = 0; i < book.users.length; i++){
        let userLi = document.createElement('li')
        userLi.innerText = book.users[i].username
        readList.appendChild(userLi)
      }
    getBookDiv().appendChild(readList)

    let readBtn = document.createElement('button')
    if (!book.users.find(function(user){
      return user.id === user1.id
    })){
      readBtn.innerText = "Read Book"
    }
    else {
      readBtn.innerText = "Unread Book"
    }
    getBookDiv().appendChild(readBtn)
    readBtn.addEventListener('click', function(){
        readBook(book)
    })
  })
}

function readBook(book){
  if (!book.users.find(function(user){
    return user.id === user1.id
  })){
    book.users.push(user1)
    document.querySelector('button').innerText = "Unread Book"
  } else {
    let index = book.users.indexOf(user1)
    book.users.splice(index, 1)
    document.querySelector('button').innerText = "Read Book"
  }
  fetch(`http://localhost:3000/books/${book.id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({users: book.users})
  })
    .then(resp => resp.json())
    .then(json => {
      let list = document.querySelector('.read-list')
      list.innerHTML = ""
      for(let i = 0; i < json.users.length; i++){
        let userLi = document.createElement('li')
        userLi.innerText = json.users[i].username
        list.appendChild(userLi)
      }
  })
}



function getBookList(){
  return document.querySelector('#list')
}

function getBookDiv(){
  return document.querySelector('#show-panel')
}

function getReadList(){
  return document.querySelector('#read-list')
}
