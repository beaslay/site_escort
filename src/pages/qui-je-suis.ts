import "../styles/styles.css";
import "../styles/qui-je-suis.css";

const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Entrée: déclenche les transitions une fois le DOM prêt
window.addEventListener('DOMContentLoaded', () => {
  if (prefersReduced) {
    document.documentElement.classList.add('enter');
    return;
  }
  // RAF pour garantir le style initial avant l'état animé
  requestAnimationFrame(() => document.documentElement.classList.add('enter'));
});

// Sortie: petite transition overlay avant de quitter cette page
function bindExit(){
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a.nav-exit'));
  for (const a of links){
    a.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;
      e.preventDefault();
      document.documentElement.classList.add('page-leave');
      setTimeout(() => { window.location.href = a.href; }, 320);
    });
  }
}

bindExit();
