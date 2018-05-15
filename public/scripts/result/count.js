/**
 * Created by zhe.zhang on 2018/3/27.
 */
$(function () {

    var dsArea = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                $.$ajax.get('/performance/json-area-list', function(res) {
                    //res.unshift({id: '', a_name: '全国'});
                    options.success(res);
                });
            }
        }
    });

    var dsGroup = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                $.$ajax.get('/performance/json-group-list', function(res) {
                    //res.unshift({id: '', g_name: '全部项目组', area_id: 0, area_name: ''});
                    options.success(res);
                });
            }
        }
    });

    var dsUser = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                $.$ajax.get('/performance/json-user-list', function(res) {
                    //res.unshift({id: '', nickname: '全体成员', area_id: 0, group_id: 0});
                    options.success(res);
                });
            }
        }
    });

    var config = {
        area: {
            dataSource: dsArea,
            dataTextField: 'a_name',
            dataValueField: 'id',
            optionLabel: '全部区域',
            change: function () {
                var area_id = ~~this.value();
                dsGroup.filter({
                    logic: 'or',
                    filters: [
                        {field: 'area_id', operator: 'eq', value: area_id},
                        {field: 'area_id', operator: 'eq', value: 0},
                    ]
                });
                dsUser.filter({
                    logic: 'or',
                    filters: [
                        {field: 'area_id', operator: 'eq', value: area_id},
                        {field: 'area_id', operator: 'eq', value: 0},
                    ]
                });
            }
        },
        group: {
            dataSource: dsGroup,
            dataTextField: 'g_name',
            dataValueField: 'id',
            optionLabel: '全部项目组',
            template: '#:g_name##:area_name ? " [" + area_name + "]" : ""#',
            change: function () {
                var group_id = ~~this.value();
                dsUser.filter({
                    logic: 'or',
                    filters: [
                        {field: 'group_id', operator: 'eq', value: group_id},
                        {field: 'group_id', operator: 'eq', value: 0},
                    ]
                });
            }
        },
        user: {
            dataSource: dsUser,
            dataTextField: 'nickname',
            dataValueField: 'id',
            optionLabel: '全体成员'
        }
    };

    var ddl_area = $('#search_area').kendoDropDownList(config.area).data('kendoDropDownList');
    var ddl_group = $('#search_group').kendoDropDownList(config.group).data('kendoDropDownList');
    var ddl_user = $('#search_user').kendoDropDownList(config.user).data('kendoDropDownList');


    var sdate = $('#sdate').kendoDatePicker({
        culture: 'zh-CN',
        format: 'yyyy-MM-dd',
        change: function () {
            edate.min(this.value());
            edate.max(this.value().translate('now+365'));
            if (!edate.value()) {
                sdate.max(this.value());
                sdate.min(this.value().translate('now-365'));
                edate.value(this.value());
            }
        }
    }).data('kendoDatePicker');
    var edate = $('#edate').kendoDatePicker({
        culture: 'zh-CN',
        format: 'yyyy-MM-dd',
        change: function () {
            sdate.max(this.value());
            sdate.min(this.value().translate('now-365'));
            if (!sdate.value()) {
                edate.min(this.value());
                edate.max(this.value().translate('now+365'));
                sdate.value(this.value());
            }
        }
    }).data('kendoDatePicker');

    $('div.btn-group').delegate('button[data-range]', 'click', function () {
        var range = $(this).data('range');
        $(this).addClass('active').siblings().removeClass('active');
        if (range == '自定义') {
            $('#range_date_box').show();
        } else {
            $('#range_date_box').hide();
        }
    });

    function getQuickSearchDates(range) {
        var date = {sdate: '', edate: ''}, d = new Date();
        switch (range) {
            case '本周':
                date.sdate = Date.translate('now-'+(day - 1)).format();
                date.edate = Date.translate('now+'+(7 - day)).format();
                break;
            case '上周':
                date.sdate = Date.translate('now-'+(day - 1 + 7)).format();
                date.edate = Date.translate('now-' + day).format();
                break;
            case '本月':
                date.sdate = new Date(d.getFullYear(), d.getMonth(), 1).format();
                date.edate = new Date(d.getFullYear(), d.getMonth()+1, 0).format();
                break;
            case '上月':
                date.sdate = new Date(d.getFullYear(), d.getMonth()-1, 1).format();
                date.edate = new Date(d.getFullYear(), d.getMonth(), 0).format();
                break;
            case '一季度':
                date.sdate = new Date(d.getFullYear(), 0, 1).format();
                date.edate = new Date(d.getFullYear(), 3, 0).format();
                break;
            case '二季度':
                date.sdate = new Date(d.getFullYear(), 3, 1).format();
                date.edate = new Date(d.getFullYear(), 6, 0).format();
                break;
            case '三季度':
                date.sdate = new Date(d.getFullYear(), 6, 1).format();
                date.edate = new Date(d.getFullYear(), 9, 0).format();
                break;
            case '四季度':
                date.sdate = new Date(d.getFullYear(), 9, 1).format();
                date.edate = new Date(d.getFullYear(), 12, 0).format();
                break;
            case '上半年':
                date.sdate = new Date(d.getFullYear(), 0, 1).format();
                date.edate = new Date(d.getFullYear(), 6, 0).format();
                break;
            case '下半年':
                date.sdate = new Date(d.getFullYear(), 6, 1).format();
                date.edate = new Date(d.getFullYear(), 12, 0).format();
                break;
            case '今年':
                date.sdate = new Date(d.getFullYear(), 0, 1).format();
                date.edate = new Date(d.getFullYear() + 1, 0, 0).format();
                break;
            case '去年':
                date.sdate = new Date(d.getFullYear() - 1, 0, 1).format();
                date.edate = new Date(d.getFullYear(), 0, 0).format();
                break;
            default:
                return;
                break;
        }
        return date;
    }

    var grid = $('#grid').kendoGrid({
        dataSource: {
            data: [],
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
            {field: 'amount', title: '打款金额'},
            {field: 'date', title: '打款日期', template: '#:new Date(date).format()#'},
            {field: 'operator', title: '业绩归属', template: getResultTarget},
            {field: 'total_percent', title: '项目占比', template: '#:total_percent#%'},
            {field: 'total_result', title: '项目业绩', template: '#:kendo.toString(+total_result, "n0")#'},
        ],
        scrollable: false,
        pageable: true,
    }).data('kendoGrid');

    function getResultTarget(item) {
        var area = ddl_area.dataItem(), group = ddl_group.dataItem(), user = ddl_user.dataItem();
        if (user && user.id) {
            return user.nickname;
        } else if (group && group.id) {
            return '{0}[{1}]'.format(group.g_name, group.area_name);
        } else if (area && area.id) {
            return area.a_name;
        } else {
            return '全公司';
        }
    }

    $('#search').click(function () {
        var range = $('button[data-range].active').data('range'), data = {};
        var area = $('#search_area').val(), group = $('#search_group').val(), user = $('#search_user').val()
        if (range == '自定义') {
            data.sdate = $('#sdate').val();
            data.edate = $('#edate').val();
        } else {
            var date = getQuickSearchDates(range);
            data.sdate = date.sdate;
            data.edate = date.edate;
        }
        data.area = area;
        data.group = group;
        data.user = user;
        console.log(data);
        $.$ajax({
            url: '/result/json-result-search',
            type: 'GET',
            dataType: 'json',
            data: data,
            success: function (res) {
                var total = 0;
                res.forEach(function (v) {
                    total += +v.total_result;
                });
                $('#result_total').text(kendo.toString(total, 'n2'))
                grid.dataSource.data(res);
            }
        })
    });
});