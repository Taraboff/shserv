Vue.config.debug = true; 
Vue.config.devtools = true;

Vue.component('lean-pocket', {
    template: `<form>
                    <a :href="pocket.file ? dest + pocket.file : ''" target="_blank">
                        <div :class="[pocket.format, pocket.file ? pocket.bg : pocket.empty]" :style="cssvars">
                            <input type="file" :name="pocket.name" :id="pocket.name" class="upload-file__input" @change="addfile">
                            <label :for="pocket.name" class="upload-file__label">
                                <div class="add"></div>
                            </label>
                        </div>
                    </a>
                </form>`,
    data() {
        return {
            
        }
    },
    props: ['pocket', 'up', 'dest', 'cssvars'],
    methods: {
        addfile(event) {
            this.$emit('up', event);
        }
    }
    
});
var app = new Vue({
    el: '#app',
    data: {
        deptsList: [],
        currentDept: {},
        stends: [],
        versionsList: [],
        currentStend: '',
        stendVersion: '',
        message: '',
        destination: '/uploads/',
        workgroup: {
            name: 'workgroup',
            file: '',
            format: 'a4',
            bg: 'bg-workgroup',
            empty: 'blue',
            isImage: false,
            thumb: 'bg_workgroup.jpg'
        },
        before1: {
            name: 'before1',
            file: '',
            format: 'a5',
            bg: 'bg-before1',
            empty: 'purple',
            isImage: true,
            thumb: 'before1.jpg'
        
        },
        files: {
            workgroup: '',
            result5s: '',
            plan5s: '',
            best: '',
            before1: './before1.jpg'
        },

        isAuth: false
    },
    computed: {
        dynamiccss() {
            return { workgroup: { '--background-thumb' : `url("./img/${this.workgroup.thumb}") no-repeat center top` },
            before1: { '--background-thumb' : `url("../uploads/thumbs/${this.before1.thumb}") no-repeat center top` }
        }
        }
    },
    methods: {
        async upload(e) {
            const pocket = e.target.name;
            const fData = new FormData();
            console.log('Загрузка файла...');

            fData.append('stend', this.stendVersion);
            fData.append('dept', this.currentDept.code);  // устоявшееся кодовое обозначение цеха, например 08, 09, 13
            fData.append('deptId', this.currentDept.id);
            fData.append('pocket', pocket);
            fData.append('uploadfile', e.target.files[0]);
            fData.append('isImage', this.$data[pocket].isImage);

            let response = await fetch('/upload', {
                method: 'POST',
                body: fData
            });
            let result = await response.json();
            this.message = result.msg;
            console.log(this.message);

            this.$data[pocket].file = result.file;
            if (result.thumb) {
                console.log('result.thumb: ', result.thumb);
                this.$data[pocket].thumb = result.thumb;
            }
            
            document.querySelector('form').reset(); // очищаем форму после загрузки файла
            
                console.log('forced');
           
             
        },
        async chooseDept(e) {
            this.currentDept = this.deptsList[e.target.dataset.dept];
            this.stendVersion = '';
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
                this.workgroup.file = this.stends[idx].workgroup;
                this.workgroup.thumb = this.stends[idx].workgroup.split('.')[0]+'.thumb.png';

            } else {
                this.workgroup.file = '';
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


