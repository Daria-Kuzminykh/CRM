export function onSave({ name, surname, lastName, contacts }, id = '') {
    return fetch('http://localhost:3000/api/clients', {
        method: 'POST',
        body: JSON.stringify({
            name,
            surname,
            lastName,
            contacts
        }),
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(res => res.json());
};

export function fetchData() {
    return fetch('http://localhost:3000/api/clients').then(res => res.json());
}
export function onDelete(id, element) {
    element.remove();
    fetch(`http://localhost:3000/api/clients/${id}`, {
        method: 'DELETE',
    });
}
export function onChange({ name, surname, lastName, contacts }, id) {
    return fetch(`http://localhost:3000/api/clients/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
            name,
            surname,
            lastName,
            contacts
        }),
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(res => res.json());
}
export function fetchDataClient(id) {
    return fetch(`http://localhost:3000/api/clients/${id}`).then(res => res.json());
}

export function searchClients(string) {
    return fetch(`http://localhost:3000/api/clients?search=${string}`).then(res => res.json());
}