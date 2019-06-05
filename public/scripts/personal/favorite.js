$(function () {
    var favorites = [], total = {};

    var selectedFavId = 0;

    function buildFavTree(items) {
        var favTree = [];
        var getChildren = function (id, depth) {
            var children = [];
            //debugger;
            items.forEach(function (v) {
                if (v.parent_id == id) {
                    v.depth = depth;
                    v.children = getChildren(v.id, v.depth + 1);
                    children.push(v);
                }
            });
            return children.length > 0 ? children : null;
        }

        items.forEach(function (v) {
            if (v.parent_id === null) {
                v.depth = 0;
                v.children = getChildren(v.id, v.depth + 1);
                favTree.push(v);
            }
        });

        return favTree;
    }

    function buildSideMenu(dom, items) {
        $(dom).empty();
        console.log(items);
        items.forEach(function (item) {
            var count = total[item.id] || 0;
            var $li = $('<li class="flex flex-v-center"><span data-id="{0}" class="flex-1">{1}</span> {2} {3}</li>'.format(
                item.id,
                '<span class="fa fa-caret-down _handler"></span>' + ' <span class="_name">' + item.name + '(<span class="_count">'+count+'</span>)</span>',
                item.depth < 2 ? '<i data-id="{0}" class="margin-right-5 fa fa-plus-circle green _add" title="添加子收藏夹"></i>'.format(item.id) : '',
                item.parent_id === null ? '' : '<i data-id="{0}" class="margin-right-5 fa fa-pencil blue _edit" title="编辑名称"></i> <i data-id="{0}" class="margin-right-5 fa fa-trash-o red _delete" title="删除"></i>'.format(item.id))
            );
            $li.appendTo($(dom));
            var $count = $li.parent().prev().find('._count');
            while ($count && $count.length > 0) {
                var p_count = $count.text() - 0;
                p_count += count;
                $count.text(p_count);
                try {
                    $count = $count.closest('ul').prev('li').find('._count');
                } catch (e) {
                    $count = null;
                }
            }
            if (item.children) {
                var _ul = $('<ul></ul>');
                _ul.insertAfter($li);
                buildSideMenu(_ul, item.children);
            }
        });
    }

    function initMenu() {
        buildSideMenu('#contentMenu', buildFavTree(favorites));
        $('#contentMenu').find('span[data-id]').eq(0).addClass('active');
    }

    function refreshMenu() {
        $.$ajax({
            url: '/personal/json-favorite-list',
            type: 'GET',
            data: { type: 'person' },
            success: function (res) {
                res.total.forEach(function (v) {
                    total[v.favorite_id] = v.count;
                });
                favorites = res.favorites;
                favorites.unshift({id: 0, name: '人才收藏夹', parent_id: null});
                initMenu();
            }
        });
    }

    refreshMenu();


    //change right side content
    $('#contentMenu').delegate('span._name', 'click', function () {
        var id = $(this).closest('span[data-id]').data('id');
        $('#contentMenu').find('span[data-id]').removeClass('active');
        $(this).closest('span[data-id]').addClass('active');
        selectedFavId = id;
        grid.dataSource.read();
    });

    $('#contentMenu').delegate('span._handler', 'click', function () {
        $(this).closest('li').next('ul').toggle('slow');
        $(this).toggleClass('fa-caret-down fa-caret-right');
    });

    //show icons of operator
    $('#favoriteOperate').click(function () {
        $('#contentMenu').find('i.fa').toggle();
    });

    //add sub favorite
    $('#contentMenu').delegate('i._add', 'click', function () {
        var id = $(this).data('id');
        $.$modal.prompt(['添加子收藏夹', '请输入收藏夹的名称'], function (isOk, val) {
            if (!isOk) return;
            if (!val) {
                $.$modal.alert('名称不能为空！');
            } else {
                $.$ajax({
                    url: '/personal/add-favorite',
                    type: 'POST',
                    data: { name: val, parent_id: id },
                    success: function (res) {
                        if (res) {
                            favorites.push({id: res, name: val, parent_id: id});
                            initMenu();
                        } else {
                            $.$modal.alert('添加失败！');
                        }
                    }
                });

            }
        });
    });

    //edit favorite
    $('#contentMenu').delegate('i._edit', 'click', function () {
        var id = $(this).data('id'), item = favorites[favorites.at({id: id})];
        $.$modal.prompt(['编辑名称', '请输入新的名称'], item.name, function (isOk, val) {
            if (!isOk) return;
            if (!val) {
                $.$modal.alert('名称不能为空！');
            } else {
                $.$ajax({
                    url: '/personal/edit-favorite',
                    type: 'POST',
                    data: { id: id, name: val },
                    success: function (res) {
                        if (res) {
                            item.name = val;
                            initMenu();
                        } else {
                            $.$modal.alert('保存失败！');
                        }
                    }
                });
            }
        });
    });

    //delete favorite
    $('#contentMenu').delegate('i._delete', 'click', function () {
        var id = $(this).data('id'), item = favorites[favorites.at({id: id})];
        $.$modal.confirm(['删除收藏夹', '确认要删除吗？'], function (isOk, val) {
            if (!isOk) return;
            if (item.children) {
                $.$modal.alert('该收藏夹下面还有子收藏夹，请先删除子收藏夹！');
            } else {
                $.$ajax({
                    url: '/personal/delete-favorite',
                    type: 'POST',
                    data: { id: id },
                    success: function (res) {
                        if (res == 1) {
                            var idx = favorites.at({id: id});
                            if (idx > -1) favorites.splice(idx, 1);
                            initMenu();
                        } else if (res == -1) {
                            $.$modal.alert('该收藏夹下还有收藏项目，请删除后再试！');
                        } else {
                            $.$modal.alert('删除失败！');
                        }
                    }
                });
            }
        });
    });

    /**************************************************************************************************************/

    //search panel
    var search_options = {
        source: ["猎聘网", "智联卓聘", "智联招聘", "前程无忧", "LinkedIn", "若邻网", "其他网站", "人脉推荐"],
        degree: ["高中", "大专", "本科", "研究生", "硕士", "博士", "博士后"]
    };

    $('#sex', '#searchCtn').kendoDropDownList({
        dataSource: ['男', '女'],
        optionLabel: '全部'
    });

    $('#source', '#searchCtn').kendoDropDownList({
        dataSource: search_options.source,
        optionLabel: '全部'
    });

    $('#degree', '#searchCtn').kendoDropDownList({
        dataSource: search_options.degree,
        optionLabel: '全部'
    });

    $('#search', '#searchCtn').click(function () {
        var searchs = {
            'name': $('#name', '#searchCtn').val().trim(),
            'sage': ~~$('#age_begin', '#searchCtn').val().trim(),
            'eage': ~~$('#age_end', '#searchCtn').val().trim(),
            'sex': $('#sex', '#searchCtn').val(),
            'source': $('#source', '#searchCtn').val(),
            'degree': $('#degree', '#searchCtn').val(),
            'job': $('#job', '#searchCtn').val(),
            'company': $('#company', '#searchCtn').val(),
            'tel': $('#tel', '#searchCtn').val()
        }, filter = [], containsField = ['name', 'job', 'company', 'tel'];
        for (var n in searchs) {
            if (searchs[n]) {
                if (n != 'sage' && n != 'eage') {
                    var operator = containsField.indexOf(n) > -1 ? 'contains' : 'eq';
                    filter.push({field: n, operator: operator, value: searchs[n]});
                } else {
                    var operator = n == 'sage' ? 'gte' : 'lte';
                    filter.push({field: n, operator: operator, value: searchs[n]});
                }
            }
        }
        grid.dataSource.filter(filter);
    });

    $('#reset', '#searchCtn').click(function () {
        $('#searchCtn input').val('');
        $('select', '#searchCtn').each(function (i, sel) {
            $(sel).data('kendoDropDownList').select(0);
        });
    });

    //grid
    var grid = $('#grid').kendoGrid({
        dataSource: {
            transport: {
                read: function (option) {
                    $.$ajax({
                        url: '/personal/json-person-favorite-data',
                        type: 'GET',
                        dataType: 'json',
                        data: {favorite_id: selectedFavId},
                        success: function (res) {
                            option.success(res);
                        }
                    });
                }
            },
            pageSize: 10,
            schema: {
                model: {
                    id: 'id'
                }
            },
            filter: {field: 'deleted', operator: 'neq', value: true}
        },
        columns: [
            {field: 'id', title: '<label><input type=\'checkbox\' id=\'selAll\'><span class=\'text\'></span></label>', template: '<label><input type="checkbox" name="fav_id" value="#:id#"/><span class="text"></span></label>', width: 40},
            {field: 'name', title: '姓名', template: getName},
            {field: 'job', title: '目前职位'},
            {field: 'company', title: '所在公司'},
            {field: 'year', title: '工作年限'},
            {field: 'location', title: '居住地'},
            {field: 'tel', title: '电话'},
            {field: 'created_at', title: '录入时间', template: getDate, filterable: false, width: 150},
            {field: 'dynamic', title: '寻访记录', template: '<div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;" title="#:dynamic || \'\'#">#:dynamic || "无"#</div>', filterable: false, width: 200},
            {
                title: '操作',
                template: '<a href="\\#/candidate/detail/#:person_id#" target="_blank" class="btn btn-info btn-xs" title="查看简历"><i class="fa fa-search"></i></a>' +
                '<a data-id="#:id#" class="btn btn-danger btn-xs margin-left-10 _delete" title="从收藏夹删除"><i class="fa fa-trash-o"></i></a>' +
                '<a data-id="#:id#" class="btn btn-primary btn-xs margin-left-10 _view" title="查看收藏信息"><i class="fa fa-book"></i></a>' +
                '<a data-id="#:id#" class="btn btn-primary btn-xs margin-left-10 _edit" title="编辑收藏信息"><i class="fa fa-edit"></i></a>',
                width: 150
            }
        ],
        //filterable: {mode: 'row'},
        scrollable: false,
        pageable: true,

    }).data('kendoGrid');

    function getName(item) {
        return '<span class="person-{0}">{1} <small class="dark-gray">{2}</small> </span>'.format(item.type, item.name, item.sex=="男"?"先生":"女士");
    }

    function getDate(item) {
        return new Date(item.updated_at.replace(/-/g, '/')).format('yyyy-mm-dd hh:MM');
    }

    function getType(item) {
        return item.type === 'basic' ? '常规简历' : '附件简历';
    }

    $('#grid').delegate('._delete', 'click', function (e) {
        var id = $(this).data('id');
        $.$modal.confirm('确定要从该收藏夹中删除吗?', function (isOk) {
            if (!isOk) return;
            $.$ajax.post('/personal/delete-favorite-target', {id: id}, function (res) {
                if (res) {
                    grid.dataSource.read();
                    refreshMenu();
                } else {
                    $.$modal.alert('删除失败！');
                }
            })
        })
    });

    $('#grid').delegate('._view', 'click', function (e) {
        var id = $(this).data('id'), item = grid.dataSource.get(id).toJSON();
        console.log(item);
        $.$modal.dialog({
            title: '查看收藏信息',
            destroy: true,
            size: 'lg',
            content: '' +
            '<div class="flex flex-row" id="favorite_info">' +
                '<div style="width: 400px; padding: 10px; border-right: 1px dashed #aaa;">' +
                    '<h3 class="margin-top-5">{{person.name}} <small>{{person.sex == "男" ? "先生" : item.sex == "女" ? "女士" : ""}}</small></h3>' +
                    '<p><span v-if="person.age" class="margin-right-10"><span class="blue">{{person.age}}</span>岁</span> / <span v-if="person.year" class="margin-left-10">工作年限：<span class="blue">{{person.year}}</span>年</span></p>' +
                    '<p><span v-if="person.location" class="margin-right-10">居住地：<span class="blue">{{person.location}}</span></span> / <span v-if="person.tel" class="margin-left-10">手机：<span class="blue">{{person.tel}}</span></span></p>' +
                    '<p v-if="person.job">目前职位：<span class="blue">{{person.job}}</span></p>' +
                    '<p v-if="person.company">所在公司：<span class="blue">{{person.company}}</span></p>' +
                    '<hr>' +
                    '<p v-if="salary_now">目前月薪：<span class="blue">{{salary_now}}</span>元</p>' +
                    '<p v-if="salary_year">目前年薪：<span class="blue">{{salary_year}}</span></p>' +
                    '<p v-if="salary_wish">期望薪资：<span class="blue">{{salary_wish}}</span></p>' +
                    '<p v-if="target_company">目标公司：<span class="blue">{{target_company}}</span></p>' +
                '</div>' +
                '<div class="flex-1 flex flex-col" style="background: #fdfce7; border-radius: 5px; padding: 0 10px;">' +
                    '<div class="flex-1"><div style="max-height: 500px; overflow-y: auto;"><div class="dark-gray text-center margin-top-5" v-if="dynamics.length == 0">暂时没有寻访记录</div><favorite-dynamic v-for="dynamic in dynamics" :dynamic="dynamic"></favorite-dynamic></div></div>' +
                    '<div class="margin-top-10"><div><textarea class="form-control" rows="3" style="resize: none; font-size: 12px;" v-model="dynamic_text"></textarea></div><div><a class="btn btn-sm btn-info width-200 margin-top-5" v-on:click="addDynamic()">添加寻访记录</a></div></div>' +
                '</div>' +
            '</div>',
            footer: null,
            onLoaded: function() {
                var self = this, dom = self.dom;
                dom.find('#favorite_info').closest('.modal').width(1200);
                var eventBus = new Vue();
                Vue.component('favorite-dynamic', {
                    props: ['dynamic'],
                    methods: {
                        deleteDynamic: function (id) {
                            var _this = this;
                            $.$modal.confirm(['删除寻访记录', '确认要删除这条记录吗？'], function (isOk) {
                                if (!isOk) return;
                                eventBus.$emit('delete-dynamic', id);
                            });
                        }
                    },
                    template: '' +
                    '<div class="flex flex-col border-radius-5 margin-top-5 padding-10 bg-dark-yellow white">' +
                        '<p class="flex-1">{{dynamic.text}}</p>' +
                        '<div class="border-top border-color-yellow dark-gray padding-top-5">' +
                            '<span class="margin-bottom-5">{{new Date(dynamic.date).format("yyyy-mm-dd hh:MM")}}</span>' +
                            '<span class="pull-right"><i class="fa fa-edit blue margin-right-10 pointer hidden" title="编辑"></i><i class="fa fa-trash-o red pointer" title="删除" v-on:click="deleteDynamic(dynamic.id)"></i></span>' +
                        '</div>' +
                    '</div>'
                });
                var vue = new Vue({
                    el: '#favorite_info',
                    data: {
                        salary_now: '',
                        salary_year: '',
                        salary_wish: '',
                        target_company: '',
                        person: item,
                        dynamics: [],
                        dynamic_text: ''
                    },
                    methods: {
                        addDynamic: function () {
                            var _this = this, date = new Date().format('yyyy-mm-dd hh:MM');
                            $.$ajax({
                                url: '/personal/add-favorite-dynamic',
                                type: 'POST',
                                dataType: 'json',
                                data: {fav_tar_id: item.id, text: _this.dynamic_text, date: date},
                                success: function (res) {
                                    if (res > 0) {
                                        _this.dynamics.unshift({id: res, fav_tar_id: item.id, text: _this.dynamic_text, date: date});
                                        _this.dynamic_text = '';
                                    } else {
                                        $.$modal.alert('保存失败！');
                                    }
                                }
                            });
                        }
                    },
                    created: function () {
                        var _this = this;
                        var getInfo = function () {
                            return new Promise(function (resolve, reject) {
                                $.$ajax({
                                    url: '/personal/json-favorite-info',
                                    type: 'GET',
                                    dataType: 'json',
                                    data: {fav_tar_id: item.id},
                                    success: function (res) {
                                        if (res) {
                                            _this.salary_now = res.salary_now || '';
                                            _this.salary_year = res.salary_year || '';
                                            _this.salary_wish = res.salary_wish || '';
                                            _this.target_company = res.target_company || '';
                                            resolve();
                                        } else {
                                            reject();
                                        }
                                    },
                                    error: function (e) {
                                        reject(e);
                                    }
                                });
                            });
                        }
                        var getDynamic = function () {
                            return new Promise(function (resolve, reject) {
                                $.$ajax({
                                    url: '/personal/json-favorite-dynamic',
                                    type: 'GET',
                                    dataType: 'json',
                                    data: {fav_tar_id: item.id},
                                    success: function (res) {
                                        if (res) {
                                            _this.dynamics = res;
                                            resolve();
                                        } else {
                                            reject();
                                        }
                                    },
                                    error: function (e) {
                                        reject(e);
                                    }
                                });
                            });
                        }
                        Promise.all([getInfo(), getDynamic()]).then(function() {
                            self.show();
                        }).catch(function(e) {
                            console.log(e);
                        });
                        eventBus.$on('delete-dynamic', function (id) {
                            $.$ajax({
                                url: '/personal/delete-favorite-dynamic',
                                type: 'POST',
                                dataType: 'json',
                                data: {id: id},
                                success: function (res) {
                                    if (res > 0) {
                                        var idx = _this.dynamics.at({id: id});
                                        if (idx > -1) _this.dynamics.splice(idx, 1);
                                    } else {
                                        $.$modal.alert('删除失败！');
                                    }
                                }
                            });
                        })
                    }
                });
            }
        });
    });

    $('#grid').delegate('._edit', 'click', function (e) {
        var id = $(this).data('id'), item = grid.dataSource.get(id);
        console.log(item);
        $.$modal.dialog({
            title: '编辑收藏信息',
            destroy: true,
            content: '<form class="form form-horizontal" id="form">' +
            '<div class="form-group">' +
            '<label class="control-label col-xs-3">候选人姓名：</label>' +
            '<div class="col-xs-9 form-control-static"><span id="person_name" class="blue bold"></span></div>' +
            '</div>' +
            '<div class="form-group">' +
            '<label class="control-label col-xs-3"><span class="red">*</span> 目前月薪：</label>' +
            '<div class="col-xs-8 form-control-static"><div class="input-group"><input type="text" class="form-control" id="salary_now" v-model="salary_now"><span class="input-group-addon">元</span></div></div>' +
            '</div>' +
            '<div class="form-group">' +
            '<label class="control-label col-xs-3">目前年薪：</label>' +
            '<div class="col-xs-8 form-control-static"><input type="text" class="form-control" v-model="salary_year"></div>' +
            '</div>' +
            '<div class="form-group">' +
            '<label class="control-label col-xs-3">期望薪资：</label>' +
            '<div class="col-xs-8 form-control-static"><input type="text" class="form-control" v-model="salary_wish"></div>' +
            '</div>' +
            '<div class="form-group">' +
            '<label class="control-label col-xs-3">目标公司：</label>' +
            '<div class="col-xs-8 form-control-static"><input type="text" class="form-control" v-model="target_company"></div>' +
            '</div>' +
            '<div class="form-group">' +
            '<label class="control-label col-xs-3"></label>' +
            '<div class="col-xs-8"><div class="btn btn-sm btn-success col-xs-2" v-on:click="submit()" :disabled="!is_valid">确定</div><div class="btn btn-sm btn-success col-xs-2 margin-left-10" v-on:click="cancel()">取消</div></div>' +
            '</div>' +
            '</form>',
            footer: null,
            onLoaded: function() {
                var self = this, dom = self.dom;
                $('#person_name', dom).html('{0} <small class="dark-gray">{1}</small>'.format(item.name, item.sex == '男' ? '先生' : item.sex == '女' ? '女士' : ''));
                var vue = new Vue({
                    el: '#form',
                    data: {
                        salary_now: '',
                        salary_year: '',
                        salary_wish: '',
                        target_company: ''
                    },
                    computed: {
                        is_valid: function () {
                            return this.salary_now.toString().trim() !== ''
                        }
                    },
                    methods: {
                        submit: function () {
                            var _this = this;
                            $.$ajax({
                                url: '/personal/edit-favorite-info',
                                type: 'POST',
                                dataType: 'json',
                                data: {fav_tar_id: item.id, salary_now: _this.salary_now, salary_year: _this.salary_year, salary_wish: _this.salary_wish, target_company: _this.target_company},
                                success: function (res) {
                                    if (res > 0) {
                                        $.$modal.alert('保存成功！');
                                        self.hide();
                                    } else {
                                        $.$modal.alert('保存失败！');
                                    }
                                }
                            });
                        },
                        cancel: function () {
                            self.hide();
                        }
                    },
                    created: function () {
                        var _this = this;
                        $.$ajax({
                            url: '/personal/json-favorite-info',
                            type: 'GET',
                            dataType: 'json',
                            data: {fav_tar_id: item.id},
                            success: function (res) {
                                _this.salary_now = res.salary_now || '';
                                _this.salary_year = res.salary_year || '';
                                _this.salary_wish = res.salary_wish || '';
                                _this.target_company = res.target_company || '';
                                $('#salary_now', dom).kendoNumericTextBox({
                                    spinners: false,
                                    min: 0,
                                    format: '',
                                    value: _this.salary_now
                                });
                                self.show();
                            }
                        });
                    }
                });
            }
        });
    });

    $('#add').click(function () {
        $.$modal.dialog({
            title: '添加收藏夹内容',
            size: 'lg',
            destroy: true,
            content: '<div id="dialogCtn"><div id="dlgSearchCtn"></div><div id="dlgGrid"></div></div>',
            footer: {
                buttons: [
                    {
                        name: 'ok',
                        handler: function () {
                            var self = this, dom = self.dom, $checked = dom.find('input[name="person_id"]:checked'), ids = [];
                            if ($checked.length > 0) {
                                $checked.each(function (i, v) { ids.push($(v).val()); });
                                console.log(ids);
                                $.$ajax({
                                    url: '/personal/add-favorite-target',
                                    type: 'POST',
                                    data: { favorite_id: selectedFavId, ids: ids },
                                    success: function (res) {
                                        if (res) {
                                            grid.dataSource.read();
                                            refreshMenu();
                                            self.hide();
                                        } else {
                                            $.$modal.alert('添加失败！');
                                        }
                                    }
                                });
                            } else {
                                $.$modal.alert('选择内容为空，请重新选择！');
                            }
                        }
                    },
                    {
                        name: 'cancel',
                        handler: function () {
                            this.hide();
                        }
                    }
                ]
            },
            onLoaded: function () {
                var dom = this.dom;
                dom.find('#dialogCtn').closest('.modal').css('width', '90%');
                dom.find('#dlgSearchCtn').html($('#searchCtn').html());
                $('#sex', dom).kendoDropDownList({
                    dataSource: ['男', '女'],
                    optionLabel: '全部'
                });

                $('#source', dom).kendoDropDownList({
                    dataSource: search_options.source,
                    optionLabel: '全部'
                });

                $('#degree', dom).kendoDropDownList({
                    dataSource: search_options.degree,
                    optionLabel: '全部'
                });

                $('#search', dom).click(function () {
                    var searchs = {
                        'name': $('#name', dom).val().trim(),
                        'sage': ~~$('#age_begin', dom).val().trim(),
                        'eage': ~~$('#age_end', dom).val().trim(),
                        'sex': $('#sex', dom).val(),
                        'source': $('#source', dom).val(),
                        'degree': $('#degree', dom).val(),
                        'job': $('#job', dom).val(),
                        'company': $('#company', dom).val(),
                        'tel': $('#tel', dom).val()
                    }, filter = {};
                    for (var n in searchs) {
                        if (searchs[n]) filter[n] = searchs[n];
                    }
                    $.$ajax.get('/personal/json-person-non-favorite-data', {filter: filter, favorite_id: selectedFavId}, function (res) {
                        console.log(res[1]);
                        $('#dlgGrid').data('kendoGrid').dataSource.data(res[0]);
                    });
                });

                $('#reset', dom).click(function () {
                    $('input', dom).val('');
                    $('select', dom).each(function (i, sel) {
                        $(sel).data('kendoDropDownList').select(0);
                    });
                });

                $('#dlgGrid', dom).kendoGrid({
                    dataSource: {
                        data: [],
                        pageSize: 10,
                        schema: {
                            model: {
                                id: 'id'
                            }
                        },
                        filter: {field: 'deleted', operator: 'neq', value: true}
                    },
                    columns: [
                        {title: '<label><input type=\'checkbox\' name=\'person_id\' id=\'selAll\'><span class=\'text\'></span></label>', template: '<label><input type="checkbox" name="person_id" value="#:id#"><span class="text"></span></label>', width: 60},
                        {field: 'name', title: '姓名', template: getName},
                        {field: 'job', title: '目前职位'},
                        {field: 'company', title: '所在公司'},
                        {field: 'source', title: '简历来源'},
                        {field: 'tel', title: '电话'},
                        {field: 'user_name', title: '录入人'},
                        {field: 'created_at', title: '录入时间', template: getDate, width: 150}
                    ],
                    //filterable: {mode: 'row'},
                    scrollable: false,
                    pageable: true,

                });

                $.$ajax.get('/personal/json-person-non-favorite-data', {filter: {}, favorite_id: selectedFavId}, function (res) {
                    console.log(res[1]);
                    $('#dlgGrid', dom).data('kendoGrid').dataSource.data(res[0]);
                });
            }
        }).show();
    });

    $('#grid').delegate('#selAll', 'click', function () {
        var checked = $(this).prop('checked');
        $('#grid').find('input[name="fav_id"]').prop('checked', checked);
    });

    $('#grid').delegate('input[name="fav_id"]', 'click', function () {
        var total = $('#grid').find('input[name="fav_id"]').length, checked = $('#grid').find('input[name="fav_id"]:checked').length;
        if (total == checked) {
            $('#grid').find('#selAll').prop('checked', true);
        } else {
            $('#grid').find('#selAll').prop('checked', false);
        }
    });

    $('#replace').click(function () {
        var checked = $('#grid').find('input[name="fav_id"]:checked'), ids = [];
        if (checked.length == 0) {
            $.$modal.alert('请选择要转入的人才简历');
            return;
        }
        checked.each(function (i, ipt) {
            ids.push($(ipt).val());
        });
        $.$modal.dialog({
            title: '转入到其它收藏夹',
            size: 'sm',
            destroy: true,
            content: '<div><select id="favorite_id"></select></div>',
            footer: {
                buttons: [
                    {
                        name: 'ok',
                        handler: function () {
                            var self = this, dom = self.dom, fav_id = $('#favorite_id', dom).val();
                            if (fav_id !== '') {
                                $.$ajax({
                                    url: '/personal/reset-favorites',
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {fav_id: fav_id, list: ids},
                                    success: function (res) {
                                        if (res) {
                                            grid.dataSource.read();
                                            refreshMenu();
                                            self.hide();
                                        } else {
                                            $.$modal.alert('保存失败');
                                        }
                                    }
                                });
                            }
                        }
                    },
                    {
                        name: 'cancel',
                        handler: function () {
                            this.hide();
                        }
                    }
                ]
            },
            onLoaded: function () {
                var dom = this.dom, favData = [];
                $('span[data-id]', '#contentMenu').each(function (i, ipt) {
                    var id = $(this).data('id'), name = $(this).find('span._name').text().split('(')[0]
                    favData.push({'id': id, 'name': name});
                });
                $('#favorite_id', dom).kendoDropDownList({
                    dataSource: favData,
                    dataTextField: 'name',
                    dataValueField: 'id',
                    optionLabel: '请选择要转入的收藏夹'
                });
            }
        }).show();
    });
});