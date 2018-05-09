/**
 * Created by zhe.zhang on 2018/3/27.
 */
$(function () {
    var power = $('meta[name="_sessionPower"]').attr('content');

    var grid = $('#grid').kendoGrid({
        dataSource: {
            transport: {
                read: function (option) {
                    $.$ajax({
                        url: '/result/json-result-list',
                        type: 'GET',
                        dataType: 'json',
                        success: function (res) {
                            option.success(res);
                        }
                    });
                }
            },
            schema: {
                model: {
                    id: 'id'
                }
            },
            pageSize: 10
        },
        columns: [
            {field: 'company_name', title: '打款客户'},
            {field: 'job_name', title: '上岗职位'},
            {field: 'name', title: '款项名称'},
            {field: 'amount', title: '打款金额', width: 100},
            {field: 'date', title: '打款日期', template: '#:new Date(date).format()#', width: 90},
            {field: 'operator', title: '操作顾问'},
            {field: 'area_name', title: '申请公司'},
            {field: 'creator', title: '申请用户'},
            {field: 'status', title: '审核状态', template: getStatus, width: 80},
            {
                title: '操作',
                template: getButtons,
                width: power == 9 ? 110 : 80
            }
        ],
        scrollable: false,
        pageable: true,
        detailTemplate: '<div class="panel panel-default"><div class="panel-body no-padding"><div class="_detail"></div></div></div>',
        detailInit: function(e) {
            e.detailRow.find("._detail").kendoGrid({
                dataSource: {
                    transport: {
                        read: function (opt) {
                            $.$ajax({
                                url: '/result/json-result-user-list',
                                type: 'GET',
                                dataType: 'json',
                                data: { result_id: e.data.id },
                                success: function (res) {
                                    opt.success(res);
                                }
                            });
                        }
                    },
                    schema: {
                        model: {
                            id: 'id'
                        }
                    }
                },
                columns: [
                    {field: 'type_name', title: '分配环节'},
                    {field: 'user_name', title: '顾问名称'},
                    {field: 'group_name', title: '所属项目组'},
                    {field: 'area_name', title: '所属区域'},
                    {field: 'percent', title: '分配比例', template: '#:percent#%'},
                    {field: 'user_result', title: '业绩额度', template: '#:kendo.toString(user_result, "n2")#'},
                ],
                scrollable: false,
                pageable: false,
            });
        }
    }).data('kendoGrid');

    function getStatus(item) {
        return item.status == 1 ? '<span class="green">已审核</span>' : '<span class="dark-gray">未审核</span>'
    }

    function getButtons(item) {
        if (power == 9) {
            return '<a class="btn btn-info btn-xs margin-right-5 _edit" title="编辑" href="#/result/edit?id={0}"><i class="fa fa-pencil"></i></a>\
                <a class="btn btn-danger btn-xs margin-right-5 _delete" title="删除" data-id="{0}#"><i class="fa fa-trash-o"></i></a>\
                <a class="btn btn-success btn-xs margin-right-5 _audit" title="审核" data-id="{0}#" {1}><i class="fa fa-check"></i></a>'.format(item.id, item.status == 1 ? "disabled" : "");
        } else {
            return '<a class="btn btn-info btn-xs margin-right-5 _edit" title="编辑" href="#/result/edit?id={0}"><i class="fa fa-pencil"></i></a>\
                <a class="btn btn-danger btn-xs margin-right-5 _delete" title="删除" data-id="{0}#"><i class="fa fa-trash-o"></i></a>'.format(item.id);
        }
    }

    $('#grid').delegate('a._delete', 'click', function () {
        var id = $(this).data('id');
        $.$modal.confirm('确认要删除吗？', function (isOk) {
            if (!isOk) return;
            $.$ajax({
                url: '/result/delete-result',
                type: 'POST',
                dataType: 'json',
                data: { result_id: id },
                success: function(res) {
                    if (res) {
                        $.$modal.alert('删除成功');
                        grid.dataSource.read();
                    } else {
                        $.$modal.alert('删除失败');
                    }
                }
            })
        });
    });

    $('#grid').delegate('a._audit', 'click', function () {
        var id = $(this).data('id');
        $.$modal.confirm('确认要通过审核吗？', function (isOk) {
            if (!isOk) return;
            $.$ajax({
                url: '/result/audit-result',
                type: 'POST',
                dataType: 'json',
                data: { result_id: id },
                success: function(res) {
                    if (res) {
                        $.$modal.alert('操作成功');
                        grid.dataSource.read();
                    } else {
                        $.$modal.alert('操作失败');
                    }
                }
            })
        });
    });
});