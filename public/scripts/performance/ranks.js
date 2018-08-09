/**
 * Created by zhe.zhang on 2018/3/27.
 */
$(function () {

    var config = {

    };

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

    $('div.btn-group').delegate('button[data-target]', 'click', function () {
        $(this).addClass('active').siblings().removeClass('active');
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

    $('#search').click(function () {
        var range = $('button[data-range].active').data('range'), target = $('button[data-target].active').data('target'), data = {};
        if (range == '自定义') {
            data.sdate = $('#sdate').val();
            data.edate = $('#edate').val();
        } else {
            var date = getQuickSearchDates(range);
            data.sdate = date.sdate;
            data.edate = date.edate;
        }
        data.target = target;
        console.log(data);
        $.$ajax({
            url: '/performance/json-performance-ranks',
            type: 'GET',
            dataType: 'json',
            data: data,
            success: function (res) {
                res.result_percent.forEach(function (v) {
                    v.rank_result = kendo.toString(v.rank_result, 'n3') - 0;
                });
                renderRankList('#rank_result', res.result, target, '元');    //业绩排名
                renderRankList('#rank_result_percent', res.result_percent, target, '单');    //单数排名
                renderRankList('#rank_bd', res.bd, target, '个');    //签约排名
                renderRankList('#rank_job', res.job, target, '个');    //职位排名
                renderRankList('#rank_report', res.report, target, '份');    //报告排名
                renderRankList('#rank_face', res.face, target, '次');    //面试排名
                renderRankList('#rank_offer', res.offer, target, '份');    //Offer排名
                renderRankList('#rank_success', res.success, target, '人');    //上岗排名
            }
        });
    });

    function renderRankList(ele, data, target, unit) {
        var $ul = $(ele), li = [], colors = ['red','blue','dark-yellow'];
        for (var i = 0; i < 50; i++) {
            var d = data[i];
            if (d) {
                li.push('<li class="list-group-item {4}">第<b>{0}</b>名 <span class="margin-left-10">{1}</span> <span class="pull-right bold">{2}{3}</span></li>'.format(i + 1, getTargetName(d, target), d['rank_result'], unit, colors[i] || ''));
            } else {
                //li.push('<li class="list-group-item {4}">第<b>{0}</b>名 <span class="margin-left-10">{1}</span> <span class="pull-right bold">{2}{3}</span></li>'.format(i + 1, '无', 0, unit, colors[i] || ''));
                break;
            }
        }
        $ul.html(li.join(''));
    }

    function getTargetName(data, target) {
        if (target == 'users') {
            return '{0} <span class="margin-left-10 dark-gray">{1} - {2}</span>'.format(data.nickname, data.group_name, data.area_name);
        } else {
            return '{0} - {1}'.format(data.group_name, data.area_name);
        }
    }
});