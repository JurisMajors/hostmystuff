const getCookie = function(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
}

const style = document.createElement('link');
style.rel = "stylesheet";
style.href = getCookie('styling') || "github.css";

document.head.appendChild(style);
// add mobile friendly <meta> tag
const metaViewport = document.createElement('meta');
metaViewport.name = "viewport";
metaViewport.content = "width=device-width, initial-scale=0.5";

// prettify
const codePrettify = document.createElement('script');
codePrettify.src = 'https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js';
metaViewport.appendChild(codePrettify);

const dropdown = document.createElement('select');
dropdown.addEventListener("change", () => {
    const selected =dropdown.options[dropdown.selectedIndex].value; 
    style.href = selected;
    document.cookie = `styling=${selected}`;
}); 

function addStyle(text, csspath) {
    const syntaxStyle = document.createElement('option');
    syntaxStyle.text = text;
    syntaxStyle.value = csspath;

    if (getCookie('styling') === csspath) {
        syntaxStyle.selected = "selected";
    } 

    dropdown.appendChild(syntaxStyle);
}
// options for the dropdown
addStyle('github', 'github.css');
addStyle('desert', 'desert.css');
addStyle('atelier cave light', 'atelier-cave-light.css');
addStyle('doxy', 'doxy.css');
addStyle('sunburst', 'sunburst.css');

document.body.appendChild(metaViewport);

document.body.insertBefore(dropdown, document.body.firstChild);
