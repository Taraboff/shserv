let datas;

var app = new Vue({
    el: '#app',
    data: {
      version: '1.3.3 vue',
      showModal: false,
      contacts: {},
      status: '',
      showDelBtn: false,
      caption: '',
      contactsForm: {
          fio: '',
          phone: '',
          description: '',
          timestamp: ''
      }
    },
    methods: {
        newcontact() {
            renderView('new');
            this.$refs['inputFio'].focus();
        },
        edit(event) {
            renderView('edit', event.target);
            this.$refs['inputFio'].focus();
        },
        delEntry() {
            getData({ id: this.timestamp, toDelete: true })
                .then((resultData) => {
                    this.contacts = resultData;
                    renderView('new');
            });
        },
        save() {
            if (this.fio === '' || this.phone === '') return;    // проверка на пустое поле ввода
            getData({ fio: this.fio, phone: this.phone, desc: this.description, id: this.timestamp })
                .then((resultData) => {
            this.contacts = resultData;
            renderView('new');
            });
        },
        closeform() {
            renderView('new');
        },
        saveonserver() {
            savetoserver().then(res => {
                this.status = res.message;
            }
            );
        }
    },
    created() {
            getData({ init: true })
                .then((resultData) => {
                    app.contacts = resultData;
                    renderView('new');
            });
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
            new: { value: 'new', 
                    status: 'Для создания нового контакта выберите в меню команду "Новый"' },
            edit: { value: 'edit', 
                    status: 'Изменение контакта' }
        };
        this.current = this.states['new'];
    }
    setState(state) {
        this.current = this.states[state];
    }
}

let state = new PhoneBook();


// **********************  View  *******************************

function renderView(newState, element) {

    switch (newState) {
        case 'new':
            state.setState('new');
            app.caption = 'Новый контакт',
            app.timestamp = genTimeStamp(true);
            app.fio = '';
            app.phone = '';
            app.description = '';
            app.showDelBtn = false;
            break;

        case 'edit':
            state.setState('edit');
            let row = element.closest('tr');
            app.caption = 'Редактирование контакта',
            app.fio = row.cells[0].textContent;
            app.phone = row.cells[1].textContent;
            app.description = row.cells[2].textContent;
            app.timestamp = row.dataset.timestamp;
            app.showDelBtn = true;
        }

    app.status = `${state.current.status}`;

}

// *********************** Model ****************************

async function getData(param) {

    let data = localStorage.getItem('contacts');
    try {
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

    } catch(e) {
        localStorage.removeItem('contacts');
        console.error('Данные в localStorage повреждены. Пожалуйста обновите страницу... ', e);
    }
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
