import { createHeader, createBodyApp, createAddButton, createStringClient } from "./view.js";
import { onSave, loadingData, onDelete, onChange, fetchDataClient, searchClients } from "./server.js";

const header = createHeader(searchClients);
const appContainer = createBodyApp();

function createClientTable() {
    loadingData().then(clientData => {
        appContainer.loading.remove();
        for (let client of clientData) {
            createStringClient(client, onDelete, onChange, fetchDataClient);
        }
        const button = createAddButton(onSave, onDelete, onChange, fetchDataClient);
        appContainer.bodyApp.append(button);
    });
}

createClientTable();
