Vue.config.debug = true; 
Vue.config.devtools = true;
Vue.component('lean-pocket', {
    template: `<form>
                    
                    <a :href="pocket.file ? dest + pocket.file : '#'" :target="pocket.file ? '_blank' : ''">
                        <div :class="[pocket.format, pocket.file ? pocket.bg : pocket.empty]" :style="cssvars">
                            <input type="file" :name="pocket.name" :id="pocket.name" class="upload-file__input" @change="addfile">
                            <label :for="pocket.name" class="upload-file__label">
                                <div class="add" v-show="ready"></div>
                            </label>
                        </div>
                    </a>
                </form>`,
    data() {
        return {
            
        }
    },
    props: ['pocket', 'up', 'dest', 'cssvars', 'ready'],
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
            version: '0.9.0',
            date: '07.06.2021 г.',
            
        }
    }
});

var app = new Vue({
    el: '#app',
    data: {
        deptsList: [],
        currentDept: {},
        stends: [],
        currentStend: '',
        stendVersion: '',
        activeStendId: '',
        activeStends: [],
        sysmsg: 'Система готова к работе. Выберите подразделение',
        
        uploaddir: '/uploads/',
        pockets: { workgroup: {
                        name: 'workgroup',
                        file: '',
                        format: 'a4',
                        bg: 'bg-a4',
                        empty: 'blue',
                        thumb: ''
                    },
                    result5s: {
                        name: 'result5s',
                        file: '',
                        format: 'a4',
                        bg: 'bg-a4',
                        empty: 'blue',
                        thumb: ''
                    },
                    plan5s: {
                        name: 'plan5s',
                        file: '',
                        format: 'a4',
                        bg: 'bg-a4',
                        empty: 'green',
                        thumb: ''
                    },
                    best: {
                        name: 'best',
                        file: '',
                        format: 'a4',
                        bg: 'bg-a4',
                        empty: 'green',
                        thumb: ''
                    },
                    before1: {
                        name: 'before1',
                        file: '',
                        format: 'a5',
                        bg: 'bg-foto',
                        empty: 'purple',
                        thumb: ''
                    },
                    after1: {
                        name: 'after1',
                        file: '',
                        format: 'a5',
                        bg: 'bg-foto',
                        empty: 'green',
                        thumb: ''
                    },
                    before2: {
                        name: 'before2',
                        file: '',
                        format: 'a5',
                        bg: 'bg-foto',
                        empty: 'purple',
                        thumb: ''
                    },
                    after2: {
                        name: 'after2',
                        file: '',
                        format: 'a5',
                        bg: 'bg-foto',
                        empty: 'green',
                        thumb: ''
                    },
                    params: {
                        name: 'params',
                        file: '',
                        format: 'a4r',
                        bg: 'bg-a4r',
                        empty: 'orange',
                        thumb: ''
                    },
                    graphics5s: {
                        name: 'graphics5s',
                        file: '',
                        format: 'a4r',
                        bg: 'bg-a4r',
                        empty: 'orange',
                        thumb: ''
                    },
                    projects: {
                        name: 'projects',
                        file: '',
                        format: 'a4r',
                        bg: 'bg-a4r',
                        empty: 'purple',
                        thumb: ''
                    },
                    techcards: {
                        name: 'techcards',
                        file: '',
                        format: 'a4r',
                        bg: 'bg-a4r',
                        empty: 'purple',
                        thumb: ''
                    }
    },
        isAuth: false,
        progress: 0,
        isModalVisible: false,
        newStendName: '',
        modalmsg: ''
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
        },
        readyToUpload() {
            let ready = !!(Object.keys(this.currentDept).length && this.stends.length && (this.stendVersion && this.stendVersion !== 'promo'));
            return ready; 
        }
    },
    mounted() {
        let vm = this;
        document.addEventListener('click', function(item) {
            if (item.target === vm.$refs['modal_wrapper']) {
                vm.swModal();
            }
        });
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
        // console.log('created '+ new Date());
    },
    methods: {
        async upload(e) {
            if (this.stends.length === 0) {
                this.sysmsg = "Для загрузки документов выберите стенд";
                return
            }
            const pocket = e.target.name;
            const fData = new FormData();
            this.sysmsg = 'Загрузка файла...';

            fData.append('stend', this.stendVersion);
            fData.append('dept', this.currentDept.code);  // устоявшееся кодовое обозначение цеха, например 08, 09, 13
            fData.append('deptId', this.currentDept.id);
            fData.append('pocket', pocket);
            fData.append('uploadfile', e.target.files[0]);
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
            this.activeStendId = '';
            this.activeStends = [];
            this.currentDept = this.deptsList[e.target.dataset.dept];
            let resp = await fetch(`/getactive/${this.currentDept.id}`);

            if (resp.ok) {
                let result = await resp.json();
                if (result.length > 0) {
                    this.activeStendId = result[0].activestend;
                }
            }

            this.sysmsg = `Выбрано подразделение: ${this.currentDept.name}. Вы можете выбрать версию стенда или создать новый`;
            this.stendVersion = '';
            this.isAuth = true;

            //запрос к БД объекта стендов
            let response = await fetch(`/getstends/${this.currentDept.id}`);
            if (response.ok) {
                let result = await response.json();
                if (result.length) {
                    this.stends = [...result];
                } else {
                    this.stends = [];
                }
                // если нет активного стенда, обновить стенд (установить пустые карманы)
                if (!this.activeStendId) {
                    this.currentStend = '';
                    for (let pocket in this.pockets) {
                        this.pockets[pocket].file = '';
                        this.pockets[pocket].thumb = '';
                    }
                } else {
                    this.stends.forEach((item, idx) => {
                        if (item.id === this.activeStendId) {
                            this.activeStends.push(item.id);
                            this.chooseStendVersion(idx);
                        } 
                    });
                }
            }
        },
        updateStend(stend) {        // функция обновления содержимого стенда
            for (let pocket in stend) {
                if (pocket != 'id' && pocket != 'dept' && pocket != 'version' && pocket != 'isActive') {
                    if (stend[pocket]) {
                        this.$data.pockets[pocket].file = stend[pocket];
                        this.$data.pockets[pocket].thumb = stend[pocket].split('.')[0] + '.thumb.png';
                    } else {
                        this.$data.pockets[pocket].file = '';
                        this.$data.pockets[pocket].thumb = '';
                    }
                }
            } 
        },
        chooseStendVersion(idx) {
            
            const stend = this.stends[idx];  // текущий стенд
            this.stendVersion = this.stends[idx].version;   // версия выбранного стенда
            this.currentStend = idx;
            this.sysmsg = `Выбрана версия стенда: ${this.stendVersion}`;
            
            this.updateStend(stend);
        },
        swModal() {
            const self = this;
            this.modalmsg = '';
            
            this.isModalVisible = !this.isModalVisible;
            if (this.isModalVisible) {
                setTimeout(function (){
                    self.$refs['newinput'].focus();
                }, 500);
            }
        },
        async makeNewStend() {

            await axios.post('/new', { 
                headers: { 'Content-Type': 'application/json'},
                data: JSON.stringify({
                    'dept': this.currentDept.id,
                    'stend': this.newStendName
                })
            }).then( async () => {
                        let response = await fetch(`/getstends/${app.currentDept.id}`);   
                        if (response.ok) {
                            let result = await response.json();
                            if (result.length) {
                                app.stends = [...result];
                            }
                        }
                        return;
            }).then(() => {
                this.sysmsg = 'Вы создали новый стенд. Можно загрузить отсканированные документы. Разрешены форматы .jpg, .png и .pdf';
                this.stendVersion = this.newStendName;
                this.swModal();
                this.newStendName = '';
                const stend = this.stends[this.stends.length - 1];      // выбор текущего стенда
                this.updateStend(stend);    // обновление содержимого стенда
            });
        },
        validateNewStendName() {
            let ifStendExist = false;
            if (!this.newStendName) {
                this.modalmsg = "Название стенда не может быть пустым!";
                return;
            } else {
               ifStendExist = this.stends.some((item) => {
                    if (item.version === this.newStendName) {
                        this.modalmsg = "Вы ввели существующее имя стенда";
                        return true;
                    } else {
                        return false;
                    }
                });
            }

            if (!ifStendExist) {
                this.makeNewStend();
            } else {
                this.newStendName = '';
            }
            return;
        },
       
        async makeStendActive(e) {
            let body = {};
            const value = e.target.value;
            if (!e.target.checked) {    // если флажок активного стенда снимается
                this.activeStends = []; 
                body = { dept: this.currentDept.id, stendId: value, checked: false };
                this.activeStendId = '';
                this.sysmsg = "У текущего подразделения теперь нет активного стенда";
            } else {
                this.activeStends = [];
                this.activeStends.push(value);
                body = { dept: this.currentDept.id, stendId: value, checked: true };
                this.activeStendId = value;
                this.sysmsg = `Установлен активный стенд`;
            }
            try {
                let response = await fetch('/setactive', {
                    headers: { 'Content-Type': 'application/json'},
                    method: 'post',
                    body: JSON.stringify(body)
                });
                let result = await response.json();
                return;

            } catch(e) {
                console.log('Ошибка запроса /setactive: ', e);
            }
        }
    }

});


