const mainContainer = document.getElementById("main");
//projects
const projectCreateForm = document.getElementById("project-create-form");
const projectsContainer = document.getElementById("projects-container");
const projectFormContainer = document.getElementById("project-form-container");
const projectsH3 = document.getElementById("projects-h3");
//stories
const storyCreateForm = document.getElementById("story-form-container");
const showTasksBtn = document.getElementById("showTasksBtn");
const storiesContainer = document.getElementById("stories-container");
const storyFormContainer = document.getElementById("story-form-container");
const storiesH3 = document.getElementById("stories-h3");
const storyDropdown = document.getElementById(
  "story-dropdown"
) as HTMLSelectElement;
const storyNameInput = document.getElementById(
  "story-name"
) as HTMLInputElement;
const storyDescriptionInput = document.getElementById(
  "story-description"
) as HTMLInputElement;
const storyPriorityInput = document.getElementById(
  "story-priority"
) as HTMLSelectElement;
const storyStatusInput = document.getElementById(
  "story-status"
) as HTMLSelectElement;
//tasks
const taskCreateForm = document.getElementById("task-form-container");
const tasksContainer = document.getElementById("tasks-grid-container");
const todoTasksContainer = document.getElementById("todo-tasks-container");
const doingTasksContainer = document.getElementById("doing-tasks-container");
const doneTasksContainer = document.getElementById("done-tasks-container");
const taskFormContainer = document.getElementById("task-form-container");
const tasksContainerHeader = document.getElementById("tasks-container-header");
const tasksH3 = document.getElementById("tasks-h3");
const taskDropdown = document.getElementById(
  "task-dropdown"
) as HTMLSelectElement;
const taskNameInput = document.getElementById("task-name") as HTMLInputElement;
const taskDescriptionInput = document.getElementById(
  "task-description"
) as HTMLInputElement;
const taskPriorityInput = document.getElementById(
  "task-priority"
) as HTMLSelectElement;
const taskStoryInput = document.getElementById(
  "task-story"
) as HTMLSelectElement;
// const taskStatusInput = document.getElementById(
//   "task-status"
// ) as HTMLSelectElement;
const estimatedFinishDateInput = document.getElementById(
  "estimated-finish-date-picker"
) as HTMLInputElement;
const taskModalDiv = document.getElementById("task-modal");
const modalContentDiv = document.getElementById("modal-content");
const closeModalBtn = document.getElementById("close-modal-btn");
const submitTaskFormBtn = document.getElementById("submit-task-btn");

const storiesKeyIdentifier = "stories-";
const tasksKeyIdentifier = "task-";
let loggedUser: User | null = null;
let chosenProject: Project | null = null;

projectCreateForm!.addEventListener("submit", function (e) {
  e.preventDefault();
  onNewProject(e);
});

taskCreateForm!.addEventListener("submit", function (e) {
  e.preventDefault();
  onNewTask(e);
});

storyCreateForm!.addEventListener("submit", function (e) {
  e.preventDefault();
  onNewStory(e);
});

type Project = {
  id: string;
  name: string;
  description: string;
};

type Story = {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  project: Project;
  createdDate: Date;
  status: Status;
  owner: User;
};

type TodoTask = {
  id: string; //?
  name: string;
  description: string;
  priority: Priority;
  storyId: string;
  estimatedFinishDate: Date;
  status: Status;
  createdDate: Date;
};

type DoingTask = {
  id: string; //?
  name: string;
  description: string;
  priority: Priority;
  storyId: string;
  estimatedFinishDate: Date;
  status: Status;
  createdDate: Date;
  startedDate: Date;
  assigneeId: string;
};

type DoneTask = {
  id: string; //?
  name: string;
  description: string;
  priority: Priority;
  storyId: string;
  estimatedFinishDate: Date;
  status: Status;
  createdDate: Date;
  startedDate: Date;
  finishedDate: Date;
  assigneeId: string;
};

enum Priority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

enum Status {
  ToDo = "ToDo",
  Doing = "Doing",
  Done = "Done",
}

enum Role {
  Admin = "Admin",
  DevOps = "DevOps",
  Developer = "Developer",
}

class User {
  id: string;
  firstName: string;
  lastName: string;
  loggedIn: boolean;
  role: Role;

