/* HostMyStuff is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

HostMyStuff is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with HostMyStuff.  If not, see <https://www.gnu.org/licenses/>. */

const getCookie = function(name) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    if (match) return match[2];
};

const style = document.createElement("link");
style.rel = "stylesheet";
style.href = getCookie("styling") || "styles/github.css";

//Selector goes into <div id="selector"></div>
const selector = document.getElementById("selector");
selector.appendChild(style);
// add mobile friendly <meta> tag
const metaViewport = document.createElement("meta");
metaViewport.name = "viewport";
metaViewport.content = "width=device-width, initial-scale=0.65";

const dropdown = document.createElement("select");
dropdown.addEventListener("change", () => {
    const selected =dropdown.options[dropdown.selectedIndex].value; 
    style.href = selected;
    document.cookie = `styling=${selected}; max-age=2147483647`;
}); 

function addStyle(text, csspath) {
    const syntaxStyle = document.createElement("option");
    syntaxStyle.text = text;
    syntaxStyle.value = `styles/${csspath}`;

    if (getCookie("styling") === syntaxStyle.value) {
        syntaxStyle.selected = "selected";
    } 

    dropdown.appendChild(syntaxStyle);
}
// options for the dropdown
addStyle("Tomorrow Night", "tomorrow-night.css");
addStyle("GruvBox Dark", "gruvbox-dark.css");
addStyle("Solarized Dark", "solarized-dark.css");
addStyle("Atom One Dark", "atom-one-dark-reasonable.css");
addStyle("Visual Studio 2015", "vs2015.css");
addStyle("Monokai", "monokai-sublime.css");
addStyle("Qtcreator", "qtcreator_dark.css");
addStyle("xt 256", "xt256.css");
addStyle("Github", "github.css");
addStyle("Atelier Cave Light", "atelier-cave-light.css");
addStyle("GruvBox Light", "gruvbox-light.css");
addStyle("Atom One Light", "atom-one-light.css");
addStyle("Arduino Light", "arduino-light.css");
addStyle("Googlecode", "googlecode.css");


selector.appendChild(metaViewport);
selector.insertBefore(dropdown, selector.firstChild);
