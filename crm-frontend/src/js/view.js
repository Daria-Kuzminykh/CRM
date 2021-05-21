const container = document.querySelector('.app-container');

function cleanTable() {
    const table = document.querySelector('.table');
    table.querySelectorAll('.table__client').forEach(el => {
        if (el) {
            el.remove();
        };
    });
}

export function createHeader(onSearch, createTable) {
    const header = document.createElement('header');
    const logo = document.createElement('img');
    const search = document.createElement('input');

    header.classList.add('header');
    logo.classList.add('header__logo');
    search.classList.add('header__input');

    logo.src = 'img/logo.svg';
    search.placeholder = 'Введите запрос';

    let timerId;
    search.addEventListener('input', () => {
        clearTimeout(timerId);
         timerId = setTimeout(() => {
            cleanTable();
            loadingAnimated();
            onSearch(search.value).then(clientData => {
                cleanTable();
                loadingRemove();
                createTable(clientData);
            });
        }, 300);
    });

    header.append(logo);
    header.append(search);
    container.append(header);
}

export function createBodyApp() {
    const bodyApp = document.createElement('div');
    const title = document.createElement('h2');
    const containerForMobil = document.createElement('div');

    bodyApp.classList.add('container');
    title.classList.add('title');
    containerForMobil.classList.add('mobil-box');
    title.textContent = 'Клиенты';

    const table = createTable();

    bodyApp.append(title);
    bodyApp.append(containerForMobil);
    containerForMobil.append(table.table);
    container.append(bodyApp);

    return {
        bodyApp,
        table
    };
}

