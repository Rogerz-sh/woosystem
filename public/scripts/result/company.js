/**
 * Created by zhe.zhang on 2018/3/27.
 */
$(function () {

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
        var date = {sdate: '', edate: ''}, d = new Date(), day = d.getDay();
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

    var localData = {
        detailField: '',
        startTime: null,
        endTime: null
    };

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
            {field: 'name', title: '客户名称'},
            {field: 'report_count', title: '推荐数', template: getCountColor('report_count')},
            {field: 'face_count', title: '初试数', template: getCountColor('face_count')},
            {field: 'faces_count', title: '复试数', template: getCountColor('faces_count')},
            {field: 'offer_count', title: 'Offer数', template: getCountColor('offer_count')},
            {field: 'success_count', title: '上岗数', template: getCountColor('success_count')},
            {field: 'result_count', title: '回款数', template: getCountColor('result_count')},
        ],
        scrollable: false,
        pageable: false,
    }).data('kendoGrid');

    function getCountColor(field) {
        return function (item) {
            return !item[field] ? '<span class="bold red">{0}</span>'.format(item[field] || 0) : '<span class="bold green pointer _detail" data-id="{1}" data-field="{2}">{0}</span>'.format(item[field], item.id, field);
        }
    }

    $('#grid').delegate('._detail', 'click', function () {
        var id = $(this).data('id'), field = $(this).data('field');
        showDetailList(id, field);
    });

    $('#search').click(function () {
        var range = $('button[data-range].active').data('range'), data = {};
        var company_name = $('#company_name').val(),
            industry = $('#industry').val();
        if (range == '自定义') {
            data.sdate = $('#sdate').val();
            data.edate = $('#edate').val();
        } else {
            var date = getQuickSearchDates(range);
            data.sdate = date.sdate;
            data.edate = date.edate;
        }
        data.company_name = company_name;
        data.industry = industry;
        console.log(data);
        if (!data.company_name || data.company_name.length < 2) {
            $.$modal.alert('必须输入2个字以上客户名称关键词');
            return;
        }
        $.$ajax({
            url: '/result/json-result-company-search',
            type: 'GET',
            dataType: 'json',
            data: data,
            success: function (res) {
                grid.dataSource.data(res);
                localData.startTime = data.sdate;
                localData.endTime = data.edate;
            }
        })
    });

    function getDetailText(item) {
        switch (localData.detailField) {
            case 'bd_count':
                return '<span class="orange bold">{0}</span> <span class="blue"> 顾问：{1} </span> <span class="gray">合作顾问：{2}</span> <span class="dark-yellow">状态：{3}</span>'.format(item.company_name, item.user_name, item.user_names, item.status);
                break;
            case 'person_count':
                return '<span class="orange bold">{0}</span> <span class="gray"> {1} {2}岁</span> <span class="blue">{3}</span> <span class="main">{4}</span>'.format(item.name, item.sex, item.age, item.job, item.company);
                break;
            case 'report_count':
                return '{0} {1}'.format(item.filename, item.is_confirm == 1 ? '<small class="text-info">已确认</small>' : '<a class="btn btn-xs btn-primary" ng-click="confirmReport('+item.id+')"><i class="fa fa-check"></i> 确认</a>');
                break;
            case 'face_count':
                return '<span class="orange bold">{0}</span> <small class="gray">{1}</small> <span class="red">{2}</span> <span class="dark-gray">{3}</span> <span class="blue">{4}</span>'.format(item.person_name, item.tel, item.date, item.job_name, item.type);
                break;
            case 'faces_count':
                return '<span class="orange bold">{0}</span> <small class="gray">{1}</small> <span class="red">{2}</span> <span class="dark-gray">{3}</span> <span class="blue">{4}</span>'.format(item.person_name, item.tel, item.date, item.job_name, item.type);
                break;
            case 'offer_count':
                return '<span class="orange bold">{0}</span> <span class="blue">{1}</span> <span class="dark-gray">{2}</span> <span class="main">{3}</span>'.format(item.person_name, item.job_name, item.company_name, item.filename);
                break;
            case 'success_count':
                return '<span class="orange bold">{0}</span> <span class="blue">{1}</span> <span class="dark-gray">{2}</span> <span class="red">{3}上岗</span> <span class="main">保证期：{4}</span>'.format(item.person_name, item.job_name, item.company_name, Date.format(item.date), item.protected);
                break;
            case 'result_count':
                return '<span class="orange bold">{0}</span> <span class="blue">{1}</span> <span class="dark-gray">{2}</span> <span class="red">业绩额度{3}元</span> <span class="main">日期：{4}</span>'.format(item.person_name, item.job_name, item.company_name, item.amount, Date.format(item.date));
                break;
            default:
                return '';
                break;
        }
    }

    function getDetailTime(item) {
        var time = localData.detailField == 'person_count' ? item.created_at : item.updated_at;
        return Date.format(time);
    }

    function showDetailList (id, field) {
        localData.detailField = field;
        $.$ajax({
            url: '/result/json-company-detail-list',
            type: 'GET',
            dataType: 'json',
            data: {id: id, field: field, sdate: localData.startTime, edate: localData.endTime},
            success: function (res) {
                $.$modal.dialog({
                    title: '查看详情',
                    destroy: true,
                    size: 'lg',
                    content: '<div id="gridDetail"></div>',
                    footer: null,
                    onLoaded: function () {
                        var dom = this.dom;
                        $('#gridDetail', dom).kendoGrid({
                            dataSource: {
                                pageSize: 10,
                                schema: {
                                    model: {
                                        id: 'id'
                                    }
                                },
                                data: res
                            },
                            scrollable: false,
                            pageable: true,
                            columns: [
                                {title: '详细信息', template: getDetailText},
                                {filed: 'updated_at', title: '提交日期', template: getDetailTime}
                            ]
                        });
                    }
                }).show();
            }
        });
    }
});