  constructor(id: string, firstName: string, lastName: string, role: Role) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.loggedIn = false;
    this.role = role;
  }

  login(): void {
    loggedUser = this;
    this.loggedIn = true;
  }

  logout(): void {
    loggedUser = null;
    this.loggedIn = false;
  }
}

function getProjectFormData() {
  const nameInput = document.getElementById("project-name") as HTMLInputElement;
  const descriptionInput = document.getElementById(
    "project-description"
  ) as HTMLInputElement;

  const name: string = nameInput.value.trim();
  const description: string = descriptionInput.value.trim();
  return { name, description };
}

function onNewProject(e: Event) {
  const { name, description } = getProjectFormData();

  if (!name || !description) {
    alert("Fill the form!");
    return;
  }

  const project = createProject(name, description);
  saveProject(project);
  showProjects();
}

function saveProject(project: Project) {
  localStorage.setItem(project.id, JSON.stringify(project));
}

function createProject(name: string, description: string): Project {
  const id = "project-" + self.crypto.randomUUID();
  return {
    id,
    name,
    description,
  };
}

function showProjects(): void {
  projectsContainer!.innerHTML = "";
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith("project")) {
      const item = JSON.parse(localStorage.getItem(key) || "null");
      if (item) {
        showSingleProject(item);
      }
    }
  }
}

function showSingleProject(project: Project): void {
  let projectDiv = document.createElement("div");
  let projectSpan = document.createElement("span");
  let deleteProjectBtn = document.createElement("button");
  let updateProjectBtn = document.createElement("button");
  let chooseProjectBtn = document.createElement("button");

  projectSpan.innerHTML = `name: ${project.name}, description: ${project.description}`;
  projectSpan.addEventListener("click", () => markProjectOut(projectDiv));
  deleteProjectBtn.classList.add("project-button");
  deleteProjectBtn.innerText = "Delete";
  deleteProjectBtn.addEventListener("click", () =>
    handleDeleteClick(project.id)
  );

  updateProjectBtn.classList.add("project-button");
  updateProjectBtn.innerText = "Update";
  updateProjectBtn.addEventListener("click", () =>
    updateProject(project, projectDiv, projectSpan)
  );

  chooseProjectBtn.classList.add("project-button");
  chooseProjectBtn.innerText = "Choose";
  chooseProjectBtn.addEventListener("click", () =>
    handleChooseProjectBtn(project.id)
  );

  projectDiv!.appendChild(projectSpan);
  projectDiv!.appendChild(deleteProjectBtn);
  projectDiv!.appendChild(updateProjectBtn);
  projectDiv!.appendChild(chooseProjectBtn);
  projectsContainer!.appendChild(projectDiv);
}

function markProjectOut(projectDiv: HTMLDivElement): void {
  projectDiv.classList.toggle("marked");
}

function handleDeleteClick(projectId: string) {
  deleteProject(projectId);
  showProjects();
}

function deleteProject(projectId: string) {
  localStorage.removeItem(projectId);
  showProjects();
}

function handleChooseProjectBtn(projectId: string) {
  chooseProject(projectId);
  showStories();
}

function chooseProject(projectId: string) {
  chosenProject = getProject(projectId);
  localStorage.setItem("chosenProject", JSON.stringify(chosenProject));
  toggleStories();
  toggleProjects();
}

function toggleProjects(): void {
  projectsH3!.classList.toggle("h3-element");
  projectFormContainer!.classList.toggle("form-container");
  projectsContainer!.classList.toggle("entity-container");
  projectsH3!.classList.toggle("hidden-element");
  projectFormContainer!.classList.toggle("hidden-element");
  projectsContainer!.classList.toggle("hidden-element");
}

function updateProject(
  project: Project,
  projectDiv: HTMLDivElement,
  projectSpan: HTMLSpanElement
) {
  projectSpan.classList.add("beingUpdated");

  let labelForname = document.createElement("label");
  labelForname.setAttribute("for", "inputname");
  var labelFornameText = document.createTextNode("name");
  labelForname.appendChild(labelFornameText);
  let inputForname = document.createElement("input");
  inputForname.setAttribute("type", "text");
  inputForname.placeholder = project.name;

  let labelFordescription = document.createElement("label");
  labelFordescription.setAttribute("for", "inputdescription");
  var labelFordescriptionText = document.createTextNode("description");
  labelFordescription.appendChild(labelFordescriptionText);
  let inputFordescription = document.createElement("input");
  inputFordescription.setAttribute("type", "text");
  inputFordescription.placeholder = project.description;

  let saveUpdatedProjectBtn = document.createElement("button");
  saveUpdatedProjectBtn.innerText = "Save";
  saveUpdatedProjectBtn.addEventListener("click", () =>
    handleSaveUpdatedProject(
      project,
      inputForname.value,
      inputFordescription.value
    )
  );

  projectDiv.append(labelForname);
  projectDiv.append(inputForname);
  projectDiv.append(labelFordescription);
  projectDiv.append(inputFordescription);
  projectDiv.append(saveUpdatedProjectBtn);
}

