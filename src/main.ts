import Project, { IProject } from "./db/models/project";
import { Story, IStory, Priority, Status } from "./db/models/story";
import { User, Role, IUser } from "./db/models/user";
import { Task, ITask } from "./db/models/task";

const mainContainer = document.getElementById("main");
const toggleNightModeBtn = document.getElementById("toggle-night-mode-btn");
//projects
const projectCreateForm = document.getElementById("project-create-form");
const projectsContainer = document.getElementById("projects-container");
const projectFormContainer = document.getElementById("project-form-container");
const projectsH3 = document.getElementById("projects-h3");
//stories
const storyCreateForm = document.getElementById("story-form-container");
const showTasksBtn = document.getElementById("showTasksBtn");
const showProjectsBtn = document.getElementById("showProjectsBtn");
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
const loginForm = document.getElementById("login-form");
const showStoriesBtn = document.getElementById("showStoriesBtn");
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
//login form
const loginFormContainer = document.getElementById("login-form-container");

let nightModeOn = false;

let loggedUser: IUser | null = null;
let chosenProject: IProject | null = null;

loginForm!.addEventListener("submit", function (e) {
  e.preventDefault();
  onLogin(e);
});

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

// type TodoTask = {
//   id: string; //?
//   name: string;
//   description: string;
//   priority: Priority;
//   storyId: string;
//   estimatedFinishDate: Date;
//   status: Status;
//   createdDate: Date;
// };

// type DoingTask = {
//   id: string; //?
//   name: string;
//   description: string;
//   priority: Priority;
//   storyId: string;
//   estimatedFinishDate: Date;
//   status: Status;
//   createdDate: Date;
//   startedDate: Date;
//   assigneeId: string;
// };

// type DoneTask = {
//   id: string; //?
//   name: string;
//   description: string;
//   priority: Priority;
//   storyId: string;
//   estimatedFinishDate: Date;
//   status: Status;
//   createdDate: Date;
//   startedDate: Date;
//   finishedDate: Date;
//   assigneeId: string;
// };

// class User {
//   id: string;
//   username: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   loggedIn: boolean;
//   role: Role;

//   constructor(
//     id: string,
//     username: string,
//     password: string,
//     firstName: string,
//     lastName: string,
//     role: Role
//   ) {
//     this.id = id;
//     this.username = username;
//     this.password = password;
//     this.firstName = firstName;
//     this.lastName = lastName;
//     this.loggedIn = false;
//     this.role = role;
//   }

//   login(): void {
//     loggedUser = this;
//     this.loggedIn = true;
//     toggleLoginFormVisibility();
//     toggleProjectsElementsVisibility();
//     showProjects();
//   }

//   logout(): void {
//     loggedUser = null;
//     this.loggedIn = false;
//     toggleLoginFormVisibility();
//     toggleProjectsElementsVisibility();
//   }
// }

function getProjectFormData() {
  const nameInput = document.getElementById("project-name") as HTMLInputElement;
  const descriptionInput = document.getElementById(
    "project-description"
  ) as HTMLInputElement;

  const name: string = nameInput.value.trim();
  const description: string = descriptionInput.value.trim();
  return { name, description };
}

async function onNewProject(e: Event) {
  const { name, description } = getProjectFormData();

  if (!name || !description) {
    alert("Fill the form!");
    return;
  }

  const project = createProject(name, description);
  await saveProject(project);
  showProjects();
}

async function saveProject(project: IProject) {
  try {
    const response = await fetch("http://localhost:3000/ManageMeDB/project/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      throw new Error(`HTTP error. Status: ${response.status}`);
    }

    const savedProject: IProject = await response.json();
    return savedProject;
  } catch (error) {
    console.error("Failed to save project:", error);
    throw error;
  }
}

function createProject(name: string, description: string): IProject {
  return new Project({
    name,
    description,
  });
}

