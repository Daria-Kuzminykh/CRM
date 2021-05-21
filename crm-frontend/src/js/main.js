import { createHeader, createBodyApp, createAddButton, createStringClient, onSort } from "./view.js";
import { onSave, fetchData, onDelete, onChange, fetchDataClient, searchClients } from "./server.js";

createHeader(searchClients, createClientTable);
const appContainer = createBodyApp();
const handler = {
    onChange,
    onDelete,
    fetchData,
    fetchDataClient,
}
onSort('id', fetchData, createClientTable, appContainer.table.idClient);
const button = createAddButton(onSave, fetchData, createClientTable);
appContainer.bodyApp.append(button);

function createClientTable(clientData) {
    for (let client of clientData) {
        createStringClient(client, handler, createClientTable);
    }
}

appContainer.table.idClient.addEventListener('click', event => {
    onSort('id', fetchData, createClientTable, event.currentTarget);
});

appContainer.table.fullNameClient.addEventListener('click', event => {
    onSort('fullName', fetchData, createClientTable, event.currentTarget);
});

appContainer.table.dateClient.addEventListener('click', event => {
    onSort('createdAt', fetchData, createClientTable, event.currentTarget);
});

appContainer.table.lastChangeClient.addEventListener('click', event => {
    onSort('updatedAt', fetchData, createClientTable, event.currentTarget);
});