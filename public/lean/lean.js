var app = new Vue({
    el: '#app',
    data: {
        workgroup_file: '',
        audit_file: ''
    },
    methods: {
        async upload(e) {
            const fData = new FormData();
            fData.append('uploadfile', e.target.files[0]);

            let response = await fetch('/upload', {
                method: 'POST',
                body: fData
            });
            let result = await response.text();
            console.log('result: ', result);

        },
    }

});

