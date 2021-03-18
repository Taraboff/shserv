var app = new Vue({
    el: '#app',
    data: {
        currentDept: 'default'
    },
    methods: {
        async upload(e) {
            const fData = new FormData();
            console.log('Загрузка файла...');

            fData.append('uploadfile', e.target.files[0]);
            
            let response = await fetch('/upload', {
                method: 'POST',
                body: fData
            });
            let result = await response.text();
            console.log(result);
            
            document.querySelector('form').reset();   // очищаем форму
        }
    }

});

