// Charge dynamiquement les données depuis data.json
let DATA = {};

const cvSection = document.getElementById('cv-section');
const projetsSection = document.getElementById('projets-section');
const projectsList = document.getElementById('projects-list');
const projectDetail = document.getElementById('project-detail');

function showSection(section) {
    if (section === 'cv') {
        cvSection.style.display = '';
        projetsSection.style.display = 'none';
        window.location.hash = '#cv';
        document.getElementById('nav-cv').classList.add('active');
        document.getElementById('nav-projets').classList.remove('active');
    } else {
        cvSection.style.display = 'none';
        projetsSection.style.display = '';
        window.location.hash = '#projets';
        document.getElementById('nav-cv').classList.remove('active');
        document.getElementById('nav-projets').classList.add('active');
    }
    projectDetail.style.display = 'none';
}

function renderCV() {
    if (!DATA.profile) return;
    cvSection.innerHTML = `
        <header>
            <h1>${DATA.profile.name}</h1>
            <h2>${DATA.profile.title}</h2>
            <p class="location">${DATA.profile.location}</p>
        </header>
        <h3>Formation</h3>
        <ul>
            ${DATA.education.map(e => `<li><strong>${e.label}</strong> – ${e.school} (${e.years}${e.mention ? ' – ' + e.mention : ''})</li>`).join('')}
        </ul>
        <h3>Expérience professionnelle</h3>
        <ul>
            ${DATA.experience.map(x => `<li><strong>${x.title}</strong> – ${x.company}, produit ${x.product} (${x.period})</li>`).join('')}
        </ul>
        <h3>Contact</h3>
        <ul>
            <li>Email : <a href="mailto:${DATA.profile.email}">${DATA.profile.email}</a></li>
        </ul>
    `;
}

function renderProjects() {
    projectsList.innerHTML = '';
    DATA.projects.forEach(proj => {
        const div = document.createElement('div');
        div.className = 'project';
        div.innerHTML = `<div class="project-title">${proj.title}</div>
                         <div class="project-desc">${proj.description}</div>`;
        div.onclick = () => showProjectDetail(proj.id);
        projectsList.appendChild(div);
    });
}

function showProjectDetail(id) {
    const proj = DATA.projects.find(p => p.id === id);
    if (!proj) return;
    projectDetail.innerHTML = `<h2>${proj.title}</h2>
        <p>${proj.details}</p>
        ${proj.link && proj.link !== '#' ? `<a href="${proj.link}" target="_blank">Voir le projet</a><br>` : ''}
        <button id="back-to-list">Retour à la liste</button>`;
    projectDetail.style.display = '';
    projectsList.style.display = 'none';
    document.getElementById('back-to-list').onclick = () => {
        projectDetail.style.display = 'none';
        projectsList.style.display = '';
    };
}

// Navigation
window.addEventListener('hashchange', () => {
    if (window.location.hash === '#projets') {
        showSection('projets');
    } else {
        showSection('cv');
    }
});

document.getElementById('nav-cv').onclick = (e) => { e.preventDefault(); showSection('cv'); };
document.getElementById('nav-projets').onclick = (e) => { e.preventDefault(); showSection('projets'); };

// Initialisation
fetch('data.json')
    .then(r => r.json())
    .then(json => {
        DATA = json;
        renderCV();
        renderProjects();
        if (window.location.hash === '#projets') {
            showSection('projets');
        } else {
            showSection('cv');
        }
    });
