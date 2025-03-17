// project-index.js

const JSONBIN_API_URL = 'https://api.jsonbin.io/v3/b/67d76ad98a456b7966772bda'; 
const JSONBIN_API_KEY = '$$2a$10$5HBAXnxLxXwi7WK5LTsEsunyIKoakcSjFLaszlRi4U4uokqsPwMcu';
const LOCAL_STORAGE_KEY = 'projectsData';
const REMOTE_STORAGE_KEY = 'remoteProjectsData';
let projectsGrid;
let currentProjects = [];
const projectCardStyles = `
  :host {
    --primary-color: #3498db;
    --text-color: #333;
    --background-color: #fff;
    --hover-color: rgba(76, 175, 80, 0.1);
    --shadow-color: rgba(0, 0, 0, 0.1);
    --transition-speed: 0.3s;
    --border-radius: 8px;
    
    display: block;
    background-color: var(--background-color);
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: 0 2px 5px var(--shadow-color);
    transition: transform var(--transition-speed), 
                box-shadow var(--transition-speed), 
                opacity var(--transition-speed);
    height: 100%;
  }

  :host(:hover) {
    background-color: var(--hover-color);
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .card-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .image-container {
    width: 100%;
    height: 250px;
    overflow: hidden;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    background-color: #f0f0f0;
  }

  .content {
    padding: 1.5rem;
    display: flex;
    margin-bottom: 2rem;
    flex-direction: column;
    flex-grow: 1;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0 0 1rem 0;
    color: var(--primary-color);
  }

  p {
    font-size: 1rem;
    line-height: 1.5;
    color: var(--text-color);
    margin: 0 0 1rem 0;
    flex-grow: 1;
  }

  .link-container {
    position: absolute;
    bottom: 0;
    margin: 10px;
    margin-top: 20px;
    min-height: 2rem;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
    transition: color var(--transition-speed);
    display: inline-block;
    padding: 1.1rem;
  }

  a:hover {
    text-decoration: underline;
  }

  /* Dark mode styles */
  :host(.dark-mode) {
    --primary-color: #64b5f6;
    --text-color: #e0e0e0;
    --background-color: #1e1e1e;
    --hover-color: rgba(100, 181, 246, 0.1);
    --shadow-color: rgba(0, 0, 0, 0.3);
  }
`;
class ProjectCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = projectCardStyles;
    const template = document.createElement("div");
    template.innerHTML = `
      <div class="card-container">
        <div class="image-container">
          <picture>
            <img src="" alt="Project preview">
          </picture>
        </div>
        <div class="content">
          <h2></h2>
          <p></p>
          <div class="link-container">
            <a href="#" target="_blank" rel="noopener noreferrer">View Project</a>
          </div>
        </div>
      </div>
    `;
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(template.cloneNode(true));
  }
  connectedCallback() {
    this.updateContent();
    this.updateTheme();
    document.body.addEventListener("classChange", () => {
      this.updateTheme();
    });
  }
  updateTheme() {
    if (document.body.classList.contains("dark-mode")) {
      this.classList.add("dark-mode");
    } else {
      this.classList.remove("dark-mode");
    }
  }
  updateContent() {
    const image = this.shadowRoot.querySelector("img");
    const title = this.shadowRoot.querySelector("h2");
    const description = this.shadowRoot.querySelector("p");
    const link = this.shadowRoot.querySelector("a");
    const linkContainer = this.shadowRoot.querySelector(".link-container");
    image.src = this.getAttribute("image") || "";
    image.alt = this.getAttribute("alt") || "Project preview";
    title.textContent = this.getAttribute("title") || "Project Title";
    description.textContent =
      this.getAttribute("description") || "Project description";

    if (this.hasAttribute("link")) {
      link.href = this.getAttribute("link");
      link.textContent = this.getAttribute("link-text") || "View Project";
      linkContainer.style.display = "block";
    } else {
      linkContainer.style.display = "none";
    }
  }
  static get observedAttributes() {
    return ["image", "alt", "title", "description", "link", "link-text"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.updateContent();
    }
  }
}
customElements.define("project-card", ProjectCard);
const bodyObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === "class") {
      document.body.dispatchEvent(new CustomEvent("classChange"));
    }
  });
});
function initializeLocalStorage() {
  const defaultProjects = [
    {
      "id": "ucsd-its",
      "title": "UCSD ITS Department",
      "description": "At UCSD's ITS Department, I develop and optimize workflows, forms, and records in ServiceNow using JavaScript to enhance accessibility for over 600,000 users. I conduct comprehensive QA testing to ensure the reliability and maintenance of campus-wide ticketing systems.",
      "image": "pics/ITS.JPG",
      "alt": "UCSD ITS Department workspace",
      "link": "https://support.ucsd.edu/services",
      "linkText": "View Website"
    },
    {
      "id": "sdsc-nextjs",
      "title": "SDSC Next.js Migration",
      "description": "At SDSC, I helped with the migration of an OpenStack platform currently serving over 450 clients to Next.js and Go. I actively participated in scrum meetings twice a week, where I contributed to planning and executing debugging, programming, and optimization tasks within our sprints.",
      "image": "pics/SDSC.JPG",
      "alt": "SDSC NextJS Development",
      "link": "https://dashboard.cloud.sdsc.edu/dashboard/auth/login/?next=/dashboard/",
      "linkText": "View Website"
    },
    {
      "id": "cses-webclicker",
      "title": "CSES WebClicker",
      "description": "Developing an interactive web-based clicker system for classroom engagement. Implemented real-time response tracking and analytics dashboard.",
      "image": "pics/webclicker.JPG",
      "alt": "CSES WebClicker Interface",
      "link": "https://webclicker-plusplus.vercel.app/",
      "linkText": "View Project"
    },
    {
      "id": "lejournal",
      "title": "LeJournal",
      "description": "Developed a web app journal with a 9-person team using vanilla HTML/CSS/JS. Led the CI/CD pipeline implementation with GitHub Actions, integrating 35+ tests, linting, and code quality checks to reduce deployment time by 40%.",
      "image": "pics/Journal.JPG",
      "alt": "LeJournal Application",
      "link": "https://cse110-sp24-group8.github.io/cse110-sp24-group8/",
      "linkText": "View Project"
    },
    {
      "id": "sdsc-internship-app",
      "title": "UCSD Rating Webapp",
      "description": "In my 2022 Summer Developer Internship at SDSC, I played a key role in creating a UCSD Rating App using TypeScript in React Native, developing a user-friendly interface for uploading, verifying, and reviewing locations.",
      "image": "pics/USCD_Rating_App.JPG",
      "alt": "SDSC Internship App",
    }
  ];
localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultProjects));
  console.log('Initialized localStorage with default project data');
}
document.addEventListener('DOMContentLoaded', function() {
  projectsGrid = document.querySelector('.projects-grid');
  if (!projectsGrid) {
    console.error('Projects grid container not found!');
    return;
  }
  projectsGrid.innerHTML = '';
  bodyObserver.observe(document.body, { attributes: true });
  initializeLocalStorage();
  setupLoadButtons();
});

