//
let addNewTaskButton = document.querySelector(".head__button");
let closeTaskButton = document.querySelector(".popup__close");
let form = document.getElementById("form");
let popup = document.querySelector(".popup");
let message = document.querySelector(".head__message");
let sort = document.querySelector(".sort");
let select = document.querySelector(".sort__select");
const PRIORITY = { Critical: 3, Normal: 2, Minor: 1 };

//
localStorage.clear();
setStorage(select.value);
render();

//

addNewTaskButton.addEventListener("click", function (e) {
  popup.classList.add("open");
  popup.addEventListener("click", function (e) {
    if (!e.target.closest(".popup__content")) {
      popup.classList.remove("open");
      form.reset();
    }
  });
  e.preventDefault();
});

closeTaskButton.addEventListener("click", function (e) {
  popup.classList.remove("open");
  form.reset();
  e.preventDefault();
});

form.addEventListener("submit", function (e) {
  let formdata = new FormData(form);
  let newObj = {};
  newObj.id = Date.now();
  for (let [name, value] of formdata) {
    newObj[name] = value;
    if (name === "prioritySelector") {
      newObj.priority = PRIORITY[value];
    }
  }
  creatNewData(newObj);

  render();

  popup.classList.remove("open");
  form.reset();
  e.preventDefault();
});

select.addEventListener("change", function (e) {
  localStorage.setItem("sort", select.value);
  render();
});

//

//
function creatNewData(obj) {
  let currentData = JSON.parse(localStorage.getItem("data"));
  currentData.push(obj);
  localStorage.setItem("data", JSON.stringify(currentData));
}
//
//
//
function deleteTask(id) {
  let answer = confirm("Are you sure?");
  if (answer) {
    let newData = JSON.parse(localStorage.getItem("data")).filter((elem) => {
      return elem.id !== id;
    });
    localStorage.setItem("data", JSON.stringify(newData));
    render();
  }
}
//
//

function render() {
  let container = document.querySelector(".main__tasks");
  let data = JSON.parse(localStorage.getItem("data"));
  let sortSelector = localStorage.getItem("sort");
  let content = "";
  let sortedData = sortData(data, sortSelector);
  sortedData.forEach((task) => {
    content += createHTMLTask(task);
  });
  container.innerHTML = content;
  editMessage(sortedData.length);
  showSortContainer(sortedData.length);
}
//

// ===========
function createHTMLTask(object) {
  return `<div class="task" id = "${object.id}"><h3 class="task__name">${object.name}</h3><p class="task__description">${object.description}</p><div class="task__priority">
  <div class="task-priority-left">
    <img
      class="task__priority-icon"
      src="./img/${object.prioritySelector}.svg"
      alt=""
    />
    <span class="task__priority-text">${object.prioritySelector}</span>
  </div>
  <a class="task__delete" href="#" onclick="deleteTask(${object.id})">
    <img src="./img/delete.svg" alt="" />
  </a>
</div>
</div>`;
}
//
//
//
function editMessage(length) {
  if (length == 0) {
    message.innerHTML = "No tasks today! Don't worry";
  } else if (length == 1) {
    message.innerHTML = `You've got <span style="color:#F3477A">${length} task</span> today!`;
  } else {
    message.innerHTML = `You've got <span style="color:#F3477A">${length} tasks</span> today!`;
  }
}
//
//
//
function showSortContainer(length) {
  if (length <= 1) {
    sort.classList.add("none");
  } else {
    sort.classList.remove("none");
  }
}
//
//
// =======Set Storage==================================
function setStorage(value) {
  if (localStorage.getItem("data") == null) {
    localStorage.setItem("data", JSON.stringify([]));
  }
  if (localStorage.getItem("sort") == null) {
    localStorage.setItem("sort", value);
  }
}
// ===========Sort data================

function sortData(data, selector) {
  return data.sort(function (obj1, obj2) {
    if (selector == "name") {
      if (obj1[selector].toUpperCase() < obj2[selector].toUpperCase()) {
        return -1;
      }
      if (obj1[selector].toUpperCase() > obj2[selector].toUpperCase()) {
        return 1;
      }
      return 0;
    } else {
      return obj2[selector] - obj1[selector];
    }
  });
}
