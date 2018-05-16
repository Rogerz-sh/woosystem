/**
 * Created by roger on 15/12/8.
 */
$(function () {
    var session = {
        id: $('meta[name="_sessionId"]').attr('content'),
        power: $('meta[name="_sessionPower"]').attr('content')
    }

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
            //{field: 'id', title: 'ID'},
            {field: 'name', title: '企业名称'},
            //{field: 'contact', title: '联系人'},
            //{field: 'tel', title: '联系电话'},
            {field: 'area', title: '所在地区', template: '#:area.split("-")[1]#'},
            {field: 'industry', title: '所属行业'},
            {field: 'scale', title: '企业规模'},
            {field: 'type', title: '企业性质'},
            {field: 'found', title: '成立时间'},
            {title: '操作', template: getButtons, width: 140}
        ],
        filterable: {mode: 'row'},
        scrollable: false,
        pageable: true,

    });

    function getButtons(item) {
        var disabled = 'disabled';
        if (['3','9'].indexOf(session.power) > -1 || session.id == item.created_by) {
            disabled = '';
        }
        return ('<a href="#/company/edit/{0}" class="btn btn-default btn-sm" {1}><i class="fa fa-pencil"></i></a> ' +
            '<a href="#/company/detail/{0}" class="btn btn-info btn-sm"><i class="fa fa-search"></i></a> ' +
            '<a data-id="{0}" class="btn btn-danger btn-sm" {1}><i class="fa fa-trash-o"></i></a>').format(item.id, disabled)
    }

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