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
            version: '0.8.4',
            date: '22.04.2021 г.',
            
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
        sysmsg: 'Система готова к работе. Пожалуйста, авторизуйтесь',
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
        progress: 0,
        isModalVisible: false
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
    mounted() {
        let vm = this;
        document.addEventListener('click', function(item) {
            if (item.target === vm.$refs['modal_wrapper']) {
                vm.swModal();
            }
        })
    },
    methods: {
        async upload(e) {
            const size = e.target.files[0].size;
            const pocket = e.target.name;
            const fData = new FormData();
            this.sysmsg = 'Загрузка файла...';
            // console.log('Загрузка файла...');

            fData.append('stend', this.stendVersion);
            fData.append('dept', this.currentDept.code);  // устоявшееся кодовое обозначение цеха, например 08, 09, 13
            fData.append('deptId', this.currentDept.id);
            fData.append('pocket', pocket);
            fData.append('uploadfile', e.target.files[0]);
            fData.append('isImage', this.$data.pockets[pocket].isImage);
            fData.append('format', this.$data.pockets[pocket].format);

            try {
                let response = await axios.post('/upload',
                    fData, 
                    { 
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        onUploadProgress: function(progressEvent) {
                            this.progress = parseInt(Math.round(( progressEvent.loaded / progressEvent.total) * 100));
                            // если файл закачан, перейти к след.этапу - конвертации файла
                            if (progressEvent.loaded == progressEvent.total) {
                                this.sysmsg = 'Обработка файла...';
                            }
                        }.bind(this)
                    });

                let result = response.data;
                app.sysmsg = result.msg;
                console.log(app.sysmsg);

                app.pockets[pocket].file = result.file;
                this.progress = 0;

                if (result.thumb) {
                    app.pockets[pocket].thumb = result.thumb;
                }
            } catch(error) {
                if (error.response) {
                  // The request was made and the server responded with a status code
                  // that falls out of the range of 2xx
                  console.log('error.response.data' + error.response.data);
                  console.log('error.response.status' + error.response.status);
                  console.log('error.response.headers' + error.response.headers);
                } else if (error.request) {
                  // The request was made but no response was received
                  // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                  // http.ClientRequest in node.js
                  console.log('error.request' + error.request);
                } else {
                  // Something happened in setting up the request that triggered an Error
                  console.log('Error', error.message);
                }
                console.log('error.config' + error.config);
            }

            document.querySelector('form').reset(); // очищаем форму после загрузки файла
        },

        async chooseDept(e) {
            this.currentDept = this.deptsList[e.target.dataset.dept];
            this.sysmsg = `Выбрано подразделение: ${this.currentDept.name}. Пожалуйста, выберите версию стенда или создайте новый`;
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
            this.sysmsg = `Выбрана версия стенда: ${this.stendVersion}. Вы можете загружать отсканированные документы. Доступны к загрузке форматы jpg, png и pdf`;
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

        },
        swModal() {
            this.isModalVisible = !this.isModalVisible;
        },
        makeNewStend() {
            // axios.post('/new', )
            // this.currentDept.id,  version формируется вручную в поле ввода модального окна
            // открытие модального окна
                this.sysmsg = 'Вы создали новый стенд. Можно загрузить отсканированные документы. Разрешены форматы jpg, png и pdf';
            // const sql_new_stend = `INSERT stends(dept, version) VALUES (${req.body.deptId}, '${req.body.stend}');`;
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


