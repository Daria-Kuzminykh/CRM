const container = document.querySelector('.app-container');

// export function createTableClients(clients) {
//
// }

export function createHeader(onSearch) {
    const header = document.createElement('header');
    const logo = document.createElement('img');
    const search = document.createElement('input');

    header.classList.add('header');
    logo.classList.add('header__logo');
    search.classList.add('header__input');

    logo.src = 'img/logo.svg';
    search.placeholder = 'Введите запрос';

    // search.addEventListener('input', () => {
    //     clearTimeout();
    //     setTimeout(() => {
    //         onSearch(search.value).then()
    //     }, 300);
    // });

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
    const block = document.createElement('div');
    const loading = document.createElement('div');

    block.classList.add('loading-block');
    loading.classList.add('loading-line');

    block.append(loading);

    return block;
}

export function createAddButton(onSave, onDelete, onChange, fetchDataClient) {
    const button = document.createElement('button');
    button.classList.add('add-btn');
    button.textContent = 'Добавить клиента';

    button.addEventListener('click', () => {
        createModalNewClient(onSave, onDelete, onChange, fetchDataClient);
    })

    return button;
}

function modalRemove(modalElement, modalOverflow) {
    modalElement.classList.add('animated-reverse');
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

    closeButton.addEventListener('click', () => {
        modalRemove(modal, overflow);
    });
    bottomButton.addEventListener('click', () => {
        modalRemove(modal, overflow);
        // if (btnName === 'Удалить клиента') {
        //     createModalDeleteClient();
        // };
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
        bottomButton
    };
}

function createForm(modalBlock, modalOverflow, onSave, markerAction, idClient = '', stringClient = null, onDelete, onChange, fetchDataClient) {
    const form = document.createElement('form');
    const inputName = document.createElement('input');
    const inputSurname = document.createElement('input');
    const inputMiddleName = document.createElement('input');
    const contacts = document.createElement('div');
    const contactList = document.createElement('ul');
    const addContact = document.createElement('button');
    const saveButton = document.createElement('button');

    form.classList.add('form');
    inputName.classList.add('form__input');
    inputSurname.classList.add('form__input');
    inputMiddleName.classList.add('form__input');
    contacts.classList.add('contacts');
    contactList.classList.add('contacts__list');
    addContact.classList.add('contacts__btn');
    saveButton.classList.add('form__btn');

    inputSurname.placeholder = 'Фамилия*';
    inputName.placeholder = 'Имя*';
    inputMiddleName.placeholder = 'Отчество';
    addContact.textContent = 'Добавить контакт';
    saveButton.textContent = 'Сохранить';

    addContact.addEventListener('click', (e) => {
        e.preventDefault();
        createContact(contactList);
        contacts.classList.add('contacts--big-padding');
    });

    inputSurname.addEventListener('input', () => {
        const topText = document.getElementById('input-surname');
        if (!topText) {
            createTopPlaceholder('Фамилия*', form, inputSurname, 'input-surname');
        };
    });

    inputName.addEventListener('input', () => {
        const topText = document.getElementById('input-name');
        if (!topText) {
            createTopPlaceholder('Имя*', form, inputName, 'input-name');
        };
    });

    inputMiddleName.addEventListener('input', () => {
        const topText = document.getElementById('input-middlename');
        if (!topText) {
            createTopPlaceholder('Отчество', form, inputMiddleName, 'input-middlename');
        };
    });

    saveButton.addEventListener('click', async event => {
        event.preventDefault();
        const client = {
            name: inputName.value,
            surname: inputSurname.value,
            lastName: inputMiddleName.value,
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

        if (markerAction === 'save') {
            const dataClient = await onSave(client);
            createStringClient(dataClient, onDelete, onChange, fetchDataClient);
        } else {
            const dataClient = await onSave(client, idClient);
            changeStringClient(dataClient, stringClient);
        };

        modalRemove(modalBlock, modalOverflow);
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
        contacts
    }
}

function createModalNewClient(save, onDelete, onChange, fetchDataClient) {
    const modal = createModal('Новый клиент', 'Отмена');
    createForm(modal.modal, modal.overflow, save, 'save', '', null, onDelete, onChange, fetchDataClient);
}

function createModalChangeClient({ name, surname, lastName, contacts, createdAt, updatedAt, id }, onDelete, element, onChange) {
    const modal = createModal('Изменить данные', 'Удалить клиента');
    const form = createForm(modal.modal, modal.overflow, onChange, 'change', id, element);

    form.inputName.value = name;
    form.inputSurname.value = surname;
    form.inputMiddleName.value = lastName;

    createTopPlaceholder('Фамилия*', form.form, form.inputSurname, 'input-surname');
    createTopPlaceholder('Имя*', form.form, form.inputName, 'input-name');
    createTopPlaceholder('Отчество', form.form, form.inputMiddleName, 'input-middlename');


    for (let contact of contacts) {
        form.contacts.classList.add('contacts--big-padding');
        const contactElement = createContact(form.contactList);
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

    modal.bottomButton.addEventListener('click', event => {
        event.preventDefault();
        createModalDeleteClient(onDelete, id, element);
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

function createContact(list) {
    const contactItem = document.createElement('li');
    const contactName = document.createElement('button');
    const listDropdown = document.createElement('ul');
    const inputContact = document.createElement('input');
    const closeButton = document.createElement('button');
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

    contactName.textContent = 'Телефон';
    inputContact.placeholder = 'Введите данные контакта';

    contactName.addEventListener('click', event => {
        event.preventDefault();
        closeDropdownMenu(listDropdown, contactName);
    });
    closeButton.addEventListener('click', event => {
        event.preventDefault();
        contactItem.remove();
    });

    contactItem.append(contactName);
    contactItem.append(inputContact);
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

export function createStringClient({ name, surname, lastName, contacts, createdAt, updatedAt, id }, onClickDel, onClickChange, fetchData) {
    const table = document.querySelector('.table')
    const stringClient = document.createElement('tr');

    stringClient.classList.add('table__client');

    const clientId = id.substr(8);
    const clientFullName = surname + ' ' + name + ' ' + lastName;
    const dateYear = createdAt.substr(0, 4);
    const dateDay = createdAt.substr(8, 2);
    const dateMonth = createdAt.substr(5, 2);
    const date = dateDay + '.' + dateMonth + '.' + dateYear;
    const createTime = createdAt.substr(11, 5);

    const updatedClient = editUpdatedClient(updatedAt);

    const idClient = createColumnClient(clientId, 'column-client__id', stringClient);
    const fullNameClient = createColumnClient(clientFullName, 'column-client__fullname', stringClient);
    const dateClient = createColumnClient(date, 'column-client__date', stringClient);
    const lastChangeClient = createColumnClient(updatedClient.update, 'column-client__last-change', stringClient);
    const contactClient = createColumnClient('', 'column-client__contact', stringClient);
    const actionClient = createColumnClient('', 'column-client__action', stringClient);

    const spanCreateTime = document.createElement('span');
    const spanChangeTime = document.createElement('span');
    spanCreateTime.classList.add('column-client__date--time');
    spanChangeTime.classList.add('column-client__date--time', 'column-client__last-change--time');
    spanCreateTime.textContent = createTime;
    spanChangeTime.textContent = updatedClient.updateTime;
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
        event.preventDefault();
        createModalDeleteClient(onClickDel, id, stringClient)
    });

    changeButton.addEventListener('click', event => {
        event.preventDefault();
        fetchData(id).then(client => {
            createModalChangeClient(client, onClickDel, stringClient, onClickChange);
        });
    });

    const contactsList = document.createElement('ul');
    contactsList.classList.add('column-contacts__list');

    createContactListInTable(contacts, contactsList);

    contactClient.append(contactsList);

    table.append(stringClient);
}

function changeStringClient({ name, surname, lastName, updatedAt, contacts }, element) {
    element.querySelector('.column-client__fullname').textContent = surname + ' ' + name + ' ' + lastName;

    const updatedClient = editUpdatedClient(updatedAt);
    // element.querySelector('.column-client__last-change--time').textContent = updatedClient.updateTime;
    element.querySelector('.column-client__last-change').innerHTML = `
        ${updatedClient.update}<span class="column-client__date--time">${updatedClient.updateTime}</span>
    `

    element.querySelectorAll('.column-contacts__icon').forEach(el => {
        el.remove();
    });

    const list = element.querySelector('.column-contacts__list');
    createContactListInTable(contacts, list);
}

function createContactListInTable(contacts, contactsList) {
    for (let contact of contacts) {
        const contactIcon = document.createElement('li');
        const contactTooltip = document.createElement('div');
        const contactLink = document.createElement('a');

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
        contactLink.classList.add('column-contacts__link');
        contactLink.href = `${typeOfLink} ${contact.value}`.trim();
        contactLink.textContent = contact.value;

        contactTooltip.append(contactLink);
        contactIcon.append(contactTooltip);
        contactsList.append(contactIcon);
    };
}

function editUpdatedClient(updatedAt) {
    const updateYear = updatedAt.substr(0, 4);
    const updateDay = updatedAt.substr(8, 2);
    const updateMonth = updatedAt.substr(5, 2);
    const update = updateDay + '.' + updateMonth + '.' + updateYear;
    const updateTime = updatedAt.substr(11, 5);

    return {
        update,
        updateTime
    };
}
