// let members = [
//   {
//     id: "1A",
//     name: "Ali Zamani",
//     tasks: [
//       {
//         taskId: 1,
//         task: "front 1",
//       },
//       {
//         taskId: 2,
//         task: "front 2",
//       },
//       {
//         taskId: 3,
//         task: "front 3",
//       },
//       {
//         taskId: 4,
//         task: "front 4",
//       },
//     ],
//   },
//   {
//     id: "2A",
//     name: "Hasan fathi",
//     tasks: [
//       {
//         taskId: 1,
//         task: "back1",
//       },
//       {
//         taskId: 2,
//         task: "back2",
//       },
//       {
//         taskId: 3,
//         task: "back 3",
//       },
//       {
//         taskId: 4,
//         task: "back 4",
//       },
//     ],
//   },
// ];
let $ = document;
let tBody = $.getElementById("tBody");
let inputName = $.getElementById("inputName");
let inputId = $.getElementById("inputId");
let inputTask = $.getElementById("inputTask");
let addBtn = $.getElementById("addBtn");
addBtn.addEventListener("click", addToMembers);

let i;
let j;
let idcounter = 0;
let taskId;
let indexofItem;
let memberDiv;
let isMember = null;
let members = [];

function loadTable() {
  for (i = 0; i < members.length; i++) {
    tBody.insertAdjacentHTML(
      "beforeend",
      `<div 
      class="col-sm-4 tBody dropzone" 
      id=${members[i].name}
      ondragover="onDragOver(event)"
      ondrop="onDrop(event)"
      >
         <div class="row p-3 justify-content-center  nameHeader">
            <span class="nameSpan">${members[i].name} 
                <i class="fas fa-user-minus fa-xs" onclick="deleteMember(${members[i].id})"></i>
            </span>
         </div>
       </div>
     `
    );
    memberDiv = $.getElementById(members[i].name);
    for (j = 0; j < members[i].tasks.length; j++) {
      memberDiv.insertAdjacentHTML(
        "beforeend",
        ` 
            <div 
            class="col-sm-4"  
            draggable="true" 
            id=${members[i].tasks[j].taskId} 
            ondragstart="onDragStart(event)"
            >
                <div class="row p-3 justify-content-center  nameHeader">
                 <span class="taskSpan">${members[i].tasks[j].task}
                 <i class="far fa-edit fa-xs" onclick="editThisTask(${members[i].tasks[j].taskId})"></i>
                 <i class="far fa-trash-alt fa-xs" onclick="deleteTask(${members[i].tasks[j].taskId})"></i>
                 </span>
                </div>
            </div>
        `
      );
    }
  }
}

//---------  load on onload ------

function checkLocalStorage() {
  if (localStorage.getItem("members") !== null) {
    getFromLocalStorage();
    loadTable();
    console.log(members);
  }
}

// ------ add members
function addToMembers() {
  isMember = false;
  if (inputName.value !== "" && inputId.value !== "") {
    checkIfMemberExict(inputId.value);
    if (isMember) {
      addTaskToMember(inputId.value, inputName.value, inputTask.value);
    } else {
      newMember(inputId.value, inputName.value, inputTask.value);
    }
  } else {
    alert("name cant be empty");
  }
  inputName.value = "";
  inputId.value = "";
  inputTask.value = "";
}

//---------- to check if we have the member-----

function checkIfMemberExict(id) {
  for (i = 0; i < members.length; i++) {
    if (members[i].id == id) {
      isMember = !isMember;
    }
  }
}

// ------ to add new member-------

function newMember(id, name, task) {
  members.push({
    id: id,
    name: name,
    tasks: [
      {
        taskId: idMaker(task),
        task: task,
      },
    ],
  });
  setToLocalStorage(members);
  setNewMemberToDom(name, id, task, taskId);
}

//------ set new member to DOM -----

function setNewMemberToDom(name, id, task, tasksId) {
  tBody.insertAdjacentHTML(
    "afterbegin",
    `<div 
    class="col-sm-4 dropzone tBody" 
    ondragover="onDragOver(event)"
    ondrop="onDrop(event)"
    id="${name}"
    >
       <div class="row p-3 justify-content-center  nameHeader">
          <span class="nameSpan">${name} 
              <i class="fas fa-user-minus fa-xs" onclick="deleteMember(${id})"></i>
          </span>
       </div>
     </div>
   `
  );
  setNewTaskToDom(name, task, tasksId);
}

//------------ to add task to a old member --------

function addTaskToMember(id, name, task) {
  for (i = 0; i < members.length; i++) {
    if (members[i].id == id) {
      members[i].tasks.push({
        taskId: idMaker(task),
        task: task,
      });
    }
  }
  setToLocalStorage(members);
  setNewTaskToDom(name, task, taskId);
}

// ------- set new task to DOM ------

function setNewTaskToDom(name, task, tasksId) {
  memberDiv = $.getElementById(name);
  memberDiv.insertAdjacentHTML(
    "beforeend",
    ` 
        <div 
        class="col-sm-4 dragAble" 
        draggable="true"  
        ondragstart="onDragStart(event)" 
        id=${tasksId}
        >
         <div class="row p-3 justify-content-center  nameHeader">
             <span class="taskSpan">${task}
             <i class="far fa-edit fa-xs" onclick="editThisTask(${tasksId})"></i>
             <i class="far fa-trash-alt fa-xs" onclick="deleteTask(${tasksId})"></i>
             </span>
          </div>
        </div>
    `
  );
}

