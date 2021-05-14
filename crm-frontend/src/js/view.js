const container = document.querySelector('.app-container');

export function createHeader() {
    const header = document.createElement('header');
    const logo = document.createElement('img');
    const search = document.createElement('input');

    header.classList.add('header');
    logo.classList.add('header__logo');
    search.classList.add('header__input');

    logo.src = 'img/logo.svg';
    search.placeholder = 'Введите запрос';

    header.append(logo);
    header.append(search);
    container.append(header);

    return search;
}

export function createBodyApp() {
    const bodyApp = document.createElement('div');
    const title = document.createElement('h2');

    bodyApp.classList.add('container');
    title.classList.add('title');

    title.textContent = 'Клиенты';

    const table = createTable();
    const loading = loadingAnimated();
    bodyApp.append(title);
    bodyApp.append(table.table);
    bodyApp.append(loading);
    container.append(bodyApp);

    return {
        table,
        bodyApp,
        loading
    };
}

function createTable() {
    const table = document.createElement('table');
    const tableHeader = document.createElement('tr');

    table.classList.add('table');
    tableHeader.classList.add('table__header');

    const idClient = createColumn('ID', 'column-id', tableHeader);
    const fullNameClient = createColumn('Фамилия Имя Отчество', 'column-fullname', tableHeader);
    const dateClient = createColumn('Дата и время создания', 'column-date', tableHeader);
    const lastChangeClient = createColumn('Последние изменения', 'column-last-change', tableHeader);
    const contactClient = createColumn('Контакты', 'column-contact', tableHeader);
    const actionClient = createColumn('Действия', 'column-action', tableHeader);

    table.append(tableHeader);
    return {
        table,
        idClient,
        fullNameClient,
        dateClient,
        lastChangeClient,
        contactClient,
        actionClient
    };
}

function createColumn(name, columnClass, tr) {
    const column = document.createElement('td');
    const stringName = document.createElement('span')
    column.classList.add('column', columnClass);
    stringName.classList.add(columnClass + '__name');
    stringName.textContent = name;
    column.append(stringName);
    tr.append(column);

    return column;
}

function loadingAnimated() {
    const block = document.createElement('div');
    const loading = document.createElement('div');

    block.classList.add('loading-block');
    loading.classList.add('loading-line');

    block.append(loading);

    return block;
}

export function createAddButton() {
    const button = document.createElement('button');
    button.classList.add('add-btn');
    button.textContent = 'Добавить клиента';

    button.addEventListener('click', () => {
        createModalNewClient();
    })

    return button;
}

function modalRemove(modalElement) {
    modalElement.classList.add('animated-reverse');
    setTimeout(() => { modalElement.remove() }, 500);
}

function createModal(titleName, btnName) {
    const overflow = document.createElement('div');
    const modal = document.createElement('div');
    const title = document.createElement('h3');
    const closeButton = document.createElement('button');
    const bottomButton = document.createElement('button');

    overflow.classList.add('overflow');
    modal.classList.add('modal-block');
    title.classList.add('small-title');
    closeButton.classList.add('close-btn');
    bottomButton.classList.add('bottom-btn');

    title.textContent = titleName;
    bottomButton.textContent = btnName;

    closeButton.addEventListener('click', () => {
        modalRemove(overflow);
    });
    bottomButton.addEventListener('click', () => {
        modalRemove(overflow);
        if (btnName === 'Удалить клиента') {
            createModalDeleteClient();
        };
    })
    modal.addEventListener('click', event => {
        event._CLOSE_MODAL = true;
    });
    overflow.addEventListener('click', event => {
        if (!event._CLOSE_MODAL) {
            modalRemove(overflow);
        };
    });

    modal.append(closeButton);
    modal.append(title);
    modal.append(bottomButton);
    overflow.append(modal);
    container.append(overflow);

    return modal;
}
function createForm(modalBlock) {
    const form = document.createElement('form');
    const inputName = document.createElement('input');
    const inputSurname = document.createElement('input');
    const inputMiddleName = document.createElement('input');
    const contacts = document.createElement('div');
    const addContact = document.createElement('button');
    const saveButton = document.createElement('button');

    form.classList.add('form');
    inputName.classList.add('form__input');
    inputSurname.classList.add('form__input');
    inputMiddleName.classList.add('form__input');
    contacts.classList.add('contacts');
    addContact.classList.add('contacts__btn');
    saveButton.classList.add('form__btn');

    inputSurname.placeholder = 'Фамилия*';
    inputName.placeholder = 'Имя*';
    inputMiddleName.placeholder = 'Отчество';
    addContact.textContent = 'Добавить контакт';
    saveButton.textContent = 'Сохранить';

    form.append(inputSurname);
    form.append(inputName);
    form.append(inputMiddleName);
    form.append(contacts);
    form.append(saveButton);
    contacts.append(addContact);
    modalBlock.append(form);
}
function createModalNewClient() {
    const modal = createModal('Новый клиент', 'Отмена');
    const form = createForm(modal);
}
function createModalChangeClient() {
    const modal = createModal('Изменить данные', 'Удалить клиента');
}
function createModalDeleteClient() {
    const modal = createModal('Удалить клиента', 'Отмена');
}