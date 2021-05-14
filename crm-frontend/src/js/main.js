import { createHeader, createBodyApp, createAddButton } from "./view.js";

const header = createHeader();
const appContainer = createBodyApp();

function createClientTable() {
    setTimeout(() => { appContainer.loading.remove(); }, 1000);
    const button = createAddButton();
    appContainer.bodyApp.append(button);
}

createClientTable();