function createTable() {
    const table = document.createElement('table');
    const tableHeader = document.createElement('tr');

    table.classList.add('table');
    tableHeader.classList.add('table__header');

    const idClient = createColumnHead('ID', 'column-id', tableHeader);
    const fullNameClient = createColumnHead('Фамилия Имя Отчество', 'column-fullname', tableHeader);
    const dateClient = createColumnHead('Дата и время создания', 'column-date', tableHeader);
    const lastChangeClient = createColumnHead('Последние изменения', 'column-last-change', tableHeader);
    const contactClient = createColumnHead('Контакты', 'column-contact', tableHeader);
    const actionClient = createColumnHead('Действия', 'column-action', tableHeader);

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

function createColumnHead(name, columnClass, tr) {
    const column = document.createElement('td');
    const stringName = document.createElement('span')
    column.classList.add('column', columnClass);
    stringName.classList.add(columnClass + '__name');
    stringName.textContent = name;
    column.append(stringName);
    tr.append(column);

    return column;
}

function createColumnClient(name, columnClass, tr) {
    const column = document.createElement('td');
    column.classList.add('column-client', columnClass);
    column.textContent = name;
    tr.append(column);

    return column;
}

function loadingAnimated() {
    const container = document.querySelector('.container');
    const btn = document.querySelector('.add-btn');
    const block = document.createElement('div');
    const loading = document.createElement('div');

    block.classList.add('loading-block');
    loading.classList.add('loading-line');

    block.append(loading);

    if (btn) {
        container.insertBefore(block, btn);
    } else {
        container.append(block);
    };
}

export function loadingRemove() {
    document.querySelector('.loading-block').remove();
}

export function createAddButton(onSave, fetchData, createTableClient) {
    const button = document.createElement('button');
    button.classList.add('add-btn');
    button.textContent = 'Добавить клиента';

    button.addEventListener('click', () => {
        createModalNewClient(onSave, fetchData, createTableClient);
    });

    return button;
}

function modalRemove(modalElement, modalOverflow) {
    modalElement.classList.add('animated-modal-block');
    modalOverflow.classList.add('animated-reverse');
    setTimeout(() => { modalElement.remove(); modalOverflow.remove(); }, 400);
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
    modal.style.top = `${150 + pageYOffset}px`;

    closeButton.addEventListener('click', () => {
        modalRemove(modal, overflow);
    });
    bottomButton.addEventListener('click', () => {
        modalRemove(modal, overflow);
    })
    modal.addEventListener('click', event => {
        event._CLOSE_MODAL = true;
    });
    overflow.addEventListener('click', event => {
        if (!event._CLOSE_MODAL) {
            modalRemove(modal, overflow);
        };
    });

    modal.append(closeButton);
    modal.append(title);
    modal.append(bottomButton);
    container.append(overflow);
    container.append(modal);

    return {
        modal,
        overflow,
        bottomButton,
        title
    };
}

function createForm(modalBlock, modalOverflow, onSave, idClient, fetchData, createTableClient) {
    const form = document.createElement('form');
    const inputName = document.createElement('input');
    const inputSurname = document.createElement('input');
    const inputMiddleName = document.createElement('input');
    const contacts = document.createElement('div');
    const contactList = document.createElement('ul');
    const addContact = document.createElement('button');
    const saveButton = document.createElement('button');
    const formOverflow = document.createElement('div');
    const message = document.createElement('p');
    let error = '';

    form.classList.add('form');
    inputName.classList.add('form__input');
    inputSurname.classList.add('form__input');
    inputMiddleName.classList.add('form__input');
    contacts.classList.add('contacts');
    contactList.classList.add('contacts__list');
    addContact.classList.add('contacts__btn');
    saveButton.classList.add('form__btn');
    formOverflow.classList.add('modal-block__overflow');
    message.classList.add('error-message');

    inputSurname.placeholder = 'Фамилия*';
    inputName.placeholder = 'Имя*';
    inputMiddleName.placeholder = 'Отчество';
    addContact.textContent = 'Добавить контакт';
    saveButton.textContent = 'Сохранить';

    addContact.addEventListener('click', (e) => {
        e.preventDefault();
        createContact(contactList, addContact);
        contacts.classList.add('contacts--big-padding');
        counterContactInForm(addContact);
    });

    inputSurname.addEventListener('input', () => {
        const topText = document.getElementById('input-surname');
        if (!topText) {
            createTopPlaceholder('Фамилия*', form, inputSurname, 'input-surname');
        };
        if (inputSurname.classList.contains('input-not-valid')) inputSurname.classList.remove('input-not-valid');
    });

    inputName.addEventListener('input', () => {
        const topText = document.getElementById('input-name');
        if (!topText) {
            createTopPlaceholder('Имя*', form, inputName, 'input-name');
        };
        if (inputName.classList.contains('input-not-valid')) inputName.classList.remove('input-not-valid');
    });

    inputMiddleName.addEventListener('input', () => {
        const topText = document.getElementById('input-middlename');
        if (!topText) {
            createTopPlaceholder('Отчество', form, inputMiddleName, 'input-middlename');
        };
    });

    saveButton.addEventListener('click', event => {
        event.preventDefault();
        const client = {
            name: inputName.value.substr(0, 1).toUpperCase() + inputName.value.substr(1).toLowerCase(),
            surname: inputSurname.value.substr(0, 1).toUpperCase() + inputSurname.value.substr(1).toLowerCase(),
            lastName: inputMiddleName.value.substr(0, 1).toUpperCase() + inputMiddleName.value.substr(1).toLowerCase(),
            contacts: [],
        };
        document.querySelectorAll('.contacts__item').forEach(el => {
            const contactName = el.querySelector('.contacts__name');
            const contactValue = el.querySelector('.contacts__input');
            const contact = {
                type: contactName.textContent,
                value: contactValue.value
            };
            client.contacts.push(contact);
        });

        if (!inputSurname.value.trim()) {
            error = error + 'Поле "Фамилия" обязательно для заполнения. ';
            inputSurname.classList.add('input-not-valid');
        };
        if (!inputName.value.trim()) {
            error = error + 'Поле "Имя" обязательно для заполнения. ';
            inputName.classList.add('input-not-valid');
        };
        if (client.contacts.some(el => !el.value)) {
            error = error + 'Добавленные контакты обязательны для заполнения. ';
        };

        if (!error) {
            modalBlock.append(formOverflow);
            saveButton.classList.add('form__btn--loading');
            onSave(client, idClient).then(() => fetchData()).then(dataClient => {
                cleanTable();
                createTableClient(dataClient);
                saveButton.classList.remove('form__btn--loading');
                modalRemove(modalBlock, modalOverflow);
            });
        } else {
            const lastMessage = form.querySelector('.error-message');
            if (lastMessage) lastMessage.remove();
            message.textContent = error;
            form.insertBefore(message, saveButton);
            error = '';
        };
    });

    form.append(inputSurname);
    form.append(inputName);
    form.append(inputMiddleName);
    form.append(contacts);
    form.append(saveButton);
    contacts.append(contactList);
    contacts.append(addContact);
    modalBlock.append(form);


    return {
        inputName,
        inputSurname,
        inputMiddleName,
        contactList,
        form,
        contacts,
        addContact
    }
}

function counterContactInForm(btn) {
    let count = 0;
    document.querySelectorAll('.contacts__item').forEach(() => {
        count++
    });
    if (count === 10) {
        btn.disabled = true
    } else btn.disabled = false;
}

function createModalNewClient(save, fetchData, createTableClient) {
    const modal = createModal('Новый клиент', 'Отмена');
    createForm(modal.modal, modal.overflow, save, '', fetchData, createTableClient);
}

function createModalChangeClient({ name, surname, lastName, contacts, createdAt, updatedAt, id }, onDelete, element, onChange, fetchData, createTableClient) {
    const modal = createModal('Изменить данные', 'Удалить клиента');
    const form = createForm(modal.modal, modal.overflow, onChange, id, fetchData, createTableClient);

    const idElement = document.createElement('span');
    idElement.classList.add('modal-block__id');
    idElement.textContent = `ID: ${id}`;
    modal.title.style.display = 'inline-block';
    modal.modal.insertBefore(idElement, form.form);

    form.inputName.value = name;
    form.inputSurname.value = surname;
    form.inputMiddleName.value = lastName;

    createTopPlaceholder('Фамилия*', form.form, form.inputSurname, 'input-surname');
    createTopPlaceholder('Имя*', form.form, form.inputName, 'input-name');
    createTopPlaceholder('Отчество', form.form, form.inputMiddleName, 'input-middlename');


    for (let contact of contacts) {
        form.contacts.classList.add('contacts--big-padding');
        const contactElement = createContact(form.contactList, form.addContact);
        contactElement.contactName.textContent = contact.type;
        contactElement.inputContact.value = contact.value;

        let dropdownNames;
        switch (contact.type) {
            case 'Телефон': dropdownNames = ['Email', 'VK', 'Facebook', 'Другое'];
                break;
            case 'Email': dropdownNames = ['Телефон', 'VK', 'Facebook', 'Другое'];
                break;
            case 'Facebook': dropdownNames = ['Email', 'VK', 'Телефон', 'Другое'];
                break;
            case 'VK': dropdownNames = ['Email', 'Телефон', 'Facebook', 'Другое'];
                break;
            case 'Другое': dropdownNames = ['Email', 'VK', 'Facebook', 'Телефон'];
                break;
        };

        let count = 0;
        contactElement.listDropdown.querySelectorAll('li').forEach(el => {
            el.textContent = dropdownNames[count];
            count++;
        });
    };

    counterContactInForm(form.addContact);

    modal.bottomButton.addEventListener('click', event => {
        setTimeout(() => { createModalDeleteClient(onDelete, id, element) }, 500);
    });
}

function createModalDeleteClient(onDelete, id, element) {
    const modal = createModal('Удалить клиента', 'Отмена');
    modal.modal.classList.add('modal-del');
    const text = document.createElement('p');
    const delButton = document.createElement('button');
    text.classList.add('modal-del__text');
    delButton.classList.add('modal-del__btn');
    text.textContent = 'Вы действительно хотите удалить данного клиента?';
    delButton.textContent = 'Удалить';

    delButton.addEventListener('click', event => {
        event.preventDefault();
        modalRemove(modal.modal, modal.overflow);
        onDelete(id, element);
    });

    modal.modal.append(text);
    modal.modal.append(delButton);
}

function createContact(list, btn) {
    const contactItem = document.createElement('li');
    const contactName = document.createElement('button');
    const listDropdown = document.createElement('ul');
    const inputContact = document.createElement('input');
    const closeButton = document.createElement('button');
    const tooltip = document.createElement('div');
    const names = ['Email', 'VK', 'Facebook', 'Другое'];
    for (let i of names) {
        const li = document.createElement('li');
        li.classList.add('dropdown__item');
        li.textContent = i;
        li.addEventListener('click', () => {
            const liName = li.textContent;
            li.textContent = contactName.textContent;
            contactName.textContent = liName;
            closeDropdownMenu(listDropdown, contactName);
        });
        listDropdown.append(li);
    };

    contactItem.classList.add('contacts__item');
    contactName.classList.add('contacts__name');
    listDropdown.classList.add('contacts__dropdown');
    inputContact.classList.add('contacts__input');
    closeButton.classList.add('contacts__btn-close');
    tooltip.classList.add('contacts__tooltip');

    contactName.textContent = 'Телефон';
    tooltip.textContent = 'Удалить контакт';
    inputContact.placeholder = 'Введите данные контакта';
    if (window.innerWidth < 485) inputContact.placeholder = 'Введите данные';

    contactName.addEventListener('click', event => {
        event.preventDefault();
        closeDropdownMenu(listDropdown, contactName);
    });
    closeButton.addEventListener('click', event => {
        event.preventDefault();
        contactItem.remove();
        counterContactInForm(btn);
    });

    contactItem.append(contactName);
    contactItem.append(inputContact);
    closeButton.append(tooltip);
    contactItem.append(closeButton);
    contactItem.append(listDropdown);
    list.append(contactItem);

    return {
        inputContact,
        listDropdown,
        contactName
    }
}

function closeDropdownMenu(list, name) {
    list.classList.toggle('contacts__dropdown--active');
    name.classList.toggle('contacts__name--active');
};

function createTopPlaceholder(name, block, input, id) {
    const textBlock = document.createElement('div');
    const textSpan = document.createElement('p');

    textBlock.classList.add('placeholder-top')
    textSpan.classList.add('placeholder-top__text');
    textSpan.textContent = name;
    textSpan.id = id;
    textBlock.append(textSpan);
    block.insertBefore(textBlock, input);

    input.addEventListener('input', () => {
        if (!input.value) {
            textBlock.remove();
        };
    });
}

export function createStringClient({ name, surname, lastName, contacts, createdAt, updatedAt, id }, { onDelete, onChange, fetchData, fetchDataClient }, createTableClient) {
    const table = document.querySelector('.table');
    const stringClient = document.createElement('tr');

    stringClient.classList.add('table__client');

    const clientId = id.substr(6);
    const clientFullName = surname + ' ' + name + ' ' + lastName;

    const createdClient = editDateClient(createdAt);
    const updatedClient = editDateClient(updatedAt);

    const idClient = createColumnClient(clientId, 'column-client__id', stringClient);
    const fullNameClient = createColumnClient(clientFullName, 'column-client__fullname', stringClient);
    const dateClient = createColumnClient(createdClient.date, 'column-client__date', stringClient);
    const lastChangeClient = createColumnClient(updatedClient.date, 'column-client__last-change', stringClient);
    const contactClient = createColumnClient('', 'column-client__contact', stringClient);
    const actionClient = createColumnClient('', 'column-client__action', stringClient);

    const spanCreateTime = document.createElement('span');
    const spanChangeTime = document.createElement('span');
    spanCreateTime.classList.add('column-client__date--time');
    spanChangeTime.classList.add('column-client__date--time', 'column-client__last-change--time');
    spanCreateTime.textContent = createdClient.dateTime;
    spanChangeTime.textContent = updatedClient.dateTime;
    dateClient.append(spanCreateTime);
    lastChangeClient.append(spanChangeTime);

    const changeButton = document.createElement('button');
    const deleteButton = document.createElement('button');
    changeButton.classList.add('column-client__btn-change');
    deleteButton.classList.add('column-client__btn-del');
    changeButton.textContent = 'Изменить';
    deleteButton.textContent = 'Удалить';
    actionClient.append(changeButton);
    actionClient.append(deleteButton);

    deleteButton.addEventListener('click', event => {
        deleteButton.classList.add('column-client__btn-del--loading');
        createModalDeleteClient(onDelete, id, stringClient);
        deleteButton.classList.remove('column-client__btn-del--loading');
    });

    changeButton.addEventListener('click', event => {
        changeButton.classList.add('column-client__btn-change--loading');
        fetchDataClient(id).then(client => {
            changeButton.classList.remove('column-client__btn-change--loading');
            createModalChangeClient(client, onDelete, stringClient, onChange, fetchData, createTableClient);
        });
    });

    const contactsList = document.createElement('ul');
    contactsList.classList.add('column-contacts__list');

    createContactListInTable(contacts, contactsList);

    contactClient.append(contactsList);

    table.append(stringClient);
}

function createContactListInTable(contacts, contactsList) {
    for (let contact of contacts) {
        const contactIcon = document.createElement('li');
        const contactTooltip = document.createElement('div');
        const contactLink = document.createElement('a');
        const contactSpanType = document.createElement('span');

        let contactClass, typeOfLink;

        switch (contact.type) {
            case 'Телефон': contactClass = 'column-contacts__tel-icon';
                typeOfLink = 'tel:';
                break;
            case 'Email': contactClass = 'column-contacts__mail-icon';
                typeOfLink = 'mailto:';
                break;
            case 'Facebook': contactClass = 'column-contacts__fb-icon';
                typeOfLink = '';
                break;
            case 'VK': contactClass = 'column-contacts__vk-icon';
                typeOfLink = '';
                break;
            case 'Другое': contactClass = 'column-contacts__other-icon';
                typeOfLink = '';
                break;
        };

        contactIcon.classList.add('column-contacts__icon', contactClass);
        contactTooltip.classList.add('column-contacts__tooltip');
        contactSpanType.classList.add('column-contacts__type');
        contactLink.classList.add('column-contacts__link');
        contactLink.href = `${typeOfLink} ${contact.value}`.trim();
        contactSpanType.textContent = contact.type + ':';
        contactLink.textContent = contact.value;

        contactTooltip.append(contactSpanType);
        contactTooltip.append(contactLink);
        contactIcon.append(contactTooltip);
        contactsList.append(contactIcon);
    };
}

function editDateClient(dateAt) {
    const dateYear = dateAt.substr(0, 4);
    const dateDay = dateAt.substr(8, 2);
    const dateMonth = dateAt.substr(5, 2);
    const date = dateDay + '.' + dateMonth + '.' + dateYear;
    const dateTime = dateAt.substr(11, 5);

    return {
        date,
        dateTime
    };
}

function sortByProperty(property, direction) {
    const sortUp = (a, b) => a[property] > b[property] ? 1 : -1;
    const sortDown = (a, b) => a[property] < b[property] ? 1 : -1;
    if (direction) {
        return sortUp;
    } else return sortDown;
};

export function onSort(property, fetchData, createTable, btn) {
    let direction = true;
    if (btn.classList.contains('sort-up')) direction = !direction;

    cleanTable();
    loadingAnimated();
    fetchData().then(clients => {
        clients.map(el => el.fullName = el.surname + el.name + el.lastName);
        const sortClient = clients.sort(sortByProperty(property, direction));
        loadingRemove();
        createTable(sortClient);
        btn.classList.toggle('sort-up', direction);
        btn.querySelector('span').classList.toggle('column-sort-up', direction);
    });
}