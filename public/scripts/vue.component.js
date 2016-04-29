/**
 * Created by roger on 16/3/15.
 */
Vue.component('nav-bar', {
    template: '<ul class="nav-list">' +
    '<li v-for="menu in menus" :class="{\'active\': navIndex == $index}" @mouseenter="changeSubNav($index)" @mouseleave="changeSubNav(-1)">' +
    '<a href="{{menu.url}}">{{menu.label}} <span class="caret" v-if="menu.items.length > 0"></span></a>' +
    '<ul class="sub-nav" v-if="menu.items.length > 0" v-show="$index == activeIndex">' +
    '<li v-for="item in menu.items"><a href="{{item.url}}">{{item.label}}</a></li>' +
    '</ul>' +
    '</li>' +
    '</ul>',
    props: ['navIndex'],
    data: function () {
        return {
            menus: [
                {url: '/dashboard', label: '首页'},
                {url: '#', label: '数据管理', items: [
                    {url: '/company/list', label: '企业管理'},
                    {url: '/job/list', label: '职位管理'},
                    {url: '/resume/list', label: '简历管理'},
                ]},
            ],
            activeIndex: -1
        }
    },
    methods: {
        changeSubNav: function (idx) {
            this.$data.activeIndex = idx;
        }
    },
    activate: function (done) {
        var self = this;
        //$(self.$el).children().bind('mouseenter', function () {
        //    var li = $(this);
        //    if (li.find('span.caret').length > 0) {
        //        li.find('.sub-nav').show().css({'min-width': li.outerWidth(), 'top': li.outerHeight()});
        //    }
        //}).bind('mouseleave', function () {
        //    var li = $(this);
        //    if (li.find('span.caret').length > 0) {
        //        li.find('.sub-nav').hide();
        //    }
        //});
        done();
    }
});