const data = {
    "personal": {
        "name": "George Alexander Orrala Tomalá",
        "shortName": "George",
        "career": "Electrónica y Automatización",
        "university": "Escuela Superior Politécnica de Chimborazo - ESPOCH",
        "description": "Soy estudiante de Electrónica y Automatización."
    },
    "projects": [
        {
            "title": "Proyecto 1",
            "description": "Descripción del proyecto 1.",
            "icon": "fa-code",
            "tags": ["HTML", "CSS", "JavaScript"]
        }
    ],
    "certificates": [
        {
            "title": "Certificado 1",
            "institution": "Institución 1",
            "year": "2026"
        }
    ]
};

document.getElementById("profile-name").textContent = data.personal.name;
document.getElementById("profile-short-name").textContent = data.personal.shortName;
document.getElementById("profile-career").textContent = data.personal.career;
document.getElementById("profile-university").textContent = data.personal.university;
document.getElementById("profile-description").textContent = data.personal.description;

const projectsContainer = document.getElementById("projects-container");
data.projects.forEach(project => {
    const card = document.createElement("div");
    card.innerHTML = `<h3>${project.title}</h3><p>${project.description}</p>`;
    projectsContainer.appendChild(card);
});

const certificatesContainer = document.getElementById("certificates-container");
data.certificates.forEach(certificate => {
    const card = document.createElement("div");
    card.innerHTML = `<h3>${certificate.title}</h3><p>${certificate.institution} - ${certificate.year}</p>`;
    certificatesContainer.appendChild(card);
});

document.getElementById("year").textContent = new Date().getFullYear();