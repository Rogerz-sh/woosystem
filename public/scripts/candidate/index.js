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
            {field: 'real_id', title: 'ID'},
            {field: 'name', title: '姓名'},
            {field: 'sex', title: '性别'},
            {field: 'age', title: '年龄'},
            {field: 'year', title: '工作年限'},
            {field: 'degree', title: '学历'},
            {field: 'tel', title: '电话'},
            {field: 'updated_at', title: '更新时间', template: getDate},
            {title: '操作', template: '<a href="/candidate/edit/#:id#" class="btn btn-default btn-sm"><i class="fa fa-pencil"></i></a> ' +
            '<a href="/candidate/detail/#:id#" target="_blank" class="btn btn-info btn-sm"><i class="fa fa-search"></i></a> ' +
            '<a data-id="#:id#" class="btn btn-danger btn-sm"><i class="fa fa-trash-o"></i></a>', width: 140}
        ],
        scrollable: false,
        pageable: true,

    });

    $('#grid').delegate('.btn-danger', 'click', function (e) {
        var id = $(this).data('id');
        $.$modal.confirm('确定要删除吗?', function (isOk) {
            if (!isOk) return;
            $.$ajax.post('/candidate/delete/'+id, function (res) {
                $.$modal.alert('删除成功', function () {
                    $('#grid').data('kendoGrid').dataSource.pushUpdate({id: id, deleted: true});
                });
            })
        })
    });

    function getDate(item) {
        return new Date(item.updated_at.replace(/-/g, '/')).format();
    }

    $.$ajax.get('/candidate/json-list-data', function (res) {
        $('#grid').data('kendoGrid').dataSource.data(res);
    })
});