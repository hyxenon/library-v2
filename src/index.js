import "./styles/main.scss";
import { initializeApp } from "firebase/app";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
// ------ Firebase Database -------
const firebaseConfig = {
  apiKey: "AIzaSyCwLVEgr246eq71aNlQAWA8W1g0KlDOTjM",
  authDomain: "library-c5b7f.firebaseapp.com",
  projectId: "library-c5b7f",
  storageBucket: "library-c5b7f.appspot.com",
  messagingSenderId: "521826285988",
  appId: "1:521826285988:web:27739f32107d1c2a7a6931",
};

initializeApp(firebaseConfig);

const db = getFirestore();

const colRef = collection(db, "books");

const addBookContainer = document.querySelector(".add-container");
const modalContainer = document.querySelector(".modal-add");
const modalClose = document.getElementById("modal-close");
const yesBtn = document.querySelector(".yesBtn");
const noBtn = document.querySelector(".noBtn");
const addForm = document.querySelector(".addForm");
const cardContainer = document.querySelector(".card-container");

let isRead = false;

addBookContainer.addEventListener("click", () => {
  modalContainer.classList.add("visible");
});

modalClose.addEventListener("click", () => {
  modalContainer.classList.remove("visible");
});

// ------ Yes and No Button in add form -------
yesBtn.addEventListener("click", (e) => {
  e.target.style.backgroundColor = "#a3e635";
  noBtn.style.backgroundColor = "white";
  noBtn.style.color = "black";
  isRead = true;
});

noBtn.addEventListener("click", (e) => {
  e.target.style.backgroundColor = "#ef4444";
  yesBtn.style.backgroundColor = "white";
  isRead = false;
});

// ------ Add book Form -------
addForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addDoc(colRef, {
    title: addForm.title.value,
    author: addForm.author.value,
    pages: addForm.pages.value,
    isRead: isRead,
  })
    .then(() => {
      clearAddInput();
    })
    .catch((err) => {
      console.log(err.message());
    });
  displayCards();
  modalContainer.classList.remove("visible");
});

const createCard = (title, author, pages, isread, id) => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("id", id);
  const titleCard = document.createElement("p");
  titleCard.textContent = title;

  const authorCard = document.createElement("p");
  authorCard.textContent = author;

  const pagesCard = document.createElement("p");
  pagesCard.textContent = pages;

  const readContainer = document.createElement("div");
  readContainer.classList.add("read-container");

  const read = document.createElement("p");
  read.setAttribute("id", "read");
  read.textContent = "Read";

  const notRead = document.createElement("p");
  read.setAttribute("id", "notRead");
  notRead.textContent = "Not Read";

  const deleteBtn = document.createElement("i");
  deleteBtn.classList.add("fa-solid", "fa-trash");
  readContainer.append(read, notRead);
  card.append(titleCard, authorCard, pagesCard, readContainer, deleteBtn);
  cardContainer.appendChild(card);

  const readColor = () => {
    read.style.backgroundColor = "#a3e635";
    notRead.style.backgroundColor = "white";
    notRead.style.color = "black";
  };

  const notReadColor = () => {
    notRead.style.backgroundColor = "#ef4444";
    read.style.backgroundColor = "white";
  };
  read.addEventListener("click", (e) => {
    readColor();
    const cardId = e.target.parentElement.parentElement.id;
    const docRef = doc(db,"books", cardId)
    updateDoc(docRef, {isRead: true})
  });

  notRead.addEventListener("click", (e) => {
    notReadColor();
    const cardId = e.target.parentElement.parentElement.id;
    const docRef = doc(db,"books", cardId)
    updateDoc(docRef,{isRead: false})
  });

  if (isread) {
    readColor();
  } else {
    notReadColor();
  }

  deleteBtn.addEventListener("click", (e) => {
    let cardId = e.target.parentElement.id;
    const docRef = doc(db, "books", cardId);
    deleteDoc(docRef).then(() => {
      displayCards();
    });
  });
};

const displayCards = () => {
  cardContainer.innerHTML = "";
  getDocs(colRef).then((snapshot) => {
    let books = [];
    snapshot.docs.forEach((doc) => {
      books.push({ ...doc.data(), id: doc.id });
    });

    books.forEach((book) => {
      createCard(book.title, book.author, book.pages, book.isRead, book.id);
    });
  });
};

const clearAddInput = () => {
  addForm.title.value = "";
  addForm.author.value = "";
  addForm.pages.value = "";
  noBtn.style.backgroundColor = "#ef4444";
  yesBtn.style.backgroundColor = "white";
  isRead = false;
};
displayCards();
