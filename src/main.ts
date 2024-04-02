const mainContainer = document.getElementById("main");
const projectCreateForm = document.getElementById("project-create-form");
const projectsContainer = document.getElementById("projects-container");
const projectFormContainer = document.getElementById("project-form-container");
const projectsH3 = document.getElementById("projects-h3");
const storyCreateForm = document.getElementById("story-form-container");
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
  "priority"
) as HTMLSelectElement;
const storyStatusInput = document.getElementById("status") as HTMLSelectElement;

const storiesKeyIdentifier = "stories-";
let loggedUser: User | null = null;
let chosenProject: Project | null = null;

projectCreateForm!.addEventListener("submit", function (e) {
  e.preventDefault();
  onNewProject(e);
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

class User {
  id: string;
  firstName: string;
  lastName: string;
  loggedIn: boolean;

  constructor(id: string, firstName: string, lastName: string) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.loggedIn = false;
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
  toggleClasses();
}

function toggleClasses(): void {
  projectsH3!.classList.toggle("h3-element");
  projectFormContainer!.classList.toggle("form-container");
  projectsContainer!.classList.toggle("entity-container");
  projectsH3!.classList.toggle("hidden-element");
  projectFormContainer!.classList.toggle("hidden-element");
  projectsContainer!.classList.toggle("hidden-element");

  storiesH3!.classList.toggle("h3-element");
  storyFormContainer!.classList.toggle("form-container");
  storiesContainer!.classList.toggle("entity-container");
  storiesH3!.classList.toggle("hidden-element");
  storyDropdown!.classList.toggle("hidden-element");
  storyFormContainer!.classList.toggle("hidden-element");
  storiesContainer!.classList.toggle("hidden-element");
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

function showStories(): void {
  const storedChosenProject = JSON.parse(
    localStorage.getItem("chosenProject") || "null"
  );
  const key = storiesKeyIdentifier + storedChosenProject!.id;
  const storiesString = localStorage.getItem(key);
  const allStories: Story[] = storiesString ? JSON.parse(storiesString) : [];
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
  console.log(projectStoriesKey);
  console.log(localStorage);
  const storiesString = localStorage.getItem(projectStoriesKey);
  const stories: Story[] = storiesString ? JSON.parse(storiesString) : [];
  let newStories = stories.filter(({ id }) => id !== storyId);

  localStorage.setItem(projectStoriesKey, JSON.stringify(newStories));
  showStories();
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

function createUser(firstName: string, lastName: string): void {
  const user = localStorage.getItem(`user-${firstName}${lastName}`);
  if (!user) {
    const user = new User(self.crypto.randomUUID(), firstName, lastName);
    localStorage.setItem(`user-${firstName}${lastName}`, JSON.stringify(user));
    return;
  }
  // alert("User with this username alreadt exists");
}

function getUser(firstName: string, lastName: string): User | null {
  const userString = localStorage.getItem(`user-${firstName}${lastName}`);
  if (userString) {
    const userData = JSON.parse(userString);
    return new User(userData.id, userData.firstName, userData.lastName);
  }
  return null;
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

function mockLoggedUser(): void {
  createUser("mock", "mockowski");
  const user = getUser("mock", "mockowski");
  user!.login();
}

storyDropdown.addEventListener("change", showStories);

mockLoggedUser();
showProjects();