async function showProjects(): Promise<void> {
  toggleContainerNightMode();
  projectsContainer!.innerHTML = "";
  try {
    const projects = await fetchProjects();
    projects.forEach((project) => {
      showSingleProject(project);
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
}

async function fetchProjects(): Promise<IProject[]> {
  try {
    const response = await fetch("http://localhost:3000/ManageMeDB/project/");
    if (!response.ok) {
      throw new Error(`HTTP error. Status: ${response.status}`);
    }
    const projects: IProject[] = await response.json();
    return projects;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    throw error;
  }
}

function toggleLoginFormVisibility() {
  loginFormContainer!.classList.toggle("hidden-element");
}

function toggleProjectsElementsVisibility() {
  projectCreateForm!.classList.toggle("hidden-element");
  projectsContainer!.classList.toggle("hidden-element");
  projectFormContainer!.classList.toggle("hidden-element");
  projectsH3!.classList.toggle("hidden-element");
}

function showSingleProject(project: IProject): void {
  let projectDiv = document.createElement("div");
  let projectSpan = document.createElement("span");
  let deleteProjectBtn = document.createElement("button");
  let updateProjectBtn = document.createElement("button");
  let chooseProjectBtn = document.createElement("button");

  projectSpan.innerHTML = `name: ${project.name}, description: ${project.description}`;
  projectSpan.addEventListener("click", () =>
    markProjectOut(projectDiv, project._id)
  );
  deleteProjectBtn.classList.add("project-button");
  deleteProjectBtn.innerText = "Delete";
  deleteProjectBtn.addEventListener("click", () =>
    handleDeleteProjectClick(project._id)
  );

  updateProjectBtn.classList.add("project-button");
  updateProjectBtn.innerText = "Update";
  updateProjectBtn.addEventListener("click", () =>
    updateProject(project, projectDiv, projectSpan)
  );

  chooseProjectBtn.classList.add("project-button");
  chooseProjectBtn.innerText = "Choose";
  chooseProjectBtn.addEventListener("click", () =>
    handleChooseProjectBtn(project._id)
  );

  projectDiv!.appendChild(projectSpan);
  projectDiv!.appendChild(deleteProjectBtn);
  projectDiv!.appendChild(updateProjectBtn);
  projectDiv!.appendChild(chooseProjectBtn);
  projectsContainer!.appendChild(projectDiv);
}

function markProjectOut(projectDiv: HTMLDivElement, projectId: string): void {
  const selectedProject: HTMLDivElement | null =
    document.querySelector(".marked");
  if (selectedProject) {
    selectedProject.classList.toggle("marked");
  }

  projectDiv.classList.toggle("marked");
}

async function handleDeleteProjectClick(projectId: string) {
  await deleteProject(projectId);
  showProjects();
}

async function deleteProject(projectId: string) {
  try {
    const response = await fetch(
      `http://localhost:3000/ManageMeDB/project/${projectId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error. Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to delete project:", error);
    throw error;
  }
}

async function handleChooseProjectBtn(projectId: string) {
  if (chosenProject && chosenProject.id != projectId) {
    chosenProject = null;
  }

  await chooseProject(projectId);
  showStories();
}

async function chooseProject(projectId: string) {
  chosenProject = await fetchProject(projectId);
  // localStorage.setItem("chosenProject", JSON.stringify(chosenProject));
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
  project: IProject,
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

async function handleSaveUpdatedProject(
  project: IProject,
  name: string,
  description: string
) {
  await saveUpdatedProject(project, name, description);
  showProjects();
}

async function saveUpdatedProject(
  project: IProject,
  newName: string,
  newDescription: string
) {
  const name = newName || project.name;
  const description = newDescription || project.description;

  const updatedProject: Partial<IProject> = {
    _id: project._id,
    name,
    description,
  };

  try {
    const response = await fetch(
      `http://localhost:3000/ManageMeDB/project/${project._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProject),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error. Status: ${response.status}`);
    }

    const updatedProjectData: IProject = await response.json();
    return updatedProjectData;
  } catch (error) {
    console.error("Failed to update project:", error);
    throw error;
  }
}

async function fetchProject(projectId: string): Promise<IProject | null> {
  try {
    const response = await fetch(
      `http://localhost:3000/ManageMeDB/project/${projectId}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error. Status: ${response.status}`);
    }
    const project: IProject = await response.json();
    return project;
  } catch (error) {
    console.error("Failed to fetch project:", error);
    throw error;
  }
}

function handleShowProjectsBtn() {
  projectFormContainer?.classList.toggle("form-container");
  projectsContainer!.classList.toggle("entity-container");
  toggleStories();
  toggleProjectsElementsVisibility();
}

//stories
function getStoriesFormData() {
  const name: string = storyNameInput.value.trim();
  const description: string = storyDescriptionInput.value.trim();
  const priority: string = storyPriorityInput.value;
  const status: string = storyStatusInput.value;
  return { name, description, priority, status };
}

async function onNewStory(e: Event) {
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
  console.log("story we savin");
  console.log(story);
  await saveStory(story as IStory);
  showStories();
}

async function saveStory(story: IStory): Promise<IStory> {
  try {
    const response = await fetch("http://localhost:3000/ManageMeDB/story", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(story),
    });

    if (!response.ok) {
      throw new Error(`HTTP error. Status: ${response.status}`);
    }

    const savedStory: IStory = await response.json();
    return savedStory;
  } catch (error) {
    console.error("Failed to save story:", error);
    throw error;
  }
}

function createStory(
  name: string,
  description: string,
  priority: Priority,
  status: Status
): IStory {
  const project = chosenProject;
  const createdDate = new Date();
  const owner = loggedUser; //poprawic jak bedzie przez api tworzenie ownera bo teraz sie nie pokrywa

  console.log("Creating story with owner:", owner);

  if (project && owner) {
    const newStory = new Story({
      name,
      description,
      priority,
      project: project._id,
      createdDate,
      status,
      // owner: owner.id,
      owner: "667737f4f9b8bc1f1d99ad95",
    });

    return newStory;
  } else {
    throw new Error("Project or owner not found.");
  }
}

async function fetchStories(chosenProjectId: string): Promise<IStory[]> {
  try {
    const response = await fetch(
      `http://localhost:3000/ManageMeDB/story?projectId=${chosenProjectId}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error. Status: ${response.status}`);
    }
    const stories: IStory[] = await response.json();
    return stories;
  } catch (error) {
    console.error("Failed to fetch stories:", error);
    throw error;
  }
}

