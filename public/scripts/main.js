/**
 * Created by roger on 15/10/27.
 */
$(function () {
    var notice_cookie = $.cookie('noticed_date'), is_cookie_set = true;
    $('.notice-handler').click(function () {
        $('.notice-container').toggleClass('open');
        if (!is_cookie_set) {
            $.cookie('noticed_date', new Date().format(), {expires: 7, path: '/'})
            is_cookie_set = true;
        }
    });

    function getDateDiff(d) {
        var daytime = 24*60*60*1000, now = Math.floor(Date.now() / daytime), date = Math.floor(new Date(d).getTime() / daytime), diff = now - date;
        return diff;
    }

    $.$ajax({
        url: '/dashboard/notice-json-list',
        type: 'GET',
        dataType: 'json',
        success: function (res) {
            var result = [];
            res[0].forEach(function (v) {
                var diff = getDateDiff(new Date(v.protected).format());
                if (diff == -7 || diff == -3 || diff == 0) {
                    var info = {
                        text: '<b>{1}</b> <small><span class="dark-gray">[{2} - {3}]</span>，于<b>{4}</b>上岗，距离保证期截止日期<b>{5}</b>还有<b>{6}</b>天 <a class="pull-right" href="#/hunt/record/{0}" target="_blank">查看详情</a></small>'
                            .format(v.hunt_id, v.person_name, v.job_name, v.company_name, new Date(v.date).format(), new Date(v.protected).format(), Math.abs(diff)),
                        type: 'success',
                        diff: diff
                    };
                    result.push(info);
                }
            });
            res[1].forEach(function (v) {
                var diff = getDateDiff(new Date(v.estimate_date).format());
                if (diff == -7 || diff == -3) {
                    var info = {
                        text: '<b>{0}</b> <small><span class="dark-gray">[{1} - {2}]</span> 的<b>{3}</b><b class="blue">{4}</b>元尚未支付，距离约定的付款日期<b>{5}</b>还有<b>{6}</b>天，请注意催收。</small>'
                            .format(v.person_name, v.job_name, v.company_name, v.type, v.amount, new Date(v.estimate_date).format(), Math.abs(diff)),
                        type: 'invoice',
                        diff: diff
                    };
                    result.push(info);
                }
                if (diff == 0) {
                    var info = {
                        text: '<b>{0}</b> <small><span class="dark-gray">[{1} - {2}]</span> 的<b>{3}</b><b class="blue">{4}</b>元尚未支付，约定的付款日期为<b>今天</b>，请注意催收。</small>'
                            .format(v.person_name, v.job_name, v.company_name, v.type, v.amount),
                        type: 'invoice',
                        diff: diff
                    };
                    result.push(info);
                }
                if (diff == 7 || diff == 30) {
                    var info = {
                        text: '<b>{0}</b> <small><span class="dark-gray">[{1} - {2}]</span> 的<b>{3}</b><b class="blue">{4}</b>元尚未支付，距离约定的付款日期<b>{5}</b>已超出<b class="red">{6}</b>天，请注意催收。</small>'
                            .format(v.person_name, v.job_name, v.company_name, v.type, v.amount, new Date(v.estimate_date).format(), Math.abs(diff)),
                        type: 'invoice',
                        diff: diff
                    };
                    result.push(info);
                }
            });
            if (getDateDiff(notice_cookie) != 0 && result.length > 0) {
                $('.notice-container').addClass('open');
                is_cookie_set = false;
            }
            if (result.lenght > 0) {
                result.sort(function (a, b) {
                    return a.diff - b.diff;
                });
                initNoticeList(result);
            } else {
                $('.notice-content').html('<div class="dark-yellow" style="line-height:360px;text-align:center;">暂时没有任何消息提醒</div>');
            }
        }
    });

    function initNoticeList(data) {
        var li = [];
        data.forEach(function (v) {
            var type = v.type == 'success' ? '<span class="dark-yellow margin-right-15">[保证期提醒]</span>' : '<span class="dark-orange margin-right-15">[收款提醒]</span>';
            li.push('<li>{0} {1}</li>'.format(type, v.text));
        });
        $('.notice-list').html(li.join(''));
    }
});