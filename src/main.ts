const createForm = document.getElementById("create-form");
const projectsContainer = document.getElementById("projects-container");
let loggedUser: User| null = null;

createForm!.addEventListener("submit", function (e) {
    e.preventDefault();
    onNewProject(e);
});

type Project = {
    id: string;
    name: string;
    description: string;
}

class User{
    id: string;
    username: string;
    loggedIn: boolean;

    constructor(id: string, username: string) {
        this.id = id;
        this.username = username;
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
    const nameInput = document.getElementById("name") as HTMLInputElement
    const descriptionInput = document.getElementById("description") as HTMLInputElement
 
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

    projectSpan.innerHTML = `name: ${project.name}, description: ${project.description}`;
    projectSpan.addEventListener("click", () => markProjectOut(projectDiv));
    deleteProjectBtn.classList.add("project-button");
    deleteProjectBtn.innerText="Delete";
    deleteProjectBtn.addEventListener("click", () => handleDeleteClick(project.id));

    updateProjectBtn.classList.add("project-button");
    updateProjectBtn.innerText="Update";
    updateProjectBtn.addEventListener("click", () => updateProject(project,projectDiv, projectSpan));

    projectDiv!.appendChild(projectSpan);
    projectDiv!.appendChild(deleteProjectBtn);
    projectDiv!.appendChild(updateProjectBtn);
    projectsContainer!.appendChild(projectDiv);
}

function markProjectOut(projectDiv: HTMLDivElement): void{
    projectDiv.classList.toggle("marked");
}

function handleDeleteClick(projectId: string){
    deleteProject(projectId);
    showProjects();
}

function deleteProject(projectid: string){
    localStorage.removeItem(projectid);
    showProjects();
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

function createUser(username: string): void{
    const user = localStorage.getItem(username);
    if(!user)
    {
        const user = new User(
            self.crypto.randomUUID(),
            username
        )
        localStorage.setItem(username, JSON.stringify(user))
        return
    }
    // alert("User with this username alreadt exists");
}

function getUser(username: string): User | null {
    const userString = localStorage.getItem(username);
    if (userString) {
        const userData = JSON.parse(userString);
        return new User(userData.id, userData.username);
    }
    return null;
}

function mockLoggedUser(): void {
    createUser("mock");
    const user = getUser("mock");
    user!.login();
    console.log(loggedUser);
}

mockLoggedUser();
showProjects();