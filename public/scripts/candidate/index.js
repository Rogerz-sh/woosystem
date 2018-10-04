/**
 * Created by roger on 15/12/8.
 */
$(function () {
    var sessionId = $('meta[name="_sessionId"]').attr('content'),
        sessionPower = $('meta[name="_sessionPower"]').attr('content');
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
            $('#grid').data('kendoGrid').dataSource.data(res[0]);
        });
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
            {field: 'year', title: '工作年限', template: '#:year ? year + "年" : ""#'},
            {field: 'location', title: '现居住地', template: getLocation},
            {field: 'tel', title: '电话'},
            {field: 'user_name', title: '录入人'},
            {field: 'created_at', title: '录入时间', template: getDate, filterable: false, width: 150},
            {title: '操作', template: getButtons, width: 110, filterable: false}
        ],
        //filterable: {mode: 'row'},
        scrollable: false,
        pageable: true,

    });

    function getButtons(item) {
        if (['10', '99'].indexOf(sessionPower) > -1 || belongs.indexOf(item.created_by) > -1) {
            return '<a href="#/candidate/detail/{0}" target="_blank" class="btn btn-info btn-xs"><i class="fa fa-search"></i></a>\
                <a href="#/candidate/edit/{0}" class="btn btn-default btn-xs"><i class="fa fa-pencil"></i></a>\
                <a data-id="{0}" class="btn btn-danger btn-xs"><i class="fa fa-trash-o"></i></a>'.format(item.id);
        } else {
            return '<a href="#/candidate/detail/{0}" target="_blank" class="btn btn-info btn-xs"><i class="fa fa-search"></i></a>'.format(item.id);
        }

    }

    $('#grid').delegate('.btn-danger', 'click', function (e) {
        var id = $(this).data('id');
        $.$modal.confirm('确定要删除吗?', function (isOk) {
            if (!isOk) return;
            $.$ajax.post('/candidate/delete/', {id: id}, function (res) {
                $.$modal.alert('删除成功', function () {
                    $('#grid').data('kendoGrid').dataSource.pushUpdate({id: id, deleted: true});
                });
            })
        })
    });

    $('#grid').delegate('.badge', 'click', function (e) {
        var id = $(this).data('id'), item = $('#grid').data('kendoGrid').dataSource.get(id);
        $.$ajax({
            url: '/candidate/report-list',
            type: 'GET',
            dataType: 'json',
            data: {id: id},
            success: function (res) {
                var list = [];
                res.forEach(function (v) {
                    var state = '已加入', date = v.date;
                    if (v.success_date) {
                        state = '已上岗';
                        date = v.success_date;
                    } else if (v.offer_date) {
                        state = '已发Offer';
                        date = v.offer_date;
                    } else if (v.face_date) {
                        state = '已面试';
                        date = v.face_date;
                    } else if (v.report_date) {
                        state = '已推荐';
                        date = v.report_date;
                    }
                    list.push('<tr><td>{0}</td><td class="dark-gray">{1}</td><td>{2}</td><td>{3}</td></tr>'.format(v.job_name, v.company_name, state, new Date(date).format()));
                });
                $.$modal.dialog({
                    title: '[<b class="blue">{0}</b>]的项目信息'.format(item.name),
                    content: '<table class="table table-bordered">' +
                                '<thead>' +
                                    '<tr>' +
                                        '<th>项目名称</th><th>所属企业</th><th>项目状态</th><th>日期</th>' +
                                    '</tr>' +
                                '</thead>' +
                                '<tbody>{0}</tbody>'.format(list.join('')) +
                            '</table>',
                    destroy: true,
                    footer: null
                }).show();
            }
        });
    });

    function getName(item) {
        var icon = item.hunt_count > 0 ? '<span class="badge pointer bg-dark-yellow" data-id="{0}" title="已加入{1}个项目，点击可查看">{1}</span>'.format(item.id, item.hunt_count) : ''
        return '<span class="person-{0}">{1} <small class="dark-gray">{2}</small> </span> {3}'.format(item.type, item.name, item.sex=="男"?"先生":"女士", icon);
    }

    function getDate(item) {
        return new Date(item.updated_at.replace(/-/g, '/')).format('yyyy-mm-dd hh:MM');
    }

    function getLocation(item) {
        if (item.location) {
            var arr = item.location.split('-');
            if (arr[1] && arr[1] != arr[0]) {
                return arr.slice(0, 2).join('-');
            } else {
                return arr[0];
            }
        } else {
            return '';
        }
    }

    function getType(item) {
        return item.type === 'basic' ? '常规简历' : '附件简历';
    }

    var belongs = [];
    $.$ajax.get('/team/team-belong-data', function (ids) {
        belongs = ids;
        $.$ajax.get('/candidate/json-list-data', {filter: {}}, function (res, filter) {
            $('#grid').data('kendoGrid').dataSource.data(res[0]);
        });
    });
});