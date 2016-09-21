/**
 * Created by roger on 16/3/18.
 */
(function (window, angular) {
    var app = window.RZ.app;

    //temp controller for route
    app.controller('routeTempController', function ($scope) {

    });

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
                    {field: 'user_names', title: '顾问', sortable: false, filterable: false},
                    {field: 'type', title: '重要程度', template: getType, sortable: {
                        compare: function (a, b) {
                            var type = {'低': 1, '中': 2, '高': 3};
                            return type[a.type] < type[b.type] ? -1 : type[a.type] === type[b.type] ? 0 : 1;
                        }
                    }, filterable: false},
                    {field: 'status', title: '当前状态', sortable: true, template: getStatus, filterable: false},
                    {
                        title: '操作',
                        template: '<a href="\\#/hunt/select/#:id#" class="btn btn-default btn-sm" target="_blank"><i class="fa fa-pencil"></i></a>',
                        width: 140,
                        sortable: false,
                        filterable: false
                    }
                ],
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
                        {field: 'name', title: 'ID'},
                        {field: 'person_name', title: '候选人', template: '#:person_name# <a ng-click="viewPerson(#:person_id#)"><i class="fa fa-search pointer"></i></a>'},
                        {field: 'date', title: '接入日期', template: getDate},
                        {field: 'status', title: '状态'},
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
                columns: [
                    {field: 'name', title: 'ID'},
                    {field: 'person_name', title: '候选人'},
                    {field: 'job_name', title: '岗位名称'},
                    {field: 'company_name', title: '企业名称'},
                    {field: 'date', title: '接入日期', template: getDate},
                    {field: 'status', title: '状态'},
                    {title: '操作', template: '<a href="\\#/hunt/edit/#:id#" class="btn btn-default btn-sm"><i class="fa fa-pencil"></i></a> ' +
                    '<a href="\\#/hunt/record/#:id#" class="btn btn-info btn-sm"><i class="fa fa-list"></i></a> ' +
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
                    {field: 'id', title: 'ID'},
                    {field: 'name', title: '面试名称'},
                    {field: 'date', title: '面试日期', template: function (item) {
                        return new Date(item.date.replace(/-/g, '/')).format();
                    }},
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
            face.hunt_id = $routeParams.hunt_id;

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
    }])

})(window, angular);