function handleSaveUpdatedProject(
  project: Project,
  name: string,
  description: string
) {
  saveUpdatedProject(project, name, description);
  showProjects();
}

function saveUpdatedProject(
  project: Project,
  name: string,
  description: string
) {
  let retrievedProject: Project | null = null;
  const storedProject = localStorage.getItem(project.id);

  if (storedProject) {
    retrievedProject = JSON.parse(storedProject);
  }
  retrievedProject!.name = name;
  retrievedProject!.description = description;

  localStorage.setItem(retrievedProject!.id, JSON.stringify(retrievedProject!));
}

function getProject(projectId: string): Project | null {
  const projectString = localStorage.getItem(`${projectId}`);
  if (projectString) {
    const projectData = JSON.parse(projectString);
    return {
      id: projectData.id,
      name: projectData.name,
      description: projectData.description,
    };
  }
  return null;
}

//stories

function getStoriesFormData() {
  const name: string = storyNameInput.value.trim();
  const description: string = storyDescriptionInput.value.trim();
  const priority: string = storyPriorityInput.value;
  const status: string = storyStatusInput.value;
  return { name, description, priority, status };
}

function onNewStory(e: Event) {
  const { name, description, priority, status } = getStoriesFormData();

  if (!name || !description || !priority || !status) {
    alert("Fill the form!");
    return;
  }

  const story = createStory(
    name,
    description,
    priority as Priority,
    status as Status
  );
  saveStory(story as Story);
  showStories();
}

function saveStory(story: Story) {
  const key = storiesKeyIdentifier + chosenProject!.id;
  const storiesString = localStorage.getItem(key);
  let stories: Story[] = storiesString ? JSON.parse(storiesString) : [];
  stories.push(story);
  localStorage.setItem(key, JSON.stringify(stories));
}

function createStory(
  name: string,
  description: string,
  priority: Priority,
  status: Status
): Story {
  const id = storiesKeyIdentifier + self.crypto.randomUUID();
  const project = chosenProject;
  const createdDate = new Date();
  const owner = loggedUser;

  if (project && owner)
    return {
      id,
      name,
      description,
      priority,
      project,
      createdDate,
      status,
      owner,
    };
  throw new Error("Unable to create story.");
}

function getStories(): Story[] {
  const storedChosenProject = JSON.parse(
    localStorage.getItem("chosenProject") || "null"
  );
  const key = storiesKeyIdentifier + storedChosenProject!.id;
  const storiesString = localStorage.getItem(key);
  const allStories: Story[] = storiesString ? JSON.parse(storiesString) : [];
  return allStories;
}

function showStories(): void {
  const allStories = getStories();
  const selectedStatus = storyDropdown!.value;
  let stories: Story[];
  if (selectedStatus == "All") {
    stories = allStories;
  } else {
    stories = allStories.filter((s) => s.status == selectedStatus);
  }
  storiesContainer!.innerHTML = "";

  stories.forEach((story: Story) => {
    let storyDiv = document.createElement("div");
    let storySpan = document.createElement("span");
    let deleteStoryBtn = document.createElement("button");
    let updateStoryBtn = document.createElement("button");
    storySpan.innerHTML = `Name: ${story.name}, Description: ${story.description}, Priority: ${story.priority}, Created Date: ${story.createdDate}, Status: ${story.status}, Owner: ${story.owner.firstName} ${story.owner.lastName}`;
    storySpan.addEventListener("click", () => markStoryOut(storyDiv));

    deleteStoryBtn.classList.add("story-button");
    deleteStoryBtn.innerText = "Delete";
    deleteStoryBtn.addEventListener("click", () =>
      handleDeleteStoryClick(story.id)
    );

    updateStoryBtn.classList.add("story-button");
    updateStoryBtn.innerText = "Update";
    updateStoryBtn.addEventListener("click", () =>
      updateStory(story, storyDiv, storySpan)
    );

    storyDiv.appendChild(storySpan);
    storyDiv.appendChild(deleteStoryBtn);
    storyDiv.appendChild(updateStoryBtn);
    storiesContainer!.appendChild(storyDiv);
  });
}

