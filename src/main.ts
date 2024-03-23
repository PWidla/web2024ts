const mainContainer = document.getElementById("main");
const projectCreateForm = document.getElementById("project-create-form");
const projectsContainer = document.getElementById("projects-container");
const projectFormContainer = document.getElementById("project-form-container");
const projectsH3 = document.getElementById("projects-h3");
const storiesContainer = document.getElementById("stories-container");
const storyFormContainer = document.getElementById("story-form-container");
const storiesH3 = document.getElementById("stories-h3");
let loggedUser: User| null = null;
let chosenProject: string | null = null;

projectCreateForm!.addEventListener("submit", function (e) {
    e.preventDefault();
    onNewProject(e);
});

type Project = {
    id: string;
    name: string;
    description: string;
}

type Story = {
    id: string;
    name: string;
    description: string;
    priority: Priority;
    project: Project;
    createdDate: Date;
    status: Status
    owned: User;
}

enum Priority {
    Low = 0,
    Medium = 1,
    High = 2
}

enum Status {
    ToDo = 0,
    Doing = 1,
    Done = 2
}

class User{
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

function getFormData() {
    const nameInput = document.getElementById("project-name") as HTMLInputElement
    const descriptionInput = document.getElementById("project-description") as HTMLInputElement
 
    const name: string = nameInput.value.trim()
    const description: string = descriptionInput.value.trim()
    return {name, description}
}

function onNewProject(e: Event) {
    const { name, description } = getFormData()
    
    if (!name || !description) {
        alert("Fill the form!")
        return
    }
 
    const project = createProject(name, description)
    saveProject(project)
    showProjects()
}

function saveProject(project: Project) {
    localStorage.setItem(project.id, JSON.stringify(project));
}

function createProject(name: string, description: string): Project {
    const id = self.crypto.randomUUID()
    return {
        id,
        name,
        description
    }
}

function showProjects() : void{
    projectsContainer!.innerHTML='';
    for (const key of Object.keys(localStorage)) {
        const item = JSON.parse(localStorage.getItem(key) || 'null');
        if (item) {
          showSingleProject(item);
        }
      }
}

function showSingleProject(project: Project) : void{
    let projectDiv = document.createElement('div');
    let projectSpan = document.createElement('span');
    let deleteProjectBtn = document.createElement('button');
    let updateProjectBtn = document.createElement('button');
    let chooseProjectBtn = document.createElement('button');

    projectSpan.innerHTML = `name: ${project.name}, description: ${project.description}`;
    projectSpan.addEventListener("click", () => markProjectOut(projectDiv));
    deleteProjectBtn.classList.add("project-button");
    deleteProjectBtn.innerText="Delete";
    deleteProjectBtn.addEventListener("click", () => handleDeleteClick(project.id));

    updateProjectBtn.classList.add("project-button");
    updateProjectBtn.innerText="Update";
    updateProjectBtn.addEventListener("click", () => updateProject(project,projectDiv, projectSpan));

    chooseProjectBtn.classList.add("project-button");
    chooseProjectBtn.innerText="Choose";
    chooseProjectBtn.addEventListener("click", () => handleChooseProjectBtn(project.id));

    projectDiv!.appendChild(projectSpan);
    projectDiv!.appendChild(deleteProjectBtn);
    projectDiv!.appendChild(updateProjectBtn);
    projectDiv!.appendChild(chooseProjectBtn);
    projectsContainer!.appendChild(projectDiv);
}

function markProjectOut(projectDiv: HTMLDivElement): void{
    projectDiv.classList.toggle("marked");
}

function handleDeleteClick(projectId: string){
    deleteProject(projectId);
    showProjects();
}

function deleteProject(projectId: string){
    localStorage.removeItem(projectId);
    showProjects();
}

function handleChooseProjectBtn(projectId: string){
    chooseProject(projectId);
    showStoriesForProject(projectId);
}

function chooseProject(projectId: string){
    chosenProject = projectId;
    localStorage.setItem("chosenProject", projectId)
}

function toggleClasses(): void{
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
    storyFormContainer!.classList.toggle("hidden-element");
    storiesContainer!.classList.toggle("hidden-element");
}

function showStoriesForProject(projectId: string){
    toggleClasses();
}

function updateProject(project: Project, projectDiv: HTMLDivElement, projectSpan: HTMLSpanElement){
    projectSpan.classList.add('beingUpdated');

    let labelForname = document.createElement('label');
    labelForname.setAttribute("for", "inputname");
    var labelFornameText = document.createTextNode("name");
    labelForname.appendChild(labelFornameText);
    let inputForname = document.createElement('input');
    inputForname.setAttribute("type", "text");
    inputForname.placeholder = project.name;

    let labelFordescription = document.createElement('label');
    labelFordescription.setAttribute("for", "inputdescription");
    var labelFordescriptionText = document.createTextNode("description");
    labelFordescription.appendChild(labelFordescriptionText);
    let inputFordescription = document.createElement('input');
    inputFordescription.setAttribute("type", "text");
    inputFordescription.placeholder = project.description;

    let saveUpdatedProjectBtn = document.createElement('button');
    saveUpdatedProjectBtn.innerText="Save";
    saveUpdatedProjectBtn.addEventListener("click", () => handleSaveUpdatedProject(project, inputForname.value, inputFordescription.value));

    projectDiv.append(labelForname);
    projectDiv.append(inputForname);
    projectDiv.append(labelFordescription);
    projectDiv.append(inputFordescription);
    projectDiv.append(saveUpdatedProjectBtn);
}

function handleSaveUpdatedProject(project: Project, name: string, description: string){
    saveUpdatedProject(project, name, description);
    showProjects();
}

function saveUpdatedProject(project: Project, name: string, description: string){
    let retrievedProject: Project | null = null;
    const storedProject = localStorage.getItem(project.id);
    
    if (storedProject) {
        retrievedProject = JSON.parse(storedProject);
    }
    retrievedProject!.name = name;
    retrievedProject!.description = description;

    localStorage.setItem(retrievedProject!.id, JSON.stringify(retrievedProject!));
}

function createUser(firstName: string, lastName: string): void{
    const user = localStorage.getItem(`user-${firstName}${lastName}`);
    if(!user)
    {
        const user = new User(
            self.crypto.randomUUID(),
            firstName,
            lastName
        )
        localStorage.setItem(`user-${firstName}${lastName}`, JSON.stringify(user))
        return
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

function mockLoggedUser(): void {
    createUser("mock", "mockowski");
    const user = getUser("mock", "mockowski");
    user!.login();
    console.log(loggedUser);
}

mockLoggedUser();
showProjects();