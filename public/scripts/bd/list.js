/**
 * Created by roger on 15/12/8.
 */
$(function () {
    var sessionId = $('meta[name="_sessionId"]').attr('content');

    $('#tab').kendoTabStrip();

    $('#grid').kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: '/bd/json-bd-list-data',
                    data: {user_id: sessionId},
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
            {field: 'company_name', title: '企业名称'},
            {field: 'user_name', title: '顾问'},
            {field: 'user_names', title: '合作顾问'},
            {field: 'date', title: '接入日期', template: getDate},
            {field: 'status', title: '状态'},
            {title: '操作', template: '<a href="\\#/bd/edit/#:id#" class="btn btn-default btn-sm"><i class="fa fa-pencil"></i></a> ' +
            '<a href="\\#/bd/record/#:id#" class="btn btn-info btn-sm"><i class="fa fa-list"></i></a> ' +
            '<a data-id="#:id#" class="btn btn-danger btn-sm"><i class="fa fa-trash-o"></i></a>', width: 140}
        ],
        scrollable: false,
        pageable: true,

    });

    $('#grid2').kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: '/bd/json-bd-list-data',
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
            {field: 'company_name', title: '企业名称'},
            {field: 'user_name', title: '顾问'},
            {field: 'user_names', title: '合作顾问'},
            {field: 'date', title: '接入日期', template: getDate},
            {field: 'status', title: '状态'},
            {title: '操作', template: '<a href="\\#/bd/edit/#:id#" class="btn btn-default btn-sm"><i class="fa fa-pencil"></i></a> ' +
            '<a href="\\#/bd/record/#:id#" class="btn btn-info btn-sm"><i class="fa fa-list"></i></a> ' +
            '<a data-id="#:id#" class="btn btn-danger btn-sm"><i class="fa fa-trash-o"></i></a>', width: 140}
        ],
        scrollable: false,
        pageable: true,

    });

    $('#tab').delegate('.btn-danger', 'click', function (e) {
        var self = this, id = $(self).data('id');
        $.$modal.confirm('确定要删除吗?', function (isOk) {
            if (!isOk) return;
            $.$ajax.post('/bd/delete/'+id, function (res) {
                $.$modal.alert('删除成功', function () {
                    $('#grid').data('kendoGrid').dataSource.read()
                    $('#grid2').data('kendoGrid').dataSource.read();
                });
            })
        })
    });

    function getDate(item) {
        return new Date(item.date.replace(/-/g, '/')).format();
    }
});