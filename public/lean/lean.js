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
        addfile(e) {
            this.$emit('up', e);
        }
    }
    
});
Vue.component('lean-footer', {
    template: `<div class="footer">
                    <p>Версия: {{ this.version }} | {{ this.date }}</p>
                </div>`,
    data() {
        return {
            version: '0.8.2',
            date: '18.04.2021 г.'
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
        uploaddir: '/uploads/',
        pockets: { workgroup: {
                        name: 'workgroup',
                        file: '',
                        format: 'a4',
                        bg: 'bg-a4',
                        empty: 'blue',
                        isImage: true,
                        thumb: ''
                    },
                    result5s: {
                        name: 'result5s',
                        file: '',
                        format: 'a4',
                        bg: 'bg-a4',
                        empty: 'blue',
                        isImage: true,
                        thumb: ''
                    },
                    plan5s: {
                        name: 'plan5s',
                        file: '',
                        format: 'a4',
                        bg: 'bg-a4',
                        empty: 'green',
                        isImage: true,
                        thumb: ''
                    },
                    best: {
                        name: 'best',
                        file: '',
                        format: 'a4',
                        bg: 'bg-a4',
                        empty: 'green',
                        isImage: true,
                        thumb: ''
                    },
                    before1: {
                        name: 'before1',
                        file: '',
                        format: 'a5',
                        bg: 'bg-foto',
                        empty: 'purple',
                        isImage: true,
                        thumb: ''
                    },
                    after1: {
                        name: 'after1',
                        file: '',
                        format: 'a5',
                        bg: 'bg-foto',
                        empty: 'green',
                        isImage: true,
                        thumb: ''
                    },
                    before2: {
                        name: 'before2',
                        file: '',
                        format: 'a5',
                        bg: 'bg-foto',
                        empty: 'purple',
                        isImage: true,
                        thumb: ''
                    },
                    after2: {
                        name: 'after2',
                        file: '',
                        format: 'a5',
                        bg: 'bg-foto',
                        empty: 'green',
                        isImage: true,
                        thumb: ''
                    },
                    params: {
                        name: 'params',
                        file: '',
                        format: 'a4r',
                        bg: 'bg-a4r',
                        empty: 'orange',
                        isImage: true,
                        thumb: ''
                    },
                    graphics5s: {
                        name: 'graphics5s',
                        file: '',
                        format: 'a4r',
                        bg: 'bg-a4r',
                        empty: 'orange',
                        isImage: true,
                        thumb: ''
                    },
                    projects: {
                        name: 'projects',
                        file: '',
                        format: 'a4r',
                        bg: 'bg-a4r',
                        empty: 'purple',
                        isImage: true,
                        thumb: ''
                    },
                    techcards: {
                        name: 'techcards',
                        file: '',
                        format: 'a4r',
                        bg: 'bg-a4r',
                        empty: 'purple',
                        isImage: true,
                        thumb: ''
                    }
    },
        isAuth: false,
        progress: 0
    },
    computed: {
        dynamiccss() {
            return { workgroup: { '--background-thumb' : `url("../uploads/thumbs/${this.pockets.workgroup.thumb}") no-repeat center top` },
                result5s: { '--background-thumb' : `url("../uploads/thumbs/${this.pockets.result5s.thumb}") no-repeat center top` },
                plan5s: { '--background-thumb' : `url("../uploads/thumbs/${this.pockets.plan5s.thumb}") no-repeat center top` },
                best: { '--background-thumb' : `url("../uploads/thumbs/${this.pockets.best.thumb}") no-repeat center top` },
                before1: { '--background-thumb' : `url("../uploads/thumbs/${this.pockets.before1.thumb}") no-repeat center top` },
                after1: { '--background-thumb' : `url("../uploads/thumbs/${this.pockets.after1.thumb}") no-repeat center top` },
                before2: { '--background-thumb' : `url("../uploads/thumbs/${this.pockets.before2.thumb}") no-repeat center top` },
                after2: { '--background-thumb' : `url("../uploads/thumbs/${this.pockets.after2.thumb}") no-repeat center top` },
                params: { '--background-thumb' : `url("../uploads/thumbs/${this.pockets.params.thumb}") no-repeat center top` },
                graphics5s: { '--background-thumb' : `url("../uploads/thumbs/${this.pockets.graphics5s.thumb}") no-repeat center top` },
                projects: { '--background-thumb' : `url("../uploads/thumbs/${this.pockets.projects.thumb}") no-repeat center top` },
                techcards: { '--background-thumb' : `url("../uploads/thumbs/${this.pockets.techcards.thumb}") no-repeat center top` }

        }
        }
    },
    methods: {
        async upload(e) {
            // const pbar = document.querySelector('.progress-bar');
            // this.progress = 10;
            const sixe = e.target.files[0].size;
            const pocket = e.target.name;
            const fData = new FormData();
            console.log('Загрузка файла...');

            fData.append('stend', this.stendVersion);
            fData.append('dept', this.currentDept.code);  // устоявшееся кодовое обозначение цеха, например 08, 09, 13
            fData.append('deptId', this.currentDept.id);
            fData.append('pocket', pocket);
            fData.append('uploadfile', e.target.files[0]);
            fData.append('isImage', this.$data.pockets[pocket].isImage);
            fData.append('format', this.$data.pockets[pocket].format);

            let response = await fetch('/upload', {
                method: 'POST',
                body: fData
            });

            let result = await response.json();
            this.message = result.msg;
            console.log(this.message);

            function sleep(milliseconds) {
                var t = (new Date()).getTime();
                var i = 0;
                while (((new Date()).getTime() - t) < milliseconds) {
                    i++;
                }
            }
            let progressCount = 0;
            
            while (progressCount <= 100) {
                sleep(20);
                this.progress = progressCount;
                progressCount++;
            }

            this.$data.pockets[pocket].file = result.file;
            if (result.thumb) {
                this.$data.pockets[pocket].thumb = result.thumb;

            }

            this.progress = 100;
            document.querySelector('form').reset(); // очищаем форму после загрузки файла
            // this.progress = 0;
             
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
                // обновить стенд
                for (let pocket in this.pockets) {
                    this.pockets[pocket].file = '';
                }
            }
        },
        chooseStendVersion(idx) {
            this.currentStend = idx;                        // порядковый номер стренда текущего подразделения
            this.stendVersion = this.stends[idx].version;   // версия выбранного стенда

            // перебор объекта this.stends[idx] - текущего стенда

            // функция обновления содержимого стенда

            const stend = this.stends[idx];
            for (let pocket in stend) {
                if (pocket != 'id' && pocket != 'dept' && pocket != 'version') {
                    if (stend[pocket]) {
                        this.$data.pockets[pocket].file = stend[pocket];
                        this.$data.pockets[pocket].thumb = stend[pocket].split('.')[0] + '.thumb.png';
                    } else {
                        this.$data.pockets[pocket].file = '';
                    }
                }
            } 

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