function markStoryOut(storyDiv: HTMLDivElement): void {
  storyDiv.classList.toggle("marked");
}

function updateStory(
  story: Story,
  storyDiv: HTMLDivElement,
  storySpan: HTMLSpanElement
) {
  storySpan.classList.add("beingUpdated");

  storyNameInput!.value = story.name;
  storyDescriptionInput!.value = story.description;
  storyPriorityInput!.value = story.priority;
  storyStatusInput!.value = story.status;

  let saveUpdatedProjectBtn = document.createElement("button");
  saveUpdatedProjectBtn.innerText = "Save";
  saveUpdatedProjectBtn.addEventListener("click", () =>
    handleSaveUpdatedStory(story)
  );
  storyDiv.appendChild(saveUpdatedProjectBtn);
}

function handleSaveUpdatedStory(story: Story): void {
  let updatedStoryInput = getStoriesFormData();
  story.name = updatedStoryInput.name;
  story.description = updatedStoryInput.description;
  story.priority = updatedStoryInput.priority as Priority;
  story.status = updatedStoryInput.status as Status;

  const key = storiesKeyIdentifier + chosenProject!.id;
  const storiesString = localStorage.getItem(key);
  const stories: Story[] = storiesString ? JSON.parse(storiesString) : [];
  let newStories = stories.filter(({ id }) => id !== story.id);
  newStories.push(story);

  localStorage.setItem(key, JSON.stringify(newStories));
  showStories();
}

function handleDeleteStoryClick(storyId: string) {
  deleteStory(storyId);
  showProjects();
}

function deleteStory(storyId: string) {
  const projectStoriesKey = "stories-" + chosenProject!.id;
  const storiesString = localStorage.getItem(projectStoriesKey);
  const stories: Story[] = storiesString ? JSON.parse(storiesString) : [];
  let newStories = stories.filter(({ id }) => id !== storyId);

  localStorage.setItem(projectStoriesKey, JSON.stringify(newStories));
  showStories();
}

function toggleStories(): void {
  storiesH3!.classList.toggle("h3-element");
  storyFormContainer!.classList.toggle("form-container");
  storiesContainer!.classList.toggle("entity-container");
  storiesH3!.classList.toggle("hidden-element");
  storyDropdown!.classList.toggle("hidden-element");
  storyFormContainer!.classList.toggle("hidden-element");
  storiesContainer!.classList.toggle("hidden-element");
  showTasksBtn!.classList.toggle("hidden-element");
}

//tasks
function handleShowTasksBtn() {
  toggleStories();
  toggleTasks();
  const currentDate = new Date().toISOString().slice(0, 10);
  estimatedFinishDateInput.value = currentDate;
  estimatedFinishDateInput.min = currentDate;
  estimatedFinishDateInput.max = "2035-01-01";
  const allStories = getStories();
  let openStories = allStories.filter((s) => s.status != Status.Done);
  openStories.forEach((story) => {
    let optionElement = document.createElement("option");
    optionElement.value = story.id;
    optionElement.text = story.name;

    taskStoryInput.appendChild(optionElement);
  });
  showTasks();
}

function showTasks() {
  todoTasksContainer!.innerHTML = "";
  doingTasksContainer!.innerHTML = "";
  doneTasksContainer!.innerHTML = "";

  const tasks = Object.keys(localStorage)
    .filter((key) => key.startsWith("task"))
    .map((key) => JSON.parse(localStorage[key]));
  console.log(tasks);

  tasks.forEach((task) => {
    let singleTaskDiv = document.createElement("div");

    let singleTaskName = document.createElement("span");
    singleTaskName.innerHTML = `Task name: ${task.name}`;

    let singleTaskAssignee = document.createElement("span");
    console.log("task assignee " + task.assigneeId);

    const assignee = getUserById(task.assigneeId);
    singleTaskAssignee.innerHTML = assignee
      ? `Task assignee: ${assignee.firstName} ${assignee.lastName}`
      : "No task assignee";

    singleTaskDiv.appendChild(singleTaskName);
    singleTaskDiv.appendChild(singleTaskAssignee);
    singleTaskDiv.classList.add("single-task");
    singleTaskDiv.id = `task-div-${task.id}`;
    singleTaskDiv.addEventListener("click", function (e) {
      showModal(task);
    });

    switch (task.status) {
      case "ToDo":
        todoTasksContainer!.appendChild(singleTaskDiv);
        break;
      case "Doing":
        doingTasksContainer!.appendChild(singleTaskDiv);
        break;
      case "Done":
        doneTasksContainer!.appendChild(singleTaskDiv);
        break;
    }
  });
}