//------ delete a member-------

function deleteMember(id) {
  for (i = 0; i < members.length; i++) {
    if (members[i].id == id) {
      memberDiv = $.getElementById(members[i].name);
      memberDiv.remove();
      let indexOfMember = members.indexOf(members[i]);
      members.splice(indexOfMember, 1);
      setToLocalStorage(members);
    }
  }
}

// -------- set and get to local storage -----

function setToLocalStorage(membersToLocal) {
  localStorage.setItem("members", JSON.stringify(membersToLocal));
}

function getFromLocalStorage() {
  members = JSON.parse(localStorage.getItem("members", members));
  return members;
}

//----- id maker for task ----
function idMaker(task) {
  taskId = task + idcounter++;
  return taskId;
}

// ------- edit  and delet each task -----
function editThisTask(selectedtaskid) {
  for (i = 0; i < members.length; i++) {
    for (j = 0; j < members[i].tasks.length; j++) {
      if (members[i].tasks[j].taskId === selectedtaskid.id) {
        inputTask.value = members[i].tasks[j].task;
        assignEditedTask(members[i].tasks[j].task);
      }
    }
  }
}
function assignEditedTask(oldTask) {
  inputTask.addEventListener("keydown", function (event) {
    if (event.keyCode == 13) {
      for (i = 0; i < members.length; i++) {
        for (j = 0; j < members[i].tasks.length; j++) {
          if (members[i].tasks[j].task === oldTask) {
            members[i].tasks[j].task = inputTask.value;
            memberDiv = $.getElementById(members[i].tasks[j].taskId);
            members[i].tasks[j].taskId = idMaker(members[i].tasks[j].task);
            setToLocalStorage(members);
            memberDiv.id = members[i].tasks[j].taskId;
            memberDiv.className = "col-sm-4 dragAble";
            memberDiv.draggable = "true";
            memberDiv.ondragstart = "onDragStart(event)";
            memberDiv.innerHTML = `
            <div class="row p-3 justify-content-center  nameHeader">
                <span class="taskSpan">${members[i].tasks[j].task}
                <i class="far fa-edit fa-xs" onclick="editThisTask(${members[i].tasks[j].taskId})"></i>
                <i class="far fa-trash-alt fa-xs" onclick="deleteTask(${members[i].tasks[j].taskId})"></i>
                </span>
             </div>
            `;

            inputTask.value = "";
          }
        }
      }
    }
  });
}

function deleteTask(IdToRemove) {
  members.map((member) => {
    let tasks = Object.keys(member);
    member[tasks[2]].map((taskObj) => {
      if (taskObj.taskId == IdToRemove.id) {
        let mainTaskIndex = member[tasks[2]].indexOf(taskObj);
        member[tasks[2]].splice(mainTaskIndex, 1);
      }
    });
  });
  setToLocalStorage(members);
  let taskDiv = $.getElementById(IdToRemove.id);
  taskDiv.remove();
}

// ------ drag and drop -------

function onDragStart(event) {
  init(event.target.id);
  for (i = 0; i < members.length; i++) {
    for (j = 0; j < members[i].tasks.length; j++) {
      if (members[i].tasks[j].taskId === event.target.id) {
        let tasks = members[i].tasks[j];
        event.dataTransfer.setData("task/object", JSON.stringify(tasks));
        event.dataTransfer.setData("task/id", event.target.id);
      }
    }
  }
}

function dragend(event) {
  let el = $.getElementById(event.target.id);
  el.style.backgroundColor = "#eee";
}

function onDragOver(event) {
  event.target.style.backgroundColor = "yellow";
  event.preventDefault();
}
// reset the background
function onDragExit(event) {
  event.target.style.backgroundColor = "#eee";
}

// highlight potential drop target when the draggable element enters it
function dragenter(event) {
  event.target.style.background = "yellow";
}

// reset background of potential drop target when the draggable element leaves it
function dragleave(event) {
  event.target.style.background = "#eee";
}

function init(someId) {
  // Set handlers for the source's enter/leave/end/exit events
  console.log("workimg");
  var el = document.getElementById(someId);
  el.ondragenter = dragenter;
  el.ondragleave = dragleave;
  el.ondragend = dragend;
  el.ondragexit = onDragExit;
}

function onDrop(event) {
  const dragedTask = JSON.parse(event.dataTransfer.getData("task/object")); // actual data
  const taskDivId = event.dataTransfer.getData("task/id"); // data id
  const dragedDiv = $.getElementById(taskDivId); // will need later
  const targetMember = event.target;
  members.map((member) => {
    let tasks = Object.keys(member);
    member[tasks[2]].map((taskObj) => {
      if (taskObj.taskId == taskDivId) {
        let mainTaskIndex = member[tasks[2]].indexOf(taskObj);
        member[tasks[2]].splice(mainTaskIndex, 1);
      }
    });
  });
  for (i = 0; i < members.length; i++) {
    if (members[i].id == targetMember.id) {
      members[i].tasks.push(dragedTask);
    }
  }

  event.target.style.backgroundColor = "#eee";
  setToLocalStorage(members);
  targetMember.insertAdjacentElement("beforeend", dragedDiv);
  targetMember.appendChild(dragedDiv);
  event.dataTransfer.clearData();
}
