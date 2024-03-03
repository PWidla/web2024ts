const createForm = document.getElementById("create-form");
const projectsContainer = document.getElementById("projects-container");

type Project = {
    Id: string,
    Name: string,
    Description: string
}

if (createForm) {
  createForm.addEventListener("submit", (event) => {
    event.preventDefault();
    createProject(event);
  });
}

function createProject(e: Event){
    const formData = new FormData(e.target as HTMLFormElement);
    const name: string = formData.get("name") as string;
    const description: string = formData.get("description") as string;

    if(name && description)
    {
        const newProject: Project = {
            Id: self.crypto.randomUUID(),
            Name: name,
            Description: description
        }

        localStorage.setItem(newProject.Id, JSON.stringify(newProject));
        showProjects();
    }else{
        alert("Fill the form!");
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

    projectSpan.innerHTML = `Name: ${project.Name}, description: ${project.Description}`;
    projectSpan.addEventListener("click", () => markProjectOut(projectDiv));
    deleteProjectBtn.classList.add("project-button");
    deleteProjectBtn.innerText="Delete";
    deleteProjectBtn.addEventListener("click", () => deleteProject(project.Id));

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

function deleteProject(projectId: string){
    localStorage.removeItem(projectId);
    showProjects();
}

function updateProject(project: Project, projectDiv: HTMLDivElement, projectSpan: HTMLSpanElement){
    projectSpan.classList.add('beingUpdated');

    let labelForName = document.createElement('label');
    labelForName.setAttribute("for", "inputName");
    var labelForNameText = document.createTextNode("Name");
    labelForName.appendChild(labelForNameText);
    let inputForName = document.createElement('input');
    inputForName.setAttribute("type", "text");
    inputForName.placeholder = project.Name;

    let labelForDescription = document.createElement('label');
    labelForDescription.setAttribute("for", "inputDescription");
    var labelForDescriptionText = document.createTextNode("Description");
    labelForDescription.appendChild(labelForDescriptionText);
    let inputForDescription = document.createElement('input');
    inputForDescription.setAttribute("type", "text");
    inputForDescription.placeholder = project.Description;

    let saveUpdatedProjectBtn = document.createElement('button');
    saveUpdatedProjectBtn.innerText="Save";
    saveUpdatedProjectBtn.addEventListener("click", () => saveUpdatedProject(project, inputForName.value, inputForDescription.value));

    projectDiv.append(labelForName);
    projectDiv.append(inputForName);
    projectDiv.append(labelForDescription);
    projectDiv.append(inputForDescription);
    projectDiv.append(saveUpdatedProjectBtn);
}

function saveUpdatedProject(project: Project, name: string, description: string){
    let retrievedProject: Project | null = null;
    const storedProject = localStorage.getItem(project.Id);
    
    if (storedProject) {
        retrievedProject = JSON.parse(storedProject);
    }
    retrievedProject!.Name = name;
    retrievedProject!.Description = description;

    localStorage.setItem(retrievedProject!.Id, JSON.stringify(retrievedProject!));

    showProjects();
}

showProjects();