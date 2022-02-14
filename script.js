//
let addNewTaskButton = document.querySelector(".head__button");
let closeTaskButton = document.querySelector(".popup__close");
let form = document.getElementById("form");
let popup = document.querySelector(".popup");
let message = document.querySelector(".head__message");
let sort = document.querySelector(".sort");
let select = document.querySelector(".sort__select");
let reqTextarea = document.querySelector(".form__textarea");
let reqInput = document.querySelector(".form__input");

//
const PRIORITY = { Critical: 3, Normal: 2, Minor: 1 };
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
  let requairedElements = document.querySelectorAll("._req");
  let error = validation(...requairedElements);
  if (error === 0) {
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
    popup.classList.remove("open");
    resetForm();
    render();
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
  currentData.push(obj);
  localStorage.setItem("data", JSON.stringify(currentData));
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

function validation(...args) {
  let error = 0;
  for (let reqElem of args) {
    if (reqElem.name == "name" && reqElem.value.length > 20) {
      reqElem.classList.add("error");
      reqElem.nextElementSibling.classList.add("active");
      reqElem.nextElementSibling.innerText = `Your name is too long!`;
      error++;
    } else if (reqElem.validity.valueMissing) {
      reqElem.classList.add("error");
      reqElem.nextElementSibling.classList.add("active");
      reqElem.nextElementSibling.innerText = `You need to enter ${reqElem.name}!`;
      error++;
    } else {
      reqElem.classList.remove("error");
      reqElem.nextElementSibling.innerText = "";
      reqElem.nextElementSibling.classList.remove("active");
    }
  }

  return error;
}

function resetForm() {
  let requairedElements = document.querySelectorAll("._req");
  for (let reqElem of requairedElements) {
    reqElem.classList.remove("error");
    reqElem.nextElementSibling.innerText = "";
    reqElem.nextElementSibling.classList.remove("active");
  }
  form.reset();
}
