var app = new Vue({
    el: '#app',
    data: {
        workgroup_file: '',
        audit_file: ''
    },
    methods: {
        addDocument() {
            // this.workgroup++;
            // console.log('addDocument method affected... ' + this.workgroup);
            return true
        },
        async upload(e) {
            
            let response = fetch('/upload', {
                method: 'POST',
                body: e.target.files[0]
            });
        },
        uploadFile() {
            console.log('File uploaded!');
        }
    }

});

