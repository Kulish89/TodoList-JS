//
let addNewTaskButton = document.querySelector(".head__button");
let closeTaskButton = document.querySelector(".popup__close");
let form = document.querySelector("form");
let popup = document.querySelector(".popup");
let message = document.querySelector(".head__message");
let sort = document.querySelector(".sort");
let select = document.querySelector(".sort__select");
let reqTextarea = document.querySelector(".form__textarea");
let reqInput = document.querySelector(".form__input");

//
const PRIORITY = { Critical: "1", Normal: "2", Minor: "3" };
//

//
//

setStorage(select.value);
render();

//
//
//
//
// AddEventListeners!======================================================
addNewTaskButton.addEventListener("click", function (e) {
  popup.classList.add("open");
  popup.addEventListener("click", function (e) {
    if (!e.target.closest(".popup__content")) {
      popup.classList.remove("open");
      resetForm();
    }
  });
  e.preventDefault();
});

closeTaskButton.addEventListener("click", function (e) {
  popup.classList.remove("open");
  resetForm();
  e.preventDefault();
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  try {
    let requairedElements = document.querySelectorAll("._req");
    validation(...requairedElements);
    let formdata = new FormData(form);
    let newObj = {};
    for (let [name, value] of formdata) {
      newObj[name] = value;
      if (name === "prioritySelector") {
        newObj.priority = PRIORITY[value];
      }
    }
    newObj.completed = false;
    if (!form.id) {
      newObj.id = Date.now();
    } else {
      newObj.id = +form.id;
    }
    creatNewData(newObj);
    popup.classList.remove("open");

    render();
    resetForm();
  } catch (error) {
    console.log(error.message);
  }
});

reqTextarea.addEventListener("input", function (e) {
  validation(reqTextarea);
});

reqInput.addEventListener("input", function (e) {
  validation(reqInput);
});

select.addEventListener("change", function (e) {
  localStorage.setItem("sort", select.value);
  render();
});

//
//
//
// ====Functions!===========================
//
function creatNewData(obj) {
  let currentData = JSON.parse(localStorage.getItem("data"));
  let newData = currentData.filter((item) => item.id !== obj.id);
  newData.push(obj);
  localStorage.setItem("data", JSON.stringify(newData));
}

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

function editTask(id) {
  let data = JSON.parse(localStorage.getItem("data"));
  let taskToEdit = data.find((item) => {
    return item.id === id;
  });
  reqInput.value = taskToEdit.name;
  reqTextarea.value = taskToEdit.description;
  let inputs = document.getElementsByName("prioritySelector");
  for (let input of inputs) {
    if (input.value == taskToEdit.prioritySelector) {
      input.checked = true;
    }
  }
  form.id = id;
  popup.classList.add("open");
  popup.addEventListener("click", function (e) {
    if (!e.target.closest(".popup__content")) {
      popup.classList.remove("open");
      resetForm();
    }
  });
}
function toggleStatusTask(id) {
  let answer = confirm("Are you sure?");
  if (answer) {
    let data = JSON.parse(localStorage.getItem("data"));
    let task = data.find((item) => {
      return item.id === id;
    });
    task.completed = !task.completed;

    localStorage.setItem("data", JSON.stringify(data));
    render();
  }
}
function render() {
  let containerToDo = document.querySelector(".main__tasks");
  let containerCompleted = document.querySelector(".completed__tasks");
  let data = JSON.parse(localStorage.getItem("data"));
  let toDoTasks = data.filter((item) => item.completed == false);
  let sortSelector = localStorage.getItem("sort");
  let toDoContent = "";
  let completedContent = "";
  let sortedToDoTasks = sortData(toDoTasks, sortSelector);
  sortedToDoTasks.forEach((task) => {
    toDoContent += createHTMLTask(task);
  });
  containerToDo.innerHTML = toDoContent;
  editMessage(sortedToDoTasks.length);
  showSortContainer(sortedToDoTasks.length);

  let completedTasks = data.filter((item) => item.completed == true);
  completedTasks.forEach((task) => {
    completedContent += createHTMLCompletedTask(task);
  });
  containerCompleted.innerHTML = completedContent;
}

function createHTMLTask(object) {
  return `<div class="task" id="${object.id}" ondblclick="toggleStatusTask(${object.id})"><h3 class="task__name">${object.name}</h3><p class="task__description">${object.description}</p><div class="task__priority">
  <div class="task-priority-left">
    <img
      class="task__priority-icon"
      src="./img/${object.prioritySelector}.svg"
      alt=""
    />
    <span class="task__priority-text">${object.prioritySelector}</span>
  </div>
  <a class="task__edit" href="#" onclick="editTask(${object.id})">
    <img src="./img/edit.svg" alt="" />
  </a>
  <a class="task__delete" href="#" onclick="deleteTask(${object.id})">
    <img src="./img/delete.svg" alt="" />
  </a>
</div>
</div>`;
}
function createHTMLCompletedTask(object) {
  return `<div class="completed__task" id="${object.id}" ondblclick="toggleStatusTask(${object.id})"><h3 class="completed__task-name">${object.name}</h3>
  <a class="task__delete" href="#" onclick="deleteTask(${object.id})">
    <img src="./img/delete.svg" alt="" />
  </a>
</div>
</div>`;
}
function editMessage(length) {
  if (length == 0) {
    message.innerHTML = "No tasks today! Don't worry";
  } else if (length == 1) {
    message.innerHTML = `You've got <span style="color:#F3477A">${length} task</span> today!`;
  } else {
    message.innerHTML = `You've got <span style="color:#F3477A">${length} tasks</span> today!`;
  }
}

function showSortContainer(length) {
  if (length <= 1) {
    sort.classList.add("none");
  } else {
    sort.classList.remove("none");
  }
}

function setStorage(value) {
  if (localStorage.getItem("data") == null) {
    localStorage.setItem("data", JSON.stringify([]));
  }
  if (localStorage.getItem("sort") == null) {
    localStorage.setItem("sort", value);
  }
}

function sortData(data, selector) {
  return data.sort(function (obj1, obj2) {
    if (obj1[selector].toUpperCase() < obj2[selector].toUpperCase()) {
      return -1;
    }
    if (obj1[selector].toUpperCase() > obj2[selector].toUpperCase()) {
      return 1;
    }
  });
}

function validation(...args) {
  let button = document.querySelector(".form__button-submit");
  for (let reqElem of args) {
    if (reqElem.name == "name" && reqElem.value.length > 20) {
      reqElem.classList.add("error");
      reqElem.nextElementSibling.classList.add("active");
      reqElem.nextElementSibling.innerText = `Your name is too long!`;
      button.dusabled = true;
      throw new Error("The invalid value of input");
    } else if (reqElem.validity.valueMissing) {
      reqElem.classList.add("error");
      reqElem.nextElementSibling.classList.add("active");
      reqElem.nextElementSibling.innerText = `You need to enter ${reqElem.name}!`;
      button.dusabled = true;
      throw new Error("The invalid value of input");
    } else {
      reqElem.classList.remove("error");
      reqElem.nextElementSibling.innerText = "";
      reqElem.nextElementSibling.classList.remove("active");
      button.dusabled = false;
    }
  }
}

function resetForm() {
  let requairedElements = document.querySelectorAll("._req");
  for (let reqElem of requairedElements) {
    reqElem.classList.remove("error");
    reqElem.nextElementSibling.innerText = "";
    reqElem.nextElementSibling.classList.remove("active");
  }
  form.id = "";
  form.reset();
}
