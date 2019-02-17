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

    $('#result_performance').kendoTabStrip({
        animation:  {
            open: {
                effects: "fadeIn"
            }
        }
    });

    $.$ajax({
        url: '/dashboard/recent-job-list',
        type: 'GET',
        dataType: 'json',
        success: function (res) {
            var li = [];
            res.forEach(function (v) {
                li.push('<li class="list-group-item">\
                    <div>\
                        <b>{0}</b> \
                        <small class="margin-left-10">{1}</small>\
                        <span class="margin-left-10">工作地点: {2}</span>\
                        <span class="pull-right">发布时间: {3}</span>\
                    </div>\
                    <div class="margin-top-5">\
                        <span>职位卖点: <span class="dark-gray">{4}</span></span>\
                    </div>\
                </li>'.format(v.name, v.company_name, v.area, new Date(v.created_at).format(), v.sellpoint));
            });
            $('#recent_jobs').html(li.join(''));
        }
    });

    $.$ajax({
        url: '/dashboard/personal-result-target',
        type: 'GET',
        dataType: 'json',
        data: {year: (new Date()).getFullYear()},
        success: function (res) {
            console.log(res);
            var now = new Date(), year_target = 0, half_target = 0, month_target = 0, area = now.getMonth() > 5 ? 2 : 1;
            res.rt.forEach(function (v) {
                year_target += v.target;
                if (area == v.area) {
                    half_target = +v.target;
                    month_target = Math.round(+v.target / 6);
                }
            });
            var year_count = 0, half_count = 0, month_count = 0, month = now.format('yyyy-mm'), month_start, month_end;
            if (area == 1) {
                month_start = now.getFullYear() + '-' + '01';
                month_end = now.getFullYear() + '-' + '06';
            } else {
                month_start = now.getFullYear() + '-' + '07';
                month_end = now.getFullYear() + '-' + '12';
            }
            res.rc.forEach(function (v) {
                year_count += +v.count;
                if (month == v.month) month_count = +v.count;
                if (month >= month_start && month <= month_end) half_count += +v.count;
            });
            var data = [
                {target: year_target, count: year_count},
                {target: half_target, count: half_count},
                {target: month_target, count: month_count}
            ];
            $('#personal_result').find('div.result-target').each(function (i, ele) {
                var d = data[i], p = d.target > 0 ? Math.round(d.count / d.target * 100) : d.count > 0 ? 100 : 0;
                if (p > 100) p = 100;
                $(ele).find('small').text('{2}% ({0}元 / {1}元)'.format(d.count, d.target, p));
                $(ele).find('div.result-count').css('width', p + '%');
            });
        }
    });

    $.$ajax({
        url: '/dashboard/team-result-target',
        type: 'GET',
        dataType: 'json',
        data: {year: (new Date()).getFullYear()},
        success: function (res) {
            console.log(res);
            var now = new Date(), year_target = 0, half_target = 0, month_target = 0, area = now.getMonth() > 5 ? 2 : 1;
            res.rt.forEach(function (v) {
                year_target += +v.target;
                if (area == +v.area) {
                    half_target = +v.target;
                    month_target = Math.round(+v.target / 6);
                }
            });
            var year_count = 0, half_count = 0, month_count = 0, month = now.format('yyyy-mm'), month_start, month_end;
            if (area == 1) {
                month_start = now.getFullYear() + '-' + '01';
                month_end = now.getFullYear() + '-' + '06';
            } else {
                month_start = now.getFullYear() + '-' + '07';
                month_end = now.getFullYear() + '-' + '12';
            }
            res.rc.forEach(function (v) {
                year_count += +v.count;
                if (month == v.month) month_count = +v.count;
                if (month >= month_start && month <= month_end) half_count += +v.count;
            });
            var data = [
                {target: year_target, count: year_count},
                {target: half_target, count: half_count},
                {target: month_target, count: month_count}
            ];
            $('#team_result').find('div.result-target').each(function (i, ele) {
                var d = data[i], p = d.target > 0 ? Math.round(d.count / d.target * 100) : d.count > 0 ? 100 : 0;
                if (p > 100) p = 100;
                $(ele).find('small').text('{2}% ({0}元 / {1}元)'.format(d.count, d.target, p));
                $(ele).find('div.result-count').css('width', p + '%');
            });
        }
    });

    /*************2019-01-26增加的功能*************/
    var kpi_json_data = {}, kpi_target = 'person';
    $('body').delegate('.selector', 'click', function () {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
    });
    $('body').delegate('.tab-switcher-selector', 'click', function () {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
    });

    var globalData = {};
    $('#kpi-selector').delegate('.selector', 'click', function () {
        var target = $(this).data('target'), d = new Date(), day = d.getDay(), month = d.format('yyyy-mm'), sdate, edate;
        if (target == 'today') {
            sdate = edate = d.format();
        } else if (target == 'week') {
            if (day == 0) day = 7;
            sdate = Date.translate('now-'+(day - 1)).format();
            edate = Date.translate('now+'+(7 - day)).format();
        } else if (target == 'month') {
            sdate = new Date(d.getFullYear(), d.getMonth(), 1).format();
            edate = new Date(d.getFullYear(), d.getMonth()+1, 0).format();
        } else if (target == 'pre_month') {
            sdate = new Date(d.getFullYear(), d.getMonth()-1, 1).format();
            edate = new Date(d.getFullYear(), d.getMonth(), 0).format();
        }
        globalData.sdate = sdate;
        globalData.edate = edate;
        getKpiJsonData(month, sdate, edate);
    });

    $('#kpi-ctn').delegate('.tab-switcher-selector', 'click', function () {
        setTimeout(showKpiTargetTab, 0);
    });

    function showKpiTargetTab() {
        //var type = $('#kpi-ctn .tab-switcher-left').find('.tab-switcher-selector.active').data('target');
        var query = $('#kpi-ctn .tab-switcher-top').find('.tab-switcher-selector.active').data('target');
        //$('#'+type).show().siblings().hide();
        if (kpi_target != query) {
            kpi_target = query;
            bindKpiJsonData();
        }
    }

    function getKpiJsonData(month, sdate, edate) {
        $.$ajax({
            url: '/dashboard/kpi-json-data',
            type: 'GET',
            data: {month: month, sdate: sdate, edate: edate},
            dataType: 'json',
            success: function (res) {
                console.log(res);
                kpi_json_data = res;
                bindKpiJsonData();
            }
        });
    }

    function bindKpiJsonData() {
        var query = $('#kpi-ctn .tab-switcher-top').find('.tab-switcher-selector.active').data('target');
        var day_target = $('#kpi-selector .selector.active').data('target');
        var div_base = day_target == 'today' ? 20 : day_target == 'week' ? 4 : 1
        var target = {bd: 0, job: 0, bds: 0, hunt: 0, person: 0, report: 0, face: 0, offer: 0, success: 0},
            result = {bd: 0, job: 0, bds: 0, hunt: 0, person: 0, report: 0, face: 0, offer: 0, success: 0}
        if (query == 'person') {
            if (kpi_json_data && kpi_json_data.person_target) {
                kpi_json_data.person_target.hunt_target = 0;
                kpi_json_data.person_target.job_target = 0;
                kpi_json_data.person_target.bds_target = 0;
                for (var n in target) {
                    target[n] += +kpi_json_data.person_target[n+'_target'] / div_base;
                }
            }
            if (kpi_json_data && kpi_json_data.person_result) {
                for (var n in result) {
                    result[n] += +kpi_json_data.person_result[n+'_count'];
                }
            }
        } else {
            if (kpi_json_data && kpi_json_data.team_target) {
                kpi_json_data.team_target.hunt_target = 0;
                kpi_json_data.team_target.job_target = 0;
                kpi_json_data.team_target.bds_target = 0;
                for (var n in target) {
                    target[n] += +kpi_json_data.team_target[n+'_target'] / div_base;
                }
            }
            if (kpi_json_data && kpi_json_data.team_result) {
                for (var n in result) {
                    result[n] += +kpi_json_data.team_result[n+'_count'];
                }
            }
        }
        renderKpiView(target, result);
    }

    function renderKpiView(target, result) {
        for (var n in target) {
            $('#kpi_view').find('#kpi_'+n).html('<a class="pointer" data-field="{0}">{1}</a> / {2}'.format(n, result[n], target[n] % 1 == 0 ? target[n] : kendo.toString(target[n], 'n1')));
        }
    }

    $('#kpi-selector .selector.active').trigger('click');

    $('#hunt-selector').delegate('.selector', 'click', function () {
        var target = $(this).data('target'), d = new Date(), day = d.getDay(), sdate, edate;
        if (target == 'today') {
            sdate = edate = d.format();
        } else if (target == 'week') {
            if (day == 0) day = 7;
            sdate = Date.translate('now-'+(day - 1)).format();
            edate = Date.translate('now+'+(7 - day)).format();
        } else if (target == 'month') {
            sdate = new Date(d.getFullYear(), d.getMonth(), 1).format();
            edate = new Date(d.getFullYear(), d.getMonth()+1, 0).format();
        } else if (target == 'pre_month') {
            sdate = new Date(d.getFullYear(), d.getMonth()-1, 1).format();
            edate = new Date(d.getFullYear(), d.getMonth(), 0).format();
        }
        getRecentHuntData(sdate, edate);
    });

    $('#hunt-ctn').delegate('.tab-switcher-selector', 'click', function () {
        setTimeout(RenderRecentHuntData, 0);
    });

    var recent_hunt_data = {};
    function getRecentHuntData(sdate, edate) {
        $.$ajax({
            url: '/dashboard/recent-hunt-data',
            type: 'GET',
            data: {sdate: sdate, edate: edate},
            dataType: 'json',
            success: function (res) {
                console.log(res);
                recent_hunt_data = res;
                RenderRecentHuntData();
            }
        });
    }

    function RenderRecentHuntData() {
        var query = $('#hunt-ctn .tab-switcher-top').find('.tab-switcher-selector.active').data('target');
        var data = recent_hunt_data[query] || [], li = [];
        data.forEach(function (v) {
            li.push('<li class="list-group-item">\
                        <div class="margin-bottom-5"><b>{0}</b> ({1}) <span class="pull-right">{2} - {3}</span></div>\
                        <div class="margin-bottom-5"><b>推荐职位：</b><span class="dark-gray">{4}</span><span class="pull-right"><b>推荐公司：</b><span class="dark-gray">{5}</span></span></div>\
                        <div class="flex"><span class="flex-1"><b>寻访记录：</b><span class="dark-gray">{6} </span></span><small class="dark-gray">[{7}]</small></div>\
                    </li>'.format(v.name, v.tel, v.job, v.company, v.job_name, v.company_name, v.description, new Date(v.created_at).format('yyyy-mm-dd hh:MM')));
        });
        if (li.length == 0) {
            li.push('<li class="list-group-item text-center text-warning"><span style="line-height:35px;">暂时没有任何记录</span></li>');
        }
        $('#hunt_view').html(li.join(''));
    }

    $('#hunt-selector .selector.active').trigger('click');

    /***********************02.17增加的功能**************************/
    function getDetailText(item, field) {
        switch (field) {
            case 'bd':
                return '<div class="flex">\
                            <span class="flex-1"><b>{0}</b></span>\
                            <span>at: <i class="dark-gray">{1}</i> by <i class="dark-gray">{2}</i></span>\
                        </div>'.format(item.company_name, new Date(item.created_at).format('yyyy-mm-dd hh:MM'), item.user_name);
                break;
            case 'job':
                return '<div class="flex">\
                            <span class="flex-1"><b>{0}</b><span class="dark-gray"> - {1}</span></span>\
                            <span>at: <i class="dark-gray">{2}</i> by <i class="dark-gray">{3}</i></span>\
                        </div>'.format(item.job_name, item.company_name, new Date(item.created_at).format('yyyy-mm-dd hh:MM'), item.user_name);
                break;
            case 'bds':
                return '<div class="flex">\
                            <span class="flex-1"><b>{0}</b></span>\
                            <span>at: <i class="dark-gray">{1}</i> by <i class="dark-gray">{2}</i></span>\
                        </div>'.format(item.company_name, new Date(item.created_at).format('yyyy-mm-dd hh:MM'), item.user_name);
                break;
            case 'hunt':
                return '<div class="flex">\
                            <span class="flex-1"><b>{0}</b><span class="dark-gray"> - {1}</span></span>\
                            <span>at: <i class="dark-gray">{2}</i></span>\
                        </div>'.format(item.job_name, item.company_name, new Date(item.created_at).format('yyyy-mm-dd hh:MM'));
                break;
            case 'person':
                return '<div class="flex">\
                            <span class="flex-1"><b>{0}</b><small class="dark-gray"> {1} - {2}</small></span>\
                            <span>at: <i class="dark-gray">{3}</i> by <i class="dark-gray">{4}</i></span>\
                        </div>'.format(item.person_name, item.job_name, item.company_name, new Date(item.created_at).format('yyyy-mm-dd hh:MM'), item.user_name);
                break;
            case 'report':
                return '<div class="flex">\
                            <span class="flex-1"><b>{0}</b><small class="dark-gray"> {1} - {2}</small></span>\
                            <span>at: <i class="dark-gray">{3}</i> by <i class="dark-gray">{4}</i></span>\
                        </div>'.format(item.person_name, item.job_name, item.company_name, new Date(item.created_at).format('yyyy-mm-dd hh:MM'), item.user_name);
                break;
            case 'face':
                return '<div class="flex">\
                            <span class="flex-1"><b>{0}</b><small class="dark-gray"> {1} - {2}</small></span>\
                            <span>at: <i class="dark-gray">{3}</i> by <i class="dark-gray">{4}</i></span>\
                        </div>'.format(item.person_name, item.job_name, item.company_name, new Date(item.created_at).format('yyyy-mm-dd hh:MM'), item.user_name);
                break;
            case 'offer':
                return '<div class="flex">\
                            <span class="flex-1"><b>{0}</b><small class="dark-gray"> {1} - {2}</small></span>\
                            <span>at: <i class="dark-gray">{3}</i> by <i class="dark-gray">{4}</i></span>\
                        </div>'.format(item.person_name, item.job_name, item.company_name, new Date(item.created_at).format('yyyy-mm-dd hh:MM'), item.user_name);
                break;
            case 'success':
                return '<div class="flex">\
                            <span class="flex-1"><b>{0}</b><small class="dark-gray"> {1} - {2}</small></span>\
                            <span>at: <i class="dark-gray">{3}</i> by <i class="dark-gray">{4}</i></span>\
                        </div>'.format(item.person_name, item.job_name, item.company_name, new Date(item.created_at).format('yyyy-mm-dd hh:MM'), item.user_name);
                break;
            default:
                return '';
                break;
        }
    }

    $('#kpi_view').delegate('a[data-field]', 'click', function () {
        var field = $(this).data('field'), target = $('#kpi-ctn').find('.tab-switcher-selector.active').data('target');
        console.log(field, target, globalData);
        $.$ajax({
            url: '/dashboard/kpi-view-data',
            type: 'GET',
            data: {field: field, target: target, sdate: globalData.sdate, edate: globalData.edate},
            dataType: 'json',
            success: function (res) {
                console.log(res);
                showKpiViewDialog(res, field);
            }
        });
    });

    function showKpiViewDialog(data, field) {
        $.$modal.dialog({
            title: '详细信息',
            destroy: true,
            content: '<ul class="list-group" id="view_list" style="max-height:300px;overflow-y:auto;"></ul>',
            onLoaded: function () {
                var dom = this.dom, li = [];
                data.forEach(function (v) {
                    li.push('<li class="list-group-item">{0}</li>'.format(getDetailText(v, field)));
                });
                $('#view_list', dom).html(li.join(''));
            }
        }).show();
    }

});