function showModal(task: TodoTask | DoingTask | DoneTask) {
  if (modalContentDiv) {
    modalContentDiv.innerHTML = "";

    let singleTaskName = document.createElement("span");
    singleTaskName.innerHTML = `Task Name: ${task.name}`;

    let singleTaskDescription = document.createElement("span");
    singleTaskDescription.innerHTML = `Task Description: ${task.description}`;

    let singleTaskPriority = document.createElement("span");
    singleTaskPriority.innerHTML = `Task Priority: ${task.priority}`;

    const storyName = getStoryName(task.storyId);
    let singleTaskStory = document.createElement("span");
    singleTaskStory.innerHTML = `Story: ${storyName}`;

    let singleTaskEstimatedFinish = document.createElement("span");
    singleTaskEstimatedFinish.innerHTML = `Estimated Finish: ${new Date(
      task.estimatedFinishDate
    )
      .toISOString()
      .slice(0, 10)}`;

    let singleTaskStatus = document.createElement("span");
    singleTaskStatus.innerHTML = `Task Status: ${task.status}`;

    let singleTaskCreatedDate = document.createElement("span");
    singleTaskCreatedDate.innerHTML = `Created Date: ${new Date(
      task.createdDate
    )
      .toISOString()
      .slice(0, 10)}`;

    let assigneeLabel = document.createElement("label");
    assigneeLabel.innerHTML = "Assignee:";
    assigneeLabel.id = "assigneeSelectLabel";
    assigneeLabel.setAttribute("for", "assigneeSelect");

    let assigneeSelect = document.createElement("select");
    assigneeSelect.id = "assigneeSelect";
    const assignees: User[] = getAssignees();
    assignees.forEach((assignee) => {
      let assigneeOption = document.createElement("option");

      assigneeOption.value = assignee.id;
      assigneeOption.text = `${assignee.firstName} ${assignee.lastName}`;
      assigneeSelect.appendChild(assigneeOption);
    });

    let editTaskBtn = document.createElement("button");
    editTaskBtn.id = "editTaskBtn";
    editTaskBtn.innerHTML = "Edit";
    editTaskBtn.addEventListener("click", function () {
      handleEditTaskBtnClick(task);
    });

    let saveTaskBtn = document.createElement("button");
    if (task.status !== "Done") {
      saveTaskBtn.id = "saveTaskBtn";
      saveTaskBtn.innerHTML = "Save";
      saveTaskBtn.addEventListener("click", function () {
        const updatedTask = updateTaskToDoing(task);
        if (updatedTask) {
          saveTask(updatedTask);
        }
      });
    }

    let finishTaskBtn = document.createElement("button");
    if (task.status === "Doing") {
      finishTaskBtn.id = "finishTaskBtn";
      finishTaskBtn.innerHTML = "Mark as done";
      finishTaskBtn.addEventListener("click", function () {
        const updatedTask = updateTaskToDone(task as DoingTask);
        if (updatedTask) {
          saveTask(updatedTask);
        }
      });
    }

    modalContentDiv.appendChild(singleTaskName);
    modalContentDiv.appendChild(singleTaskDescription);
    modalContentDiv.appendChild(singleTaskPriority);
    modalContentDiv.appendChild(singleTaskStory);
    modalContentDiv.appendChild(singleTaskEstimatedFinish);
    modalContentDiv.appendChild(singleTaskStatus);
    modalContentDiv.appendChild(singleTaskCreatedDate);

    if (task.status !== "Done") {
      modalContentDiv.appendChild(assigneeLabel);
      modalContentDiv.appendChild(assigneeSelect);
      modalContentDiv.appendChild(saveTaskBtn);
      modalContentDiv.appendChild(finishTaskBtn);
    }

    if (task.status !== "ToDo") {
      let moveTaskBackBtn = document.createElement("button");
      moveTaskBackBtn.id = "moveTaskBackBtn";
      moveTaskBackBtn.innerHTML = "Move task to previous stage";
      moveTaskBackBtn.addEventListener("click", () =>
        moveTaskBack(task as DoingTask | DoneTask)
      );

      modalContentDiv.appendChild(moveTaskBackBtn);
    }
    modalContentDiv.appendChild(editTaskBtn);

    taskModalDiv!.style.display = "block";
    modalContentDiv.classList.remove("hidden-element");
    closeModalBtn!.classList.remove("hidden-element");

    closeModalBtn!.addEventListener("click", () => closeModal());
  }
}

