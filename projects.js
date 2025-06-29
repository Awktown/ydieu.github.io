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

function renderProfile() {
    const profile = DATA.profile;
    return `
        <div class="profile-block">
            <div class="profile-photo">
                ${profile.photo ? `<img src="${profile.photo}" alt="Photo de ${profile.name}">` : '<div class="photo-placeholder">Photo</div>'}
            </div>
            <div class="profile-infos">
                <h1>${profile.name}</h1>
                <h2>${profile.title}</h2>
                <p class="location">
                    <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.location)}" target="_blank">${profile.location}</a>
                </p>
                <p class="email"><a href="mailto:${profile.email}">${profile.email}</a></p>
            </div>
        </div>
    `;
}

function renderCV() {
    if (!DATA.profile) return;
    const hobbyIcons = {
        "Cinéma": "🎬",
        "Sport automobile": "🏎️",
        "Basketball": "🏀",
        "Bricolage": "🛠️"
    };
    cvSection.innerHTML = `
        ${renderProfile()}
        <h3>Expérience professionnelle</h3>
        <div class="exp-list">
            ${DATA.experience.map((x, i) => `
                <div class="exp-item">
                    ${x.logo ? `<div class='exp-logo'><img src='${x.logo}' alt='${x.company} logo'></div>` : ''}
                    <div class="exp-content">
                        <div class="exp-company"><strong>${x.company}</strong>${x.location ? `<span class='exp-location'><a href='https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(x.location)}' target='_blank'>${x.location}</a></span>` : ''}</div>
                        <ul class="exp-roles">
                        ${x.roles.map(role => `
                            <li>
                                <span class="exp-title">${role.title}</span> – <span class="exp-product">${role.product}</span><br>
                                <span class="exp-dates">${role.start} - ${role.end}</span><br>
                                <span class="exp-desc">${role.description}</span>
                            </li>
                        `).join('')}
                        </ul>
                    </div>
                </div>
            `).join('')}
        </div>
        <h3>Formation</h3>
        <div class="edu-list">
            ${DATA.education.map(e => `
                <div class="edu-item">
                    ${e.logo ? `<div class='edu-logo'><img src='${e.logo}' alt='${e.school} logo'></div>` : ''}
                    <div class="edu-content">
                        <div class="edu-title"><strong>${e.label}</strong></div>
                        <div class="edu-school">${e.school}</div>
                        <div class="edu-dates">${e.start} - ${e.end}</div>
                        ${e.location ? `<div class="edu-location"><a href='https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.location)}' target='_blank'>${e.location}</a></div>` : ''}
                        ${e.mention ? `<div class="edu-mention">${e.mention}</div>` : ''}
                        ${e.description ? `<div class="edu-desc">${e.description}</div>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
        <h3>Hobbies</h3>
        <div class="hobbies-block">
            ${DATA.hobbies.map(hobby => `
                <span class="hobby-item">
                    <span class="hobby-icon">${hobbyIcons[hobby] || "⭐"}</span> ${hobby}
                </span>
            `).join('')}
        </div>
    `;
}

function renderProjects() {
    // Afficher le bloc profil en haut de la page projets
    projetsSection.innerHTML = `
        ${renderProfile()}
        <h1>Projets</h1>
        <div id="projects-list"></div>
        <div id="project-detail" style="display:none;"></div>
    `;
    const projectsList = document.getElementById('projects-list');
    DATA.projects.forEach(proj => {
        const div = document.createElement('div');
        div.className = 'project';
        div.innerHTML = `<div class=\"project-title\">${proj.title}</div>
                         <div class=\"project-desc\">${proj.description}</div>`;
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
