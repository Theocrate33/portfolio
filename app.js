let currenctLang = 'en';

// Detect browser language on load
window.addEventListener('DOMContentLoaded', () => {
  const ulang = navigator.language.slice(0,2); // e.g. "fr"
  if (translations[ulang]) {
    currenctLang = ulang;
    document.getElementById('lang-switcher').value = ulang;
  }
  const defaulSection = document.getElementById('defaultOpen');
  defaulSection.classList.add('active');
  loadSection(defaulSection.dataset.section);
});

// Load section content
function loadSection(section) {
  const filepath = translations[currenctLang][section];
  console.log('Loading:', filepath); // Debugging

  fetch(filepath + '?v=' + Date.now()) // THEO: in production reemove "+ '?v=' + Date.now()" THIS IS FOR CACHE BUSTING FOR LOCAL TESTING ONLY
    .then(response => {
      if(!response.ok) throw new Error('File not found: ' + filepath);
      return response.text()
    })
    .then(data => {
      // document.getElementById(section).innerHTML = data; 
      // Hide all sections
      document.querySelectorAll('.folio-content').forEach(div => {
        div.classList.remove('show');
        div.style.display = 'none';
      });
      // Load into a correct/specific div
      const targetDiv = document.getElementById(section);
      targetDiv.innerHTML = data;
      targetDiv.style.display = 'block';
      setTimeout(() => targetDiv.classList.add('show'), 10);
      // document.getElementById(section).style.display = 'block';

      // Initiate skills animation if this is the skills section
      if (section === 'skills') {
        initSkillsAnimation();
      }
      // Initiate cases studies
      if (section === 'studies') {
        initCaseStudies();
      }
    })
    .catch(err => {
      document.getElementById(section).innerHTML = '<p>Error loading content.</p>';
      console.error('Fetch error: ', err);
    });
}

// sidebar button clicks
document.querySelectorAll('.port-sect-l button').forEach(btn => {
  btn.addEventListener('click', () => {
    //  Remove active class from all buttons
    document.querySelectorAll('.port-sect-l button').forEach(b => b.classList.remove('active'));
    // Add active class to the clicked button
    btn.classList.add('active');
    // Load the section content
    const section = btn.dataset.section;
    loadSection(section);
  });
});

// Language switcher
document.getElementById('lang-switcher').addEventListener('change', function() {
  currenctLang = this.value;
  // Reload active section if one is selected
  const activeSection = document.querySelector('.port-sect-l button.active')?.dataset.section;
  if (activeSection) {
    loadSection(activeSection);
  } else {
    const defaulSection = document.getElementById('defaultOpen').dataset.section;
    loadSection(defaulSection);
  }
});


function initSkillsAnimation() {
  // Skills
  const skills = document.querySelectorAll(".circle-skill .progress");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progress = entry.target;

        let percent = 0; // progress.getAttribute("stroke-dasharray").split(",")[0];
        //if (!percent || percent == 0) {
        if (progress.classList.contains("networking")) percent = 85;
        if (progress.classList.contains("sysadmin"))   percent = 92;
        if (progress.classList.contains("dev"))        percent = 78;
        if (progress.classList.contains("security"))   percent = 75;
        if (progress.classList.contains("education"))  percent = 91;
        if (progress.classList.contains("leadership")) percent = 89;
        //}
        progress.style.strokeDashoffset = 100 - percent;
        // progress.setAttribute("stroke-dasharray", percent + ", 100");

        const text = progress.parentNode.querySelector(".percentage");
        let current = 0;
        const step = Math.ceil(percent / 30);
        const interval = setInterval(() => {
          current += step;
          if (current >= percent) {
            current = percent;
            clearInterval(interval);
          }
          text.textContent = current + "%";
        }, 30);

        observer.unobserve(progress) // animate once
      }
    });
  }, { threshold: 0.1 });

  skills.forEach(skill => observer.observe(skill));
}

// case study details DIVs open
function initCaseStudies(){
  document.querySelectorAll(".case-study .toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".case-study");
      card.classList.toggle("open");

      // Add a close button dynamically if not present
      const detail = card.querySelector(".detail");
      if (!detail.querySelector(".close-btn")) {
        const closeBtn = document.createElement("div");
        closeBtn.textContent = "Close";
        closeBtn.className = "close-btn";
        detail.appendChild(closeBtn);

        closeBtn.addEventListener("click", () => {
          card.classList.remove("open");
        });
      }
      // btn.textContent = card.classList.contains("open") ? "Show Less" : "Read More";
    });
  });
}