function closeModal() {
  taskModalDiv!.style.display = "none";
  modalContentDiv!.classList.add("hidden-element");
  closeModalBtn!.classList.add("hidden-element");
}

function handleEditTaskBtnClick(task: TodoTask | DoingTask | DoneTask) {
  let saveUpdatedTaskBtn = document.createElement("button");
  saveUpdatedTaskBtn.innerText = "Save";
  saveUpdatedTaskBtn.addEventListener("click", () =>
    handleSaveUpdatedTaskBtn(task, saveUpdatedTaskBtn)
  );
  taskFormContainer!.appendChild(saveUpdatedTaskBtn);

  closeModal();
  hideKudoBoard();
  toggleElementsVisibility();
  fillFormWithTaskData(task);
}

function handleSaveUpdatedTaskBtn(
  task: TodoTask | DoingTask | DoneTask,
  saveUpdatedTaskBtn: HTMLButtonElement
) {
  const formData = getTasksFormData();

  if (
    !formData.name ||
    !formData.description ||
    !formData.priority ||
    !formData.storyId ||
    !task.estimatedFinishDate
  ) {
    alert("Fill the form!");
    return;
  }

  task.name = formData.name;
  task.description = formData.description;
  task.priority = formData.priority as Priority;
  task.storyId = formData.storyId;
  task.estimatedFinishDate = new Date(formData.estimatedFinishDate);

  saveUpdatedTaskBtn.style.display = "none";
  updateTask(task.id, task);
  toggleElementsVisibility();
  showTasks();
}

function updateTask(taskId: string, task: TodoTask | DoingTask | DoneTask) {
  localStorage.setItem(taskId, JSON.stringify(task));
}

function fillFormWithTaskData(task: TodoTask | DoingTask | DoneTask) {
  taskNameInput.value = task.name;
  taskDescriptionInput.value = task.description;
  taskPriorityInput.value = task.priority;
  taskStoryInput.value = task.storyId;

  const taskEstimatedFinishDate = new Date(task.estimatedFinishDate)
    .toISOString()
    .slice(0, 10);
  estimatedFinishDateInput.value = taskEstimatedFinishDate;
}

function toggleElementsVisibility() {
  tasksContainer!.classList.toggle("hidden-element");
  tasksContainer!.classList.toggle("entity-container");
  tasksContainerHeader!.classList.toggle("hidden-element");
  submitTaskFormBtn!.classList.toggle("hidden-element");
}

function hideKudoBoard() {
  todoTasksContainer!.innerHTML = "";
  doingTasksContainer!.innerHTML = "";
  doneTasksContainer!.innerHTML = "";
}

function getStoryName(storyId: string): string {
  const key = storiesKeyIdentifier + chosenProject!.id;
  const storiesString = localStorage.getItem(key);
  const stories: Story[] = storiesString ? JSON.parse(storiesString) : [];
  const story: Story | undefined = stories.find(
    (story) => story.id === storyId
  );
  return story!.name;
}

function moveTaskBack(task: DoingTask | DoneTask) {
  if (task.status === Status.Doing) {
    const updatedTask = updateTaskToToDo(task);
    if (updatedTask) {
      saveTask(updatedTask);
    }
  } else if (task.status === Status.Done) {
    const updatedTask = updateTaskToDoing(task);
    if (updatedTask) {
      saveTask(updatedTask);
    }
  }
}

function getAssignees(): User[] {
  return Object.keys(localStorage)
    .filter(
      (key) => key.startsWith("user-DevOps") || key.startsWith("user-Developer")
    )
    .map((key) => JSON.parse(localStorage[key]));
}

function onNewTask(e: Event) {
  const { name, description, priority, storyId, estimatedFinishDate } =
    getTasksFormData();

  if (!name || !description || !priority || !storyId || !estimatedFinishDate) {
    alert("Fill the form!");
    return;
  }

  const task = createTask(
    name,
    description,
    priority as Priority,
    storyId,
    estimatedFinishDate
  );
  saveTask(task as TodoTask);
  showTasks();
}

