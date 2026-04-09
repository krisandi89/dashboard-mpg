const fs = require('fs');

const path = '\\\\nuclearstorage\\home\\PERSONAL\\FAMILY\\SANDI\\Aplikasi Antigravity\\Super-app-MPG\\dashboard-pt-mpg\\index.html';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
    "document.getElementById('pane-ppu').innerHTML =",
    `window.APP_MODULES = [
                { id: 'ppu', name: 'PPU', icon: 'fa-file-invoice-dollar', templateFn: () => window.getTemplatePpu(), initFn: () => window.initPPUApp() },
                { id: 'rekap', name: 'Rekapitulasi', icon: 'fa-chart-pie', templateFn: () => window.getTemplateRekap(), initFn: () => window.initRekapApp() }
            ];

            window.getTemplatePpu = () =>`
);

content = content.replace(
    "document.getElementById('pane-rekap').innerHTML =",
    "window.getTemplateRekap = () =>"
);

const initReplacement = `await fetchHolidays();

            const tabsContainer = document.getElementById('app-tabs-container');
            const panesContainer = document.getElementById('app-panes-container');
            
            if (tabsContainer && panesContainer) {
                tabsContainer.innerHTML = '';
                panesContainer.innerHTML = '';
                window.APP_MODULES.forEach((mod, index) => {
                    const isActive = index === 0 ? 'active' : '';
                    tabsContainer.innerHTML += \`<button onclick="changeAppTab('\${mod.id}')" id="app-tab-\${mod.id}" class="app-tab-button \${isActive}">
                        <i class="fas \${mod.icon}"></i> \${mod.name}
                    </button>\`;
                    panesContainer.innerHTML += \`<div id="pane-\${mod.id}" class="app-pane \${isActive}">\${mod.templateFn()}</div>\`;
                });
            }

            window.APP_MODULES.forEach(mod => {
                if(mod.initFn) mod.initFn();
            });`;

content = content.replace(
    /await fetchHolidays\(\);\s*initPPUApp\(\);\s*initRekapApp\(\);/,
    initReplacement
);

content = content.replace("function initPPUApp() {", "window.initPPUApp = function initPPUApp() {");
content = content.replace("function initRekapApp() {", "window.initRekapApp = function initRekapApp() {");

fs.writeFileSync(path, content, 'utf8');
console.log("Mutation completed!");
