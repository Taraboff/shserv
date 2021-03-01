const fio = document.querySelector('#fio');
const phone = document.querySelector('#phone');
const description = document.querySelector('#description');
const timestamp = document.querySelector('#timestamp');
const button = document.querySelector('#button');
const table = document.querySelector('#main');
const del = document.querySelector('.del');
const newcontact = document.querySelector('.newcontact');
const tb = document.querySelector('#tb');
const status = document.querySelector('#status');
const dev = document.querySelector('.devinfo');
const toserver = document.querySelector('#savetoserver');
const modal = document.getElementById('myModal');
const capt = document.querySelector('.caption');
let tr, contacts, datas;

// let myModal = new bootstrap.Modal(modal, {keyboard: true});
 
modal.addEventListener('shown.bs.modal', function () {
    fio.focus();
  });

var app = new Vue({
    el: '#app',
    data: {
      version: '1.3.1',
      showModal: false,
      contacts: {},
      status: ''
    },
    methods: {
        newcontact() {
            renderView('new');
        },
        edit(event) {
            console.log(event.target);
            renderView('edit', event.target);
        },
        save() {
            savetoserver().then(res => {
                this.status = res.message;
            }
            );
        }
    }
    
})

function genTimeStamp(stamp) {
    const d = new Date();
    if (stamp) {
        return `${d.getDate()}${d.getMonth() + 1}${d.getFullYear()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}`;
    } else {
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    }
}

class PhoneBook {
    constructor() {
        this.states = {
            new: { value: 'new', displayDelBtn: false, 
                    status: 'Для создания нового контакта выберите в меню команду "Новый"',
                    caption: 'Новый контакт' },
            edit: { value: 'edit', displayDelBtn: true, 
                    status: 'Изменение контакта',
                    caption: 'Редактирование контакта' }
        };
        this.current = this.states['new'];
    }
    setState(state) {
        this.current = this.states[state];
    }
}

let state = new PhoneBook();

// document.addEventListener('click', (e) => {
//     renderView('edit', e.target);
// });
document.addEventListener('DOMContentLoaded', function () {
    getData({ init: true })
        .then((resultData) => {
            app.contacts = resultData;
            renderView('new');
    });
});

document.querySelector('#myModal').addEventListener('submit', (e) => {
    e.preventDefault();
    if (fio.value === '' || phone.value === '') return;    // проверка на пустое поле ввода
    myModal.hide();
    getData({ fio: fio.value, phone: phone.value, desc: description.value, id: timestamp.value })
        .then((resultData) => {
            app.contacts = resultData;
            renderView('new');
        });
});

del.addEventListener('click', () => {
    myModal.hide();
    getData({ id: timestamp.value, toDelete: true })
        .then((resultData) => {
            app.contacts = resultData;
            renderView('new');
        });
});


// **********************  View  *******************************

function renderView(newState, element) {

    if (tr) {
        // Array.from(tr.cells).map(cell => cell.classList.remove('active'));
    }
    switch (newState) {
        case 'new':
            state.setState('new');

            timestamp.value = genTimeStamp(true);
            fio.value = '';
            phone.value = '';
            description.value = '';
            break;

        case 'edit':
            console.log('in EDIT fase');
            state.setState('edit');
            let row = element.closest('tr');
            console.log('row: ', row);

            // if (!row || !row.hasAttribute('data-timestamp') || !table.contains(row)) return;
            
            // myModal.show();
            console.log(fio);
            fio.value = row.cells[0].textContent;
            console.log(fio);
            phone.value = row.cells[1].textContent;
            description.value = row.cells[2].textContent;
            timestamp.value = row.dataset.timestamp;
            // tr = row;
            // tr.cells[0].classList.add('active');
    }

    status.textContent = `${state.current.status}`;
    
    capt.textContent = `${state.current.caption}`;

    del.style.display = state.current.displayDelBtn ? 'inline-block' : 'none';

    // tb.textContent = '';
    // contacts.forEach((item, idx, arr) => {
    //     const row = `<tr data-timestamp="${item.id}"><td>${item.fio}</td><td>${item.phone}</td><td>${item.desc ? item.desc : ''}</td></tr>`;
    //     tb.insertAdjacentHTML('beforeend', row);
    // });

}

// *********************** Model ****************************

async function getData(param) {
    let data = localStorage.getItem('contacts');
    if (data) {
        if (param['init']) {
            datas = JSON.parse(data);
        } else if (param['toDelete']) {
            let delArray = JSON.parse(data);
            let newArr = delArray.slice();
            newArr.map((item, index, array) => {
                if (item.id == param['id']) {
                    array.splice(index, 1);
                } else {
                    return item;
                }
            });
            datas = newArr;
            localStorage.setItem('contacts', JSON.stringify(newArr));
        } else {

            // если запись редактируется, найти по id и перезаписать
            let array = JSON.parse(data);
            let newArr = array.slice();
            newArr.map((item, index, array) => {
                if (item.id == param['id']) {
                    array.splice(index, 1);
                } else {
                    return item;
                }
            });
            datas = newArr;
            datas.push(param);
            localStorage.setItem('contacts', JSON.stringify(datas));
        }

    } else {
        datas = await update(param);
        localStorage.setItem('contacts', JSON.stringify(datas.contacts));
        datas = datas.contacts;
    }

    let sorted = datas.slice();    // создаем новый массив для сортировки

    sorted.sort((a, b) => {          // функция сортировки
        let x = a.fio.toLowerCase();
        let y = b.fio.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
    });
    
    return await sorted;
}

// функция для считывания данных из файла на сервере

async function update(param) {
    try {
        let response = await fetch('/init', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(param)
        });
        if (!response.ok) {
            throw new Error('Ошибка ответа сервера');
        }
        let result = await response.json();

        return await result;

    } catch (error) {
        console.log('Возникла проблема с вашим fetch запросом: ', error.message);
    }
}

async function savetoserver() {
    let dump = localStorage.getItem('contacts');
    let obj = {};
    obj.saved = genTimeStamp(false);
    obj.contacts = JSON.parse(dump);

    // добавить в начало массива "user" и "saved"
    try {
        let response = await fetch('/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(obj)
        });

        if (!response.ok) {
            throw new Error('Ошибка ответа сервера');
        }
        let result = await response.json();

        return result;

    } catch (error) {
        console.log('Возникла проблема с вашим fetch запросом: ', error.message);
    }
}
