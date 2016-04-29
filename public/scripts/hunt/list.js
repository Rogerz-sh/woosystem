/**
 * Created by roger on 15/12/8.
 */
$(function () {
    $('#tab').kendoTabStrip({

    });

    $('#grid').kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: '/hunt/json-hunt-select-list-data',
                    dataType: 'json'
                }
            },
            pageSize: 10,
            schema: {
                model: {
                    id: 'id'
                }
            },
            filter: {field: 'deleted', operator: 'neq', value: true},
            sort: [
                {field: 'status', dir: 'desc', compare: function (a, b) {
                    var status = {'进行中': 3, '已暂停': 2, '已停止': 1};
                    return status[a.status] < status[b.status] ? -1 : status[a.status] === status[b.status] ? 0 : 1;
                }},
                {field: 'type', dir: 'desc', compare: function (a, b) {
                    var type = {'低': 1, '中': 2, '高': 3};
                    return type[a.type] < type[b.type] ? -1 : type[a.type] === type[b.type] ? 0 : 1;
                }},
            ]
        },
        columns: [
            {field: 'id', title: 'ID', sortable: false},
            {field: 'job_name', title: '职位名称', template: '#:job_name# <i ng-click="viewJob(#:job_id#)" class="fa fa-search"></i>', sortable: false},
            {field: 'company_name', title: '客户名称', sortable: false},
            {field: 'user_names', title: '顾问', sortable: false},
            {field: 'type', title: '重要程度', template: getType, sortable: {
                compare: function (a, b) {
                    var type = {'低': 1, '中': 2, '高': 3};
                    return type[a.type] < type[b.type] ? -1 : type[a.type] === type[b.type] ? 0 : 1;
                }
            }},
            {field: 'status', title: '当前状态', sortable: true, template: getStatus},
            {
                title: '操作',
                template: '<a href="\\#/hunt/select/#:id#" class="btn btn-default btn-sm"><i class="fa fa-pencil"></i></a>',
                width: 140,
                sortable: false
            }
        ],
        detailTemplate: '<div class="col-xs-12"><div class="detail-grid"></div></div>',
        detailInit: function (e) {
            var detailRow = e.detailRow;
            detailRow.find(".detail-grid").kendoGrid({
                dataSource: {
                    transport: {
                        read: {
                            url: '/hunt/json-hunt-select-job-data',
                            data: {job_id: e.data.job_id},
                            dataType: 'json'
                        }
                    },
                    pageSize: 5,
                    schema: {
                        model: {
                            id: 'id'
                        }
                    },
                    filter: {field: 'deleted', operator: 'neq', value: true}
                },
                columns: [
                    {field: 'name', title: 'ID'},
                    {field: 'person_name', title: '候选人'},
                    {field: 'job_name', title: '岗位名称'},
                    {field: 'company_name', title: '企业名称'},
                    {field: 'date', title: '接入日期', template: getDate},
                    {field: 'status', title: '状态'},
                    {title: '操作', template: '<a href="\\#/hunt/edit/#:id#" class="btn btn-default btn-sm"><i class="fa fa-pencil"></i></a> ' +
                    '<a href="\\#/hunt/record/#:id#" class="btn btn-info btn-sm"><i class="fa fa-list"></i></a> ' +
                    '<a data-id="#:id#" class="btn btn-danger btn-sm"><i class="fa fa-trash-o"></i></a>', width: 140}
                ],
                scrollable: false,
                pageable: true,
            });
        },
        scrollable: false,
        pageable: true,
        //sortable: true,
    });

    $('#grid2').kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: '/hunt/json-hunt-list-data',
                    dataType: 'json'
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
            {field: 'name', title: 'ID'},
            {field: 'person_name', title: '候选人'},
            {field: 'job_name', title: '岗位名称'},
            {field: 'company_name', title: '企业名称'},
            {field: 'date', title: '接入日期', template: getDate},
            {field: 'status', title: '状态'},
            {title: '操作', template: '<a href="\\#/hunt/edit/#:id#" class="btn btn-default btn-sm"><i class="fa fa-pencil"></i></a> ' +
            '<a href="\\#/hunt/record/#:id#" class="btn btn-info btn-sm"><i class="fa fa-list"></i></a> ' +
            '<a data-id="#:id#" class="btn btn-danger btn-sm"><i class="fa fa-trash-o"></i></a>', width: 140}
        ],
        scrollable: false,
        pageable: true,

    });

    $('#grid2').delegate('.btn-danger', 'click', function (e) {
        var id = $(this).data('id');
        $.$modal.confirm('确定要删除吗?', function (isOk) {
            if (!isOk) return;
            $.$ajax.post('/hunt/delete/'+id, function (res) {
                $.$modal.alert('删除成功', function () {
                    $('#grid2').data('kendoGrid').dataSource.pushUpdate({id: id, deleted: true});
                });
            });
        })
    });

    function getDate(item) {
        return new Date(item.date.replace(/-/g, '/')).format();
    }

    function getType(item) {
        var color = {'低': 'dark-gray', '中': 'yellow', '高': 'red'};
        return '<span class="{0}">{1}</span>'.format(color[item.type], item.type);
    }

    function getStatus(item) {
        var color = {'已停止': 'dark-gray', '已暂停': 'yellow', '进行中': 'green'};
        return '<span class="{0}">{1}</span>'.format(color[item.status], item.status);
    }

    $.$ajax.get('/hunt/json-hunt-list-data', function (res) {
        $('#grid2').data('kendoGrid').dataSource.data(res);
    })
});