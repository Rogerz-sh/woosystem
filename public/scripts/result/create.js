/**
 * Created by zhe.zhang on 2018/3/27.
 */
$(function () {

    var typeList = [
        {type_id: 1, type_name: "客户线索", default: 15},
        {type_id: 2, type_name: "签约谈判", default: 15},
        {type_id: 3, type_name: "人选线索", default: 10},
        {type_id: 4, type_name: "人选推荐", default: 20},
        {type_id: 5, type_name: "候选人跟进", default: 20},
        {type_id: 6, type_name: "项目协调", default: 10},
        {type_id: 7, type_name: "款项催收", default: 10}
    ];

    $('#date').kendoDatePicker({
        culture: 'zh-CN',
        format: 'yyyy-MM-dd',
        value: new Date()
    });

    $('#amount').kendoNumericTextBox({
        spinners: false,
        format: 'n2',
        value: 0,
        change: function () {
            var result = +this.value();
            $('#result_user tbody').find('tr').each(function (i, tr) {
                showUserResult($(tr));
            });
            //$('#result').data('kendoNumericTextBox').value(result);
        }
    });

    $('#order').kendoNumericTextBox({
        spinners: false,
        format: 'n2',
        value: 1,
        change: function () {
            var order = +this.value();
            $('#result_user tbody').find('tr').each(function (i, tr) {
                showUserResult($(tr));
            });
            //$('#result').data('kendoNumericTextBox').value(result);
        }
    });

    $('#pay_percent').kendoNumericTextBox({
        spinners: false,
        min: 0,
        format: 'n0',
        value: 0
    });

    $('#type').kendoDropDownList({
        dataSource: ['全款', '首款', '尾款'],
        optionLabel: '请选择付款类型'
    });

    var person = $('#person_id').kendoDropDownList({
        dataSource: [],
        dataTextField: 'person_name',
        dataValueField: 'person_id',
        optionLabel: '请选择上岗候选人',
        template: '#:person_name#  <small class="dark-gray">[入职日期：#:new Date(date).format()#]</small>',
        valueTemplate: '#:person_name#  <small class="dark-gray">[入职日期：#:new Date(date).format()#]</small>',
    }).data('kendoDropDownList');

    $('#area').kendoDropDownList({
        dataSource: {
            transport: {
                read: {
                    url: '/team/json-area-list',
                    dataType: 'json'
                }
            }
        },
        dataTextField: 'a_name',
        dataValueField: 'id',
        optionLabel: '请选择申请公司'
    });

    $('#created_by').text($('meta[name="_sessionNickname"]').attr('content'));


    $('#job_id').kendoDropDownList({
        dataSource: {
            transport: {
                read: {
                    url: '/result/search-job-with-company'
                }
            },
            serverFiltering: true
        },
        dataTextField: 'job_name',
        dataValueField: 'job_id',
        template: '#:job_name# -- #:company_name#',
        valueTemplate: '#:job_name# -- #:company_name#',
        filter: 'contains',
        minLength: 2,
        optionLabel: '请输入岗位或企业关键字查询',
        filtering: function(e) {
            var filter = e.filter;
            if (!filter || !filter.value) {
                //prevent filtering if the filter does not value
                e.preventDefault();
            }
        },
        change: function () {
            var item = this.dataItem();
            $.$ajax({
                url: '/result/json-job-person-list',
                type: 'GET',
                dataType: 'json',
                data: {job_id: item.job_id},
                success: function (res) {
                    person.dataSource.data(res);
                }
            });
        }
    });

    $.$ajax({
        url: '/result/json-user-list',
        type: 'GET',
        dataType: 'json',
        success: function (res) {
            var rows = [], result = +$('#amount').data('kendoNumericTextBox').value();

            $('#operator').kendoDropDownList({
                dataSource: res,
                dataTextField: 'user_name',
                dataValueField: 'user_id',
                template: '<span style="font-size:12px;">#:user_name# -- #:group_name# -- #:area_name#</span>',
                optionLabel: '请选择操作顾问',
                filter: 'contains'
            });

            typeList.forEach(function (v) {
                rows.push('<tr data-type-id="{0}">\
                            <td><span class="form-control-label">{1}</span></td>\
                            <td><select class="_user" style="width:240px;"></select></td>\
                            <td><span class="_group">--</span></td>\
                            <td><span class="_area">--</span></td>\
                            <td><div class="input-group" style="width:100px;"><input type="text" class="form-control _percent" value="{2}" /><span class="input-group-addon">%</span></div></td>\
                            <td><span class="_result">0.00</span></td>\
                            <td><span class="_order">0.00</span></td>\
                           </tr>'.format(v.type_id, v.type_name, v.default));
            });
            $('#result_user tbody').html(rows.join(''));
            $('#result_user tbody').find('tr').each(function (i, tr) {
                var $row = $(tr), $select = $row.find('select._user'), $input = $row.find('input._percent');
                $select.kendoDropDownList({
                    dataSource: res,
                    dataTextField: 'user_name',
                    dataValueField: 'user_id',
                    template: '<span style="font-size:12px;">#:user_name# -- #:group_name# -- #:area_name#</span>',
                    //valueTemplate: '#:user_name# -- #:group_name# -- #:area_name#',
                    optionLabel: '请选择顾问',
                    filter: 'contains',
                    change: function () {
                        var item = this.dataItem();
                        $row.find('span._group').text(item.group_name);
                        $row.find('span._area').text(item.area_name);
                    }
                });

                $input.kendoNumericTextBox({
                    spinners: false,
                    min: 0,
                    max: 100,
                    format: 'n2',
                    change: function () {
                        showUserResult($row);
                        getTotalPercent();
                    }
                });

                showUserResult($row);

            });
        }
    });

    function showUserResult($tr) {
        var percent = +$tr.find('input._percent').val(),
            result = +$('#amount').data('kendoNumericTextBox').value(),
            order = +$('#order').data('kendoNumericTextBox').value(),
            ur = result.times(percent).divs(100),
            uo = order.times(percent).divs(100);
        $tr.find('span._result').text(kendo.toString(ur, 'n2'));
        $tr.find('span._order').text(kendo.toString(uo, 'n3'));
    }

    function getTotalPercent() {
        var percent = 0;
        $('#result_user tbody').find('tr').each(function (i, tr) {
            percent += +$(tr).find('input._percent').val();
        });
        $('#totalPercent').text(percent + '%');
        if (percent == 100) {
            $('#totalPercent').removeClass('red').addClass('green');
        } else {
            $('#totalPercent').removeClass('green').addClass('red');
        }
    }

    $('#save').click(function () {
        var invalid = false;
        var item = $('#job_id').data('kendoDropDownList').dataItem(),
            _item = $('#person_id').data('kendoDropDownList').dataItem(),
            date = $('#date').val().trim(),
            job_id = item.job_id,
            company_id = item.company_id,
            person_id = _item.person_id,
            job_name = item.job_name,
            company_name = item.company_name,
            person_name = _item.person_name,
            type = $('#type').val(),
            pay_percent = +$('#pay_percent').val(),
            amount = +$('#amount').val(),
            result = +$('#amount').val(),
            order = +$('#order').val(),
            comment = $('#comment').val(),
            operator = $('#operator').val(),
            ext = $('input[name="ext"]:checked').val() || 0,
            area = $('#area').val();
        var name = '{0}({1}{2}%)'.format(person_name, type, pay_percent);
        if (!name || !date || !job_id || !person_id || !type || !pay_percent || typeof(amount) != 'number' || typeof(order) != 'number') invalid = true;
        var users = [], totalPercent = 0, totalResult = 0, totalOrder = 0;
        typeList.forEach(function (v) {
            if (invalid) return;
            var $row = $('#result_user').find('tr[data-type-id="{0}"]'.format(v.type_id)),
                user_id = $row.find('select._user').val(),
                type_id = v.type_id,
                type_name = v.type_name,
                percent = +$row.find('input._percent').val(),
                user_result = +$row.find('span._result').text().replace(/,/g, ''),
                user_order = +$row.find('span._order').text().replace(/,/g, ''),
                _date = date;
            totalPercent = totalPercent.plus(percent);
            totalResult = totalResult.plus(user_result);
            totalOrder = totalOrder.plus(user_order);
            if (!user_id || !type_id || typeof(percent) != 'number') invalid = true;
            users.push({user_id: user_id, type_id: type_id, type_name: type_name, percent: percent, user_result: user_result, user_order: user_order, date: _date});
        });

        var data = {
            name: name,
            date: date,
            job_id: job_id,
            company_id: company_id,
            person_id: person_id,
            job_name: job_name,
            company_name: company_name,
            person_name: person_name,
            type: type,
            pay_percent: pay_percent,
            amount: amount,
            result: result,
            order: order,
            operator: operator,
            area: area,
            comment: comment,
            ext: ext
        };

        if (ext != 0 && comment.trim() == '') {
            $.$modal.alert('请在备注中填写抵扣或替补业绩的详细说明');
            return;
        }

        if (invalid) {
            $.$modal.alert('数据填写不全，请检查后重新提交');
            return;
        }
        if (totalResult > amount) {
            $.$modal.alert('业绩总配额不能大于打款金额');
            return;
        }
        if (totalPercent != 100) {
            $.$modal.alert('分配总额必须等于100%');
            return;
        }
        if (totalOrder != order) {
            $.$modal.alert('计入单数合计与填写的单数不一致');
            return;
        }

        console.log(data, users);
        $.$ajax({
            url: '/result/save-result',
            type: 'POST',
            dataType: 'json',
            data: { data: data, users: users },
            success: function (res) {
                if (res) {
                    $.$modal.alert('保存成功', function () {
                        location.href = '#/result/list'
                    });
                } else {
                    $.$modal.alert('保存失败');
                }
            }
        })
    });

});