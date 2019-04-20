/**
 * Created by roger on 16/3/15.
 */
"use strict";
window.$eventBus = new Vue({
    methods: {
        personSideClick: function (data) {
            this.$emit('person.side.update', data);
        }
    },
    created: function () {
        this.$on('person.side.click', this.personSideClick);
    }
});

Vue.component('view-header', {
    data: function () {
        return {

        }
    },
    template: '<div class="view-header">\
    <div class="column">Roger</div>\
    </div>',
    created: function () {

    }
});

Vue.component('view-side-nav', {
    props: ['actived'],
    data: function () {
        return {
            menus: [
                {title: '人选管理', icon: 'fa-user', link: ''},
                {title: '职位管理', icon: 'fa-briefcase', link: ''},
                {title: '客户管理', icon: 'fa-coffee', link: ''},
            ],
            actived: this.actived
        }
    },
    methods: {
        active: function (idx, data) {
            this.actived = idx;
        }
    },
    template: '<div class="view-side-nav">\
    <ul>\
    <li v-for="(idx, menu) in menus" :class="{\'actived\': actived == idx}"><a :title="menu.title" @click="active(idx, menu)"><i class="fa {{menu.icon}} fa-3x"></i></a></li>\
    </ul>\
    </div>',
    created: function () {

    }
});

Vue.component('view-container-side-nav', {
    props: [],
    data: function () {
        return {
            items: [
                {name: '近期人选'},
                {name: '收藏夹'},
                {name: '收藏-1'},
            ]
        }
    },
    methods: {
        addFav: function (data) {
            this.items.push({name: data.title});
        }
    },
    template: '<div class="view-container-side-nav" v-on:test="changePersonList">\
    <ul>\
    <li v-for="item in items"><a v-on:click="$emit(\'test\', item.name)" v-text="item.name"></a></li>\
    </ul>\
    </div>',
    created: function () {
        var self = this;
        setTimeout(function () {
            self.items.push({name: '收藏-2'});
        }, 1000);
    }
});

Vue.component('view-person-list-item', {
    props: ['person'],
    data: function () {
        return {

        }
    },
    methods: {

    },
    template: '<li><b class="text-primary pointer" v-text="person.name"></b> <span v-text="person.tel"></span></li>'
})