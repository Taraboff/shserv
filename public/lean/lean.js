Vue.config.debug = true; 
Vue.config.devtools = true;

Vue.component('lean-foto', {
    template: `<div class="a5">
                    <a href="#" class="add" @click="addfile"></a>
                </div>`,
    props: ['img'],
    methods: {
        addfile() {
            this.$emit('add', 'new');
        }
    }
});
var app = new Vue({
    el: '#app',
    data: {
        currentDept: {},
        stends: [],
        currentStend: '',
        stendVersion: '',
        message: '',
        files: {
            workgroup: '',
            result5s: '',
            plan5s: '',
            best: '',
            before1: './img/before1.jpg'
        },
        blankBg: {
            workgroup: true,
            result5s: true
        },
        isAuth: true,
        deptsList: [],
        versionsList: []
    },
    methods: {
        addfoto(e) {
            this.files.before1 = e;
        },
        async upload(e) {
            const fData = new FormData();
            console.log('Загрузка файла...');

            fData.append('stend', this.stendVersion);
            fData.append('dept', this.currentDept.code);  // устоявшееся кодовое обозначение цеха, например 08, 09, 13
            fData.append('deptId', this.currentDept.id);
            fData.append('pocket', e.target.name);
            fData.append('uploadfile', e.target.files[0]);

            let response = await fetch('/upload', {
                method: 'POST',
                body: fData
            });
            let result = await response.json();
            this.message = result.msg;
            console.log(this.message);

            this.files[e.target.name] = '/uploads/' + result.file;

            document.querySelector('form').reset(); // очищаем форму после загрузки файла
        },
        async chooseDept(e) {
            this.currentDept = this.deptsList[e.target.dataset.dept];

            this.isAuth = true;
            this.versionsList = [];
            //запрос к БД объекта стендов
            let response = await fetch(`/getstends/${this.currentDept.id}`);
            if (response.ok) {
                let result = await response.json();
                if (result.length) {
                    for (let i = 0; i < result.length; i++) {
                        this.versionsList.push(result[i].version);

                    }
                    this.stends = [...result];
                    

                }

            }
        },
        chooseStendVersion(idx) {
            this.currentStend = idx;
            this.stendVersion = this.stends[idx].version;

            if (this.stends[idx].workgroup) { // если в кармане workgroup текущего стенда есть файл
                this.files.workgroup = this.stends[idx].workgroup;
                this.blankBg.workgroup = false; // меняем пустое фоновое изображение на миниатюру .pdf-файла

            } else {
                this.files.workgroup = '';
                this.blankBg.workgroup = true;
            }
            if (this.stends[idx].result5s) {
                this.files.result5s = this.stends[idx].result5s;
                this.blankBg.result5s = false;
            } else {
                this.files.result5s = '';
                this.blankBg.result5s = true;
            }
            this.files.plan5s = this.stends[idx].plan5s ? this.stends[idx].plan5s : '';
            this.files.best = this.stends[idx].best ? this.stends[idx].best : '';
        }
    },
    async created() {
        // чтение из БД

        let response = await fetch('/init');
        if (response.ok) {
            let result = await response.json();

            if (result.length) {
                this.deptsList = [...result];
                // console.log('this.deptsList: ', this.deptsList);

            }
        } else {
            console.log(`Ошибка init: ${response.status}`);
        }
    }

});


