//SPA
var backToPage1 = false;
const allPages = document.querySelectorAll('div.page');
allPages[0].style.display = 'block';


function navigateToPage(event) {
  let pageId = null;
  pageId = location.hash ? location.hash : '#page1';

  for (let page of allPages) {
    if (pageId === '#' + page.id) {
      page.style.display = 'block';
    } else {
      page.style.display = 'none';
    }
  }
  return;
}
  
navigateToPage();

// init handler for hash navigation
window.addEventListener('hashchange', navigateToPage);


document.getElementById("menu_toggle").addEventListener("click", menuToggler);

function menuToggler() {
    document.getElementById("menu").classList.toggle("show_menu");
}