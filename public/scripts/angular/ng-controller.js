/**
 * Created by roger on 16/3/18.
 */
(function (window, angular) {
    var app = window.RZ.app;

    //temp controller for route
    app.controller('routeTempController', ['$scope', 'model', function ($scope, model) {
        $scope.session = model.getUserSession();
    }]);

    //controller for dashboard
    app.controller('dashboardController', ['$scope', '$http', '$routeParams', 'model', 'token', function ($scope, $http, $routeParams, model, token) {


        $scope.config = {
            //grid: {
            //    dataSource: {
            //        transport: {
            //            read: {
            //                url: '/dashboard/recent-hunt-list',
            //                dataType: 'json'
            //            }
            //        },
            //        pageSize: 5,
            //        schema: {
            //            model: {
            //                id: 'id'
            //            }
            //        },
            //        filter: {field: 'deleted', operator: 'neq', value: true},
            //        sort: [
            //            {field: 'updated_at', dir: 'desc'},
            //            {field: 'status', dir: 'desc', compare: function (a, b) {
            //                var status = {'进行中': 3, '已暂停': 2, '已停止': 1};
            //                return status[a.status] < status[b.status] ? -1 : status[a.status] === status[b.status] ? 0 : 1;
            //            }},
            //            {field: 'type', dir: 'desc', compare: function (a, b) {
            //                var type = {'低': 1, '中': 2, '高': 3};
            //                return type[a.type] < type[b.type] ? -1 : type[a.type] === type[b.type] ? 0 : 1;
            //            }},
            //        ]
            //    },
            //    filterable: {mode: 'row'},
            //    columns: [
            //        {field: 'id', title: 'ID', sortable: false, filterable: false},
            //        {
            //            field: 'job_name',
            //            title: '职位名称',
            //            template: '#:job_name# <a ng-click="viewJob(#:job_id#)"><i class="fa fa-search pointer"></i></a>',
            //            sortable: false,
            //            filterable: {
            //                cell: {
            //                    operator: 'contains'
            //                }
            //            }
            //        },
            //        {field: 'company_name', title: '客户名称', template: '#:company_name# <a ng-click="viewCompany(#:company_id#)"><i class="fa fa-search pointer"></i></a>', sortable: false},
            //        {field: 'user_names', title: '顾问', sortable: false},
            //        {field: 'person_count', title: '人选', filterable: false, template: getCountColor('person_count')},
            //        {field: 'report_count', title: '报告', filterable: false, template: getCountColor('report_count')},
            //        {field: 'view_count', title: '面试', filterable: false, template: getCountColor('view_count')},
            //        {field: 'offer_count', title: 'Offer', filterable: false, template: getCountColor('offer_count')},
            //        {field: 'type', title: '重要程度', template: getType, sortable: {
            //            compare: function (a, b) {
            //                var type = {'低': 1, '中': 2, '高': 3};
            //                return type[a.type] < type[b.type] ? -1 : type[a.type] === type[b.type] ? 0 : 1;
            //            }
            //        }, filterable: {multi:true}},
            //        {field: 'status', title: '状态', template: getStatus},
            //        {field: 'updated_at', title: '更新日期', template: '#: new Date(updated_at).format()#', filterable: false},
            //        {
            //            title: '操作',
            //            template: '<a href="\\#/hunt/select/#:id#" class="btn btn-default btn-sm" target="_blank"><i class="fa fa-pencil"></i></a>',
            //            width: 140,
            //            sortable: false,
            //            filterable: {multi:true}
            //        }
            //    ],
            //    sortable: true,
            //    scrollable: false,
            //    pageable: true,
            //},
            //gridDetail: function (item) {
            //    return {
            //        dataSource: {
            //            transport: {
            //                read: {
            //                    url: '/hunt/json-hunt-select-job-data',
            //                    data: {job_id: item.job_id},
            //                    dataType: 'json'
            //                }
            //            },
            //            pageSize: 5,
            //            schema: {
            //                model: {
            //                    id: 'id'
            //                }
            //            },
            //            filter: {field: 'deleted', operator: 'neq', value: true}
            //        },
            //        columns: [
            //            {field: 'name', title: '候选人', template: '#:name# <a ng-click="viewPerson(#:person_id#)"><i class="fa fa-search pointer"></i></a>'},
            //            {field: 'company', title: '所在公司'},
            //            {field: 'job', title: '现任职位'},
            //            {field: 'sex', title: '性别'},
            //            {field: 'age', title: '年龄'},
            //            {field: 'degree', title: '学历'},
            //            {field: 'tel', title: '联系电话'},
            //            {field: 'date', title: '接入日期', template: getDate},
            //            {title: '<div class=\'text-center\'>当前状态</div>', columns: [
            //                {filed: 'reported', title: '推荐', template: getPersonStatus('reported')},
            //                {filed: 'faced', title: '面试', template: getPersonStatus('faced')},
            //                {filed: 'offered', title: 'Offer', template: getPersonStatus('offered')},
            //                {filed: 'succeed', title: '上岗', template: getPersonStatus('succeed')},
            //            ]},
            //            {field: 'user_name', title: '顾问'},
            //            {title: '操作', template: '<a href="\\#/hunt/edit/#:id#" class="btn btn-default btn-sm"><i class="fa fa-pencil"></i></a> ' +
            //            '<a href="\\#/hunt/record/#:id#" class="btn btn-info btn-sm" target="_blank"><i class="fa fa-list"></i></a> ' +
            //            '<a ng-click="deleteHunt(#:id#)" class="btn btn-danger btn-sm"><i class="fa fa-trash-o"></i></a>', width: 140}
            //        ],
            //        scrollable: false,
            //        pageable: true,
            //    }
            //},
            //gridPerson: {
            //    dataSource: {
            //        transport: {
            //            read: {
            //                url: '/dashboard/recent-hunt-person',
            //                dataType: 'json'
            //            }
            //        },
            //        pageSize: 5,
            //        schema: {
            //            model: {
            //                id: 'id'
            //            }
            //        },
            //        filter: {field: 'deleted', operator: 'neq', value: true}
            //    },
            //    columns: [
            //        {field: 'name', title: '候选人', template: '#:name# <a ng-click="viewPerson(#:person_id#)"><i class="fa fa-search pointer"></i></a>'},
            //        {field: 'company_name', title: '推荐公司'},
            //        {field: 'job_name', title: '推荐职位'},
            //        {field: 'sex', title: '性别'},
            //        {field: 'age', title: '年龄'},
            //        {field: 'degree', title: '学历'},
            //        {field: 'tel', title: '联系电话'},
            //        {title: '<div class=\'text-center\'>当前状态</div>', columns: [
            //            {filed: 'reported', title: '推荐', template: getPersonStatus('reported')},
            //            {filed: 'faced', title: '面试', template: getPersonStatus('faced')},
            //            {filed: 'offered', title: 'Offer', template: getPersonStatus('offered')},
            //            {filed: 'succeed', title: '上岗', template: getPersonStatus('succeed')},
            //        ]},
            //        {field: 'user_name', title: '顾问'},
            //        {field: 'updated_at', title: '更新日期', template: getUpdatedDate},
            //        {title: '操作', template: '<a href="\\#/hunt/edit/#:id#" class="btn btn-default btn-sm"><i class="fa fa-pencil"></i></a> ' +
            //        '<a href="\\#/hunt/record/#:id#" class="btn btn-info btn-sm" target="_blank"><i class="fa fa-list"></i></a> ' +
            //        '<a ng-click="deleteHunt(#:id#)" class="btn btn-danger btn-sm"><i class="fa fa-trash-o"></i></a>', width: 140}
            //    ],
            //    scrollable: false,
            //    pageable: true,
            //},
            //progress: {
            //    min: 0,
            //    max: 100,
            //    type: 'percent'
            //},
            gridFace: {
                dataSource: {
                    transport: {
                        read: {
                            url: '/dashboard/recent-face-list',
                            data: {}
                        }
                    },
                    pageSize: 5
                },
                columns: [
                    //{field: 'num', title: '编号'},
                    {field: 'person_name', title: '姓名'},
                    {field: 'job_name', title: '岗位'},
                    {field: 'company_name', title: '公司'},
                    {field: 'date', title: '日期'},
                    {field: 'tel', title: '手机号'},
                    {field: 'desc', title: '备注'},
                    //{title: '操作', template: '<a ng-click="editFace(#:id#)"><i class="fa fa-pencil"></i></a><a ng-click="deleteFace(#:id#)"><i class="fa fa-times margin-left-5"></i></a>'}
                ],
                scrollable: false,
                pageable: true,
            },
            gridOffer: {
                dataSource: {
                    transport: {
                        read: {
                            url: '/dashboard/recent-offer-list',
                            data: {}
                        }
                    },
                    pageSize: 5
                },
                columns: [
                    {field: 'person_name', title: '姓名'},
                    {field: 'job_name', title: '岗位'},
                    {field: 'company_name', title: '公司'},
                    {field: 'date', title: '日期', template: '#:new Date(date).format()#'},
                    {field: 'desc', title: '备注'},
                ],
                scrollable: false,
                pageable: true,
            },
            gridSuccess: {
                dataSource: {
                    transport: {
                        read: {
                            url: '/dashboard/recent-success-list',
                            data: {}
                        }
                    },
                    pageSize: 5
                },
                columns: [
                    {field: 'person_name', title: '姓名'},
                    {field: 'job_name', title: '岗位'},
                    {field: 'company_name', title: '公司'},
                    {field: 'date', title: '日期', template: '#:new Date(date).format()#'},
                    {field: 'protected', title: '保证期'},
                    {field: 'desc', title: '备注'},
                ],
                scrollable: false,
                pageable: true,
            },
        };

        //$scope.target = {
        //    person: {
        //        target: 0,
        //        value: 0,
        //        progress: 0
        //    },
        //    report: {
        //        target: 0,
        //        value: 0,
        //        progress: 0
        //    },
        //    face: {
        //        target: 0,
        //        value: 0,
        //        progress: 0
        //    },
        //    offer: {
        //        target: 0,
        //        value: 0,
        //        progress: 0
        //    },
        //    success: {
        //        target: 0,
        //        value: 0,
        //        progress: 0
        //    },
        //    kpi: 0
        //};
        //
        //var now = new Date(), startDate = new Date(now.getFullYear(), now.getMonth(), 1).format(), endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).format();

        //$http.get('/performance/json-target-data', {params: {month: now.format('yyyy-mm')}}).success(function (res) {
        //    console.log(res);
        //    if (res.length > 0) {
        //        for (var t in $scope.target) {
        //            $scope.target[t].target = res[0][t + '_target'];
        //        }
        //    }
        //    $http.get('/performance/json-performance-data', {params: {sdate: startDate, edate: endDate}}).success(function (res) {
        //        console.log(res);
        //        for (var t in $scope.target) {
        //            $scope.target[t].value = res[0][t + '_count'];
        //            $scope.target[t].progress = kendo.toString($scope.target[t].value / $scope.target[t].target, 'p0');
        //        }
        //        var kpi = { person: 0, report: 0, face: 0, offer: 0 };
        //        kpi.person = $scope.target.person.value > 100 ? 20 : $scope.target.person.value * 0.2;
        //        kpi.report = $scope.target.report.value > 40 ? 40 : $scope.target.report.value * 1;
        //        kpi.face = $scope.target.face.value > 18 ? 36 : $scope.target.face.value * 2;
        //        kpi.offer = $scope.target.offer.value * 5;
        //        $scope.target.kpi = kpi.person.plus(kpi.report).plus(kpi.face).plus(kpi.offer);
        //    });
        //});

        //$scope.deleteHunt = function (id) {
        //    $.$modal.confirm('确定要删除吗?', function (isOk) {
        //        if (!isOk) return;
        //        $.$ajax.post('/hunt/delete/'+id, function (res) {
        //            $.$modal.alert('删除成功', function () {
        //                location.reload();
        //            });
        //        });
        //    })
        //};
        //
        //function getPersonStatus(name) {
        //    return function (item) {
        //        return item[name] == '0' ? '<span class="bold red"><i class="fa fa-times"></i></span>' : '<span class="bold green"><i class="fa fa-check"></i></span>';
        //    }
        //}
        //
        //function getCountColor(name) {
        //    return function (item) {
        //        return item[name] == '0' ? '<span class="bold red">'+item[name]+'</span>' : '<span class="bold green">'+item[name]+'</span>';
        //    }
        //}
        //
        //function getDate(item) {
        //    return new Date(item.date.replace(/-/g, '/')).format();
        //}
        //
        //function getUpdatedDate(item) {
        //    return new Date(item.updated_at.replace(/-/g, '/')).format();
        //}
        //
        //function getType(item) {
        //    var color = {'三级': 'dark-gray', '二级': 'yellow', '一级': 'red'};
        //    return '<span class="{0}">{1}</span>'.format(color[item.type], item.type);
        //}
        //
        //function getStatus(item) {
        //    var color = {'已停止': 'dark-gray', '已暂停': 'yellow', '进行中': 'green'};
        //    return '<span class="{0}">{1}</span>'.format(color[item.status], item.status);
        //}
        //
        //$scope.viewCompany = function (cid) {
        //    $scope.$broadcast('refresh.company-info', cid, function () {
        //        $scope.win6.center().open();
        //    });
        //};
        //
        //$scope.viewJob = function (jid) {
        //    $scope.$broadcast('refresh.job-info', jid, function () {
        //        $scope.win5.center().open();
        //    });
        //};
        //
        //$scope.viewPerson = function (pid) {
        //    $scope.$broadcast('refresh.person-info', pid, function () {
        //        $scope.win4.center().open();
        //    });
        //};

    }]);

    //controllers for company
    app.controller('companyController', ['$scope', '$http', '$routeParams', '$location', 'model', 'token', function ($scope, $http, $routeParams, $location, model, token) {
        $scope.session = model.getUserSession();

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

            var dsFile = new kendo.data.DataSource({
                transport: {
                    read: function (option) {
                        $http.get('/company/file-list', {params: {id: $routeParams.company_id}}).success(function (res) {
                            option.success(res);
                        });
                    }
                },
                schema: {
                    model: {
                        id: 'id'
                    }
                },
                pageSize: 10
            });

            $scope.config = {
                grid: {
                    dataSource: dsFile,
                    pageable: true,
                    scrollable: false,
                    columns: [
                        {field: 'name', title: '名称'},
                        {field: 'filename', title: '文件名'},
                        {field: 'created_at', title: '上传日期', template: '#:new Date(created_at).format()#'},
                        {title: '操作', template: '<a href="/file/download-file/?path=#:filepath#&name=#:filename#&coded=1" class="btn btn-info btn-xs"><i class="fa fa-download"></i></a>' +
                        '<a class="btn btn-danger btn-xs margin-left-5" ng-click="deleteFile(#:id#)" power-checker allowed="all" cond="session.id==#:created_by#"><i class="fa fa-trash-o"></i></a>', width: 75},
                    ]
                },
                file: {
                    async: {
                        saveUrl: '/file/upload?_token='+token.getCsrfToken(),
                        saveField: 'file',
                    },
                    success: function (e) {
                        console.log(e);
                        $scope.file.filepath = e.response;
                        $scope.file.filename = e.files[0].name;
                        //$scope.file.coded = 1;
                        $scope.$apply();
                    },
                    complete: function (e) {
                        console.log('complete');
                    }
                },
            };

            $scope.file = {
                name: '',
                filename: '',
                filepath: ''
            };

            $http.get('/company/job-list', {params: {id: $routeParams.company_id}}).success(function (res) {
                $scope.jobs = res;
            });

            $http.get('/company/company-json-data', {params: {id: $routeParams.company_id}}).success(function (res) {
                $scope.company = res;
            });

            $scope.saveFile = function () {
                $http.post('/company/save-file', {name: $scope.file.name, filename: $scope.file.filename, filepath: $scope.file.filepath, company_id: $routeParams.company_id}).success(function (res) {
                    console.log(res);
                    dsFile.read();
                    $scope.win1.close();
                    $scope.file = {
                        name: '',
                        filename: '',
                        filepath: ''
                    };
                });
            }

            $scope.deleteFile = function (id) {
                $.$modal.confirm(['删除文件', '确认要删除该文件吗？'], function (isOk) {
                    if (!isOk) return;
                    $http.post('/company/delete-file', {id: id}).success(function (res) {
                        console.log(res);
                        dsFile.read();
                    });
                });
            }
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

        $scope.session = model.getUserSession();

        $scope.person_id = $routeParams.person_id;

        // if ($location.path() == '/candidate/detail/'+$routeParams.person_id) {
        //     $http.get('/candidate/hunt-list', {params: {id: $routeParams.person_id}}).success(function (res) {
        //         $scope.hunts = res;
        //     });
        //
        //     $http.get('/candidate/addition-list', {params: {id: $routeParams.person_id}}).success(function (res) {
        //         $scope.additions = res;
        //     });
        //
        //     $scope.pushAddition = function () {
        //         $.$modal.dialog({
        //             title: '增加补充信息',
        //             destroy: true,
        //             content: '<textarea class="form-control" rows="5" style="resize: none;" placeholder="请填写补充信息"></textarea>',
        //             footer: {
        //                 buttons: [
        //                     {
        //                         name: 'ok',
        //                         handler: function () {
        //                             var self = this, dom = self.dom, text = dom.find('textarea').val().trim();
        //                             if (text == '') {
        //                                 $.$modal.alert('补充信息不能为空');
        //                                 return;
        //                             }
        //                             $.$ajax({
        //                                 url: '/candidate/push-addition',
        //                                 type: 'POST',
        //                                 dataType: 'json',
        //                                 data: {person_id: $routeParams.person_id, content: text},
        //                                 success: function (res) {
        //                                     $scope.additions.unshift(res);
        //                                     $scope.$apply();
        //                                     self.hide();
        //                                 }
        //                             })
        //                         }
        //                     },
        //                     {
        //                         name: 'cancel',
        //                         handler: function () {
        //                             this.hide();
        //                         }
        //                     }
        //                 ]
        //             }
        //         }).show();
        //     }
        //
        //     $scope.removeAddition = function (id, index) {
        //         $.$modal.confirm(['删除补充信息', '确定要删除吗？'], function (isOk) {
        //             if (!isOk) return;
        //             $.$ajax({
        //                 url: '/candidate/remove-addition',
        //                 type: 'POST',
        //                 dataType: 'json',
        //                 data: {id: id},
        //                 success: function (res) {
        //                     $scope.additions.splice(index, 1);
        //                     $scope.$apply();
        //                 }
        //             });
        //         })
        //     }
        // }
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

        $scope.session = session;

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
                    {field: 'source', title: '来源'},
                    {field: 'company_name', title: '客户名称'},
                    {field: 'contact', title: '联系人'},
                    {field: 'industry', title: '所属行业'},
                    {field: 'area', title: '所属地区'},
                    {field: 'belong', title: '归属公司'},
                    {field: 'user_name', title: '开发顾问'},
                    //{field: 'user_names', title: '合作顾问'},
                    {field: 'date', title: '联系日期', template: getDate},
                    {field: 'status', title: '状态'},
                    {field: 'description', title: '沟通记录', template: '<div style="max-width:300px;overflow: hidden; text-overflow: ellipsis;white-space: nowrap;" title="#:description#"><span>#:description#</span></div>'},
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
                    {field: 'source', title: '来源'},
                    {field: 'company_name', title: '客户名称'},
                    {field: 'contact', title: '联系人'},
                    {field: 'industry', title: '所属行业'},
                    {field: 'area', title: '所属地区'},
                    {field: 'user_name', title: '开发顾问'},
                    //{field: 'user_names', title: '合作顾问'},
                    {field: 'date', title: '联系日期', template: getDate},
                    {field: 'status', title: '状态'},
                    {field: 'description', title: '沟通记录', template: '<div style="max-width:300px;overflow: hidden; text-overflow: ellipsis;white-space: nowrap;" title="#:description#"><span>#:description#</span></div>'},
                    {title: '操作', template: '<a href="\\#/bd/edit/#:id#" class="btn btn-default btn-sm"><i class="fa fa-pencil"></i></a> ' +
                    '<a href="\\#/bd/record/#:id#" class="btn btn-info btn-sm"><i class="fa fa-list"></i></a> ' +
                    '<a data-id="#:id#" class="btn btn-danger btn-sm" ng-click="bdDelete(#:id#)"><i class="fa fa-trash-o"></i></a>', width: 140}
                ],
                scrollable: false,
                pageable: true,

            }
        }


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
                            var type = {'三级': 1, '二级': 2, '一级': 3};
                            return type[a.type] < type[b.type] ? -1 : type[a.type] === type[b.type] ? 0 : 1;
                        }},
                        {field: 'updated_at', dir: 'desc'},
                    ]
                },
                filterable: {mode: 'row'},
                columns: [
                    //{field: 'id', title: 'ID', sortable: false, filterable: false},
                    {
                        field: 'job_name',
                        title: '职位名称',
                        template: getJobName,
                        sortable: false,
                        filterable: {
                            cell: {
                                operator: 'contains'
                            }
                        }
                    },
                    {field: 'company_name', title: '客户名称', template: '#:company_name# <a ng-click="viewCompany(#:company_id#)"><i class="fa fa-search pointer"></i></a>', sortable: false},
                    {field: 'last_report', title: '报告编号', template: getReportNum, width: 120},
                    {field: 'user_names', title: '操作顾问', sortable: false},
                    {field: 'person_count', title: '人选', filterable: false, template: getCountColor('person_count')},
                    {field: 'report_count', title: '报告', filterable: false, template: getCountColor('report_count')},
                    {field: 'view_count', title: '面试', filterable: false, template: getCountColor('view_count')},
                    {field: 'offer_count', title: 'Offer', filterable: false, template: getCountColor('offer_count')},
                    //{field: 'type', title: '重要程度', template: getType, sortable: {
                    //    compare: function (a, b) {
                    //        var type = {'三级': 1, '二级': 2, '一级': 3};
                    //        return type[a.type] < type[b.type] ? -1 : type[a.type] === type[b.type] ? 0 : 1;
                    //    }
                    //}, filterable: {multi:true}},
                    //{field: 'status', title: '状态', template: getStatus},
                    {
                        title: '操作',
                        template: '<a href="\\#/hunt/select/#:id#" class="btn btn-default btn-sm" target="_blank"><i class="fa fa-pencil"></i></a>',
                        width: 80,
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
                            {field: 'reported', title: '推荐', template: getPersonStatus('reported')},
                            {field: 'faced', title: '面试', template: getPersonStatus('faced')},
                            {field: 'offered', title: 'Offer', template: getPersonStatus('offered')},
                            {field: 'succeed', title: '上岗', template: getPersonStatus('succeed')},
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

        function getJobName(item) {
            //var types = {'三级': '<i class="fa fa-exclamation-circle dark-gray" title="重要程度：三级"></i>', '二级': '<i class="fa fa-exclamation-circle yellow" title="重要程度：二级"></i>', '一级': '<i class="fa fa-exclamation-circle red" title="重要程度：一级"></i>'},
            //    status = {'已停止': '<i class="fa fa-times-circle dark-gray" title="状态：已停止"></i>', '已暂停': '<i class="fa fa-minus-circle yellow" title="状态：已暂停"></i>', '进行中': '<i class="fa fa-check-circle green" title="状态：进行中"></i>'};
            return '{1} <a ng-click="viewJob({0})"><i class="fa fa-search pointer"></i></a>'.format(item.job_id, item.job_name);
        }

        function getName(item) {
            return '<span class="person-{0}">{1} <small class="dark-gray">{2}</small> <a ng-click="viewPerson({3})"><i class="fa fa-search pointer"></i></a> <a ng-click="editPerson({3})"><i class="fa fa-pencil pointer"></i></a></span>'.format(item.type, item.name, item.sex=="男"?"先生":"女士", item.person_id);
        }

        function getReportNum(item) {
            var num = item.last_report && item.last_report.match(/\d+/);
            if (num) {
                return num[0];
            } else {
                return '暂无'
            }
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
            var color = {'三级': 'dark-gray', '二级': 'yellow', '一级': 'red'};
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
                },
                dataBound: function () {
                    $scope.hs.user_ids = $scope.debug.user_ids;
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

        //var dsResult = new kendo.data.DataSource({
        //    transport: {
        //        read: {
        //            url: '/hunt/result-list',
        //            data: {hunt_id: $routeParams.hunt_id}
        //        }
        //    },
        //    pageSize: 10,
        //    schema: {
        //        model: {
        //            id: 'id'
        //        }
        //    },
        //    filter: {field: 'deleted', operator: 'neq', value: true}
        //});

        $scope.file = model.getRecordFile();
        $scope.report = model.getRecordReport();
        $scope.face = model.getRecordNewFace();
        $scope.offer = model.getRecordOffer();
        $scope.success = model.getRecordSuccess();
        $scope.result = model.getRecordResult();
        $scope.rptInfo = {
            total: '',
            list: []
        };
        $scope.personInfo = {
            tel: ''
        };

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
                    {field: 'desc', title: '备注'},
                    {title: '操作', template: '<a ng-click="editFace(#:id#)"><i class="fa fa-pencil"></i></a><a ng-click="deleteFace(#:id#)"><i class="fa fa-times margin-left-5"></i></a>'}
                ],
                scrollable: false,
                pageable: true,
            },
            //grid_result: {
            //    dataSource: dsResult,
            //    columns: [
            //        {field: 'id', title: 'ID'},
            //        {field: 'date', title: '打款日期', template: '#:Date.format(date)#'},
            //        {field: 'amount', title: '打款金额', template: '#:kendo.toString(amount, "n2")#'},
            //        {field: 'type', title: '类型'},
            //        {title: '操作', template: '<a ng-click="editResult(#:id#)"><i class="fa fa-pencil"></i></a><a ng-click="deleteResult(#:id#)"><i class="fa fa-times margin-left-5"></i></a>'}
            //    ],
            //    scrollable: false,
            //    pageable: true,
            //},
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
            date: {
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
                format: 'yyyy-MM-dd',
                change: function () {
                    $scope.success.date = this.value().format();
                }
            },
            protectedDate: {
                culture: 'zh-CN',
                value: new Date(),
                format: 'yyyy-MM-dd',
                change: function () {
                    $scope.success.protected = this.value().format();
                }
            },
            resultDate: {
                culture: 'zh-CN',
                value: new Date(),
                format: 'yyyy-MM-dd',
                change: function () {
                    $scope.result.date = this.value().format();
                }
            },
            numeric: {
                spinners: false,
                decimals: 0,
                min: 0
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

            //$scope.face.hunt_id = $routeParams.hunt_id;
            //$scope.face.person_id = data.person_id;
            //$scope.face.person_name = data.person_name;
            //$scope.face.job_id = data.job_id;
            //$scope.face.job_name = data.job_name;

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

            $http.get('/hunt/person-basic-info?person_id='+$scope.hunt.person_id).success(function (res) {
                $scope.personInfo = res;
            });
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

        $scope.confirmReport = function (id) {
            $.$modal.confirm('确认后报告将计入绩效，确认吗？', function (isOk) {
                if (isOk) {
                    $http.post('/hunt/confirm-report', {id: id}).success(function (res) {
                        if (~~res) {
                            $scope.reportInfo.is_confirm = 1;
                            $.$modal.alert('推荐报告已确认！');
                        }
                    });
                }
            });
        }

        $scope.deleteReport = function (id) {
            $.$modal.confirm('确认要删除吗？', function (isOk) {
                if (isOk) {
                    $http.post('/hunt/delete-report', {id: id}).success(function (res) {
                        if (~~res) {
                            $scope.reportInfo = {};
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
            $scope.face = model.getRecordNewFace();
            $scope.face.hunt_id = $routeParams.hunt_id;
            $scope.face.person_id = $scope.hunt.person_id;
            $scope.face.person_name = $scope.hunt.person_name;
            $scope.face.job_id = $scope.hunt.job_id;
            $scope.face.job_name = $scope.hunt.job_name;
            $scope.face.tel = $scope.personInfo.tel;
            $scope.win8.open();
        };

        $scope.saveFace = function () {
            var face = $scope.face;
            face.date = face.date + ' ' + face.time;
            delete face.time;

            $http.post('/hunt/save-face', {face: face}).success(function (res) {
                if (~~res > 0) {
                    $scope.win8.close();
                    dsFace.read();
                    $.$modal.alert('面试通知保存成功');
                } else if (res == -1) {
                    $.$modal.alert(face['type'] + '面试信息重复');
                } else {
                    $.$modal.alert('保存失败');
                }
            });
        };

        $scope.editFace = function (id) {
            var face = dsFace.get(id).toJSON();
            $scope.face = angular.extend({}, face);
            $scope.face.date = face.date.split(' ')[0];
            $scope.face.time = face.date.split(' ')[1];
            $scope.face.hunt_id = $routeParams.hunt_id;
            $scope.face.person_id = $scope.hunt.person_id;
            $scope.face.person_name = $scope.hunt.person_name;
            $scope.face.job_id = $scope.hunt.job_id;
            $scope.face.job_name = $scope.hunt.job_name;
            console.log($scope.face);
            $scope.win8.open();
        };

        $scope.deleteFace = function (id) {
            $.$modal.confirm('确认要删除吗？', function (isOk) {
                if (!isOk) return;
                $http.post('/hunt/delete-face', {id: id}).success(function (res) {
                    if (~~res) {
                        dsFace.read();
                        $.$modal.alert('面试信息已删除！');
                    }
                });
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

        $scope.deleteOffer = function (id) {
            $.$modal.confirm('确认要删除吗？', function (isOk) {
                if (isOk) {
                    $http.post('/hunt/delete-report', {id: id}).success(function (res) {
                        if (~~res) {
                            $scope.offerInfo = {};
                            $.$modal.alert('Offer已删除！');
                        }
                    });
                }
            });
        }

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
                    $scope.successInfo = success;
                    $scope.win10.close();
                    $.$modal.alert('候选人上岗信息保存成功！');
                }
            });
        };

        $scope.deleteSuccess = function (id) {
            $.$modal.confirm('确认要删除吗？', function (isOk) {
                if (isOk) {
                    $http.post('/hunt/delete-success', {id: id}).success(function (res) {
                        if (~~res) {
                            $scope.successInfo = {};
                            $.$modal.alert('上岗信息已删除！');
                        }
                    });
                }
            });
        }

        //$scope.makeResult = function () {
        //    $scope.result = model.getRecordResult();
        //    $scope.result.hunt_id = $routeParams.hunt_id;
        //    $scope.result.person_id = $scope.hunt.person_id;
        //    $scope.result.person_name = $scope.hunt.person_name;
        //    $scope.result.job_id = $scope.hunt.job_id;
        //    $scope.result.job_name = $scope.hunt.job_name;
        //    $scope.win11.open();
        //};
        //
        //$scope.saveResult = function () {
        //    var result = $scope.result;
        //    result.hunt_id = $routeParams.hunt_id;
        //    result.job_id = $scope.hunt.job_id;
        //    result.job_name = $scope.hunt.job_name;
        //    result.company_id = $scope.hunt.company_id;
        //    result.company_name = $scope.hunt.company_name;
        //    result.person_id = $scope.hunt.person_id;
        //    result.person_name = $scope.hunt.person_name;
        //
        //    $http.post('/hunt/save-result', {result: result}).success(function (res) {
        //        if (~~res > 0) {
        //            $scope.win11.close();
        //            dsResult.read();
        //            $.$modal.alert('业绩保存成功');
        //        } else if (res == -1) {
        //            $.$modal.alert(result['type'] + '打款信息重复');
        //        } else {
        //            $.$modal.alert('保存失败');
        //        }
        //    });
        //};
        //
        //$scope.editResult = function (id) {
        //    var result = dsResult.get(id).toJSON();
        //    $scope.result = angular.extend({}, result);
        //    $scope.result.hunt_id = $routeParams.hunt_id;
        //    $scope.result.person_id = $scope.hunt.person_id;
        //    $scope.result.person_name = $scope.hunt.person_name;
        //    $scope.result.job_id = $scope.hunt.job_id;
        //    $scope.result.job_name = $scope.hunt.job_name;
        //    $scope.win11.open();
        //};
        //
        //$scope.deleteResult = function (id) {
        //    $.$modal.confirm('确认要删除吗？', function (isOk) {
        //        if (isOk) {
        //            $http.post('/hunt/delete-result', {id: id}).success(function (res) {
        //                if (~~res) {
        //                    dsResult.read();
        //                    $.$modal.alert('业绩信息已删除！');
        //                }
        //            });
        //        }
        //    });
        //}

        $scope.offerInfo = {};
        model.getHuntOfferInfo(~~$routeParams.hunt_id, function (res) {
            console.log(res);
            if (res.id) {
                $scope.offerInfo = res;
            }
        });

        $scope.successInfo = {};
        model.getHuntSuccessInfo(~~$routeParams.hunt_id, function (res) {
            console.log(res);
            if (res.id) {
                $scope.successInfo = res;
            }
        });

        //$scope.resultInfo = {};
        //model.getHuntResultInfo(~~$routeParams.hunt_id, function (res) {
        //    console.log(res);
        //    if (res.id) {
        //        $scope.resultInfo = res;
        //    }
        //});

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

        $scope.team = {
            _area: '',
            _group: '',
            _user: ''
        };

        $scope.quickIndex = 0;

        var dsArea = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    $http.get('/performance/json-area-list').success(function(res) {
                        //res.unshift({id: '', a_name: '全国'});
                        options.success(res);
                    });
                }
            }
        });

        var dsGroup = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    $http.get('/performance/json-group-list').success(function(res) {
                        //res.unshift({id: '', g_name: '全部项目组', area_id: 0, area_name: ''});
                        options.success(res);
                    });
                }
            }
        });

        var dsUser = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    $http.get('/performance/json-user-list').success(function(res) {
                        //res.unshift({id: '', nickname: '全体成员', area_id: 0, group_id: 0});
                        options.success(res);
                    });
                }
            }
        });
        var init = false;
        var gridData = new kendo.data.DataSource({
            transport: {
                read: function (option) {
                    if (init) {
                        $.$ajax({
                            url: '/performance/json-performance-list-data',
                            dataType: 'json',
                            data: Object.assign($scope.search, $scope.team),
                            success: function (res) {
                                var data = res.users.map(function (v) {
                                    var bd_count = getCountData(v, res.bd),
                                        person_count = getCountData(v, res.person),
                                        report_count = getCountData(v, res.report),
                                        face_count = getCountData(v, res.face),
                                        faces_count = getCountData(v, res.faces),
                                        offer_count = getCountData(v, res.offer),
                                        success_count = getCountData(v, res.success),
                                        result_count = getCountData(v, res.result);

                                    return {
                                        user_id: v.user_id,
                                        nickname: v.nickname,
                                        group_name: v.group_name,
                                        area_name: v.area_name,
                                        bd_count: bd_count,
                                        person_count: person_count,
                                        report_count: report_count,
                                        face_count: face_count,
                                        faces_count: faces_count,
                                        offer_count: offer_count,
                                        success_count: success_count,
                                        result_count: result_count
                                    }
                                });
                                option.success(data);
                            }
                        });
                    } else {
                        option.success([]);
                        init = true;
                    }
                }
            },
            pageSize: 20,
            schema: {
                model: {
                    id: 'id'
                }
            },
            //aggregate: [
            //    { field: "bd_count", aggregate: "max" },
            //    { field: "person_count", aggregate: "max" },
            //    { field: "report_count", aggregate: "max" },
            //    { field: "face_count", aggregate: "max" },
            //    { field: "offer_count", aggregate: "max" },
            //    { field: "success_count", aggregate: "max" },
            //    { field: "result_count", aggregate: "max" }
            //],
            filter: {field: 'deleted', operator: 'neq', value: true},
            sort: {field: 'id', dir: 'desc'}
        });

        function getCountData(v, data) {
            var count = 0;
            for (var i = 0; i < data.length; i++) {
                var d = data[i];
                if (d.user_id == v.user_id) {
                    count += +d.count;
                }
            }
            return count;
        }

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
                //filterable: {mode: 'row'},
                columns: [
                    //{field: 'id', title: 'ID', sortable: false},
                    //{field: 'name', title: '账号', sortable: false},
                    {field: 'nickname', title: '顾问', sortable: false},
                    {field: 'group_name', title: '所属项目组', sortable: false},
                    {field: 'area_name', title: '所属区域', sortable: false},
                    {field: 'bd_count', title: 'BD', template: getCountColor('bd')},
                    {field: 'person_count', title: '人选', template: getCountColor('person')},
                    {field: 'report_count', title: '报告', template: getCountColor('report')},
                    {field: 'face_count', title: '面试(首轮)', template: getCountColor('face')},
                    {field: 'faces_count', title: '面试(多轮)', template: getCountColor('faces')},
                    {field: 'offer_count', title: 'Offer', template: getCountColor('offer')},
                    {field: 'success_count', title: '上岗', template: getCountColor('success')},
                    {field: 'result_count', title: '业绩', template: getCountColor('result')},
                    {title: 'KPI', template: getKpi}
                ],
                sortable: true,
                scrollable: false,
                pageable: true,
            },
            sdate: {
                culture: 'zh-CN',
                format: 'yyyy-MM-dd',
                //max: Date.translate('now').format(),
                value: $scope.search.sdate,
                change: function () {
                    $scope.quickIndex = 0;
                    $scope.$apply();
                }
            },
            edate: {
                culture: 'zh-CN',
                format: 'yyyy-MM-dd',
                //max: Date.translate('now').format(),
                value: $scope.search.edate,
                change: function () {
                    $scope.quickIndex = 0;
                    $scope.$apply();
                }
            },
            gridDetail: {
                dataSource: detailData,
                scrollable: false,
                pageable: true,
                columns: [
                    {title: '详细信息', template: getDetailText},
                    {filed: 'updated_at', title: '提交日期', template: getDetailTime},
                    {title: '操作', template: getDetailOperator}
                ]
            },
            area: {
                dataSource: dsArea,
                dataTextField: 'a_name',
                dataValueField: 'id',
                optionLabel: '全部区域',
                change: function () {
                    $scope.team._area = ~~this.value();
                    $scope.team._group = '';
                    $scope.team._user = '';
                    dsGroup.filter({field: 'area_id', operator: 'eq', value: $scope.team._area});
                    dsUser.filter({field: 'area_id', operator: 'eq', value: $scope.team._area});
                    //search();
                }
            },
            group: {
                dataSource: dsGroup,
                dataTextField: 'g_name',
                dataValueField: 'id',
                optionLabel: '全部项目组',
                template: '#:g_name##:area_name ? " [" + area_name + "]" : ""#',
                change: function () {
                    $scope.team._group = ~~this.value();
                    $scope.team._user = '';
                    dsUser.filter({field: 'group_id', operator: 'eq', value: $scope.team._group});
                    //search();
                }
            },
            user: {
                dataSource: dsUser,
                dataTextField: 'nickname',
                dataValueField: 'id',
                optionLabel: '全体成员',
                change: function () {
                    $scope.team._user = ~~this.value();
                    //search();
                }
            }
        };

        function getKpi(item) {
            var kpi = { person: 0, report: 0, face: 0, offer: 0}, result = 0;
            kpi.person = item.person_count > 100 ? 20 : item.person_count * 0.2;
            kpi.report = item.report_count > 40 ? 40 : item.report_count * 1;
            kpi.face = item.face_count > 18 ? 36 : item.face_count * 2;
            kpi.offer = item.offer_count * 5;
            result = kpi.person.plus(kpi.report).plus(kpi.face).plus(kpi.offer);
            result = kendo.toString(result, 'n1');
            if (result < 60) {
                return '<span class="bold red">{0}</span>'.format(result);
            } else if (result >= 60 && result < 80) {
                return '<span class="bold dark-orange">{0}</span>'.format(result);
            } else if (result >= 80 && result < 100) {
                return '<span class="bold dark-yellow">{0}</span>'.format(result);
            } else {
                return '<span class="bold green">{0}</span>'.format(result);
            }
        }

        function getCountColor(name) {
            var count_field = name + '_count', target_field = name + '_target';
            return function (item) {
                var performance = item[count_field] || 0;
                //var percent = performance / target;
                //var color = '';
                //if (percent >= 0.8) {
                //    //green
                //    color = '#20bb0d';
                ////} else if (percent < 0.9 && percent >= 0.5) {
                ////    //blue
                ////    color = '#207fcc';
                //} else if (percent < 0.8 && percent >= 0.5) {
                //    //yellow
                //    color = '#ded02c';
                //} else {
                //    //red
                //    color = '#f72626';
                //}
                //if (percent > 1) percent = 1;
                //if (percent < 0 || !percent) percent = 0;
                //if (performance > 0) {
                //    return '<div class="box-progress"><div class="box-target"><div class="box-performance pointer {3}" title="已完成：{0}" style="width:{2}%;background-color: {3}" ng-click="showDetailList({4},\'{5}\')">{0}</div></div><div class="box-detail" title="目标：{1}">{1}</div><div class="width-20 text-center">{6}</div></div>'.format(performance, item[target_field] || '--', kendo.toString(percent*100, 'n0'), color, item.id, count_field, percent > 0.8 && performance == gridData.aggregates()[count_field].max ? '<i class="fa fa-thumbs-up dark-yellow"></i>': '');
                //} else {
                //    return '<div class="box-progress"><div class="box-target"><div class="box-performance {3}" title="已完成：{0}" style="width:{2}%;background-color: {3}">{0}</div></div><div class="box-detail" title="目标：{1}">{1}</div><div class="width-20"></div></div>'.format(performance, item[target_field] || '--', kendo.toString(percent*100, 'n0'), color);
                //}

                return item[count_field] == '0' ? '<span class="bold red">{0}</span>'.format(item[count_field]) : '<span class="bold green pointer" ng-click="showDetailList({1},\'{2}\')">{0}</span>'.format(item[count_field], item.user_id, count_field);
            }
        }

        function getDetailText(item) {
            switch ($scope.detailField) {
                case 'bd_count':
                    return '<span class="orange bold">{0}</span> <span class="blue"> 顾问：{1} </span> <span class="gray">合作顾问：{2}</span> <span class="dark-yellow">状态：{3}</span>'.format(item.company_name, item.user_name, item.user_names, item.status);
                    break;
                case 'person_count':
                    return '<span class="orange bold">{0}</span> <span class="gray"> {1} {2}岁</span> <span class="blue">{3}</span> <span class="main">{4}</span>'.format(item.name, item.sex, item.age, item.job, item.company);
                    break;
                case 'report_count':
                    return '{0} {1}'.format(item.filename, item.is_confirm == 1 ? '<small class="text-info">已确认</small>' : '<a class="btn btn-xs btn-primary" ng-click="confirmReport('+item.id+')"><i class="fa fa-check"></i> 确认</a>');
                    break;
                case 'face_count':
                    return '<span class="orange bold">{0}</span> <small class="gray">{1}</small> <span class="red">{2}</span> <span class="dark-gray">{3}</span> <span class="blue">{4}</span>'.format(item.person_name, item.tel, item.date, item.job_name, item.type);
                    break;
                case 'faces_count':
                    return '<span class="orange bold">{0}</span> <small class="gray">{1}</small> <span class="red">{2}</span> <span class="dark-gray">{3}</span> <span class="blue">{4}</span>'.format(item.person_name, item.tel, item.date, item.job_name, item.type);
                    break;
                case 'offer_count':
                    return '<span class="orange bold">{0}</span> <span class="blue">{1}</span> <span class="dark-gray">{2}</span> <span class="main">{3}</span>'.format(item.person_name, item.job_name, item.company_name, item.filename);
                    break;
                case 'success_count':
                    return '<span class="orange bold">{0}</span> <span class="blue">{1}</span> <span class="dark-gray">{2}</span> <span class="red">{3}上岗</span> <span class="main">保证期：{4}</span>'.format(item.person_name, item.job_name, item.company_name, Date.format(item.date), item.protected);
                    break;
                case 'result_count':
                    return '<span class="orange bold">{0}</span> <span class="blue">{1}</span> <span class="dark-gray">{2}</span> <span class="red">业绩额度{3}元</span> <span class="main">日期：{4}</span>'.format(item.person_name, item.job_name, item.company_name, item.amount, Date.format(item.date));
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

        function getDetailOperator(item) {
            if ($scope.detailField == 'report_count') {
                return '<a class="btn btn-danger btn-xs" ng-click="deleteReport({0})"><i class="fa fa-trash-o"></i> 删除</a>'.format(item.id);
            } else if ($scope.detailField == 'face_count') {
                return '<a class="btn btn-danger btn-xs" ng-click="deleteFace({0})"><i class="fa fa-trash-o"></i> 删除</a>'.format(item.id);
            } else {
                return '';
            }
        }

        $scope.detailField = 'person_count';
        $scope.showDetailList = function (id, field) {
            $scope.detailField = field;
            $http.get('/performance/json-detail-list', {params: {id: id, field: field, sdate: $scope.searched.sdate, edate: $scope.searched.edate}}).success(function (res) {
                detailData.data(res);
                $scope.win1.center().open();
            });
        };

        $scope.confirmReport = function (id) {
            $.$modal.confirm('确认后报告将计入绩效，确认吗？', function (isOk) {
                if (isOk) {
                    $http.post('/hunt/confirm-report', {id: id}).success(function (res) {
                        if (~~res) {
                            $scope.win1.close();
                            $.$modal.alert('推荐报告已确认！');
                        }
                    });
                }
            });
        }

        $scope.deleteReport = function (id) {
            $.$modal.confirm('确认要删除吗？', function (isOk) {
                if (isOk) {
                    $http.post('/hunt/delete-report', {id: id}).success(function (res) {
                        if (~~res) {
                            $scope.win1.close();
                            $.$modal.alert('推荐报告已删除！');
                        }
                    });
                }
            });
        }

        $scope.deleteFace = function (id) {
            $.$modal.confirm('确认要删除吗？', function (isOk) {
                if (!isOk) return;
                $http.post('/hunt/delete-face', {id: id}).success(function (res) {
                    if (~~res) {
                        $scope.win1.close();
                        $.$modal.alert('面试信息已删除！');
                    }
                });
            });
        };

        $scope.customSearch = function () {
            //$scope.searched.type = '自定义';
            search();
        }

        $scope.quickSearch = function (type, index) {
            var date = {sdate: '', edate: ''};
            switch (type) {
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
                default:
                    return;
                    break;
            }
            $scope.search.sdate = date.sdate;
            $scope.search.edate = date.edate;
            $scope.quickIndex = index;
            //$scope.$apply();
        }

        function search() {
            gridData.read(Object.assign($scope.search, $scope.team)).then(function () {
                $scope.searched.sdate = $scope.search.sdate;
                $scope.searched.edate = $scope.search.edate;
                $scope.$apply();
            });
        }
    }]);

    app.controller('performanceChartController', ['$scope', '$http', function ($scope, $http) {
        var d = new Date(), day = d.getDay() === 0 ? 7 : d.getDay();

        $scope.search = {
            type: 'day',
            area: '',
            group: '',
            user: '',
            sdate: Date.translate('now-6').format(),
            edate: Date.translate('now').format()
        };

        $scope.searched = {
            type: '自定义',
            sdate: $scope.search.sdate,
            edate: $scope.search.edate
        };

        initChartData($scope.search);

        function initChartData(data, callback) {
            if (Date.compute(data.sdate, data.edate) > 30) {
                data.type = 'month';
            }
            var category = generateCategories(data);
            console.log(category);
            $http.get('/performance/json-performance-chart-data', {params: data}).success(function (res) {
                var person = [], report = [], face = [], offer = [], success = [];
                category.forEach(function (v, i) {
                    person[i] = res.person.has({date: v}) ? res.person[res.person.at({date: v})].count : 0;
                    report[i] = res.report.has({date: v}) ? res.report[res.report.at({date: v})].count : 0;
                    face[i] = res.face.has({date: v}) ? res.face[res.face.at({date: v})].count : 0;
                    offer[i] = res.offer.has({date: v}) ? res.offer[res.offer.at({date: v})].count : 0;
                    success[i] = res.success.has({date: v}) ? res.success[res.success.at({date: v})].count : 0;
                });
                if (data.type == 'day') {
                    category = category.map(function(v){
                        return Date.format(v, 'mm.dd');
                    });
                }
                $('#chart').kendoChart({
                    //title: {
                    //    text: "Gross domestic product growth /GDP annual %/"
                    //},
                    legend: {
                        position: "top"
                    },
                    seriesDefaults: {
                        type: "column",
                        overlay: {
                            gradient: "none"
                        },
                        labels: {
                            visible: true,
                            background: "transparent"
                        }
                    },
                    series: [{
                        name: "人选",
                        data: person
                    }, {
                        name: "报告",
                        data: report
                    }, {
                        name: "面试",
                        data: face
                    },{
                        name: "Offer",
                        data: offer
                    },{
                        name: "上岗",
                        data: success
                    }],
                    valueAxis: {
                        labels: {
                            //format: "{0}%"
                        },
                        line: {
                            visible: false
                        },
                        axisCrossingValue: 0
                    },
                    categoryAxis: {
                        categories: category,
                        line: {
                            visible: false
                        }
                    },
                    tooltip: {
                        visible: true,
                        //format: "{0}%",
                        template: "#= series.name #: #= value #"
                    }
                });
                if (typeof callback === 'function') callback();
            });
            $http.get('/performance/json-performance-rate-data', {params: data}).success(function (res) {
                var data = [];
                for (var n in res) {
                    data.push({"name": n, "value": res[n]});
                }
                var names = {'person': '人选', 'report': '报告', 'face': '面试', 'offer': 'Offer', 'success': '上岗'}
                $("#funnel").kendoChart({
                    title: {
                        text: '转化率',
                        margin: {
                            top: 10,
                            bottom: 10,
                            left: -5
                        }
                    },
                    legend: {
                        visible: false
                    },
                    dataSource: {
                        data: data
                    },
                    series: [{
                        type: "funnel",
                        dynamicSlope:true,
                        field: "value",
                        categoryField: "name",
                        dynamicHeight : false,
                        labels: {
                            color:"black",
                            visible: true,
                            background: "transparent",
                            template: "#= {'person': '人选', 'report': '报告', 'face': '面试', 'offer': 'Offer', 'success': '上岗'}[category] #: #= value#",
                            align: "left"
                        }
                    }],
                    tooltip: {
                        visible: true,
                        template: function (e) {
                            var parent = e.dataItem.parent()
                            switch (e.category) {
                                case 'person':
                                    return '--';
                                    break;
                                case 'report':
                                    return '人选/报告转化率： {0}'.format(kendo.toString(parent[0].value/e.value, 'n2'));
                                    break;
                                case 'face':
                                    return '报告/面试转化率： {0}'.format(kendo.toString(parent[1].value/e.value, 'n2'));
                                    break;
                                case 'offer':
                                    return '面试/Offer转化率： {0}'.format(kendo.toString(parent[2].value/e.value, 'n2'));
                                    break;
                                case 'success':
                                    return '报告/上岗转化率： {0}<br>面试/上岗转化率： {1}<br>Offer/上岗转化率： {2}'.format(kendo.toString(parent[1].value/e.value, 'n2'), kendo.toString(parent[2].value/e.value, 'n2'), kendo.toString(parent[3].value/e.value, 'n2'));
                                    break;
                            }
                        }
                    }
                });
            });
        }

        function generateCategories(data) {
            var start = new Date(data.sdate), end = new Date(data.edate), pointer = new Date(data.sdate), list = [];
            if (data.type == 'day') {
                while (pointer.format('yyyy-mm-dd') <= end.format('yyyy-mm-dd')) {
                    list.push(pointer.format('yyyy-mm-dd'));
                    pointer = new Date(pointer.getFullYear(), pointer.getMonth(), pointer.getDate() + 1);
                }
            } else {
                while (pointer.format('yyyy-mm') <= end.format('yyyy-mm')) {
                    list.push(pointer.format('yyyy-mm'));
                    pointer = new Date(pointer.getFullYear(), pointer.getMonth() + 1, pointer.getDate());
                }
            }
            return list;
        }

        var dsArea = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    $http.get('/performance/json-area-list').success(function(res) {
                        //res.unshift({id: '', a_name: '全国'});
                        options.success(res);
                    });
                }
            }
        });

        var dsGroup = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    $http.get('/performance/json-group-list').success(function(res) {
                        //res.unshift({id: '', g_name: '全部项目组', area_id: 0, area_name: ''});
                        options.success(res);
                    });
                }
            }
        });

        var dsUser = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    $http.get('/performance/json-user-list').success(function(res) {
                        //res.unshift({id: '', nickname: '全体成员', area_id: 0, group_id: 0});
                        options.success(res);
                    });
                }
            }
        });

        $scope.config = {
            sdate: {
                culture: 'zh-CN',
                format: 'yyyy-MM-dd',
                min: '2017-01-01',
                value: $scope.search.sdate
            },
            edate: {
                culture: 'zh-CN',
                format: 'yyyy-MM-dd',
                min: '2017-01-01',
                value: $scope.search.edate
            },
            area: {
                dataSource: dsArea,
                dataTextField: 'a_name',
                dataValueField: 'id',
                optionLabel: '全部区域',
                change: function () {
                    var area_id = ~~this.value();
                    $scope.search.group = '';
                    $scope.search.user = '';
                    dsGroup.filter({
                        logic: 'or',
                        filters: [
                            {field: 'area_id', operator: 'eq', value: area_id},
                            {field: 'area_id', operator: 'eq', value: 0},
                        ]
                    });
                    dsUser.filter({
                        logic: 'or',
                        filters: [
                            {field: 'area_id', operator: 'eq', value: area_id},
                            {field: 'area_id', operator: 'eq', value: 0},
                        ]
                    });
                    initChartData($scope.search);
                }
            },
            group: {
                dataSource: dsGroup,
                dataTextField: 'g_name',
                dataValueField: 'id',
                optionLabel: '全部项目组',
                template: '#:g_name##:area_name ? " [" + area_name + "]" : ""#',
                change: function () {
                    var group_id = ~~this.value();
                    $scope.search.user = '';
                    dsUser.filter({
                        logic: 'or',
                        filters: [
                            {field: 'group_id', operator: 'eq', value: group_id},
                            {field: 'group_id', operator: 'eq', value: 0},
                        ]
                    });
                    initChartData($scope.search);
                }
            },
            user: {
                dataSource: dsUser,
                dataTextField: 'nickname',
                dataValueField: 'id',
                optionLabel: '全体成员',
                change: function () {
                    initChartData($scope.search);
                }
            }
        };

        $scope.customSearch = function () {
            initChartData($scope.search, function () {
                $scope.searched = {
                    type: '自定义',
                    sdate: $scope.search.sdate,
                    edate: $scope.search.edate
                }
            });
        }

        $scope.quickSearch = function (type) {
            var date = {type: 'day', sdate: '', edate: '', user: $scope.search.user};
            switch (type) {
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
                    date.type = 'month';
                    break;
                case '二季度':
                    date.sdate = new Date(d.getFullYear(), 3, 1).format();
                    date.edate = new Date(d.getFullYear(), 6, 0).format();
                    date.type = 'month';
                    break;
                case '三季度':
                    date.sdate = new Date(d.getFullYear(), 6, 1).format();
                    date.edate = new Date(d.getFullYear(), 9, 0).format();
                    date.type = 'month';
                    break;
                case '四季度':
                    date.sdate = new Date(d.getFullYear(), 9, 1).format();
                    date.edate = new Date(d.getFullYear(), 12, 0).format();
                    date.type = 'month';
                    break;
                case '上半年':
                    date.sdate = new Date(d.getFullYear(), 0, 1).format();
                    date.edate = new Date(d.getFullYear(), 6, 0).format();
                    date.type = 'month';
                    break;
                case '下半年':
                    date.sdate = new Date(d.getFullYear(), 6, 1).format();
                    date.edate = new Date(d.getFullYear(), 12, 0).format();
                    date.type = 'month';
                    break;
                case '今年':
                    date.sdate = new Date(d.getFullYear(), 0, 1).format();
                    date.edate = new Date(d.getFullYear() + 1, 0, 0).format();
                    date.type = 'month';
                    break;
                case '去年':
                    date.sdate = new Date(d.getFullYear() - 1, 0, 1).format();
                    date.edate = new Date(d.getFullYear(), 0, 0).format();
                    date.type = 'month';
                    break;
                default:
                    return;
                    break;
            }
            initChartData(date, function () {
                $scope.searched = {
                    type: type,
                    sdate: date.sdate,
                    edate: date.edate
                }
                $scope.search.sdate = date.sdate;
                $scope.search.edate = date.edate;
            });
        }
    }]);

    app.controller('targetListController', ['$scope', '$http', function ($scope, $http) {
        $scope.selMonth = '';
        $scope.days = [];

        var monthEditable = true;
        $scope.isValidMonth = function () {
            var selDate = new Date($scope.selMonth + '-01');
            console.log((selDate.getFullYear() >= 2017), monthEditable);
            return !((selDate.getFullYear() >= 2017) && monthEditable);
        };

        //getMonthTargetInfo($scope.selMonth);

        var dsGrid = new kendo.data.DataSource({
            transport: {
                read: {
                    url: '/performance/json-target-list',
                    dataType: 'json'
                }
            },
            pageSize: 10,
            schema: {
                model: {
                    id: 'id'
                }
            }
        });

        $scope.config = {
            grid: {
                dataSource: dsGrid,
                scrollable: false,
                pageable: true,
                sortable: true,
                columns: [
                    {field: 'nickname', title: '顾问'},
                    {field: 'month', title: '月份'},
                    {title: '<div class=\'text-center\'>目标设定</div>', columns: [
                        {field: 'bd_target', title: 'BD'},
                        {field: 'person_target', title: '人选录入'},
                        {field: 'report_target', title: '推荐报告'},
                        {field: 'face_target', title: '面试'},
                        {field: 'offer_target', title: 'Offer'},
                        {field: 'success_target', title: '成功上岗'},
                        {field: 'result_target', title: '业绩'}
                    ]}
                ]
            },
            date: {
                culture: 'zh-CN',
                format: 'yyyy-MM',
                depth: 'year',
                start: 'year',
                change: function () {
                    getMonthTargetInfo(this.value().format('yyyy-mm'));
                }
            }
        };

        function getMonthTargetInfo(month) {
            $http.get('/performance/json-month-target?month='+month).success(function (res) {
                var res = res[0];
                if (res) {
                    monthEditable = false;
                    $scope.target = {
                        bd: res.bd_target || 0,
                        person: res.person_target || 0,
                        report: res.report_target || 0,
                        face: res.face_target || 0,
                        offer: res.offer_target || 0,
                        success: res.success_target || 0,
                        result: res.result_target || 0,
                    };
                } else {
                    monthEditable = true;
                    $scope.target = {
                        bd: 0,
                        person: 0,
                        report: 0,
                        face: 0,
                        offer: 0,
                        success: 0,
                        result: 0,
                    };
                }
            });
        }

        $scope.target = {
            bd: 0,
            person: 0,
            report: 0,
            face: 0,
            offer: 0,
            success: 0,
            result: 0,
        };

        $scope.$on('weeksData', function (res, days) {
            $scope.days = days;
        });

        $scope.saveTarget = function () {
            var target = angular.extend({}, $scope.target);
            target.month = $scope.selMonth;
            $http.post('/performance/save-target', {month: target, days: $scope.days}).success(function (res) {
                console.log(res);
                $.$modal.alert('保存成功！');
            });
        }
    }]);

    /*
    app.controller('dailyReportController', ['$scope', '$http', 'model', function ($scope, $http, model) {
        var d = new Date(), day = d.getDay() === 0 ? 7 : d.getDay();

        $scope.search = {
            user: '',
            sdate: Date.translate('now-6').format(),
            edate: Date.translate('now').format()
        };

        $scope.searched = {
            type: '自定义',
            sdate: $scope.search.sdate,
            edate: $scope.search.edate
        };

        var dsReport = new kendo.data.DataSource({
            transport: {
                read: {
                    url: '/performance/daily-report-list',
                    dataType: 'json',
                    data: $scope.search
                }
            },
            schema: {
                model: {
                    id: 'id'
                }
            },
            pageSize: 10,
        });

        var dsJob = new kendo.data.DataSource({
            transport: {
                read: {
                    url: '/hunt/json-job-list-data',
                    dataType: 'json'
                }
            }
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

        $scope.report = model.getNewDailyReport();

        $scope.config = {
            grid: {
                dataSource: dsReport,
                scrollable: false,
                pageable: true,
                filterable: true,
                toolbar: [{
                    template: '<div class="pull-left margin-left-10"><button class="btn btn-info" ng-click="addNewReport()">新建日清任务</button></div>'
                }],
                columns: [
                    {field: 'nickname', title: '顾问'},
                    {field: 'group', title: '小组'},
                    {field: 'date', title: '任务日期', template: '#:Date.format(date)#'},
                    {field: 'job_name', title: '目标岗位'},
                    {field: 'company_name', title: '目标企业'},
                    {field: 'target', title: '目标量', filterable: false},
                    {field: 'complete', title: '完成量', filterable: false},
                    {title: '当日作业情况', columns: [
                        {field: 'person_count', title: '人选', template: getDetail('person_count'), filterable: false},
                        {field: 'report_count', title: '报告', template: getDetail('report_count'), filterable: false},
                        {field: 'face_count', title: '面试', template: getDetail('face_count'), filterable: false},
                        {field: 'offer_count', title: 'Offer', template: getDetail('offer_count'), filterable: false},
                        {field: 'success_count', title: '上岗', template: getDetail('success_count'), filterable: false},
                    ], filterable: false},
                    {title: '操作', template: '<a class="btn btn-xs btn-info" ng-click="editDailyReport(#:id#)"><i class="fa fa-pencil"></i></a>' +
                    '<a class="btn btn-xs btn-danger margin-left-5" ng-click="deleteDailyReport(#:id#)" ng-if="user.power==9"><i class="fa fa-trash-o"></i></a>', filterable: false},
                ]
            },
            jobs: {
                dataSource: dsJob,
                optionLabel: '请选择岗位...',
                filter: 'startswith',
                delay: 500,
                dataTextField: 'name',
                dataValueField: 'id',
                defaultValue: $scope.report.job_id,
                template: '<strong>#:name#</strong> <span class="dark-gray">[ #:company_name# ]</span>',
                change: function () {
                    var item = this.dataItem();
                    $scope.report.job_name = item.name;
                    $scope.report.job_id = item.id;
                    $scope.report.company_id = item.company_id;
                    $scope.report.company_name = item.company_name;
                    $scope.$apply();
                }
            },
            date: {
                culture: 'zh-CN',
                format: 'yyyy-MM-dd',
                value: new Date().format(),
                min: Date.translate('now-1').format()
            },
            gridDetail: {
                dataSource: detailData,
                scrollable: false,
                pageable: true,
                columns: [
                    {title: '详细信息', template: getDetailText},
                    {filed: 'updated_at', title: '提交日期', template: getDetailTime}
                ]
            },
            sdate: {
                culture: 'zh-CN',
                format: 'yyyy-MM-dd',
                min: '2017-01-01',
                value: $scope.search.sdate
            },
            edate: {
                culture: 'zh-CN',
                format: 'yyyy-MM-dd',
                min: '2017-01-01',
                value: $scope.search.edate
            },
            user: {
                dataSource: {
                    transport: {
                        read: function (options) {
                            $http.get('/performance/json-user-list').success(function(res) {
                                res.unshift({id: '-2', nickname: '项目二部'});
                                res.unshift({id: '-1', nickname: '项目一部'});
                                res.unshift({id: '', nickname: '全体成员'});
                                options.success(res);
                            });
                        }
                    }
                },
                dataTextField: 'nickname',
                dataValueField: 'id',
                change: function () {
                    dsReport.read($scope.search);
                }
            },
        };

        function getDetail(field) {
            return function (item) {
                return '<a class="text-info pointer" ng-click="showDetailList({0}, {1},\'{2}\',\'{3}\')">{0}</a>'.format(item[field], item.user_id, field, Date.format(item.date));
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

        $scope.customSearch = function () {
            dsReport.read($scope.search).then(function () {
                $scope.searched = {
                    type: '自定义',
                    sdate: $scope.search.sdate,
                    edate: $scope.search.edate
                }
                $scope.$apply();
            });
        }

        $scope.quickSearch = function (type) {
            var date = {sdate: '', edate: '', user: $scope.search.user};
            switch (type) {
                case '昨天':
                    date.sdate = Date.translate('now-1').format();
                    date.edate = Date.translate('now-1').format();
                    break;
                case '今天':
                    date.sdate = Date.translate('now').format();
                    date.edate = Date.translate('now').format();
                    break;
                case '明天':
                    date.sdate = Date.translate('now+1').format();
                    date.edate = Date.translate('now+1').format();
                    break;
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
                default:
                    return;
                    break;
            }
            dsReport.read(date).then(function () {
                $scope.searched = {
                    type: type,
                    sdate: date.sdate,
                    edate: date.edate
                }
                $scope.search.sdate = date.sdate;
                $scope.search.edate = date.edate;
                $scope.$apply();
            });
        }

        $scope.showDetailList = function (count, user_id, field, date) {
            if (count <= 0) return;
            $scope.detailField = field;
            $http.get('/performance/json-detail-list', {params: {id: user_id, field: field, sdate: date, edate: date}}).success(function (res) {
                detailData.data(res);
                $scope.win2.center().open();
            });
        };

        $scope.user = model.getUserSession();

        $scope.date = {
            'yesterday': Date.translate('now-1').format(),
            'today': Date.translate('now').format(),
            'tomorrow': Date.translate('now+1').format(),
        };

        $scope.addNewReport = function () {
            $scope.report = model.getNewDailyReport();
            $scope.win1.center().open();
        };

        $scope.saveDailyReport = function () {
            console.log($scope.report);
            $http.post('/performance/save-daily-report', {report: $scope.report}).success(function (res) {
                if (res > 0) {
                    dsReport.read();
                    $scope.win1.close();
                } else if (res == -1) {
                    $.$modal.alert('该日期的任务已经设置过了');
                } else {
                    $.$modal.alert('保存失败');
                }
            });
        };

        $scope.editDailyReport = function (id) {
            var item = dsReport.get(id).toJSON();
            $scope.report.id = item.id;
            $scope.report.user_id = item.user_id;
            $scope.report.date = item.date;
            $scope.report.job_id = item.job_id;
            $scope.report.job_name = item.job_name;
            $scope.report.company_id = item.company_id;
            $scope.report.company_name = item.company_name;
            $scope.report.target = item.target;
            $scope.win1.center().open();
        };

        $scope.deleteDailyReport = function (id) {
            $.$modal.confirm('确定要删除吗？', function (isOk) {
                if (isOk) {
                    $http.post('/performance/delete-daily-report', {id: id}).success(function (res) {
                        if (res > 0) {
                            $.$modal.alert('删除成功');
                            dsReport.pushDestroy({id: id});
                        } else {
                            $.$modal.alert('删除失败');
                        }
                    });
                }
            });
        };
    }]);
    */

    app.controller('dailyReportController', ['$scope', '$http', 'model', function ($scope, $http, model) {
        $scope.session = model.getUserSession();
        $scope.today = new Date().format();
        $scope.tomorrow = Date.translate('now+1').format();

        $scope.users = [];
        $scope.selectedUser = {id: $scope.session.id, nickname: $scope.session.nickname};
        $scope.selectedDate = new Date().format();
        $scope.selectedNextDate = Date.translate('now+1').format();
        $scope.report = model.getNewDailyReport();
        $scope.detail = {'today': [], 'tomorrow': [], 'person': [], 'report': [], 'face': [], 'offer': [], 'success': [], 'reason': ''};

        var dsJob = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    $http.get('/hunt/json-job-list-data').success(function (res) {
                        res.forEach(function (v) {
                            v.fullname = '{0} - {1}'.format(v.name, v.company_name);
                        });
                        options.success(res);
                    });
                }
            }
        });

        $scope.config = {
            calendar: {
                culture: 'zh-CN',
                value: new Date(),
                change: function () {
                    $scope.selectedDate = this.value().format();
                    $scope.selectedNextDate = this.value().translate('now+1').format();
                    $scope.$apply();
                    $scope.getReportInfo();
                }
            },
            jobs: {
                dataSource: dsJob,
                optionLabel: '请选择岗位...',
                filter: 'contains',
                delay: 500,
                dataTextField: 'fullname',
                dataValueField: 'id',
                defaultValue: $scope.report.job_id,
                template: '<strong>#:name#</strong> <span class="dark-gray">[ #:company_name# ]</span>',
                change: function () {
                    var item = this.dataItem();
                    $scope.report.job_name = item.name;
                    $scope.report.job_id = item.id;
                    $scope.report.company_id = item.company_id;
                    $scope.report.company_name = item.company_name;
                    $scope.$apply();
                }
            },
            date: {
                culture: 'zh-CN',
                value: Date.translate('now+1'),
                format: 'yyyy-MM-dd',
                min: Date.translate('now+1').format()
            },
            grid: {
                dataSource: {
                    transport: {
                        read: {
                            url: '/performance/json-hunt-select-list-data',
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
                        {field: 'type', dir: 'desc', compare: function (a, b) {
                            var type = {'三级': 1, '二级': 2, '一级': 3};
                            return type[a.type] < type[b.type] ? -1 : type[a.type] === type[b.type] ? 0 : 1;
                        }},
                        {field: 'updated_at', dir: 'desc'},
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
                    {field: 'last_report', title: '报告编号', template: getReportNum},
                    {field: 'user_names', title: '顾问', sortable: false},
                    {field: 'person_count', title: '人选', filterable: false, template: getCountColor('person_count')},
                    {field: 'report_count', title: '报告', filterable: false, template: getCountColor('report_count')},
                    {field: 'view_count', title: '面试', filterable: false, template: getCountColor('view_count')},
                    {field: 'offer_count', title: 'Offer', filterable: false, template: getCountColor('offer_count')},
                    {field: 'type', title: '重要程度', template: getType, sortable: {
                        compare: function (a, b) {
                            var type = {'三级': 1, '二级': 2, '一级': 3};
                            return type[a.type] < type[b.type] ? -1 : type[a.type] === type[b.type] ? 0 : 1;
                        }
                    }, filterable: {multi:true}},
                    {field: 'status', title: '状态', template: getStatus},
                    {field: 'updated_at', title: '更新时间', template: getDate},
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
        }

        function getReportNum(item) {
            var num = item.last_report && item.last_report.match(/\d+/);
            if (num) {
                return num[0];
            } else {
                return '暂无'
            }
        }

        function getType(item) {
            var color = {'三级': 'dark-gray', '二级': 'yellow', '一级': 'red'};
            return '<span class="{0}">{1}</span>'.format(color[item.type], item.type);
        }

        function getStatus(item) {
            var color = {'已停止': 'dark-gray', '已暂停': 'yellow', '进行中': 'green'};
            return '<span class="{0}">{1}</span>'.format(color[item.status], item.status);
        }

        function getCountColor(name) {
            return function (item) {
                return item[name] == '0' ? '<span class="bold red">'+item[name]+'</span>' : '<span class="bold green">'+item[name]+'</span>';
            }
        }

        function getDate(item) {
            return new Date(item.updated_at.replace(/-/g, '/')).format();
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

        $scope.getDate = function (date) {
            return new Date(date).format();
        }

        $http.get('/performance/json-user-list').success(function(res) {
            $scope.users = res;
        });

        $scope.selectUser = function (user) {
            $scope.selectedUser = user;
            $scope.getReportInfo();
        }

        $scope.setDailyReport = function () {
            $scope.win1.center().open();
        }

        $scope.getReportInfo = function () {
            $http.get('/performance/daily-report', {params: {user_id: $scope.selectedUser.id, date: $scope.selectedDate, nextDate: $scope.selectedNextDate}}).success(function(res) {
                //console.log(res);
                $scope.detail = res;
                $scope.detail.reason = $scope.detail.reason.length ? $scope.detail.reason[0].reason : '';
            });
        }

        $scope.saveDailyReport = function () {
            console.log($scope.report);
            $http.post('/performance/save-daily-report', {report: $scope.report}).success(function (res) {
                if (res > 0) {
                    if ($scope.selectedDate == $scope.today && $scope.selectedUser.id == $scope.session.id) {
                        $scope.getReportInfo();
                    }
                    $scope.win1.close();
                } else if (res == -1) {
                    $.$modal.alert('该岗位已经添加过了');
                } else {
                    $.$modal.alert('保存失败');
                }
            });
        };

        $scope.deleteDailyReport = function (id) {
            $.$modal.confirm('确定要删除吗？', function (isOk) {
                if (isOk) {
                    $http.post('/performance/delete-daily-report', {id: id}).success(function (res) {
                        if (res > 0) {
                            $.$modal.alert('删除成功');
                            $scope.getReportInfo();
                        } else {
                            $.$modal.alert('删除失败');
                        }
                    });
                }
            });
        };

        $scope.saveDailyReason = function () {
            console.log($scope.selectedDate, $scope.detail.reason);
            $http.post('/performance/save-daily-reason', {reason: $scope.detail.reason, date: $scope.selectedDate}).success(function (res) {
                if (res > 0) {
                    $.$modal.alert('保存成功');
                } else {
                    $.$modal.alert('保存失败');
                }
            });
        }

        $scope.getReportInfo();
    }]);

    //controller for team
    app.controller('teamRecentController', ['$scope', '$http', '$routeParams', 'model', 'token', function ($scope, $http, $routeParams, model, token) {

        $scope.config = {
            gridFace: {
                dataSource: {
                    transport: {
                        read: {
                            url: '/team/recent-face-list',
                            data: {}
                        }
                    },
                    pageSize: 10
                },
                columns: [
                    {field: 'person_name', title: '面试人'},
                    {field: 'job_name', title: '面试岗位'},
                    {field: 'type', title: '面试名称'},
                    {field: 'date', title: '面试日期'},
                    {field: 'tel', title: '手机号'},
                    {field: 'nickname', title: '顾问'},
                    {field: 'updated_at', title: '更新日期', template: '#:new Date(updated_at).format()#'},
                    {field: 'desc', title: '备注'},
                ],
                scrollable: false,
                pageable: true,
            },
            gridOffer: {
                dataSource: {
                    transport: {
                        read: {
                            url: '/team/recent-offer-list',
                            data: {}
                        }
                    },
                    pageSize: 10
                },
                columns: [
                    {field: 'person_name', title: '姓名'},
                    {field: 'job_name', title: '岗位'},
                    {field: 'company_name', title: '公司'},
                    {field: 'date', title: '日期', template: '#:new Date(date).format()#'},
                    {field: 'nickname', title: '顾问'},
                    {field: 'updated_at', title: '更新日期', template: '#:new Date(updated_at).format()#'},
                    {field: 'desc', title: '备注'},
                ],
                scrollable: false,
                pageable: true,
            },
            gridSuccess: {
                dataSource: {
                    transport: {
                        read: {
                            url: '/team/recent-success-list',
                            data: {}
                        }
                    },
                    pageSize: 10
                },
                columns: [
                    {field: 'person_name', title: '姓名'},
                    {field: 'job_name', title: '岗位'},
                    {field: 'company_name', title: '公司'},
                    {field: 'date', title: '日期', template: '#:new Date(date).format()#'},
                    {field: 'protected', title: '保证期'},
                    {field: 'nickname', title: '顾问'},
                    {field: 'updated_at', title: '更新日期', template: '#:new Date(updated_at).format()#'},
                    {field: 'desc', title: '备注'},
                ],
                scrollable: false,
                pageable: true,
            },
        };


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


    app.controller('teamUsersController', ['$scope', '$http', '$routeParams', 'model', 'token', function ($scope, $http, $routeParams, model, token) {
        var ds = new kendo.data.DataSource({
            transport: {
                read: {
                    url: '/team/json-user-list',
                    data: {}
                }
            },
            pageSize: 10,
            schema: {
                model: {
                    id: 'id'
                }
            }
        });

        $scope.user = {
            id: '',
            name: '',
            nickname: '',
            job: '',
            date: '',
            group_id: '',
            group_name: '',
            area_id: '',
            area_name: ''
        }

        $scope.searchkey = '';

        $scope.config = {
            grid: {
                dataSource: ds,
                toolbar: [
                    {
                        template: '<div class="col-xs-3 pull-right no-padding-right">\
                                <div class="input-group">\
                                    <input type="text" ng-model="searchkey" class="form-control" placeholder="输入用户名称搜索"  ng-keyup="searchUser($event)">\
                                    <span class="input-group-btn" ng-click="searchUser()">\
                                        <button class="btn btn-default" type="button"><i class="fa fa-search"></i></button>\
                                    </span>\
                                </div></div>'
                    }
                ],
                columns: [
                    //{field: 'id', title: 'ID'},
                    {field: 'name', title: '账号'},
                    {field: 'nickname', title: '昵称'},
                    {field: 'job', title: '职位'},
                    {field: 'group_name', title: '所属项目组'},
                    {field: 'area_name', title: '所属区域'},
                    {field: 'date', title: '入职日期', template: '#:date ? new Date(date).format() : ""#'},
                    {field: 'status', title: '状态', template: getStatus},
                    {field: 'created_at', title: '创建时间'},
                    {title: '操作', template: getButtons, width: 140}
                ],
                scrollable: false,
                pageable: true,
            },
            jobs: {
                dataSource: {
                    data: [
                        "助理顾问",
                        "顾问",
                        "项目经理",
                        "项目总监",
                        "城市总经理",
                        "大区总经理",
                        "合伙人",
                    ]
                },
                optionLabel: '请选择职位',
            },
            list: {
                dataSource: {
                    transport: {
                        read: {
                            url: '/team/json-group-list',
                            data: {}
                        }
                    }
                },
                template: '#:g_name# [#:area_name#]',
                optionLabel: '请选择所属项目组',
                dataTextField: 'g_name',
                dataValueField: 'id',
                change: function () {
                    var item = this.dataItem();
                    $scope.user.group_id = item.id;
                    $scope.user.group_name = item.g_name;
                    $scope.user.area_id = item.area_id;
                    $scope.user.area_name = item.area_name;
                    $scope.$apply();
                },
            },
            date: {
                culture: 'zh-CN',
                max: new Date(),
                format: 'yyyy-MM-dd'
            }
        }

        function getStatus(item) {
            if (item.status == '1') {
                return '<span class="text-success">启用中</span>'
            } else {
                return '<span class="text-danger">已禁用</span>'
            }
        }

        function getButtons(item) {
            var button = ['<a ng-click="editUser('+item.id+')" class="btn btn-info btn-sm margin-right-5" title="编辑"><i class="fa fa-pencil"></i></a>']
            if (item.status == '1') {
                button.push('<a ng-click="editUserStatus('+item.id+', 0)" class="btn btn-danger btn-sm" title="禁用"><i class="fa fa-times"></i></a>')
                return button.join('');
            } else {
                button.push('<a ng-click="editUserStatus('+item.id+', 1)" class="btn btn-success btn-sm" title="启用"><i class="fa fa-check"></i></a>')
                return button.join('');
            }
        }

        $scope.searchUser = function (e) {
            if (e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode == 13) {
                    filterUser($scope.searchkey);
                }
            } else {
                filterUser($scope.searchkey);
            }
        }

        function filterUser(key) {
            if (key) {
                ds.filter({field: 'name', operator: 'contains', value: $scope.searchkey});
            } else {
                ds.filter([]);
            }
        }

        $scope.addUser = function () {
            $scope.user = {
                id: '',
                name: '',
                nickname: '',
                job: '',
                date: null,
                password: '',
                email: '',
                group_id: '',
                group_name: '',
                area_id: '',
                area_name: ''
            }
            $scope.win2.center().open();
        }

        $scope.editUser = function (id) {
            var item = ds.get(id);
            $scope.user.id = item.id;
            $scope.user.name = item.name;
            $scope.user.nickname = item.nickname;
            $scope.user.job = item.job;
            $scope.user.date = item.date;
            $scope.user.group_id = item.group_id;
            $scope.user.group_name = item.group_name;
            $scope.user.area_id = item.area_id;
            $scope.user.area_name = item.area_name;
            $scope.win1.center().open();
        }

        $scope.editUserStatus = function (id, status) {
            $.$modal.confirm('确认要变更吗？', function (isOk) {
                if (isOk) {
                    $http.post('/team/edit-user-status', {id: id, status: status}).success(function (res) {
                        if (res >= 1) {
                            ds.pushUpdate({id: id, status: status});
                        } else {
                            $.$modal.alert('操作失败');
                        }
                    });
                }
            });

        }

        $scope.saveUser = function () {
            if ($scope.user.id) {
                $http.post('/team/edit-user', $scope.user).success(function (res) {
                    if (res >= 1) {
                        $.$modal.alert('保存成功');
                        $scope.win1.close();
                        ds.read();
                    } else {
                        $.$modal.alert('保存失败');
                    }
                });
            } else {
                $.$modal.alert('保存失败');
            }
        }

        $scope.saveNewUser = function () {
            $http.post('/team/new-user', $scope.user).success(function (res) {
                if (res >= 1) {
                    $.$modal.alert('保存成功');
                    $scope.win2.close();
                    ds.read();
                } else if (res == -1) {
                    $.$modal.alert('用户名称或邮箱重复');
                } else {
                    $.$modal.alert('保存失败');
                }
            });
        }

    }]);


    app.controller('teamGroupsController', ['$scope', '$http', '$routeParams', 'model', 'token', function ($scope, $http, $routeParams, model, token) {
        var ds = new kendo.data.DataSource({
            transport: {
                read: {
                    url: '/team/json-group-list',
                    data: {}
                }
            },
            pageSize: 10,
            schema: {
                model: {
                    id: 'id'
                }
            }
        });

        $scope.group = {
            id: '',
            g_name: '',
            area_id: '',
            area_name: ''
        }

        $scope.config = {
            grid: {
                dataSource: ds,
                toolbar: [
                    {
                        template: '<a class="btn btn-success" ng-click="addFile()">新建项目组</a>'
                    }
                ],
                columns: [
                    {field: 'id', title: 'ID'},
                    {field: 'g_name', title: '项目组名称'},
                    {field: 'area_name', title: '所属区域'},
                    {field: 'created_at', title: '创建时间'},
                    {title: '操作', template: '<a ng-click="editGroup(#:id#)" class="btn btn-info btn-sm" title="编辑"><i class="fa fa-pencil"></i></a>' +
                    ' <a  ng-click="deleteGroup(#:id#)" class="btn btn-danger btn-sm" title="删除"><i class="fa fa-trash-o"></i></a>', width: 140}
                ],
                scrollable: false,
                pageable: true,
            },
            list: {
                dataSource: {
                    transport: {
                        read: {
                            url: '/team/json-area-list',
                            data: {}
                        }
                    }
                },
                optionLabel: '请选择所属区域',
                dataTextField: 'a_name',
                dataValueField: 'id',
                change: function () {
                    var item = this.dataItem();
                    $scope.group.area_id = item.id;
                    $scope.group.area_name = item.a_name;
                    $scope.$apply();
                },
            }
        }

        $scope.addFile = function () {
            $scope.group.id = '';
            $scope.group.g_name = '';
            $scope.group.area_id = '';
            $scope.group.area_name = '';
            $scope.win1.center().open();
        }

        $scope.editGroup = function (id) {
            var item = ds.get(id);
            $scope.group.id = item.id;
            $scope.group.g_name = item.g_name;
            $scope.group.area_id = item.area_id;
            $scope.group.area_name = item.area_name;
            $scope.win1.center().open();
        }

        $scope.deleteGroup = function (id) {
            $.$modal.confirm('确认要删除吗？', function (isOk) {
                if (isOk) {
                    $http.post('/team/delete-group', {id: id}).success(function (res) {
                        if (res >= 1) {
                            $.$modal.alert('删除成功');
                            ds.read();
                        } else {
                            $.$modal.alert('删除失败');
                        }
                    });
                }
            });

        }

        $scope.saveGroup = function () {
            if ($scope.group.id) {
                $http.post('/team/edit-group', {id: $scope.group.id, g_name: $scope.group.g_name, area_id: $scope.group.area_id, area_name: $scope.group.area_name}).success(function (res) {
                    if (res >= 1) {
                        $.$modal.alert('保存成功');
                        $scope.win1.close();
                        ds.read();
                    } else {
                        $.$modal.alert('保存失败');
                    }
                });
            } else {
                $http.post('/team/save-group', {g_name: $scope.group.g_name, area_id: $scope.group.area_id, area_name: $scope.group.area_name}).success(function (res) {
                    if (res >= 1) {
                        $.$modal.alert('保存成功');
                        $scope.win1.close();
                        ds.read();
                    } else {
                        $.$modal.alert('保存失败');
                    }
                });
            }
        }
    }]);


    app.controller('teamAreasController', ['$scope', '$http', '$routeParams', 'model', 'token', function ($scope, $http, $routeParams, model, token) {
        var ds = new kendo.data.DataSource({
            transport: {
                read: {
                    url: '/team/json-area-list',
                    data: {}
                }
            },
            pageSize: 10,
            schema: {
                model: {
                    id: 'id'
                }
            }
        });

        $scope.area = {
            id: '',
            a_name: ''
        }

        $scope.config = {
            grid: {
                dataSource: ds,
                toolbar: [
                    {
                        template: '<a class="btn btn-success" ng-click="addFile()">新建区域</a>'
                    }
                ],
                columns: [
                    {field: 'id', title: 'ID'},
                    {field: 'a_name', title: '区域名称'},
                    {field: 'created_at', title: '创建时间'},
                    {title: '操作', template: '<a ng-click="editArea(#:id#)" class="btn btn-info btn-sm" title="编辑"><i class="fa fa-pencil"></i></a>' +
                    ' <a  ng-click="deleteArea(#:id#)" class="btn btn-danger btn-sm" title="删除"><i class="fa fa-trash-o"></i></a>', width: 140}
                ],
                scrollable: false,
                pageable: true,
            }
        }

        $scope.addFile = function () {
            $scope.area.id = '';
            $scope.area.a_name = '';
            $scope.win1.center().open();
        }

        $scope.editArea = function (id) {
            var item = ds.get(id);
            $scope.area.id = item.id;
            $scope.area.a_name = item.a_name;
            $scope.win1.center().open();
        }

        $scope.deleteArea = function (id) {
            $.$modal.confirm('确认要删除吗？', function (isOk) {
                if (isOk) {
                    $http.post('/team/delete-area', {id: id}).success(function (res) {
                        if (res >= 1) {
                            $.$modal.alert('删除成功');
                            ds.read();
                        } else {
                            $.$modal.alert('删除失败');
                        }
                    });
                }
            });

        }

        $scope.saveArea = function () {
            if ($scope.area.id) {
                $http.post('/team/edit-area', {id: $scope.area.id, a_name: $scope.area.a_name}).success(function (res) {
                    if (res >= 1) {
                        $.$modal.alert('保存成功');
                        $scope.win1.close();
                        ds.read();
                    } else {
                        $.$modal.alert('保存失败');
                    }
                });
            } else {
                $http.post('/team/save-area', {a_name: $scope.area.a_name}).success(function (res) {
                    if (res >= 1) {
                        $.$modal.alert('保存成功');
                        $scope.win1.close();
                        ds.read();
                    } else {
                        $.$modal.alert('保存失败');
                    }
                });
            }
        }
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
                date: user.date ? user.date.split(' ').shift() : '',
                group_name: user.group_name,
                area_name: user.area_name,
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

    //controller for results
    app.controller('resultCountController', ['$scope', '$http', '$routeParams', 'model', 'token', function ($scope, $http, $routeParams, model, token) {

        function getTop10List(data) {
            var list = [];
            for (var i = 0; i < 5; i++) {
                if (data[i]) {
                    list.push({name: data[i].nickname, group: data[i].group_name + ' - ' + data[i].area_name, result: data[i].total_result});
                } else {
                    list.push({name: '无', group: '', result: 0});
                }
            }
            return list;
        }

        $scope.top10list = {
            month: getTop10List([]),
            season: getTop10List([]),
            halfyear: getTop10List([]),
            fullyear: getTop10List([])
        };

        function getTop10Rank() {
            var d = new Date(), year = d.getFullYear(), month = d.getMonth(), day = d.getDate(), season = Math.floor(month / 3) * 3, half = Math.floor(month / 6) * 6;
            var dates = {
                m_sdate: new Date(year, month, 1).format('yyyy-mm-dd 00:00:00'),
                m_edate: new Date(year, month + 1, 0).format('yyyy-mm-dd 00:00:00'),
                s_sdate: new Date(year, season, 1).format('yyyy-mm-dd 00:00:00'),
                s_edate: new Date(year, season + 3, 0).format('yyyy-mm-dd 00:00:00'),
                h_sdate: new Date(year, half, 1).format('yyyy-mm-dd 00:00:00'),
                h_edate: new Date(year, half + 6, 0).format('yyyy-mm-dd 00:00:00'),
                y_sdate: new Date(year, 0, 1).format('yyyy-mm-dd 00:00:00'),
                y_edate: new Date(year + 1, 0, 0).format('yyyy-mm-dd 00:00:00')
            }
            $http.get('/result/json-result-rank', {params: dates}).success(function (res) {
                $scope.top10list = {
                    month: getTop10List(res.month),
                    season: getTop10List(res.season),
                    halfyear: getTop10List(res.halfyear),
                    fullyear: getTop10List(res.fullyear)
                };
            });
        }

        getTop10Rank();
    }]);

})(window, angular);