function createTask(
  name: string,
  description: string,
  priority: Priority,
  storyId: string,
  estimatedFinishDate: string
): TodoTask {
  const id = tasksKeyIdentifier + self.crypto.randomUUID();
  const createdDate = new Date();
  const owner = loggedUser;

  if (owner)
    return {
      id,
      name,
      description,
      priority,
      storyId,
      estimatedFinishDate: new Date(estimatedFinishDate),
      status: Status.ToDo,
      createdDate,
    };
  throw new Error("Unable to create story.");
}

function updateTaskToToDo(task: DoingTask): DoingTask {
  return {
    ...task,
    status: Status.ToDo,
    assigneeId: "",
  };
}

function updateTaskToDoing(task: TodoTask | DoneTask): DoingTask | null {
  if (task.status === Status.Done) {
    return {
      ...(task as DoneTask),
      status: Status.Doing,
    };
  }

  const selectedAssignee = document.getElementById(
    "assigneeSelect"
  ) as HTMLSelectElement | null;
  console.log(selectedAssignee);
  console.log(selectedAssignee!.value);

  if (!selectedAssignee!.value) {
    alert("Choose assignee");
    return null;
  }

  const doingTask: DoingTask = {
    ...task,
    startedDate: new Date(),
    status: Status.Doing,
    assigneeId: selectedAssignee!.value,
  };

  return doingTask;
}

function updateTaskToDone(task: DoingTask): DoneTask | null {
  const doneTask: DoneTask = {
    ...task,
    finishedDate: new Date(),
    status: Status.Done,
  };

  return doneTask;
}

function saveTask(task: TodoTask | DoingTask | DoneTask) {
  localStorage.setItem(task.id, JSON.stringify(task));
  showTasks();
}

function getTasksFormData() {
  const name: string = taskNameInput.value.trim();
  const description: string = taskDescriptionInput.value.trim();
  const priority: string = taskPriorityInput.value;
  const storyId: string = taskStoryInput.value;
  const estimatedFinishDate: string = estimatedFinishDateInput.value;

  return { name, description, priority, storyId, estimatedFinishDate };
}

function toggleTasks(): void {
  tasksH3!.classList.toggle("h3-element");
  taskFormContainer!.classList.toggle("form-container");
  tasksContainer!.classList.toggle("entity-container");
  tasksH3!.classList.toggle("hidden-element");
  // taskDropdown!.classList.toggle("hidden-element");
  taskFormContainer!.classList.toggle("hidden-element");
  tasksContainer!.classList.toggle("hidden-element");
}

//users
function createUser(firstName: string, lastName: string, role: Role): void {
  const user = localStorage.getItem(`user-${firstName}${lastName}`);
  if (!user) {
    const user = new User(self.crypto.randomUUID(), firstName, lastName, role);
    localStorage.setItem(`user-${firstName}${lastName}`, JSON.stringify(user));
    return;
  }
  // alert("User with this username alreadt exists");
}

function getUser(firstName: string, lastName: string): User | null {
  const userString = localStorage.getItem(`user-${firstName}${lastName}`);
  if (userString) {
    const userData = JSON.parse(userString);
    return new User(
      userData.id,
      userData.firstName,
      userData.lastName,
      userData.Role
    );
  }
  return null;
}

function getUserById(userId: string) {
  const users: User[] = [];

  for (const key of Object.keys(localStorage)) {
    if (key.startsWith("user")) {
      const userData = localStorage.getItem(key);
      if (userData) {
        const user: User = JSON.parse(userData);
        if (typeof user === "object" && user !== null) {
          users.push(user);
        }
      }
    }
  }

  return users.find((user) => user.id == userId);
}

function mockLoggedUser(): void {
  createUser("AdminFirstName", "AdminLastName", Role.Admin);
  createUser("DevOpsFirstName", "DevOpsLastName", Role.DevOps);
  createUser("DeveloperFirstName", "DeveloperLastName", Role.Developer);
  const user = getUser("AdminFirstName", "AdminLastName");
  user!.login();
}

storyDropdown.addEventListener("change", showStories);
showTasksBtn?.addEventListener("click", handleShowTasksBtn);

mockLoggedUser();
showProjects();
