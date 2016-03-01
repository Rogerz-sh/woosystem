/**
 * Created by roger on 15/12/8.
 */
$(function () {
    $('#grid').kendoGrid({
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
            {field: 'name', title: 'ID'},
            {field: 'company_name', title: '企业名称'},
            {field: 'user', title: '业务员'},
            {field: 'date', title: '接入日期', template: getDate},
            {field: 'status', title: '状态'},
            {title: '记录数', template: '0次'},
            {field: 'updated_at', title: '更新时间'},
            {title: '操作', template: '<a href="/bd/edit/#:id#" class="btn btn-default btn-sm"><i class="fa fa-pencil"></i></a> ' +
            '<a href="/bd/record/#:id#" class="btn btn-info btn-sm"><i class="fa fa-list"></i></a> ' +
            '<a data-id="#:id#" class="btn btn-danger btn-sm"><i class="fa fa-trash-o"></i></a>', width: 140}
        ],
        scrollable: false,
        pageable: true,

    });

    $('#grid').delegate('.btn-danger', 'click', function (e) {
        var id = $(this).data('id');
        $.$modal.confirm('确定要删除吗?', function (isOk) {
            if (!isOk) return;
            $.$ajax.post('/company/delete/'+id, function (res) {
                $.$modal.alert('删除成功', function () {
                    $('#grid').data('kendoGrid').dataSource.pushUpdate({id: id, deleted: true});
                });
            })
        })
    });

    function getDate(item) {
        return new Date(item.date.replace(/-/g, '/')).format();
    }

    $.$ajax.get('/bd/json-bd-list-data', function (res) {
        $('#grid').data('kendoGrid').dataSource.data(res);
    })
});