function setupLoadButtons() {
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'load-buttons';
  buttonsContainer.style.marginBottom = '20px';
  buttonsContainer.style.display = 'flex';
  buttonsContainer.style.justifyContent = 'center';
  buttonsContainer.style.gap = '10px';
  const loadLocalButton = document.createElement('button');
  loadLocalButton.textContent = 'Load Local';
  loadLocalButton.className = 'load-button';
  loadLocalButton.addEventListener('click', loadLocalData);
  const loadRemoteButton = document.createElement('button');
  loadRemoteButton.textContent = 'Load Remote';
  loadRemoteButton.className = 'load-button';
  loadRemoteButton.addEventListener('click', loadRemoteData);
  buttonsContainer.appendChild(loadLocalButton);
  buttonsContainer.appendChild(loadRemoteButton);
  const projectsSection = document.querySelector('.projects');
  projectsSection.insertBefore(buttonsContainer, projectsGrid);
}

function loadLocalData() {
  projectsGrid.innerHTML = '';
  try {
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localData) {
      const projects = JSON.parse(localData);
      currentProjects = [...projects];
      renderProjects(currentProjects);
    } else {
      displayMessage('No local data found. Try loading remote data first.');
    }
  } catch (error) {
    console.error('Error loading local data:', error);
    displayMessage('Error loading local data. Check console for details.');
  }
}
function loadRemoteData() {
  projectsGrid.innerHTML = '';
  displayMessage('Loading projects from remote server...');
  fetch(JSONBIN_API_URL, {
    method: 'GET',
    headers: {
      'X-Master-Key': JSONBIN_API_KEY,
      'X-Bin-Meta': false  
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    const projects = Array.isArray(data) ? data : data.record;
    localStorage.setItem(REMOTE_STORAGE_KEY, JSON.stringify(projects));
    currentProjects = [...projects];
    projectsGrid.innerHTML = '';
    renderProjects(currentProjects);
  })
  .catch(error => {
    console.error('Error fetching remote data:', error);
    displayMessage('Error loading remote data. Check console for details.');
  });
}

function mergeLocalAndRemoteData() {
  projectsGrid.innerHTML = '';
  try {
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    const remoteData = localStorage.getItem(REMOTE_STORAGE_KEY);
    
    if (!localData && !remoteData) {
      displayMessage('No data found in either local or remote storage.');
      return;
    }
    const localProjects = localData ? JSON.parse(localData) : [];
    const remoteProjects = remoteData ? JSON.parse(remoteData) : [];
    const mergedProjects = mergeProjectArrays(remoteProjects, localProjects);
    currentProjects = [...mergedProjects];
    renderProjects(currentProjects);
  } catch (error) {
    console.error('Error merging data:', error);
    displayMessage('Error merging data. Check console for details.');
  }
}
function mergeProjectArrays(array1, array2) {
  const projectMap = new Map();
  const getProjectKey = (project) => {
    if (project.id) return `id-${project.id}`;
    if (project.title) return `title-${project.title}`;
    if (project.link) return `link-${project.link}`;
    return JSON.stringify(project);
  };
  if (Array.isArray(array1)) {
    array1.forEach(project => {
      projectMap.set(getProjectKey(project), project);
    });
  }
  if (Array.isArray(array2)) {
    array2.forEach(project => {
      projectMap.set(getProjectKey(project), project);
    });
  }
  return Array.from(projectMap.values());
}
function renderProjects(projects) {
  if (!Array.isArray(projects) || projects.length === 0) {
    displayMessage('No projects to display.');
    return;
  }
  projects.forEach(project => {
    const projectCard = createProjectCard(project);
    projectsGrid.appendChild(projectCard);
  });
}
function createProjectCard(project) {
  const card = document.createElement('project-card');
  card.setAttribute('image', project.image || '');
  card.setAttribute('alt', project.alt || `${project.title} preview`);
  card.setAttribute('title', project.title || '');
  card.setAttribute('description', project.description || '');
  
  if (project.link) {
    card.setAttribute('link', project.link);
    card.setAttribute('link-text', project.linkText || 'View Project');
  }
  
  return card;
}
function displayMessage(message) {
  projectsGrid.innerHTML = `
    <div class="message" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
      <p>${message}</p>
    </div>
  `;
}
function saveCurrentToLocal() {
  if (currentProjects.length > 0) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentProjects));
    alert('Current projects saved to local storage');
  } else {
    alert('No projects to save');
  }
}
function initializeJSONBinData(projectsData) {
  if (!projectsData || !Array.isArray(projectsData)) {
    console.error('No valid project data provided for initialization');
    return;
  }
  localStorage.setItem(REMOTE_STORAGE_KEY, JSON.stringify(projectsData));
  fetch(JSONBIN_API_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': JSONBIN_API_KEY
    },
    body: JSON.stringify(projectsData)
  })
  .then(response => response.json())
  .then(data => console.log('Data uploaded to JSONBin:', data))
  .catch(error => console.error('Error uploading to JSONBin:', error));
}