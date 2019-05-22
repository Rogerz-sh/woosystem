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
            {field: 'report_count', title: '推荐数'},
            {field: 'face_count', title: '面试数'},
            {field: 'offer_count', title: 'Offer数'},
            {field: 'result_count', title: '回款数', template: function (item) {
                return item.result_count || 0;
            }},
        ],
        scrollable: false,
        pageable: false,
    }).data('kendoGrid');

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
            }
        })
    });
});