// ===== находим основные элементы страицы=================================
let addNewTaskButton = document.querySelector(".head__button");
let closeTaskButton = document.querySelector(".popup__close");
let form = document.getElementById("form");
let popup = document.querySelector(".popup");
let message = document.querySelector(".head__message");
let sort = document.querySelector(".sort");
let select = document.querySelector(".sort__select");

// ======устанавливаем Storage и рендерим страницу=====================
setStorage();
render();

// ====Вешаем события на кнопки, форму и select =======================

addNewTaskButton.addEventListener("click", function (e) {
  popup.classList.add("open");
  popup.addEventListener("click", function (e) {
    if (!e.target.closest(".popup__content")) {
      e.target.closest(".popup").classList.remove("open");
      form.reset();
    }
  });
  e.preventDefault();
});

closeTaskButton.addEventListener("click", function (e) {
  closeTaskButton.closest(".popup").classList.remove("open");
  form.reset();
  e.preventDefault();
});

form.addEventListener("submit", function (e) {
  let formdata = new FormData(form);
  let newObj = {};
  for (let [name, value] of formdata) {
    newObj[name] = value;
    switch (value) {
      case "Critical":
        newObj.priority = 3;
        break;
      case "Normal":
        newObj.priority = 2;
        break;
      case "Minor":
        newObj.priority = 1;
        break;
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

// ===== функции работы с данными=================================

// ========добавляем новый объект в Localstorage, в массив data======
function creatNewData(obj) {
  let currentData = JSON.parse(localStorage.getItem("data"));
  currentData.push(obj);
  localStorage.setItem("data", JSON.stringify(currentData));
}
//
//
//====== функция-обработчик события: удаление задачи из списка======================
function deleteTask(but) {
  let answer = confirm("Are you sure?");
  if (answer) {
    let objectName = but.closest(".task").firstChild.innerHTML;
    let newData = JSON.parse(localStorage.getItem("data")).filter((elem) => {
      return elem.name !== objectName;
    });
    localStorage.setItem("data", JSON.stringify(newData));
    render();
  }
}
// =====render - сбор, сортировка данных с Localstorage, рендер всей станицы: задач, главного сообщения и окна сотировки=====================
function render() {
  let container = document.querySelector(".main__tasks");
  let data = JSON.parse(localStorage.getItem("data"));
  let sortSelector = localStorage.getItem("sort");
  let sortedData;
  if (sortSelector == "priority") {
    sortedData = data.sort((obj1, obj2) => obj2.priority - obj1.priority);
  } else if (sortSelector == "name") {
    sortedData = data.sort((obj1, obj2) => obj2.name - obj1.name);
  }
  let content = "";
  sortedData.forEach((task) => {
    content += createHTMLTask(task);
  });
  container.innerHTML = content;
  let deleteButtons = document.querySelectorAll(".task__delete");
  for (let button of deleteButtons) {
    button.addEventListener("click", (e) => {
      deleteTask(button);
      e.preventDefault();
    });
  }
  editMessage(sortedData);
  toggleSortContainer(sortedData);
}
//

// ===========функция создает HTML разметку для каждой Task.
function createHTMLTask(object) {
  return `<div class="task"><h3 class="task__name">${object.name}</h3><p class="task__description">${object.description}</p><div class="task__priority">
  <div class="task-priority-left">
    <img
      class="task__priority-icon"
      src="./img/${object.prioritySelector}.svg"
      alt=""
    />
    <span class="task__priority-text">${object.prioritySelector}</span>
  </div>
  <a class="task__delete" href="#">
    <img src="./img/delete.svg" alt="" />
  </a>
</div>
</div>`;
}
//
//
// ==========функция меняет текст главного собщения на странице в зависимости от Data
function editMessage(data) {
  if (data.length == 0) {
    message.innerHTML = "No tasks today! Don't worry";
  } else if (data.length == 1) {
    message.innerHTML = `You've got <span style="color:#F3477A">${data.length} task</span> today!`;
  } else {
    message.innerHTML = `You've got <span style="color:#F3477A">${data.length} tasks</span> today!`;
  }
}
//
//
// ============= включение и выключения окна сортировки в зависимости от количества задча=====================================================================
function toggleSortContainer(data) {
  if (data.length <= 1) {
    sort.classList.add("none");
  } else {
    sort.classList.remove("none");
  }
}
//
//
// =======установка начального storage===================================
function setStorage() {
  if (localStorage.getItem("data") == null) {
    localStorage.setItem("data", JSON.stringify([]));
  }
  if (localStorage.getItem("sort") == null) {
    localStorage.setItem("sort", select.value);
  }
}
