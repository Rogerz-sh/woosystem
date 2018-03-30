/**
 * Created by zhe.zhang on 2018/3/27.
 */
$(function () {
    var query = $.queryString.parse(location.hash), result_id = query.id;

    var typeList = [
        {type_id: 1, type_name: "客户线索", default: 15},
        {type_id: 2, type_name: "签约谈判", default: 15},
        {type_id: 3, type_name: "人选线索", default: 10},
        {type_id: 4, type_name: "人选推荐", default: 20},
        {type_id: 5, type_name: "候选人跟进", default: 20},
        {type_id: 6, type_name: "项目协调", default: 10},
        {type_id: 7, type_name: "款项催收", default: 10}
    ];

    $.$ajax({
        url: '/result/json-result-data',
        type: 'GET',
        dataType: 'json',
        data: { result_id: result_id },
        success: function (res) {
            initPageData(res);
        }
    });

    function initPageData(res) {
        $('#date').kendoDatePicker({
            culture: 'zh-CN',
            format: 'yyyy-MM-dd',
            value: res.date
        });

        $('#amount').kendoNumericTextBox({
            spinners: false,
            min: 0,
            format: 'n2',
            value: res.amount
        });

        $('#result').kendoNumericTextBox({
            spinners: false,
            min: 0,
            format: 'n2',
            value: res.result,
            change: function () {
                var result = +this.value();
                $('#result_user tbody').find('tr').each(function (i, tr) {
                    showUserResult($(tr));
                })
            }
        });

        $('#name').val(res.name);
        $('#desc').val(res.desc);

        var initDDL = false;
        var ddl = $('#job_id').kendoDropDownList({
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
                    e.preventDefault();
                }
            },
            dataBound: function () {
                if (!initDDL && this.dataItems().length) {
                    ddl.select(1);
                    initDDL = true;
                }
            }
        }).data('kendoDropDownList');

        ddl.search(res.job_name);

        var userData = res.users;
        $.$ajax({
            url: '/result/json-user-list',
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                var rows = [], result = +$('#result').data('kendoNumericTextBox').value();
                typeList.forEach(function (v) {
                    rows.push('<tr data-type-id="{0}">\
                            <td><span class="form-control-label">{1}</span></td>\
                            <td><select class="_user" style="width:240px;"></select></td>\
                            <td><span class="_group">--</span></td>\
                            <td><span class="_area">--</span></td>\
                            <td><div class="input-group" style="width:100px;"><input type="text" class="form-control _percent" value="{2}" /><span class="input-group-addon">%</span></div></td>\
                            <td><span class="_result">0.00</span></td>\
                           </tr>'.format(v.type_id, v.type_name, v.default));
                });
                $('#result_user tbody').html(rows.join(''));
                $('#result_user tbody').find('tr').each(function (i, tr) {
                    var $row = $(tr), $select = $row.find('select._user'), $input = $row.find('input._percent'), tid = $row.data('typeId');
                    $select.kendoDropDownList({
                        dataSource: res,
                        dataTextField: 'user_name',
                        dataValueField: 'user_id',
                        template: '<span style="font-size:12px;">#:user_name# -- #:group_name# -- #:area_name#</span>',
                        //valueTemplate: '#:user_name# -- #:group_name# -- #:area_name#',
                        optionLabel: '请选择顾问',
                        value: userData[userData.at({type_id: tid})].user_id,
                        change: function () {
                            var item = this.dataItem();
                            $row.find('span._group').text(item.group_name);
                            $row.find('span._area').text(item.area_name);
                        }
                    }).data('kendoDropDownList').trigger('change');

                    $input.kendoNumericTextBox({
                        spinners: false,
                        min: 0,
                        max: 100,
                        format: 'n2',
                        value: userData[userData.at({type_id: tid})].percent,
                        change: function () {
                            showUserResult($row);
                            getTotalPercent();
                        }
                    });

                    showUserResult($row);

                });
            }
        });
    }

    function showUserResult($tr) {
        var percent = +$tr.find('input._percent').val(), result = +$('#result').data('kendoNumericTextBox').value(), ur = result.times(percent).divs(100);
        $tr.find('span._result').text(kendo.toString(ur, 'n2'));
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
        var name = $('#name').val().trim(),
            date = $('#date').val().trim(),
            item = $('#job_id').data('kendoDropDownList').dataItem(),
            job_id = item.job_id,
            company_id = item.company_id,
            job_name = item.job_name,
            company_name = item.company_name,
            amount = +$('#amount').val(),
            result = +$('#result').val(),
            desc = $('#desc').val();
        if (!name || !date || !job_id || !amount || !result) invalid = true;

        var users = [], totalPercent = 0, totalResult = 0;
        typeList.forEach(function (v) {
            if (invalid) return;
            var $row = $('#result_user').find('tr[data-type-id="{0}"]'.format(v.type_id)),
                user_id = $row.find('select._user').val(),
                type_id = v.type_id,
                type_name = v.type_name,
                percent = +$row.find('input._percent').val(),
                user_result = +$row.find('span._result').text().replace(/,/g, ''),
                _date = date;
            totalPercent += percent;
            totalResult += user_result;
            if (!user_id || !type_id || typeof(percent) != 'number') invalid = true;
            users.push({result_id: result_id, user_id: user_id, type_id: type_id, type_name: type_name, percent: percent, user_result: user_result, date: _date});
        });

        var data = {
            id: result_id,
            name: name,
            date: date,
            job_id: job_id,
            company_id: company_id,
            job_name: job_name,
            company_name: company_name,
            amount: amount,
            result: result,
            desc: desc
        }

        if (invalid) {
            $.$modal.alert('数据填写不全，请检查后重新提交');
            return;
        }
        if (result > amount) {
            $.$modal.alert('业绩金额不能大于打款金额');
            return;
        }
        if (totalPercent != 100) {
            $.$modal.alert('分配总额必须等于100%');
            return;
        }

        console.log(data, users);
        $.$ajax({
            url: '/result/edit-result',
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