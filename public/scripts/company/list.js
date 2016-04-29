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
            {field: 'id', title: 'ID'},
            {field: 'name', title: '企业名称'},
            {field: 'area', title: '所在地区', template: '#:area.split("-")[1]#'},
            {field: 'industry', title: '所属行业'},
            {field: 'contact', title: '联系人'},
            {field: 'tel', title: '联系电话'},
            {title: '操作', template: '<a href="\\#/company/edit/#:id#" class="btn btn-default btn-sm"><i class="fa fa-pencil"></i></a> ' +
            '<a href="\\#/company/detail/#:id#" class="btn btn-info btn-sm"><i class="fa fa-search"></i></a> ' +
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
        return new Date(item.updated_at.replace(/-/g, '/')).format();
    }

    function getStatus(item) {
        var icon = ['<i class="fa fa-times red"></i>','<i class="fa fa-check green"></i>'];
        return '<div class="text-center">{0}</div>'.format(icon[item.showing]);
    }

    function getIndustry(item) {
        var industry = {
            1: "IT&互联网",
            2: "金融",
            3: "房地产",
            4: "机械制造",
            5: "文件&养老&健康",
            6: "消费品",
        };
        return industry[item.industry];
    }

    $.$ajax.get('/company/json-list-data', function (res) {
        $('#grid').data('kendoGrid').dataSource.data(res);
    })
});