/**
 * Created by roger on 15/12/8.
 */
$(function () {

    //search panel
    var search_options = {
        source: ["猎聘网", "智联卓聘", "智联招聘", "前程无忧", "LinkedIn", "若邻网", "其他网站", "人脉推荐"],
        degree: ["高中", "大专", "本科", "研究生", "硕士", "博士", "博士后"]
    };

    $('#sex').kendoDropDownList({
        dataSource: ['男', '女'],
        optionLabel: '全部'
    });

    $('#source').kendoDropDownList({
        dataSource: search_options.source,
        optionLabel: '全部'
    });

    $('#degree').kendoDropDownList({
        dataSource: search_options.degree,
        optionLabel: '全部'
    });

    $('#search').click(function () {
        var searchs = {
            'name': $('#name').val().trim(),
            'sage': ~~$('#age_begin').val().trim(),
            'eage': ~~$('#age_end').val().trim(),
            'sex': $('#sex').val(),
            'source': $('#source').val(),
            'degree': $('#degree').val(),
            'job': $('#job').val(),
            'company': $('#company').val(),
            'tel': $('#tel').val()
        }, filter = {};
        for (var n in searchs) {
            if (searchs[n]) filter[n] = searchs[n];
        }
        $.$ajax.get('/candidate/json-list-data', {filter: filter}, function (res) {
            console.log(res[1]);
            $('#grid').data('kendoGrid').dataSource.data(res[0]);
        })
    });

    //grid
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
            //{field: 'real_id', title: 'ID', width: 200, filterable: false},
            {field: 'name', title: '姓名', template: getName},
            {field: 'job', title: '目前职位'},
            {field: 'company', title: '所在公司'},
            {field: 'source', title: '简历来源'},
            {field: 'tel', title: '电话'},
            {field: 'user_name', title: '录入人'},
            {field: 'created_at', title: '录入时间', template: getDate, filterable: false, width: 150},
            {title: '操作', template: '<a href="\\#/candidate/edit/#:id#" class="btn btn-default btn-sm"><i class="fa fa-pencil"></i></a> ' +
            '<a href="\\#/candidate/detail/#:id#" target="_blank" class="btn btn-info btn-sm"><i class="fa fa-search"></i></a> ' +
            '<a data-id="#:id#" class="btn btn-danger btn-sm"><i class="fa fa-trash-o"></i></a>', width: 140, filterable: false}
        ],
        //filterable: {mode: 'row'},
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

    $('#grid').delegate('.badge', 'click', function (e) {
        var id = $(this).data('id'), item = $('#grid').data('kendoGrid').dataSource.get(id);
        $.$ajax({
            url: '/candidate/hunt-list',
            type: 'GET',
            dataType: 'json',
            data: {id: id},
            success: function (res) {
                var list = [];
                res.forEach(function (v) {
                    list.push('<p>{0} -- <small class="dark-gray">{1}</small></p>'.format(v.job_name, v.company_name));
                });
                $.$modal.dialog({
                    title: '[<b class="blue">{0}</b>]已推荐岗位'.format(item.name),
                    content: list.join(''),
                    destroy: true,
                    footer: null
                }).show();
            }
        });
    });

    function getName(item) {
        var icon = item.hunt_count > 0 ? '<span class="badge pointer bg-dark-yellow" data-id="{0}" title="已推荐{1}个职位，点击可查看">{1}</span>'.format(item.id, item.hunt_count) : ''
        return '<span class="person-{0}">{1} <small class="dark-gray">{2}</small> </span> {3}'.format(item.type, item.name, item.sex=="男"?"先生":"女士", icon);
    }

    function getDate(item) {
        return new Date(item.updated_at.replace(/-/g, '/')).format('yyyy-mm-dd hh:MM');
    }

    function getType(item) {
        return item.type === 'basic' ? '常规简历' : '附件简历';
    }

    $.$ajax.get('/candidate/json-list-data', {filter: {}}, function (res, filter) {
        console.log(res[1]);
        $('#grid').data('kendoGrid').dataSource.data(res[0]);
    })
});