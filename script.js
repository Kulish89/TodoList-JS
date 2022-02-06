let addNewTaskButton = document.querySelector(".head__button");
let closeTaskButton = document.querySelector(".popup__close");
let form = document.getElementById("form");
let popup = document.querySelector(".popup");
let message = document.querySelector(".head__message");

if (localStorage.getItem("data") == null) {
  localStorage.setItem("data", JSON.stringify([]));
}
render();

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
  }
  creatNewData(newObj);

  render();

  popup.classList.remove("open");
  form.reset();
  e.preventDefault();
});

function creatNewData(obj) {
  let currentData = JSON.parse(localStorage.getItem("data"));
  currentData.push(obj);
  localStorage.setItem("data", JSON.stringify(currentData));
}
function deleteTask(but) {
  let answer = confirm("Are you sure?");
  if (answer) {
    let objectName = but.closest(".task").firstChild.innerHTML;
    let newData = JSON.parse(localStorage.getItem("data")).filter((elem) => {
      return elem.name !== objectName;
    });
    console.log(newData);
    localStorage.setItem("data", JSON.stringify(newData));

    render();
  }
}
function render() {
  let container = document.querySelector(".main__tasks");
  let data = JSON.parse(localStorage.getItem("data"));
  let content = "";
  data.forEach((task) => {
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
  editMessage(data);
}
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
function editMessage(data) {
  if (data.length == 0) {
    message.innerHTML = "No tasks today! Don't worry";
  } else if (data.length == 1) {
    message.innerHTML = `You've got <span style="color:#F3477A">${data.length} task</span> today!`;
  } else {
    message.innerHTML = `You've got <span style="color:#F3477A">${data.length} tasks</span> today!`;
  }
}
