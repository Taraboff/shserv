var app = new Vue({
    el: '#app',
    data: {
        workgroup: 0
    },
    methods: {
        addDocument() {
            this.workgroup++;
            console.log('addDocument method affected... ' + this.workgroup);
            return true
        }
    }
});