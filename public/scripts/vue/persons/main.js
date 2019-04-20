/**
 * Created by zhe.zhang on 2019/3/26.
 */
"use strict";

let app = new Vue({
    el: '#app',
    data: {
        persons: [],
        limit: 20,
        skip: 0,
        filter: {}
    },
    methods: {
        changePersonList: function(data) {
            alert(data);
        }
    },
    created: function () {
        console.log('created');
        var self = this;
        $.$ajax({
            url: '/v/person/vue-person-list',
            type: 'GET',
            dataType: 'json',
            data: {limit: self.limit, skip: self.skip},
            success: function (res) {
                self.persons = res;
            }
        })
    }
});