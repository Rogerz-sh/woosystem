/**
 * Created by roger on 16/3/18.
 */
(function (window, angular) {
    var app = window.RZ.app;

    //temp controller for route
    app.controller('routeTempController', function ($scope) {

    });

    //controller for dashboard
    app.controller('dashboardController', ['$scope', '$http', '$routeParams', 'model', 'token', function ($scope, $http, $routeParams, model, token) {
        $scope.config = {
            grid: {
                dataSource: {
                    transport: {
                        read: {
                            url: '/dashboard/recent-hunt-list',
                            dataType: 'json'
                        }
                    },
                    pageSize: 5,
                    schema: {
                        model: {
                            id: 'id'
                        }
                    },
                    filter: {field: 'deleted', operator: 'neq', value: true},
                    sort: [
                        {field: 'updated_at', dir: 'desc'},
                        {field: 'status', dir: 'desc', compare: function (a, b) {
                            var status = {'进行中': 3, '已暂停': 2, '已停止': 1};
                            return status[a.status] < status[b.status] ? -1 : status[a.status] === status[b.status] ? 0 : 1;
                        }},
                        {field: 'type', dir: 'desc', compare: function (a, b) {
                            var type = {'低': 1, '中': 2, '高': 3};
                            return type[a.type] < type[b.type] ? -1 : type[a.type] === type[b.type] ? 0 : 1;
                        }},
                    ]
                },
                filterable: {mode: 'row'},
                columns: [
                    {field: 'id', title: 'ID', sortable: false, filterable: false},
                    {
                        field: 'job_name',
                        title: '职位名称',
                        template: '#:job_name# <a ng-click="viewJob(#:job_id#)"><i class="fa fa-search pointer"></i></a>',
                        sortable: false,
                        filterable: {
                            cell: {
                                operator: 'contains'
                            }
                        }
                    },
                    {field: 'company_name', title: '客户名称', template: '#:company_name# <a ng-click="viewCompany(#:company_id#)"><i class="fa fa-search pointer"></i></a>', sortable: false},
                    {field: 'user_names', title: '顾问', sortable: false},
                    {field: 'person_count', title: '人选', filterable: false, template: getCountColor('person_count')},
                    {field: 'report_count', title: '报告', filterable: false, template: getCountColor('report_count')},
                    {field: 'view_count', title: '面试', filterable: false, template: getCountColor('view_count')},
                    {field: 'offer_count', title: 'Offer', filterable: false, template: getCountColor('offer_count')},
                    {field: 'type', title: '重要程度', template: getType, sortable: {
                        compare: function (a, b) {
                            var type = {'低': 1, '中': 2, '高': 3};
                            return type[a.type] < type[b.type] ? -1 : type[a.type] === type[b.type] ? 0 : 1;
                        }
                    }, filterable: {multi:true}},
                    {field: 'status', title: '状态', template: getStatus},
                    {field: 'updated_at', title: '更新日期', template: '#: new Date(updated_at).format()#', filterable: false},
                    {
                        title: '操作',
                        template: '<a href="\\#/hunt/select/#:id#" class="btn btn-default btn-sm" target="_blank"><i class="fa fa-pencil"></i></a>',
                        width: 140,
                        sortable: false,
                        filterable: {multi:true}
                    }
                ],
                sortable: true,
                scrollable: false,
                pageable: true,
            },
            gridDetail: function (item) {
                return {
                    dataSource: {
                        transport: {
                            read: {
                                url: '/hunt/json-hunt-select-job-data',
                                data: {job_id: item.job_id},
                                dataType: 'json'
                            }
                        },
                        pageSize: 5,
                        schema: {
                            model: {
                                id: 'id'
                            }
                        },
                        filter: {field: 'deleted', operator: 'neq', value: true}
                    },
                    columns: [
                        {field: 'name', title: '候选人', template: '#:name# <a ng-click="viewPerson(#:person_id#)"><i class="fa fa-search pointer"></i></a>'},
                        {field: 'company', title: '所在公司'},
                        {field: 'job', title: '现任职位'},
                        {field: 'sex', title: '性别'},
                        {field: 'age', title: '年龄'},
                        {field: 'degree', title: '学历'},
                        {field: 'tel', title: '联系电话'},
                        {field: 'date', title: '接入日期', template: getDate},
                        {title: '<div class=\'text-center\'>当前状态</div>', columns: [
                            {filed: 'reported', title: '推荐', template: getPersonStatus('reported')},
                            {filed: 'faced', title: '面试', template: getPersonStatus('faced')},
                            {filed: 'offered', title: 'Offer', template: getPersonStatus('offered')},
                            {filed: 'succeed', title: '上岗', template: getPersonStatus('succeed')},
                        ]},
                        {field: 'user_name', title: '顾问'},
                        {title: '操作', template: '<a href="\\#/hunt/edit/#:id#" class="btn btn-default btn-sm"><i class="fa fa-pencil"></i></a> ' +
                        '<a href="\\#/hunt/record/#:id#" class="btn btn-info btn-sm" target="_blank"><i class="fa fa-list"></i></a> ' +
                        '<a ng-click="deleteHunt(#:id#)" class="btn btn-danger btn-sm"><i class="fa fa-trash-o"></i></a>', width: 140}
                    ],
                    scrollable: false,
                    pageable: true,
                }
            },
            gridPerson: {
                dataSource: {
                    transport: {
                        read: {
                            url: '/dashboard/recent-hunt-person',
                            dataType: 'json'
                        }
                    },
                    pageSize: 5,
                    schema: {
                        model: {
                            id: 'id'
                        }
                    },
                    filter: {field: 'deleted', operator: 'neq', value: true}
                },
                columns: [
                    {field: 'name', title: '候选人', template: '#:name# <a ng-click="viewPerson(#:person_id#)"><i class="fa fa-search pointer"></i></a>'},
                    {field: 'company_name', title: '推荐公司'},
                    {field: 'job_name', title: '推荐职位'},
                    {field: 'sex', title: '性别'},
                    {field: 'age', title: '年龄'},
                    {field: 'degree', title: '学历'},
                    {field: 'tel', title: '联系电话'},
                    {title: '<div class=\'text-center\'>当前状态</div>', columns: [
                        {filed: 'reported', title: '推荐', template: getPersonStatus('reported')},
                        {filed: 'faced', title: '面试', template: getPersonStatus('faced')},
                        {filed: 'offered', title: 'Offer', template: getPersonStatus('offered')},
                        {filed: 'succeed', title: '上岗', template: getPersonStatus('succeed')},
                    ]},
                    {field: 'user_name', title: '顾问'},
                    {field: 'updated_at', title: '更新日期', template: getUpdatedDate},
                    {title: '操作', template: '<a href="\\#/hunt/edit/#:id#" class="btn btn-default btn-sm"><i class="fa fa-pencil"></i></a> ' +
                    '<a href="\\#/hunt/record/#:id#" class="btn btn-info btn-sm" target="_blank"><i class="fa fa-list"></i></a> ' +
                    '<a ng-click="deleteHunt(#:id#)" class="btn btn-danger btn-sm"><i class="fa fa-trash-o"></i></a>', width: 140}
                ],
                scrollable: false,
                pageable: true,
            }
        };

        $scope.deleteHunt = function (id) {
            $.$modal.confirm('确定要删除吗?', function (isOk) {
                if (!isOk) return;
                $.$ajax.post('/hunt/delete/'+id, function (res) {
                    $.$modal.alert('删除成功', function () {
                        location.reload();
                    });
                });
            })
        };

        function getPersonStatus(name) {
            return function (item) {
                return item[name] == '0' ? '<span class="bold red"><i class="fa fa-times"></i></span>' : '<span class="bold green"><i class="fa fa-check"></i></span>';
            }
        }

        function getCountColor(name) {
            return function (item) {
                return item[name] == '0' ? '<span class="bold red">'+item[name]+'</span>' : '<span class="bold green">'+item[name]+'</span>';
            }
        }

        function getDate(item) {
            return new Date(item.date.replace(/-/g, '/')).format();
        }

        function getUpdatedDate(item) {
            return new Date(item.updated_at.replace(/-/g, '/')).format();
        }

        function getType(item) {
            var color = {'低': 'dark-gray', '中': 'yellow', '高': 'red'};
            return '<span class="{0}">{1}</span>'.format(color[item.type], item.type);
        }

        function getStatus(item) {
            var color = {'已停止': 'dark-gray', '已暂停': 'yellow', '进行中': 'green'};
            return '<span class="{0}">{1}</span>'.format(color[item.status], item.status);
        }

        $scope.viewCompany = function (cid) {
            $scope.$broadcast('refresh.company-info', cid, function () {
                $scope.win6.center().open();
            });
        };

        $scope.viewJob = function (jid) {
            $scope.$broadcast('refresh.job-info', jid, function () {
                $scope.win5.center().open();
            });
        };

        $scope.viewPerson = function (pid) {
            $scope.$broadcast('refresh.person-info', pid, function () {
                $scope.win4.center().open();
            });
        };
    }]);

    //controllers for company
    app.controller('companyController', ['$scope', '$http', '$routeParams', '$location', function ($scope, $http, $routeParams, $location) {
        $scope.$on('saved.company', function (e, res) {
            if (~~res > 0) {
                $.$modal.alert('保存成功！', function () {
                    location.href = '#/company/list';
                });
            } else {
                $.$modal.alert(res);
            }
        });

        $scope.$on('quit.company', function (e) {
            location.href = '#/company/list';
        });

        $scope.company_id = $routeParams.company_id;

        if ($location.path() == '/company/detail/'+$routeParams.company_id) {
            $http.get('/company/job-list', {params: {id: $routeParams.company_id}}).success(function (res) {
                $scope.jobs = res;
            });
        }
    }]);

    //controllers for job
    app.controller('jobController', ['$scope', '$http', '$routeParams', '$location', function ($scope, $http, $routeParams, $location) {
        $scope.$on('saved.job', function (e, res) {
            if (~~res > 0) {
                $.$modal.alert('保存成功！', function () {
                    location.href = '#/job/list';
                });
            } else {
                $.$modal.alert(res);
            }
        });

        $scope.$on('quit.job', function (e) {
            location.href = '#/job/list';
        });

        $scope.job_id = $routeParams.job_id;
    }]);

    //controllers for candidate
    app.controller('candidateController', ['$scope', '$http', 'model', '$routeParams', '$location', function ($scope, $http, model, $routeParams, $location) {

        $scope.$on('saved.resume', function (e, res) {
            if (~~res > 0) {
                $.$modal.alert('保存成功！', function () {
                    location.href = '#/candidate/list';
                });
            } else {
                $.$modal.alert(res);
            }
        });

        $scope.$on('quit.resume', function () {
            location.href = '#/candidate/list';
        });

        $scope.person_id = $routeParams.person_id;

        if ($location.path() == '/candidate/detail/'+$routeParams.person_id) {
            $http.get('/candidate/hunt-list', {params: {id: $routeParams.person_id}}).success(function (res) {
                $scope.hunts = res;
            });
        }
    }]);

    //controllers for bd
    app.controller('bdController', ['$scope', '$http', function ($scope, $http) {
        $scope.$on('saved.bd', function (e, res) {
            if (~~res > 0) {
                $.$modal.alert('保存成功！', function () {
                    location.href = '#/bd/list';
                });
            } else {
                $.$modal.alert(res);
            }
        });

        $scope.$on('quit.bd', function (e) {
            location.href = '#/bd/list';
        });
    }]);

    app.controller('bdListController', ['$scope', '$http', 'model', 'token', function ($scope, $http, model, token) {
        var session = model.getUserSession();

        $scope.config = {
            grid: {
                dataSource: {
                    transport: {
                        read: {
                            url: '/bd/json-bd-list-data',
                            data: {user_id: session.id},
                            dataType: 'json'
                        }
                    },
                    pageSize: 10,
                    schema: {
                        model: {
                            id: 'id'
                        }
                    },
                    filter: {field: 'deleted', operator: 'neq', value: true}
                },
                filterable: {mode: 'row'},
                columns: [
                    //{field: 'name', title: 'ID'},
                    {field: 'company_name', title: '企业名称'},
                    {field: 'user_name', title: '顾问'},
                    {field: 'user_names', title: '合作顾问'},
                    {field: 'contact', title: '联系人'},
                    {field: 'tel', title: '联系电话'},
                    {field: 'source', title: '客户来源'},
                    {field: 'date', title: '接入日期', template: getDate},
                    {field: 'status', title: '状态'},
                    {title: '操作', template: '<a href="\\#/bd/edit/#:id#" class="btn btn-default btn-sm"><i class="fa fa-pencil"></i></a> ' +
                    '<a href="\\#/bd/record/#:id#" class="btn btn-info btn-sm"><i class="fa fa-list"></i></a> ' +
                    '<a data-id="#:id#" class="btn btn-danger btn-sm" ng-click="bdDelete(#:id#)"><i class="fa fa-trash-o"></i></a>', width: 140}
                ],
                scrollable: false,
                pageable: true,

            },
            grid2: {
                dataSource: {
                    transport: {
                        read: {
                            url: '/bd/json-bd-list-data',
                            dataType: 'json'
                        }
                    },
                    pageSize: 10,
                    schema: {
                        model: {
                            id: 'id'
                        }
                    },
                    filter: {field: 'deleted', operator: 'neq', value: true}
                },
                filterable: {mode: 'row'},
                columns: [
                    //{field: 'name', title: 'ID'},
                    {field: 'company_name', title: '企业名称'},
                    {field: 'user_name', title: '顾问'},
                    {field: 'user_names', title: '合作顾问'},
                    {field: 'contact', title: '联系人'},
                    {field: 'tel', title: '联系电话'},
                    {field: 'source', title: '客户来源'},
                    {field: 'date', title: '接入日期', template: getDate},
                    {field: 'status', title: '状态'},
                    {title: '操作', template: '<a href="\\#/bd/edit/#:id#" class="btn btn-default btn-sm"><i class="fa fa-pencil"></i></a> ' +
                    '<a href="\\#/bd/record/#:id#" class="btn btn-info btn-sm"><i class="fa fa-list"></i></a> ' +
                    '<a data-id="#:id#" class="btn btn-danger btn-sm" ng-click="bdDelete(#:id#)"><i class="fa fa-trash-o"></i></a>', width: 140}
                ],
                scrollable: false,
                pageable: true,

            }
        }

        $('#grid').kendoGrid();

        $('#grid2').kendoGrid();

        $scope.bdDelete = function (id) {
            $.$modal.confirm('确定要删除吗?', function (isOk) {
                if (!isOk) return;
                $.$ajax.post('/bd/delete/'+id, function (res) {
                    $.$modal.alert('删除成功', function () {
                        $('#grid').data('kendoGrid').dataSource.read()
                        $('#grid2').data('kendoGrid').dataSource.read();
                    });
                })
            })
        }

        function getDate(item) {
            return new Date(item.date.replace(/-/g, '/')).format();
        }
    }]);

    app.controller('bdRecordController', ['$scope', '$http', '$routeParams', 'model', 'token', function ($scope, $http, $routeParams, model, token) {
        var session = model.getUserSession();

        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: '/bd/file-list?bd_id='+$routeParams.bd_id
                }
            },
            pageSize: 10,
            schema: {
                model: {
                    id: 'id'
                }
            },
            filter: {field: 'deleted', operator: 'neq', value: true}
        });

        $scope.file = model.getRecordFile();

        $scope.config = {
            grid: {
                dataSource: dataSource,
                toolbar: [
                    {
                        template: '<a class="btn btn-success" id="addFile" ng-click="win1.open()">添加附件</a>'
                    }
                ],
                columns: [
                    {field: 'id', title: 'ID'},
                    {field: 'path', title: '文件名称', template: getFileName},
                    {field: 'desc', title: '备注'},
                    {field: 'created_at', title: '上传时间'},
                    {title: '操作', template: '<a href="/file/download-file/?path=#:path#&name=#:name#&coded=#:coded#" class="btn btn-info btn-sm" title="下载文件"><i class="fa fa-download"></i></a>' +
                    ' <a href="/bd/delete-file/?id=#:id#&path=#:path#" class="btn btn-danger btn-sm" title="删除文件"><i class="fa fa-trash-o"></i></a>', width: 140}
                ],
                scrollable: false,
                pageable: true,
            },
            file: {
                async: {
                    saveUrl: '/file/upload?_token='+token.getCsrfToken(),
                    saveField: 'file',
                },
                success: function (e) {
                    console.log(e);
                    $scope.file.path = e.response;
                    $scope.file.name = e.files[0].name;
                    $scope.file.coded = 1;
                    $scope.$apply();
                },
                complete: function (e) {
                    console.log('complete');
                }
            }
        };

        function getFileName(item) {
            if (item.coded == 0) {
                return item.path.split('/').pop();
            } else {
                return item.name;
            }
        }

        model.getBdInfo(~~$routeParams.bd_id, function (data) {
            $scope.bd = data;
            $scope.$broadcast('refresh.company-info', $scope.bd.company_id);
        });

        $scope.records = [];

        $http.get('/bd/record-list?bd_id='+$routeParams.bd_id).success(function (res) {
            $scope.records = res;
        });

        $scope.user_id = session.id;

        var newRecord = {
            bd_id: $routeParams.bd_id,
            user_id: session.id,
            user_name: session.nickname,
            text: '',
        };

        $scope.record = $.extend({}, newRecord);

        $scope.delRecord = function (idx) {
            $scope.records.splice(idx, 1);
        };

        $scope.addRecord = function () {

            $http.post('/bd/add-record', {record: $scope.record}).success(function (res) {
                if (res && res.id) {
                    $scope.record.id = res.id;
                    $scope.record.created_at = res.created_at;
                    $scope.records.push($.extend({}, $scope.record));
                    $scope.record = $.extend({}, newRecord);
                }
            });
        };

        $scope.saveFile = function () {
            if ($scope.file.path == '') return;
            $scope.file.bd_id = $routeParams.bd_id;
            $http.post('/bd/add-file', {file: $scope.file}).success(function (res) {
                if (~~res) {
                    $scope.win1.close();
                    $.$modal.alert('文件保存成功', function () {
                        dataSource.read();
                    });
                }
            });
        }
    }]);

    //controllers for hunt
    app.controller('huntController', ['$scope', '$http', function ($scope, $http) {
        $scope.$on('saved.hunt', function (e, res) {
            if (~~res > 0) {
                $.$modal.alert('保存成功！', function () {
                    location.href = '#/hunt/list';
                });
            } else {
                $.$modal.alert(res);
            }
        });

        $scope.$on('quit.hunt', function (e) {
            location.href = '#/hunt/list';
        });
    }]);

    app.controller('huntListController', ['$scope', '$http', '$routeParams', 'model', 'token', function ($scope, $http, $routeParams, model, token) {
        var session = model.getUserSession();

        $scope.config = {
            grid: {
                dataSource: {
                    transport: {
                        read: {
                            url: '/hunt/json-hunt-select-list-data',
                            dataType: 'json'
                        }
                    },
                    pageSize: 10,
                    schema: {
                        model: {
                            id: 'id'
                        }
                    },
                    filter: {field: 'deleted', operator: 'neq', value: true},
                    sort: [
                        {field: 'status', dir: 'desc', compare: function (a, b) {
                            var status = {'进行中': 3, '已暂停': 2, '已停止': 1};
                            return status[a.status] < status[b.status] ? -1 : status[a.status] === status[b.status] ? 0 : 1;
                        }},
                        {field: 'type', dir: 'desc', compare: function (a, b) {
                            var type = {'低': 1, '中': 2, '高': 3};
                            return type[a.type] < type[b.type] ? -1 : type[a.type] === type[b.type] ? 0 : 1;
                        }},
                    ]
                },
                filterable: {mode: 'row'},
                columns: [
                    //{field: 'id', title: 'ID', sortable: false, filterable: false},
                    {
                        field: 'job_name',
                        title: '职位名称',
                        template: '#:job_name# <a ng-click="viewJob(#:job_id#)"><i class="fa fa-search pointer"></i></a>',
                        sortable: false,
                        filterable: {
                            cell: {
                                operator: 'contains'
                            }
                        }
                    },
                    {field: 'company_name', title: '客户名称', template: '#:company_name# <a ng-click="viewCompany(#:company_id#)"><i class="fa fa-search pointer"></i></a>', sortable: false},
                    {field: 'user_names', title: '顾问', sortable: false},
                    {field: 'person_count', title: '人选', filterable: false, template: getCountColor('person_count')},
                    {field: 'report_count', title: '报告', filterable: false, template: getCountColor('report_count')},
                    {field: 'view_count', title: '面试', filterable: false, template: getCountColor('view_count')},
                    {field: 'offer_count', title: 'Offer', filterable: false, template: getCountColor('offer_count')},
                    {field: 'type', title: '重要程度', template: getType, sortable: {
                        compare: function (a, b) {
                            var type = {'低': 1, '中': 2, '高': 3};
                            return type[a.type] < type[b.type] ? -1 : type[a.type] === type[b.type] ? 0 : 1;
                        }
                    }, filterable: {multi:true}},
                    {field: 'status', title: '状态', template: getStatus},
                    {
                        title: '操作',
                        template: '<a href="\\#/hunt/select/#:id#" class="btn btn-default btn-sm" target="_blank"><i class="fa fa-pencil"></i></a>',
                        width: 140,
                        sortable: false,
                        filterable: {multi:true}
                    }
                ],
                sortable: true,
                scrollable: false,
                pageable: true,
            },
            gridDetail: function (item) {
                return {
                    dataSource: {
                        transport: {
                            read: {
                                url: '/hunt/json-hunt-select-job-data',
                                data: {job_id: item.job_id},
                                dataType: 'json'
                            }
                        },
                        pageSize: 5,
                        schema: {
                            model: {
                                id: 'id'
                            }
                        },
                        filter: {field: 'deleted', operator: 'neq', value: true}
                    },
                    columns: [
                        {field: 'name', title: '候选人', template: getName},
                        {field: 'company', title: '所在公司'},
                        {field: 'job', title: '现任职位'},
                        {field: 'salary_month', title: '目前薪资', template: getSalary},
                        //{field: 'sex', title: '性别'},
                        {field: 'age', title: '年龄'},
                        {field: 'degree', title: '学历'},
                        {field: 'tel', title: '联系电话'},
                        {field: 'date', title: '接入日期', template: getDate},
                        {title: '<div class=\'text-center\'>当前状态</div>', columns: [
                            {filed: 'reported', title: '推荐', template: getPersonStatus('reported')},
                            {filed: 'faced', title: '面试', template: getPersonStatus('faced')},
                            {filed: 'offered', title: 'Offer', template: getPersonStatus('offered')},
                            {filed: 'succeed', title: '上岗', template: getPersonStatus('succeed')},
                        ]},
                        {field: 'user_name', title: '顾问'},
                        {title: '操作', template: '<a href="\\#/hunt/edit/#:id#" class="btn btn-default btn-sm"><i class="fa fa-pencil"></i></a> ' +
                        '<a href="\\#/hunt/record/#:id#" class="btn btn-info btn-sm" target="_blank"><i class="fa fa-list"></i></a> ' +
                        '<a ng-click="deleteHunt(#:id#)" class="btn btn-danger btn-sm"><i class="fa fa-trash-o"></i></a>', width: 140}
                    ],
                    scrollable: false,
                    pageable: true,
                }
            },
            grid2: {
                dataSource: {
                    transport: {
                        read: {
                            url: '/hunt/json-hunt-list-data',
                            dataType: 'json'
                        }
                    },
                    pageSize: 10,
                    schema: {
                        model: {
                            id: 'id'
                        }
                    },
                    filter: {field: 'deleted', operator: 'neq', value: true}
                },
                filterable: {mode: 'row'},
                columns: [
                    //{field: 'HID', title: 'ID'},
                    {field: 'person_name', title: '候选人', template: getName},
                    {field: 'tel', title: '联系电话'},
                    {field: 'email', title: '邮箱'},
                    {field: 'job_name', title: '岗位名称'},
                    {field: 'company_name', title: '企业名称'},
                    {field: 'salary_month', title: '目前薪资', template: getSalary},
                    {field: 'date', title: '接入日期', template: getDate, filterable: false},
                    {field: 'description', title: '寻访记录', template: getRecord, filterable: false},
                    {title: '操作', template: '<a href="\\#/hunt/edit/#:id#" class="btn btn-default btn-sm"><i class="fa fa-pencil"></i></a> ' +
                    '<a href="\\#/hunt/record/#:id#" class="btn btn-info btn-sm"><i class="fa fa-list"></i></a> ' +
                    '<a ng-click="deleteHunt(#:id#)" class="btn btn-danger btn-sm"><i class="fa fa-trash-o"></i></a>', width: 140}
                ],
                scrollable: false,
                pageable: true,
                dataBound: function () {
                    $('a[data-toggle="popover-hover"]').popover({
                        trigger: 'hover',
                        html: true
                    });
                }
            }
        };

        $scope.deleteHunt = function (id) {
            $.$modal.confirm('确定要删除吗?', function (isOk) {
                if (!isOk) return;
                $.$ajax.post('/hunt/delete/'+id, function (res) {
                    $.$modal.alert('删除成功', function () {
                        location.reload();
                    });
                });
            })
        };

        function getName(item) {
            return '<span class="person-{0}">{1} <small class="dark-gray">{2}</small> <a ng-click="viewPerson({3})"><i class="fa fa-search pointer"></i></a> <a ng-click="editPerson({3})"><i class="fa fa-pencil pointer"></i></a></span>'.format(item.type, item.name, item.sex=="男"?"先生":"女士", item.person_id);
        }

        function getPersonStatus(name) {
            return function (item) {
                return item[name] == '0' ? '<span class="bold red"><i class="fa fa-times"></i></span>' : '<span class="bold green"><i class="fa fa-check"></i></span>';
            }
        }

        function getCountColor(name) {
            return function (item) {
                return item[name] == '0' ? '<span class="bold red">'+item[name]+'</span>' : '<span class="bold green">'+item[name]+'</span>';
            }
        }

        function getDate(item) {
            return new Date(item.date.replace(/-/g, '/')).format();
        }

        function getType(item) {
            var color = {'低': 'dark-gray', '中': 'yellow', '高': 'red'};
            return '<span class="{0}">{1}</span>'.format(color[item.type], item.type);
        }

        function getStatus(item) {
            var color = {'已停止': 'dark-gray', '已暂停': 'yellow', '进行中': 'green'};
            return '<span class="{0}">{1}</span>'.format(color[item.status], item.status);
        }

        function getSalary(item) {
            var str = [];
            if (item.salary_month) str.push('月薪：<span class="text-info">{0}</span>万'.format(item.salary_month));
            if (item.salary_year) str.push('年薪：<span class="text-info">{0}</span>万'.format(item.salary_year));
            return str.join('/');
        }

        function getRecord(item) {
            return '<span><a tabindex="0" data-container="body" data-titleclass="bordered-ivory" data-class="dark" data-toggle="popover-hover" data-trigger="hover" data-placement="top" data-content="{1}">{0}</a></span>'.format(item.description.length > 5 ? item.description.substr(0,5) + '…' : item.description, item.description);
        }

        $scope.viewCompany = function (cid) {
            $scope.$broadcast('refresh.company-info', cid, function () {
                $scope.win6.center().open();
            });
        };

        $scope.viewJob = function (jid) {
            $scope.$broadcast('refresh.job-info', jid, function () {
                $scope.win5.center().open();
            });
        };

        $scope.viewPerson = function (pid) {
            $scope.$broadcast('refresh.person-info', pid, function () {
                $scope.win4.center().open();
            });
        };

        $scope.editPerson = function (pid) {
            $scope.$broadcast('load.resume', pid, function () {
                $scope.win7.center().open();
            });
        }

        $scope.$on('saved.resume', function (e, res) {
            if (~~res > 0) {
                $scope.win7.close();
                $.$modal.alert('保存成功！');
            } else {
                $.$modal.alert(res);
            }
        });

        $scope.$on('quit.resume', function (e) {
            $scope.win7.close();
        });

    }]);

    app.controller('huntSelectController', ['$scope', '$http', '$routeParams', 'model', 'token', function ($scope, $http, $routeParams, model, token) {
        var session = model.getUserSession();
        $scope.hs = {};
        $scope.debug = {};

        var dsJob = new kendo.data.DataSource({
            transport: {
                read: {
                    url: '/hunt/json-job-list-data',
                    dataType: 'json'
                }
            }
        });

        if ($routeParams.hs_id) {
            model.getHuntSelectInfo(~~$routeParams.hs_id, function (data) {
                $scope.hs = data;
                $scope.debug.job_id = data.job_id;
                $scope.debug.user_ids = data.user_ids;
            });
        } else {
            $scope.hunt = model.getNewHuntSelect();
        }

        $scope.config = {
            users: {
                dataSource: {
                    transport: {
                        read: {
                            url: '/hunt/user-list',
                            dataType: 'json'
                        }
                    }
                },
                optionLabel: '请选择顾问...',
                filter: 'startswith',
                delay: 500,
                dataTextField: 'nickname',
                dataValueField: 'id',
                change: function () {
                    var item = this.dataItems(), names = [];
                    for (var i = 0; i < item.length; i++) {
                        names.push(item[i].nickname);
                    }
                    $scope.hs.user_names = names;
                    $scope.$apply();
                }
            },
            jobs: {
                dataSource: dsJob,
                optionLabel: '请选择岗位...',
                filter: 'startswith',
                delay: 500,
                dataTextField: 'name',
                dataValueField: 'id',
                template: '<strong>#:name#</strong> <span class="dark-gray">[ #:company_name# ]</span>',
                change: function () {
                    var item = this.dataItem();
                    $scope.hs.job_name = item.name;
                    $scope.hs.job_id = item.id;
                    $scope.hs.company_id = item.company_id;
                    $scope.hs.company_name = item.company_name;
                    $scope.$apply();
                },
                dataBound: function () {
                    $scope.hs.job_id = $scope.debug.job_id;
                }
            },
        }

        $scope.$on('saved.job', function (e, res, job) {
            if(~~res > 0) {
                dsJob.read();
                $scope.hs.job_id = job.id;
                $scope.hs.job_name = job.name;
                $scope.win1.close();
                $.$modal.alert('保存成功！');
            } else {
                $.$modal.alert(res);
            }
        });

        $scope.$on('quit.job', function () {
            $scope.win1.close();
        });

        $scope.saveInfo = function () {
            console.log($scope.hs);
            var url = !~~$routeParams.hs_id ? '/hunt/save-select-new' : '/hunt/save-select-edit';
            var hs = $.extend(true, {}, $scope.hs);
            hs.user_ids = hs.user_ids.join(',');
            hs.user_names = hs.user_names.join(',');
            $http.post(url, {hs: hs}).success(function (res) {
                if (~~res > 0) {
                    $.$modal.alert('保存成功！', function () {
                        location.href = '#/hunt/list';
                    });
                } else {
                    $.$modal.alert(res);
                }
            });
        };

        $scope.quit = function () {
            location.href = '#/hunt/list';
        };

    }]);

    app.controller('huntRecordController', ['$scope', '$http', '$routeParams', 'model', 'token', function ($scope, $http, $routeParams, model, token) {
        var session = model.getUserSession();

        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: '/hunt/file-list?hunt_id='+$routeParams.hunt_id
                }
            },
            pageSize: 10,
            schema: {
                model: {
                    id: 'id'
                }
            },
            filter: {field: 'deleted', operator: 'neq', value: true}
        });

        var dsPerson = new kendo.data.DataSource({
            transport: {
                read: {
                    url: '/hunt/person-hunt-list',
                    data: {person_id: 0}
                }
            },
            pageSize: 10,
            schema: {
                model: {
                    id: 'id'
                }
            },
            filter: {field: 'deleted', operator: 'neq', value: true}
        });

        var dsHunt = new kendo.data.DataSource({
            transport: {
                read: {
                    url: '/hunt/job-hunt-list',
                    data: {job_id: 0}
                }
            },
            pageSize: 10,
            schema: {
                model: {
                    id: 'id'
                }
            },
            filter: {field: 'deleted', operator: 'neq', value: true}
        });

        var dsFace = new kendo.data.DataSource({
            transport: {
                read: {
                    url: '/hunt/face-list',
                    data: {hunt_id: $routeParams.hunt_id}
                }
            },
            pageSize: 10,
            schema: {
                model: {
                    id: 'id'
                }
            },
            filter: {field: 'deleted', operator: 'neq', value: true}
        });

        $scope.file = model.getRecordFile();
        $scope.report = model.getRecordReport();
        $scope.face = model.getRecordNewFace();
        $scope.offer = model.getRecordOffer();
        $scope.success = model.getRecordSuccess();
        $scope.rptInfo = {
            total: '',
            list: []
        }

        $scope.config = {
            grid: {
                dataSource: dataSource,
                toolbar: [
                    {
                        template: '<a class="btn btn-success" id="addFile" ng-click="win1.open()">添加附件</a>'
                    }
                ],
                columns: [
                    {field: 'id', title: 'ID'},
                    {field: 'path', title: '文件名称', template: getFileName},
                    {field: 'desc', title: '备注'},
                    {field: 'created_at', title: '上传时间'},
                    {title: '操作', template: '<a href="/file/download-file/?path=#:path#&name=#:name#&coded=#:coded#" class="btn btn-info btn-sm" title="下载文件"><i class="fa fa-download"></i></a>' +
                    ' <a href="/hunt/delete-file/?id=#:id#&path=#:path#" class="btn btn-danger btn-sm" title="删除文件"><i class="fa fa-trash-o"></i></a>', width: 140}
                ],
                scrollable: false,
                pageable: true,
            },
            grid_person: {
                dataSource: dsPerson,
                columns: [
                    {field: 'id', title: 'ID'},
                    {field: 'job_name', title: '岗位名称'},
                    {field: 'company_name', title: '所属企业'},
                    {field: 'user', title: '顾问'},
                    {field: 'status', title: '状态'}
                ],
                scrollable: false,
                pageable: true,
            },
            grid_hunt: {
                dataSource: dsHunt,
                columns: [
                    {field: 'id', title: 'ID'},
                    {field: 'person_name', title: '姓名', template: '#:person_name#<small class="dark-gray">#:sex=="男"?"先生":"女士"#</small>'},
                    {field: 'job', title: '当前职位'},
                    {field: 'company', title: '所在公司'},
                    {field: 'tel', title: '联系电话'},
                    {field: 'user_name', title: '顾问'},
                    {field: 'status', title: '状态'}
                ],
                scrollable: false,
                pageable: true,
            },
            grid_face: {
                dataSource: dsFace,
                columns: [
                    {field: 'num', title: '编号'},
                    {field: 'person_name', title: '面试人'},
                    {field: 'job_name', title: '面试岗位'},
                    {field: 'type', title: '面试名称'},
                    {field: 'date', title: '面试日期'},
                    {field: 'tel', title: '手机号'},
                    {field: 'desc', title: '备注'}
                ],
                scrollable: false,
                pageable: true,
            },
            file: {
                async: {
                    saveUrl: '/file/upload?_token='+token.getCsrfToken(),
                    saveField: 'file',
                },
                success: function (e) {
                    console.log(e);
                    $scope.file.path = e.response;
                    $scope.file.name = e.files[0].name;
                    $scope.file.coded = 1;
                    $scope.$apply();
                },
                complete: function (e) {
                    console.log('complete');
                }
            },
            reportFile: {
                async: {
                    saveUrl: '/file/upload?_token='+token.getCsrfToken(),
                    saveField: 'file',
                },
                success: function (e) {
                    console.log(e);
                    $scope.report.filepath = e.response;
                    $scope.report.filename = e.files[0].name;
                    $scope.report.filecoded = 1;
                    $scope.$apply();
                },
                complete: function (e) {
                    console.log('complete');
                }
            },
            rptWin: {
                open: function () {
                    console.log('open report');
                    $http.get('/hunt/report-info?hunt_id=' + ~~$routeParams.hunt_id).success(function (res) {
                        $scope.rptInfo.total = res.length;
                        $scope.rptInfo.list = res.splice(0,5);
                        //$scope.$apply();
                    });
                }
            },
            offerFile: {
                async: {
                    saveUrl: '/file/upload?_token='+token.getCsrfToken(),
                    saveField: 'file',
                },
                success: function (e) {
                    console.log(e);
                    $scope.offer.filepath = e.response;
                    $scope.offer.filename = e.files[0].name;
                    $scope.offer.filecoded = 1;
                    $scope.$apply();
                },
                complete: function (e) {
                    console.log('complete');
                }
            },
            reportDate: {
                culture: 'zh-CN',
                value: new Date(),
                format: 'yyyy-MM-dd'
            },
            faceNum: {
                spinners: false,
                format: ''
            },
            faceDate: {
                culture: 'zh-CN',
                value: new Date(),
                format: 'yyyy-MM-dd'
            },
            faceTime: {
                culture: 'zh-CN',
                format: 'HH:mm',
                interval: 30,
                min: '00:00',
                max: '23:30'
            },
            successDate: {
                culture: 'zh-CN',
                value: new Date(),
                format: 'yyyy-MM-dd'
            }
        };

        function getFileName(item) {
            if (item.coded == 0) {
                return item.path.split('/').pop();
            } else {
                return item.name;
            }
        }

        model.getHuntInfo(~~$routeParams.hunt_id, function (data) {
            $scope.hunt = data;

            $scope.face.hunt_id = $routeParams.hunt_id;
            $scope.face.person_id = data.person_id;
            $scope.face.person_name = data.person_name;
            $scope.face.job_id = data.job_id;
            $scope.face.job_name = data.job_name;

            $scope.success.hunt_id = $routeParams.hunt_id;
            $scope.success.person_id = data.person_id;
            $scope.success.person_name = data.person_name;
            $scope.success.job_id = data.job_id;
            $scope.success.job_name = data.job_name;
            $scope.success.company_id = data.company_id;
            $scope.success.company_name = data.company_name;

            $scope.$broadcast('refresh.company-info', $scope.hunt.company_id);
            $scope.$broadcast('refresh.job-info', $scope.hunt.job_id);
            $scope.$broadcast('refresh.person-info', $scope.hunt.person_id);
        });

        $scope.records = [];

        $http.get('/hunt/record-list?hunt_id='+$routeParams.hunt_id).success(function (res) {
            $scope.records = res;
        });

        $scope.user_id = session.id;

        var newRecord = {
            hunt_id: $routeParams.hunt_id,
            user_id: session.id,
            user_name: session.nickname,
            text: '',
        };

        $scope.record = $.extend({}, newRecord);

        $scope.delRecord = function (idx) {
            $scope.records.splice(idx, 1);
        };

        $scope.addRecord = function () {

            $http.post('/hunt/add-record', {record: $scope.record}).success(function (res) {
                if (res && res.id) {
                    $scope.record.id = res.id;
                    $scope.record.created_at = res.created_at;
                    $scope.records.push($.extend({}, $scope.record));
                    $scope.record = $.extend({}, newRecord);
                }
            });
        };

        $scope.saveFile = function () {
            if ($scope.file.path == '') return;
            $scope.file.hunt_id = $routeParams.hunt_id;
            $http.post('/hunt/add-file', {file: $scope.file}).success(function (res) {
                if (~~res) {
                    $scope.win1.close();
                    $.$modal.alert('文件保存成功', function () {
                        dataSource.read();
                    });
                }
            });
        }

        $scope.makeReport = function () {
            $scope.win7.open();
        };

        $scope.saveReport = function () {
            var report = $scope.report;
            report.hunt_id = $routeParams.hunt_id;
            report.job_id = $scope.hunt.job_id;
            report.job_name = $scope.hunt.job_name;
            report.company_id = $scope.hunt.company_id;
            report.company_name = $scope.hunt.company_name;
            report.person_id = $scope.hunt.person_id;
            report.person_name = $scope.hunt.person_name;

            $http.post('/hunt/save-report', {report: report}).success(function (res) {
                if (~~res) {
                    report.id = res;
                    $scope.reportInfo = report;
                    $scope.win7.close();
                    $.$modal.alert('上传推荐报告成功');
                }
            });
        };

        $scope.deleteReport = function (id) {
            $.$modal.confirm('确认要删除吗？', function (isOk) {
                if (isOk) {
                    $http.post('/hunt/delete-report', {id: id}).success(function (res) {
                        if (~~res) {
                            $scope.offerInfo = {};
                            $.$modal.alert('推荐报告已删除！');
                        }
                    });
                }
            });
        }

        $scope.reportInfo = {};
        model.getHuntReportInfo(~~$routeParams.hunt_id, function (res) {
            console.log(res);
            if (res.id) {
                $scope.reportInfo = res;
            }
        });

        $scope.addFaceView = function () {
            $scope.win8.open();
        };

        $scope.saveFace = function () {
            var face = $scope.face;
            face.date = face.date + ' ' + face.time;
            delete face.time;

            $http.post('/hunt/save-face', {face: face}).success(function (res) {
                if (~~res) {
                    $scope.face = model.getRecordNewFace();
                    $scope.win8.close();
                    dsFace.read();
                    $.$modal.alert('面试通知保存成功');
                }
            });
        };

        $scope.makeOffer = function () {
            $scope.win9.open();
        };

        $scope.saveOffer = function () {
            var offer = $scope.offer;
            offer.hunt_id = $routeParams.hunt_id;
            offer.job_id = $scope.hunt.job_id;
            offer.job_name = $scope.hunt.job_name;
            offer.company_id = $scope.hunt.company_id;
            offer.company_name = $scope.hunt.company_name;
            offer.person_id = $scope.hunt.person_id;
            offer.person_name = $scope.hunt.person_name;

            $http.post('/hunt/save-report', {report: offer}).success(function (res) {
                if (~~res) {
                    offer.id = res;
                    $scope.offerInfo = offer;
                    $scope.win9.close();
                    $.$modal.alert('上传Offer成功');
                }
            });
        };

        $scope.makeSuccess = function () {
            $scope.win10.open();
        };

        $scope.saveSuccess = function () {
            var success = $scope.success;
            success.hunt_id = $routeParams.hunt_id;
            success.job_id = $scope.hunt.job_id;
            success.job_name = $scope.hunt.job_name;
            success.company_id = $scope.hunt.company_id;
            success.company_name = $scope.hunt.company_name;
            success.person_id = $scope.hunt.person_id;
            success.person_name = $scope.hunt.person_name;

            $http.post('/hunt/save-success', {success: success}).success(function (res) {
                if (~~res) {
                    success.id = res;
                    $scope.win10.close();
                    $.$modal.alert('候选人已成功上岗！');
                }
            });
        };

        $scope.offerInfo = {};
        model.getHuntOfferInfo(~~$routeParams.hunt_id, function (res) {
            console.log(res);
            if (res.id) {
                $scope.offerInfo = res;
            }
        });

        $scope.showPersonHuntList = function () {
            dsPerson.read({person_id: $scope.hunt.person_id});
            $scope.win2.open();
        };

        $scope.showJobHuntList = function () {
            dsHunt.read({job_id: $scope.hunt.job_id});
            $scope.win3.open();
        };
    }]);

    //controllers for performance
    app.controller('performanceListController', ['$scope', '$http', function ($scope, $http) {
        var d = new Date(), day = d.getDay() === 0 ? 7 : d.getDay();

        $scope.search = {
            sdate: Date.translate('now-'+(day - 1)).format(),
            edate: Date.translate('now').format()
        };

        $scope.searched = {
            type: '自定义',
            sdate: $scope.search.sdate,
            edate: $scope.search.edate
        };

        var gridData = new kendo.data.DataSource({
            transport: {
                read: {
                    url: '/performance/json-performance-list-data',
                    dataType: 'json',
                    data: {sdate: $scope.search.sdate, edate: $scope.search.edate}
                }
            },
            pageSize: 10,
            schema: {
                model: {
                    id: 'id'
                }
            },
            filter: {field: 'deleted', operator: 'neq', value: true}
        });

        var detailData = new kendo.data.DataSource({
            pageSize: 10,
            schema: {
                model: {
                    id: 'id'
                }
            },
            data: []
        });

        $scope.config = {
            grid: {
                dataSource: gridData,
                filterable: {mode: 'row'},
                columns: [
                    {field: 'id', title: 'ID', sortable: false, filterable: false},
                    {field: 'name', title: '账号', sortable: false},
                    {field: 'nickname', title: '顾问', sortable: false},
                    {field: 'person_count', title: '人选', filterable: false, template: getCountColor('person_count')},
                    {field: 'report_count', title: '报告', filterable: false, template: getCountColor('report_count')},
                    {field: 'face_count', title: '面试', filterable: false, template: getCountColor('face_count')},
                    {field: 'offer_count', title: 'Offer', filterable: false, template: getCountColor('offer_count')},
                    {field: 'success_count', title: '上岗', filterable: false, template: getCountColor('success_count')}
                ],
                sortable: true,
                scrollable: false,
                pageable: true,
            },
            sdate: {
                culture: 'zh-CN',
                format: 'yyyy-MM-dd',
                max: Date.translate('now').format(),
                value: $scope.search.sdate
            },
            edate: {
                culture: 'zh-CN',
                format: 'yyyy-MM-dd',
                max: Date.translate('now').format(),
                value: $scope.search.edate
            },
            gridDetail: {
                dataSource: detailData,
                scrollable: false,
                pageable: true,
                columns: [
                    {title: '详细信息', template: getDetailText},
                    {filed: 'updated_at', title: '提交日期', template: getDetailTime}
                ]
            }
        };

        function getCountColor(name) {
            return function (item) {
                return item[name] == '0' ? '<span class="bold red">{0}</span>'.format(item[name]) : '<span class="bold green pointer" ng-click="showDetailList({1},\'{2}\')">{0}</span>'.format(item[name], item.id, name);
            }
        }

        function getDetailText(item) {
            switch ($scope.detailField) {
                case 'person_count':
                    return '<span class="orange bold">{0}</span> <span class="gray"> {1} {2}岁</span> <span class="blue">{3}</span> <span class="main">{4}</span>'.format(item.name, item.sex, item.age, item.job, item.company);
                    break;
                case 'report_count':
                    return item.filename;
                    break;
                case 'face_count':
                    return '<span class="orange bold">{0}</span> <small class="gray">{1}</small> <span class="red">{2}</span> <span class="dark-gray">{3}</span> <span class="blue">{4}</span>'.format(item.person_name, item.tel, item.date, item.job_name, item.type);
                    break;
                case 'offer_count':
                    return '<span class="orange bold">{0}</span> <span class="blue">{1}</span> <span class="dark-gray">{2}</span> <span class="main">{3}</span>'.format(item.person_name, item.job_name, item.company_name, item.filename);
                    break;
                case 'success_count':
                    return '<span class="orange bold">{0}</span> <span class="blue">{1}</span> <span class="dark-gray">{2}</span> <span class="red">{3}上岗</span> <span class="main">保证期：{4}</span>'.format(item.person_name, item.job_name, item.company_name, Date.format(item.date), item.protected);
                    break;
                default:
                    return '';
                    break;
            }
        }

        function getDetailTime(item) {
            var time = $scope.detailField == 'person_count' ? item.created_at : item.updated_at;
            return Date.format(time);
        }

        $scope.detailField = 'person_count';
        $scope.showDetailList = function (id, field) {
            $scope.detailField = field;
            $http.get('/performance/json-detail-list', {params: {id: id, field: field, sdate: $scope.searched.sdate, edate: $scope.searched.edate}}).success(function (res) {
                detailData.data(res);
                $scope.win1.center().open();
            });
        };

        $scope.customSearch = function () {
            gridData.read($scope.search).then(function () {
                $scope.searched = {
                    type: '自定义',
                    sdate: $scope.search.sdate,
                    edate: $scope.search.edate
                }
                $scope.$apply();
            });
        }

        $scope.quickSearch = function (type) {
            var date = {sdate: '', edate: ''};
            switch (type) {
                case '本周':
                    date.sdate = Date.translate('now-'+(day - 1)).format();
                    date.edate = Date.translate('now+'+(day % 7 + (7 - day))).format();
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
                default:
                    return;
                    break;
            }
            gridData.read(date).then(function () {
                $scope.searched = {
                    type: type,
                    sdate: date.sdate,
                    edate: date.edate
                }
                $scope.$apply();
            });
        }
    }]);

    app.controller('targetListController', ['$scope', '$http', function ($scope, $http) {
        $scope.selMonth = '2016-11';
    }]);

    //controllers for user
    app.controller('userInfoController', ['$scope', '$http', 'model', 'token', function ($scope, $http, model, token) {
        $scope.operation = 'view';

        $scope.password = {
            old: '',
            new: '',
            repeat: ''
        };

        $scope.pic_path = '';//'/upload/user_snap/'

        model.getUserInfo(function (user) {
            $scope.user = user;
            $scope.pic_path = user.picpath || '/images/logo.jpg';
            $scope.view = {
                name: user.name,
                nickname: user.nickname,
                date: user.date.split(' ').shift(),
                group: user.group,
                job: user.job
            };
        });

        $scope.config = {
            date: {
                culture: 'zh-CN',
                format: 'yyyy-MM-dd',
                max: new Date()
            },
            select: {
                filter: 'none',
            },
            upload: {
                async: {
                    saveUrl: '/file/upload-user-snap?_token='+token.getCsrfToken(),
                    saveField: 'file',
                },
                success: function (e) {
                    location.reload();
                },
                complete: function (e) {
                    console.log('complete');
                },
                upload: function (e) {
                    var files = e.files;
                    $.each(files, function () {
                        if ([".jpg", ".gif", ".png"].indexOf(this.extension.toLowerCase()) < 0) {
                            $.$modal.alert("只能上传图片类型");
                            e.preventDefault();
                        }
                    });
                }
            }
        };

        $scope.editInfo = function () {
            $scope.operation = 'edit';
        };
        $scope.saveInfo = function () {
            $http.post('/user/save-info', {user: $scope.user}).success(function (res) {
                if (res == '1') {
                    $.$modal.alert('保存成功！');
                    $scope.view.date = $scope.user.date.split(' ').shift();
                    $scope.view.group = $scope.user.group;
                    $scope.view.job = $scope.user.job;
                    $scope.operation = 'view';
                } else {
                    $.$modal.alert('保存失败！');
                }
            });
        };
        $scope.quitInfo = function () {
            $scope.operation = 'view';
        };

        $scope.editPassword = function () {
            $scope.operation = 'password';
        };
        $scope.savePassword = function () {
            $http.post('/user/save-password', {password: $scope.password}).success(function (res) {
                if (res == '1') {
                    $.$modal.alert('修改成功！');
                    $scope.operation = 'view';
                } else {
                    $.$modal.alert('修改失败！');
                }
            });
        };
        $scope.quitPassword = function () {
            $scope.operation = 'view';
        };
    }]);

    app.controller('userController', ['$scope', '$http', 'model', function ($scope, $http, model) {

        $scope.pic_path = '';//'/images/logo.jpg';

        model.getUserInfo(function (user) {
            $scope.user = user;
            if ($scope.user.picpath) $scope.pic_path = $scope.user.picpath;
        });

        $scope.$on('load.user', function () {
            model.getUserInfo(function (user) {
                $scope.user = user;
                if ($scope.user.picpath) $scope.pic_path = $scope.user.picpath;
            });
        })
    }]);

})(window, angular);