async function showStories(): Promise<void> {
  const allStories = await fetchStories(chosenProject!._id);
  const selectedStatus = storyDropdown!.value;
  let stories: IStory[];
  if (selectedStatus == "All") {
    stories = allStories;
  } else {
    stories = allStories.filter((s) => s.status == selectedStatus);
  }
  storiesContainer!.innerHTML = "";

  stories.forEach((story: IStory) => {
    let storyDiv = document.createElement("div");
    let storySpan = document.createElement("span");
    let deleteStoryBtn = document.createElement("button");
    let updateStoryBtn = document.createElement("button");
    storySpan.innerHTML = `Name: ${story.name}, Description: ${story.description}, Priority: ${story.priority}, Created Date: ${story.createdDate}, Status: ${story.status}, Owner: ${story.owner}`;
    storySpan.addEventListener("click", () => markStoryOut(storyDiv));

    deleteStoryBtn.classList.add("story-button");
    deleteStoryBtn.innerText = "Delete";
    deleteStoryBtn.addEventListener("click", () =>
      handleDeleteStoryClick(story._id)
    );

    updateStoryBtn.classList.add("story-button");
    updateStoryBtn.innerText = "Update";
    updateStoryBtn.addEventListener("click", () =>
      handleUpdateStoryClick(story, storyDiv, storySpan)
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

function handleUpdateStoryClick(
  story: IStory,
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

async function handleSaveUpdatedStory(story: IStory): Promise<void> {
  await saveUpdatedStory(story);
  showStories();
}

async function saveUpdatedStory(story: IStory): Promise<IStory> {
  let updatedStoryInput = getStoriesFormData();
  const name = updatedStoryInput.name;
  const description = updatedStoryInput.description;
  const priority = updatedStoryInput.priority as Priority;
  const project = story.project;
  const status = updatedStoryInput.status as Status;

  const updatedStory: Partial<IStory> = {
    name,
    description,
    priority,
    project,
    status,
  };

  try {
    const response = await fetch(
      `http://localhost:3000/ManageMeDB/story/${story._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStory),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error. Status: ${response.status}`);
    }

    const savedStory: IStory = await response.json();
    return savedStory;
  } catch (error) {
    console.error("Failed to update story:", error);
    throw error;
  }
}

async function handleDeleteStoryClick(storyId: string) {
  await deleteStory(storyId);
  showStories();
}

async function deleteStory(storyId: string) {
  try {
    const response = await fetch(
      `http://localhost:3000/ManageMeDB/story/${storyId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error. Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to delete project:", error);
    throw error;
  }
}

function toggleStories(): void {
  showProjectsBtn?.classList.toggle("hidden-element");

  storiesH3!.classList.toggle("h3-element");
  storyFormContainer!.classList.toggle("form-container");
  storiesContainer!.classList.toggle("entity-container");
  storiesH3!.classList.toggle("hidden-element");
  storyDropdown!.classList.toggle("hidden-element");
  storyFormContainer!.classList.toggle("hidden-element");
  storiesContainer!.classList.toggle("hidden-element");
  showTasksBtn!.classList.toggle("hidden-element");
  toggleContainerNightMode();
}

//tasks

function handleShowStoriesBtn() {
  // projectFormContainer?.classList.toggle("form-container");
  // projectsContainer!.classList.toggle("entity-container");
  toggleStories();
  toggleTasks();
}

async function handleShowTasksBtn() {
  toggleStories();
  toggleTasks();
  const currentDate = new Date().toISOString().slice(0, 10);
  estimatedFinishDateInput.value = currentDate;
  estimatedFinishDateInput.min = currentDate;
  estimatedFinishDateInput.max = "2035-01-01";

  taskStoryInput.innerHTML = "";
  const allStories = await fetchStories(chosenProject?._id);
  let openStories = allStories.filter((s) => s.status != Status.Done);
  openStories.forEach((story) => {
    let optionElement = document.createElement("option");
    optionElement.value = story._id;
    optionElement.text = story.name;

    taskStoryInput.appendChild(optionElement);
  });
  showTasks();
}

async function fetchTasks() {
  try {
    const response = await fetch("http://localhost:3000/ManageMeDB/task/");

    if (!response.ok) {
      throw new Error(`HTTP error. Status: ${response.status}`);
    }

    const tasks: ITask[] = await response.json();
    return tasks;
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    throw error;
  }
}

async function showTasks() {
  toggleContainerNightMode();
  todoTasksContainer!.innerHTML = "";
  doingTasksContainer!.innerHTML = "";
  doneTasksContainer!.innerHTML = "";

  const tasks = await fetchTasks();

  tasks.forEach(async (task) => {
    let singleTaskDiv = document.createElement("div");

    let singleTaskName = document.createElement("span");
    singleTaskName.innerHTML = `Task name: ${task.name}`;

    let singleTaskAssignee = document.createElement("span");
    const assignee = await fetchUser(task.assigneeId);
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

async function showModal(task: ITask) {
  if (modalContentDiv) {
    modalContentDiv.innerHTML = "";

    let singleTaskName = document.createElement("span");
    singleTaskName.innerHTML = `Task Name: ${task.name}`;

    let singleTaskDescription = document.createElement("span");
    singleTaskDescription.innerHTML = `Task Description: ${task.description}`;

    let singleTaskPriority = document.createElement("span");
    singleTaskPriority.innerHTML = `Task Priority: ${task.priority}`;

    // const storyName = getStoryName(task.storyId);
    const storyName = "story name mock";
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
    const users: IUser[] = await fetchUsers();
    const assignees = users.filter((u) => u.role != Role.Admin);
    assignees.forEach((assignee) => {
      let assigneeOption = document.createElement("option");

      assigneeOption.value = assignee._id;
      assigneeOption.text = `${assignee.firstName} ${assignee.lastName}`;
      assigneeSelect.appendChild(assigneeOption);
    });

    let editTaskBtn = document.createElement("button");
    editTaskBtn.id = "editTaskBtn";
    editTaskBtn.innerHTML = "Edit";
    editTaskBtn.addEventListener("click", function () {
      handleEditTaskBtnClick(task);
    });

    let deleteTaskBtn = document.createElement("button");
    deleteTaskBtn.id = "deleteTaskBtn";
    deleteTaskBtn.innerHTML = "Delete";
    deleteTaskBtn.addEventListener("click", function () {
      handleDeleteTaskBtnClick(task.id);
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
    modalContentDiv.appendChild(deleteTaskBtn);

    taskModalDiv!.style.display = "block";
    modalContentDiv.classList.remove("hidden-element");
    closeModalBtn!.classList.remove("hidden-element");

    closeModalBtn!.addEventListener("click", () => closeModal());
  }
}

function handleDeleteTaskBtnClick(taskId: string) {
  localStorage.removeItem(taskId);
  showTasks();
  closeModal();
}

function closeModal() {
  taskModalDiv!.style.display = "none";
  modalContentDiv!.classList.add("hidden-element");
  closeModalBtn!.classList.add("hidden-element");
}

function handleEditTaskBtnClick(task: ITask) {
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

async function handleSaveUpdatedTaskBtn(
  task: ITask,
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
  await updateTask(task._id, task);
  toggleElementsVisibility();
  showTasks();
}

async function updateTask(taskId: string, task: ITask) {
  console.log("update task");
  console.log(task);
  try {
    const response = await fetch(
      `http://localhost:3000/ManageMeDB/task/${taskId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error. Status: ${response.status}`);
    }

    const savedTask: IStory = await response.json();
    return savedTask;
  } catch (error) {
    console.error("Failed to update task:", error);
    throw error;
  }
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
  saveTask(task);
  showTasks();
}

function createTask(
  name: string,
  description: string,
  priority: Priority,
  storyId: string,
  estimatedFinishDate: string
): ITask {
  // const id = tasksKeyIdentifier + self.crypto.randomUUID();
  const createdDate = new Date();
  const owner = loggedUser;

  if (owner)
    return {
      name,
      description,
      priority,
      storyId,
      estimatedFinishDate: new Date(estimatedFinishDate),
      status: Status.ToDo,
      createdDate,
    } as ITask;
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

async function saveTask(task: ITask) {
  await postTask(task);
  showTasks();
}

async function postTask(task: ITask) {
  console.log(JSON.stringify(task));
  console.log(task);
  //todo rename
  try {
    const response = await fetch("http://localhost:3000/ManageMeDB/task/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error(`HTTP error. Status: ${response.status}`);
    }

    const savedTask: ITask = await response.json();
    return savedTask;
  } catch (error) {
    console.error("Failed to save task:", error);
    throw error;
  }
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
  showStoriesBtn?.classList.toggle("hidden-element");
  tasksH3!.classList.toggle("h3-element");
  taskFormContainer!.classList.toggle("form-container");
  tasksContainer!.classList.toggle("tasks-container");
  tasksH3!.classList.toggle("hidden-element");
  // taskDropdown!.classList.toggle("hidden-element");
  taskFormContainer!.classList.toggle("hidden-element");
  tasksContainer!.classList.toggle("hidden-element");
}

//users
function createUser(
  username: string,
  password: string,
  firstName: string,
  lastName: string,
  role: Role
): IUser {
  const loggedIn = false;
  // const user = localStorage.getItem(`user-${username}`);
  return new User({
    username,
    password,
    loggedIn,
    firstName,
    lastName,
    role,
  });
  // alert("User with this username alreadt exists");
}

// function getUserByUsername(username: string): User | null {
//   const userString = localStorage.getItem(`user-${username}`);
//   if (userString) {
//     const userData = JSON.parse(userString);
//     return new User(
//       userData.id,
//       userData.username,
//       userData.password,
//       userData.firstName,
//       userData.lastName,
//       userData.Role
//     );
//   }
//   return null;
// }

// function getUserById(userId: string) {
//   const users: User[] = [];

//   for (const key of Object.keys(localStorage)) {
//     if (key.startsWith("user")) {
//       const userData = localStorage.getItem(key);
//       if (userData) {
//         const user: User = JSON.parse(userData);
//         if (typeof user === "object" && user !== null) {
//           users.push(user);
//         }
//       }
//     }
//   }

//   return users.find((user) => user.id == userId);
// }

async function saveUser(user: IUser) {
  console.log("save user");
  console.log(user);
  console.log(JSON.stringify(user));
  try {
    const response = await fetch("http://localhost:3000/ManageMeDB/user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error(`HTTP error. Status: ${response.status}`);
    }

    const savedUser: IUser = await response.json();
    console.log("saveUser");
    console.log(savedUser._id);

    return savedUser;
  } catch (error) {
    console.error("Failed to save user:", error);
    throw error;
  }
}

async function fetchUsers() {
  try {
    const response = await fetch("http://localhost:3000/ManageMeDB/user/");

    if (!response.ok) {
      throw new Error(`HTTP error. Status: ${response.status}`);
    }

    const users: IUser[] = await response.json();
    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
}

async function fetchUser(userId: string) {
  try {
    const response = await fetch(
      `http://localhost:3000/ManageMeDB/user/${userId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error. Status: ${response.status}`);
    }

    const user: IUser = await response.json();
    return user;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    // throw error;
    return null;
  }
}

async function mockUsers(): Promise<void> {
  const existingUsers = await fetchUsers();

  let admin: IUser | undefined = existingUsers.find(
    (u) => u.username == "admin1"
  );
  if (admin == null) {
    const newAdmin = await createUser(
      "admin1",
      "adminpwd",
      "AdminFirstName",
      "AdminLastName",
      Role.Admin
    );

    admin = await saveUser(newAdmin);
  }

  let devops: IUser | undefined = existingUsers.find(
    (u) => u.username == "devops1"
  );
  if (devops == null) {
    devops = await createUser(
      "devops1",
      "devopspwd",
      "DevOpsFirstName",
      "DevOpsLastName",
      Role.DevOps
    );

    await saveUser(devops);
  }

  let dev: IUser | undefined = existingUsers.find((u) => u.username == "dev1");
  if (dev == null) {
    dev = await createUser(
      "dev1",
      "devpwd",
      "DeveloperFirstName",
      "DeveloperLastName",
      Role.Developer
    );

    await saveUser(dev);
  }

  await handleUserLoginLogout(admin, true);
}

async function handleUserLoginLogout(user: IUser, logIn: boolean) {
  const loggedIn = logIn;

  const updatedUser: Partial<IUser> = {
    loggedIn,
  };

  await updateUserLogIn(user, updatedUser);

  if (updatedUser.loggedIn) {
    loggedUser = user;
  }
  toggleLogInForm();
}

async function updateUserLogIn(user: IUser, updatedUser: Partial<IUser>) {
  try {
    const response = await fetch(
      `http://localhost:3000/ManageMeDB/user/${user._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error. Status: ${response.status}`);
    }

    const savedUser: IUser = await response.json();
    return savedUser;
  } catch (error) {
    console.error("Failed to save user:", error);
    throw error;
  }
}

function toggleLogInForm(): void {
  toggleLoginFormVisibility();
  toggleProjectsElementsVisibility();
  showProjects();
}

function getLoginFormData() {
  const usernameInput = document.getElementById(
    "username-input"
  ) as HTMLInputElement;
  const passwordInput = document.getElementById(
    "password-input"
  ) as HTMLInputElement;

  const username: string = usernameInput.value;
  const password: string = passwordInput.value;
  return { username, password };
}

async function onLogin(e: Event) {
  e.preventDefault();
  const { username, password } = getLoginFormData();

  if (!username || !password) {
    alert("Fill the form!");
    return;
  }

  const user = getUserByUsername(username);
  if (!user || user.password != password) {
    alert("Incorrect credentials");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    if (data.token) {
      user.login();
    }
    // Store token
  } catch (error) {
    console.error("Error:", error);
  }
}

function handleToggleNightMode() {
  if (nightModeOn == false) {
    nightModeOn = true;
    document.body.style.backgroundColor = "#1f1f1f";
    document.body.style.color = "white";
  } else {
    nightModeOn = false;
    document.body.style.backgroundColor = "bisque";
    document.body.style.color = "black";
  }
  toggleContainerNightMode();
}

function toggleContainerNightMode() {
  const containers = document.querySelectorAll(".entity-container");

  if (nightModeOn == true) {
    containers.forEach((container) => {
      container.classList.add("entity-container-night-mode");
    });
  } else {
    containers.forEach((container) => {
      container.classList.remove("entity-container-night-mode");
    });
  }
}

storyDropdown.addEventListener("change", showStories);
showTasksBtn?.addEventListener("click", handleShowTasksBtn);
showProjectsBtn?.addEventListener("click", handleShowProjectsBtn);
showStoriesBtn?.addEventListener("click", handleShowStoriesBtn);
toggleNightModeBtn!.addEventListener("click", handleToggleNightMode);

mockUsers();
// await mockUsers();
// showProjects();
