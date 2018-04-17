/**
 * Created by zhe.zhang on 2018/3/27.
 */
$(function () {


    var grid = $('#grid').kendoGrid({
        dataSource: {
            transport: {
                read: function (option) {
                    $.$ajax({
                        url: '/result/json-result-user',
                        type: 'GET',
                        dataType: 'json',
                        success: function (res) {
                            option.success(res);
                        }
                    });
                }
            },
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
            {field: 'operator', title: '操作顾问'},
            {field: 'total_percent', title: '我的占比', template: '#:total_percent#%'},
            {field: 'total_result', title: '我的业绩', template: '#:kendo.toString(+total_result, "n0")#'},
        ],
        scrollable: false,
        pageable: true,
    }).data('kendoGrid');
});