/**
 * Created by zhe.zhang on 2018/3/27.
 */
$(function () {

    $('div.btn-group').delegate('button[data-target]', 'click', function () {
        $(this).addClass('active').siblings().removeClass('active');
        searchRank();
    });

    function getQuickSearchDates() {
        var date = {sdate: '', edate: ''}, d = new Date();
        date.sdate = new Date(d.getFullYear(), d.getMonth(), 1).format();
        date.edate = new Date(d.getFullYear(), d.getMonth()+1, 0).format();
        return date;
    }

    function searchRank() {
        var target = $('button[data-target].active').data('target'), data = {};
        var date = getQuickSearchDates();
        data.sdate = date.sdate;
        data.edate = date.edate;
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
    }

    function getPersonPerformance() {
        var date = getQuickSearchDates(), data = {};
        data.sdate = date.sdate;
        data.edate = date.edate;
        $.$ajax({
            url: '/performance/json-performance-data',
            type: 'GET',
            dataType: 'json',
            data: data,
            success: function (data) {
                //g: #84ffb5, y: #fff8a4, r: #ff8484
                var month = new Date().format('yyyy-mm');
                $('.circle span').each(function (i, span) {
                    var id = $(span).attr('id');
                    $(span).text(getCountData(month, data[id]));
                    initTargetView(id, month, data);
                });
            }
        })
    }

    function getCountData(month, data) {
        var count = 0;
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            if (d.month == month) {
                count = d.count;
                break;
            }
        }
        return count;
    }

    function renderRankList(ele, data, target, unit) {
        var $ul = $(ele), li = [], colors = ['red','blue','dark-yellow'];
        for (var i = 0; i < 5; i++) {
            var d = data[i];
            if (d) {
                li.push('<li class="list-group-item {4}">第<b>{0}</b>名 <span class="margin-left-10">{1}</span> <span class="pull-right bold">{2}{3}</span></li>'.format(i + 1, getTargetName(d, target), d['rank_result'], unit, colors[i] || ''));
            } else {
                li.push('<li class="list-group-item {4}">第<b>{0}</b>名 <span class="margin-left-10">{1}</span> <span class="pull-right bold">{2}{3}</span></li>'.format(i + 1, '无', 0, unit, colors[i] || ''));
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

    function initTargetView(id, month, data) {
        var color = {r: '#f12424', y: '#ffdf43', g: '#43e283'}
        var target = data.target[0] ? data.target[0][id + '_target'] || 0 : 0;
        if (id == 'result' && target < 10000) target = target * 10000;
        var count = getCountData(month, data[id]),
            percent = target ? count / target : -1,
            percentMargin = percent > 0 ? kendo.toString(1-percent, 'n1') : '0',
            percentText = target > 0 ? kendo.toString(count/target, 'p1') : '---%';
        if (percent > 0 && percent < 0.6) {
            $('#'+id).prev().find('div').css({
                'background': color.r,
                'margin-top': (percentMargin*100) + '%'
            });
        } else if (percent >= 0.6 && percent < 0.8) {
            $('#'+id).prev().find('div').css({
                'background': color.y,
                'margin-top': (percentMargin*100) + '%'
            });
        } else if (percent >= 0.8) {
            $('#'+id).prev().find('div').css({
                'background': color.g,
                'margin-top': (percentMargin*100) + '%'
            });
        }
        $('#'+id).closest('.circle').next().find('span.p_text').text('{0}/{1} ({2})'.format(count, target, percentText))
    }

    getPersonPerformance();
    searchRank();
});