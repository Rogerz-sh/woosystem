/**
 * Created by roger on 15/12/8.
 */
$(function () {
    var sessionId = $('meta[name="_sessionId"]').attr('content'), sessionPower = $('meta[name="_sessionPower"]').attr('content');

    var optionList = {
        industry: [
            "互联网•游戏•软件",
            "电子•通信•硬件",
            "房地产•建筑•物业",
            "金融",
            "广告•传媒•教育•文化",
            "制药•医疗,消费品",
            "汽车•机械•制造",
            "服务•外包•中介",
            "交通•贸易•物流",
            "能源•化工•环保",
            "政府•农林牧渔•其他"
        ],
        type: [
            "高级管理",
            "投资类",
            "财务类",
            "技术类",
            "市场营销类",
            "销售/客服",
            "法务/风控类",
            "人力资源/行政类"
        ],
        status: ['进行中','已暂停','已停止','已上岗'],
        created_at: [
            { value: '10', text: '最近10天' },
            { value: '30', text: '最近30天' },
            { value: '60', text: '最近60天' },
        ]
    };

    $('#industry,#status').each(function (i, ele) {
        var id = $(ele).attr('id');
        $(ele).kendoDropDownList({
            dataSource: optionList[id],
            optionLabel: '全部'
        });
    });

    $('#type_parent').kendoDropDownList({
        dataSource: [],
        dataTextField: 'name',
        dataValueField: 'id',
        optionLabel: '全部',
        change: function () {
            var item = this.dataItem();
            if (item.id) {
                bData.filter({field: 'parentid', operator: 'eq', value: item.id});
                $('#type_id').data('kendoDropDownList').dataSource.data(bData.view().toJSON());
            } else {
                $('#type_id').data('kendoDropDownList').dataSource.data([]);
            }
        }
    });
    $('#type_id').kendoDropDownList({
        dataSource: [],
        dataTextField: 'name',
        dataValueField: 'id',
        optionLabel: '全部'
    });

    var bData = new kendo.data.DataSource();
    $.$ajax({
        url: '/job/json-types-list',
        type: 'GET',
        dataType: 'json',
        success: function (res) {
            var a = [], b = [];
            res.forEach(function (v) {
                if (v.parentid == 0) {
                    a.push(v);
                } else {
                    b.push(v);
                }
            });
            $('#type_parent').data('kendoDropDownList').dataSource.data(a);
            bData.data(b);
        }
    });

    $('#created_at').kendoDropDownList({
        dataSource: optionList['created_at'],
        dataTextField: 'text',
        dataValueField: 'value',
        optionLabel: '全部'
    });

    $('#search').click(function () {
        var data = {}, filters = [];
        ['name', 'company_name', 'industry', 'type_id', 'type_parent', 'area', 'status', 'created_at'].map(function(v){
            data[v] = $('#'+v).val()
        });

        for (var n in data) {
            if (data[n]) {
                if ($('#'+n).is('input')) {
                    filters.push({field: n, operator: 'contains', value: data[n]});
                } else if (n == 'created_at') {
                    filters.push({field: n, operator: 'gte', value: Date.translate('now-' + data[n]).format()});
                } else if (n == 'type_id' || n == 'type_parent') {
                    filters.push({field: n, operator: 'eq', value: data[n] - 0});
                } else {
                    filters.push({field: n, operator: 'eq', value: data[n]});
                }
            }
        }

        $('#grid').data('kendoGrid').dataSource.filter(filters);
    });

    var grid = $('#grid').kendoGrid({
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
            {field: 'id', title: 'ID'},
            {field: 'name', title: '职位名称'},
            {field: 'company_name', title: '所属企业'},
            {field: 'area', title: '工作地点'},
            {field: 'salary', title: '岗位薪资'},
            {field: 'sellpoint', title: '职位卖点', template: '<div style="width: 200px; overflow-x: hidden; text-overflow: ellipsis; "><span style="white-space: nowrap;" title="#:sellpoint#">#:sellpoint#</span></div>'},
            {field: 'created_at', title: '发布时间', template: getDate},
            {field: 'status', title: '职位状态', template: getStatus},
            {title: '操作', template: getButtons, width: 120}
        ],
        //filterable: {mode: 'row'},
        scrollable: false,
        pageable: true,

    }).data('kendoGrid');

    function getButtons(item) {
        if (['3', '9', '10'].indexOf(sessionPower) > -1) {
            return '<a href="#/job/edit/{0}" class="btn btn-default btn-xs" title="编辑"><i class="fa fa-pencil"></i></a>\
                    <a href="#/job/detail/{0}" class="btn btn-info btn-xs" title="查看详情"><i class="fa fa-search"></i></a>\
                    <a data-id="{0}" class="btn btn-success btn-xs" title="加入我的项目"><i class="fa fa-plus-circle"></i></a>\
                    <a data-id="{0}" class="btn btn-danger btn-xs" title="删除"><i class="fa fa-trash-o"></i></a>'.format(item.id);
        } else {
            return '<a href="#/job/detail/{0}" class="btn btn-info btn-xs" title="查看详情"><i class="fa fa-search"></i></a>\
                    <a data-id="{0}" class="btn btn-success btn-xs" title="加入我的项目"><i class="fa fa-plus-circle"></i></a>'.format(item.id);
        }
    }

    $('#grid').delegate('.btn-danger', 'click', function (e) {
        var id = $(this).data('id');
        $.$modal.confirm('确定要删除吗?', function (isOk) {
            if (!isOk) return;
            $.$ajax.post('/job/delete/'+id, function (res) {
                $.$modal.alert('删除成功', function () {
                    $('#grid').data('kendoGrid').dataSource.pushUpdate({id: id, deleted: true});
                });
            })
        })
    });

    $('#grid').delegate('.btn-success', 'click', function (e) {
        var id = $(this).data('id'), item = grid.dataSource.get(id), user_ids = (item.user_ids || '').split(','), pushType = '';
        $.$modal.confirm(['加入项目', '确定要加入到项目中吗？'], function (isOk) {
            if (!isOk) return;

            if (user_ids.length > 0) {
                if (user_ids.indexOf(sessionId) > -1) {
                    $.$modal.alert('你已经参与在项目中了!');
                    return;
                } else {
                    pushType = 'join'
                }
            } else {
                pushType = 'new'
            }

            $.$ajax({
                url: '/hunt/join-hunt-select',
                type: 'POST',
                dataType: 'json',
                data: {
                    job_id: item.id,
                    job_name: item.name,
                    company_id: item.company_id,
                    company_name: item.company_name
                },
                success: function (res) {
                    if (res && res.user_ids && res.user_names) {
                        grid.dataSource.pushUpdate({id: item.id, user_ids: res.user_ids, user_names: res.user_names, status: res.status})
                    } else {
                        $.$modal.alert('操作失败');
                    }
                }
            });
        });
    });

    function getStatus(item) {
        if (item.status) {
            return item.status;
        } else {
            return '<span class="dark-gray">尚未加入项目</span>';
        }
    }

    function getDate(item) {
        return new Date(item.created_at.replace(/-/g, '/')).format();
    }

    $.$ajax.get('/job/json-job-list-data', function (res) {
        $('#grid').data('kendoGrid').dataSource.data(res);
    });
});