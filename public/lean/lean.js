Vue.config.debug = true; 
Vue.config.devtools = true;

Vue.component('lean-foto', {
    template: `<form>
                    <a :href="pocket.file ? '/uploads/' + pocket.file : ''" target="_blank">
                        <div :class="classList">
                            <input type="file" :name="pocket.name" :id="pocket.name" class="upload-file__input" @change="addfile">
                            <label :for="pocket.name" class="upload-file__label">
                                <div class="add"></div>
                            </label>
                        </div>
                    </a>
                </form>`,
    data() {
        return {
            format: 'a5'
        }
    },
    props: ['pocket', 'up'],
    methods: {
        addfile(e) {
            this.$emit('up', e);
        }
    },
    computed: {
        classList() {
            const classes = [this.format, 'purple'];
            return classes;
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
        pockets: {
            workgroup: {
                name: 'workgroup',
                file: '',
                format: 'a4',
                thumbclass: 'bg-workgroup',
                ifempty: 'blue',
                classes: {
                    a4: true,
                    'bg-workgroup': true,
                    blue: false
                }
            },
            before1: {
                name: 'before1',
                file: ''
            }
        },
        files: {
            workgroup: '',
            result5s: '',
            plan5s: '',
            best: '',
            before1: './img/before1.jpg'
        },
        thumbs: {
            before1: '',
            after1: '',
            before2: '',
            after2: ''
        },
        isAuth: true,
        deptsList: [],
        versionsList: []
    },
    methods: {
        addfoto(e) {
            console.log('e: ', e);
            
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

            this.files[e.target.name] = result.file;   
            this.pockets[e.target.name].file = result.file;

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
                this.pockets.workgroup.file = this.stends[idx].workgroup;

            } else {
                this.pockets.workgroup.file = '';
            }
            if (this.stends[idx].result5s) {
                this.files.result5s = this.stends[idx].result5s;
            } else {
                this.files.result5s = '';
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
            }
        } else {
            console.log(`Ошибка init: ${response.status}`);
        }
    }

});


