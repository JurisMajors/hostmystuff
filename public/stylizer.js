const getCookie = function(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
}

const prettifyStyle = document.createElement('link');
prettifyStyle.rel = "stylesheet";
prettifyStyle.href = "prettify.css"
const style = document.createElement('link');
style.rel = "stylesheet";
style.href = getCookie('styling') || 'highlightStyles/github.css';

document.head.appendChild(prettifyStyle);
document.head.appendChild(style);
// add mobile friendly <meta> tag
const metaViewport = document.createElement('meta');
metaViewport.name = "viewport";
metaViewport.content = "width=device-width, initial-scale=0.65";

const dropdown = document.createElement('select');
dropdown.addEventListener("change", () => {
    const selected =dropdown.options[dropdown.selectedIndex].value; 
    style.href = selected;
    document.cookie = `styling=${selected}; max-age=2147483647`;
}); 

function addStyle(text, csspath) {
    const syntaxStyle = document.createElement('option');
    syntaxStyle.text = text;
    syntaxStyle.value = `highlightStyles/${csspath}`;

    if (getCookie('styling') === syntaxStyle.value) {
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
// run pretty print after loading necessary things
PR.prettyPrint();
