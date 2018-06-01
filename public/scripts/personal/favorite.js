$(function () {
    var favorites = [];

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
            var $li = $('<li class="flex flex-v-center"><span data-id="{0}" class="flex-1">{1}</span> {2} {3}</li>'.format(
                item.id,
                '<span class="fa fa-caret-right"></span>' + ' ' + item.name,
                item.depth < 2 ? '<i data-id="{0}" class="margin-right-5 fa fa-plus-circle green _add" title="添加子收藏夹"></i>'.format(item.id) : '',
                item.parent_id === null ? '' : '<i data-id="{0}" class="margin-right-5 fa fa-pencil blue _edit" title="编辑名称"></i> <i data-id="{0}" class="margin-right-5 fa fa-trash-o red _delete" title="删除"></i>'.format(item.id))
            );
            $li.appendTo($(dom));
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

    $.$ajax({
        url: '/personal/json-favorite-list',
        type: 'GET',
        data: { type: 'person' },
        success: function (res) {
            favorites = res;
            favorites.unshift({id: 0, name: '人才收藏夹', parent_id: null});
            initMenu();
        }
    });


    //change right side content
    $('#contentMenu').delegate('span[data-id]', 'click', function () {
        var id = $(this).data('id');
        $('#contentMenu').find('span[data-id]').removeClass('active');
        $(this).addClass('active');
        selectedFavId = id;
        grid.dataSource.read();
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
            //{field: 'real_id', title: 'ID', width: 200, filterable: false},
            {field: 'name', title: '姓名', template: getName},
            {field: 'job', title: '目前职位'},
            {field: 'company', title: '所在公司'},
            {field: 'source', title: '简历来源'},
            {field: 'tel', title: '电话'},
            //{field: 'user_name', title: '录入人'},
            {field: 'created_at', title: '录入时间', template: getDate, filterable: false, width: 150},
            {
                title: '操作',
                template: '<a href="\\#/candidate/detail/#:person_id#" target="_blank" class="btn btn-info btn-xs"><i class="fa fa-search"></i></a>' +
                '<a data-id="#:id#" class="btn btn-danger btn-xs margin-left-10"><i class="fa fa-trash-o"></i></a>',
                width: 80
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

    $('#grid').delegate('.btn-danger', 'click', function (e) {
        var id = $(this).data('id');
        $.$modal.confirm('确定要从该收藏夹中删除吗?', function (isOk) {
            if (!isOk) return;
            $.$ajax.post('/personal/delete-favorite-target', {id: id}, function (res) {
                if (res) {
                    grid.dataSource.read();
                } else {
                    $.$modal.alert('删除失败！');
                }
            })
        })
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

});