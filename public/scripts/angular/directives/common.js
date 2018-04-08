/**
 * Created by roger on 16/3/15.
 */
(function (window, angular) {
    var app = window.RZ.app;

    app.directive('navBar', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: '/scripts/angular/templates/nav-bar.html',
            controller: ['$scope', '$http', 'model', function ($scope, $http, model) {
                $scope.navIndex = -1;
                $scope.activeIndex = 0;
                $scope.session = model.getUserSession();
                $scope.menus = [
                    {url: '/', label: '首页', power: [1,2,3,9]},
                    {url: '#', label: '数据管理', power: [1,2,3,9], items: [
                        {url: '/company/list', label: '企业库', power: [9]},
                        {url: '/job/list', label: '职位库', power: [9]},
                        {url: '/candidate/list', label: '简历库', power: [1,2,3,9]},
                    ]},
                    {url: '/bd/list', label: '客户管理', power: [1,2,3,9]},
                    {url: '/hunt/list', label: '项目管理', power: [1,2,3,9]},
                    {url: '/performance/list', label: '绩效管理', power: [1,2,3,9], items: [
                        {url: '/performance/list', label: '绩效管理', power: [1,2,3,9]},
                        {url: '/performance/charts', label: '绩效图表', power: [1,2,3,9]},
                        {url: '/target/list', label: '目标管理', power: [1,2,3,9]},
                        {url: '/target/daily-report', label: '日清表', power: [1,2,3,9]},
                    ]},
                    {url: '/team/recent', label: '团队管理', power: [9], items: [
                        {url: '/team/recent', label: '团队近况', power: [9]},
                    ]},
                    {url: '/result/list', label: '业绩管理', power: [3,9], items: [
                        {url: '/result/list', label: '业绩列表', power: [3,9]},
                    ]},
                    {url: '/team/users', label: '用户管理', power: [2,9], items: [
                        {url: '/team/users', label: '用户管理', power: [2,9]},
                        {url: '/team/groups', label: '项目组管理', power: [2,9]},
                        {url: '/team/areas', label: '区域管理', power: [2,9]},
                    ]}
                ];
                $scope.changeSubNav = function (idx) {
                    $scope.navIndex = idx;
                }
                $scope.activeNavIndex = function (idx) {
                    $scope.activeIndex = idx;
                }
            }],
            link: function (scope, element, attr) {

            }
        }
    });

    app.directive('companyForm', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: '/scripts/angular/templates/company-form.html',
            controller: ['$scope', '$http', 'model', '$routeParams', function ($scope, $http, model, $routeParams) {
                $scope.kendoConfig = {
                    companyAutoComplete: {
                        dataSource: {
                            transport: {
                                read: {
                                    url: '/company/exist-company',
                                    dataType: 'json'
                                }
                            },
                            serverFiltering: true
                        },
                        filter: 'startswith',
                        minLength: 2,
                        delay: 500,
                        dataTextField: 'name',
                        dataValueField: 'name',
                    }
                };

                $scope.data = {
                    industry: [
                        "互联网•游戏•软件",
                        "电子•通信•硬件",
                        "房地产•建筑•物业",
                        "金融",
                        "广告•传媒•教育•文化",
                        "制药•医疗,消费品",
                        "汽车•机械•制造",
                        "服务•外包•中介",
                        "交通•贸易•物流",
                        "能源•化工•环保",
                        "政府•农林牧渔•其他"
                    ],
                    scale: [
                        "1-49人",
                        "50-99人",
                        "100-499人",
                        "500-999人",
                        "1000-1999人",
                        "2000-4999人",
                        "5000-9999人",
                        "10000人及以上"
                    ],
                    type: [
                        "外商独资",
                        "中外合资",
                        "私营／民营",
                        "国有企业",
                        "上市公司",
                        "政府／事业单位",
                        "其他"
                    ]
                };

                $scope.locationData = {
                    p: new kendo.data.DataSource(),
                    c: new kendo.data.DataSource(),
                    change: function (e) {
                        var p = this.dataItem();
                        $scope.locationData.c.filter({field: 'provinceId', operator: 'eq', value: p.id});

                    }
                };

                $http.get('/data/location.json').success(function (res) {
                    $scope.locationData.p.data(res.province);
                    var citys = [];
                    for (c in res.citys) {
                        citys.push(res.citys[c]);
                    }
                    $scope.locationData.c.data(citys);
                });

                if ($routeParams.company_id) {
                    var company = model.getCompanyInfo(~~$routeParams.company_id, function (res) {
                        $scope.company = res;
                        var area = $scope.company.area.split('-');
                        $scope.company.location = {
                            p: area[0],
                            c: area[1]
                        }
                    });
                } else {
                    $scope.company = model.getNewCompany();
                }


                $scope.saveInfo = function () {
                    var company = $.extend(true, {}, $scope.company);
                    company.area = company.location.p + '-' + company.location.c;
                    delete company.location;
                    var url = !$routeParams.company_id ? '/company/save-new' : '/company/save-edit'
                    $http.post(url, {company: company}).success(function (res) {
                        console.log(res);
                        $scope.$emit('saved.company', res, company);
                    });
                };

                $scope.quit = function () {
                    $scope.$emit('quit.company');
                }
            }],
            link: function (scope, element, attr) {

            }
        }
    });

    app.directive('companyInfo', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                'id': '@'
            },
            templateUrl: '/scripts/angular/templates/company-info.html',
            controller: ['$scope', '$http', 'model', '$routeParams', function ($scope, $http, model) {

                model.getCompanyInfo(~~$scope.id, function (res) {
                    $scope.company = res;
                });

                $scope.$on('refresh.company-info', function (e, id, callback) {
                    model.getCompanyInfo(~~id, function (res) {
                        $scope.company = res;
                        if (typeof callback === 'function') callback();
                    });
                });

            }],
            link: function (scope, element, attr) {

            }
        }
    });

    app.directive('resumeForm', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: '/scripts/angular/templates/resume-form.html',
            controller: ['$scope', '$http', 'model', 'token', '$routeParams', function ($scope, $http, model, token, $routeParams) {
                $scope.kendoConfig = {
                    monthPicker: {
                        culture: 'zh-CN',
                        start: 'year',
                        depth: 'year',
                        format: 'yyyy-MM'
                    },
                    numericTextBox: {
                        min: 0,
                        max: 100,
                        spinners: false,
                        format: 'n0'
                    },
                    fileUpload: {
                        async: {
                            saveUrl: '/file/upload-resume?_token='+token.getCsrfToken(),
                            saveField: 'file',
                        },
                        success: function (e) {
                            $scope.person.file_path = e.response;
                            $scope.person.file_name = e.files[0].name;
                            $scope.person.file_coded = 1;
                            console.log($scope.person);
                            $scope.$apply();
                        },
                        complete: function (e) {
                            console.log('complete');
                        }
                    },
                    companyAutoComplete: {
                        dataSource: {
                            transport: {
                                read: {
                                    url: '/candidate/suggest-company',
                                    dataType: 'json'
                                }
                            },
                            serverFiltering: true
                        },
                        filter: 'startswith',
                        minLength: 2,
                        delay: 500,
                        dataTextField: 'name',
                        dataValueField: 'name',
                    },
                    schoolAutoComplete: {
                        dataSource: {
                            transport: {
                                read: {
                                    url: '/candidate/suggest-school',
                                    dataType: 'json'
                                }
                            },
                            serverFiltering: true
                        },
                        filter: 'startswith',
                        minLength: 2,
                        delay: 500,
                        dataTextField: 'name',
                        dataValueField: 'name',
                    }
                };

                $scope.data = {
                    source: [
                        "猎聘网",
                        "智联卓聘",
                        "智联招聘",
                        "前程无忧",
                        "LinkedIn",
                        "若邻网",
                        "其他网站",
                        "人脉推荐"
                    ],
                    degree: [
                        "高中",
                        "大专",
                        "本科",
                        "研究生",
                        "硕士",
                        "博士",
                        "博士后"
                    ]
                };

                $scope.person_id = $routeParams.person_id;

                $scope.locationData = {
                    p: new kendo.data.DataSource(),
                    c: new kendo.data.DataSource(),
                    change: function (e) {
                        var p = this.dataItem();
                        $scope.locationData.c.filter({field: 'provinceId', operator: 'eq', value: p.id});
                    }
                };

                $scope.belongData = {
                    p: new kendo.data.DataSource(),
                    c: new kendo.data.DataSource(),
                    change: function (e) {
                        var p = this.dataItem();
                        $scope.belongData.c.filter({field: 'provinceId', operator: 'eq', value: p.id});
                    }
                };

                $http.get('/data/location.json').success(function (res) {
                    $scope.locationData.p.data(res.province);
                    $scope.belongData.p.data(res.province);
                    var citys = [];
                    for (c in res.citys) {
                        citys.push(res.citys[c]);
                    }
                    $scope.locationData.c.data(citys);
                    $scope.belongData.c.data(citys);
                });

                if ($scope.person_id) {
                    model.getPersonInfo(~~$scope.person_id, function (data) {
                        $scope.person = data;
                    });
                } else {
                    $scope.person = model.getNewPerson();
                }

                $scope.$on('load.resume', function (e, person_id, callback) {
                    $scope.person_id = person_id;
                    model.getPersonInfo(~~$scope.person_id, function (data) {
                        $scope.person = data;
                        if (typeof callback === 'function') callback();
                    });
                });

                $scope.operator = {
                    getId: function () {
                        $scope.person.real_id = 'R' +  model.getRandomId();
                    },
                    addWorkGroup: function () {
                        $scope.person.companys.push(model.getNewPersonCompany());
                    },
                    delWorkGroup: function (idx) {
                        $scope.person.companys.splice(idx, 1);
                    },
                    addSchoolGroup: function () {
                        $scope.person.schools.push(model.getNewPersonSchool());
                    },
                    delSchoolGroup: function (idx) {
                        $scope.person.schools.splice(idx, 1);
                    },
                    addTrainingGroup: function () {
                        $scope.person.trainings.push(model.getNewPersonTraining());
                    },
                    delTrainingGroup: function (idx) {
                        $scope.person.trainings.splice(idx, 1);
                    },
                    savePersonData: function () {
                        console.log($scope.person);
                        var person = $.extend({}, $scope.person),
                            company = $.extend({}, person.companys),
                            school = $.extend({}, person.schools),
                            training = $.extend({}, person.trainings);
                        delete person.companys;
                        delete person.schools;
                        delete person.trainings;
                        var location = person.location.p + '-' + person.location.c, belong = person.belong.p + '-' + person.belong.c;
                        person.location = location;
                        person.belong = belong;
                        console.log(person, company, school, training);
                        var url = !$scope.person_id ? '/candidate/save-new' : '/candidate/save-edit';
                        $http.post(url, {person: person, company: company, school: school, training: training}).success(function (res) {
                            $scope.$emit('saved.resume', res, $scope.person);
                            $scope.person = model.getNewPerson();
                        });
                    },
                    quit: function () {
                        $scope.$emit('quit.resume');
                    }
                };
            }],
            link: function (scope, element, attr) {

            }
        }
    });

    app.directive('resumeInfo', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                'id': '@'
            },
            templateUrl: '/scripts/angular/templates/resume-info.html',
            controller: ['$scope', '$http', 'model', '$routeParams', function ($scope, $http, model) {

                function rebuild(res) {
                    $scope.person.location = res.location.p + '-' + res.location.c;
                    $scope.person.belong = res.belong.p + '-' + res.belong.c;
                }

                model.getPersonInfo(~~$scope.id, function (res) {
                    $scope.person = res;
                    rebuild(res);
                });

                $scope.$on('refresh.person-info', function (e, id, callback) {
                    model.getPersonInfo(~~id, function (res) {
                        $scope.person = res;
                        rebuild(res);
                        if (typeof callback === 'function') callback();
                    });
                });

            }],
            link: function (scope, element, attr) {

            }
        }
    });

    app.directive('jobForm', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: '/scripts/angular/templates/job-form.html',
            controller: ['$scope', '$http', 'model', '$routeParams', function ($scope, $http, model, $routeParams) {
                $scope.kendoConfig = {
                    companyDropDownList: {
                        dataSource: {
                            transport: {
                                read: {
                                    url: '/job/company-list',
                                    dataType: 'json'
                                }
                            }
                        },
                        optionLabel: '请选择所属企业...',
                        filter: 'startswith',
                        delay: 500,
                        dataTextField: 'name',
                        dataValueField: 'id',
                        change: function () {
                            var item = this.dataItem();
                            $scope.job.company_name = item.name;
                        }
                    }
                };

                $scope.data = {
                    type: [
                        "高级管理",
                        "投资类",
                        "财务类",
                        "技术类",
                        "市场营销类",
                        "销售/客服",
                        "法务/风控类",
                        "人力资源/行政类"
                    ],
                    degree: [
                        "高中",
                        "大专",
                        "本科",
                        "研究生",
                        "硕士",
                        "博士",
                        "博士后"
                    ]
                };

                $scope.locationData = {
                    p: new kendo.data.DataSource(),
                    c: new kendo.data.DataSource(),
                    change: function (e) {
                        var p = this.dataItem();
                        $scope.locationData.c.filter({field: 'provinceId', operator: 'eq', value: p.id});
                    }
                };

                $http.get('/data/location.json').success(function (res) {
                    $scope.locationData.p.data(res.province);
                    var citys = [];
                    for (c in res.citys) {
                        citys.push(res.citys[c]);
                    }
                    $scope.locationData.c.data(citys);
                });

                if ($routeParams.job_id) {
                    model.getJobInfo(~~$routeParams.job_id, function (data) {
                        $scope.job = data;
                    });
                } else {
                    $scope.job = model.getNewJob();
                }

                $scope.saveInfo = function () {
                    var job = $.extend(true, {}, $scope.job);
                    job.area = job.location.p + '-' + job.location.c;
                    job.salary = job.salarys.s + '-' + job.salarys.e;
                    job.year = job.years.s + '-' + job.years.e;
                    job.age = job.ages.s + '-' + job.ages.e;

                    delete job.location;
                    delete job.salarys;
                    delete job.years;
                    delete job.ages;

                    var url = !$routeParams.job_id ? '/job/save-new' : '/job/save-edit'
                    $http.post(url, {job: job}).success(function (res) {
                        console.log(res);
                        $scope.$emit('saved.job', res, job);
                    });
                };

                $scope.quit = function () {
                    $scope.$emit('quit.job');
                };

            }],
            link: function (scope, element, attr) {

            }
        }
    });

    app.directive('jobInfo', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                'id': '@'
            },
            templateUrl: '/scripts/angular/templates/job-info.html',
            controller: ['$scope', '$http', 'model', '$routeParams', function ($scope, $http, model) {

                function rebuild(res) {
                    $scope.job.area = res.location.p + '-' + res.location.c;
                    $scope.job.salary = res.salarys.s + '-' + res.salarys.e + '万';
                    $scope.job.age = res.ages.s + '-' + res.ages.e + '岁';
                    $scope.job.year = res.years.s + '-' + res.years.e + '年';
                }

                model.getJobInfo(~~$scope.id, function (res) {
                    $scope.job = res;
                    rebuild(res);
                });

                $scope.$on('refresh.job-info', function (e, id, callback) {
                    model.getJobInfo(~~id, function (res) {
                        $scope.job = res;
                        rebuild(res);
                        if (typeof callback === 'function') callback();
                    });
                });

            }],
            link: function (scope, element, attr) {

            }
        }
    });

    app.directive('bdForm', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: '/scripts/angular/templates/bd-form.html',
            controller: ['$scope', '$http', 'model', '$routeParams', function ($scope, $http, model, $routeParams) {
                var dataSource = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: '/job/company-list',
                            dataType: 'json'
                        }
                    }
                });

                $scope.config = {
                    datepicker: {
                        culture: 'zh-CN',
                        format: 'yyyy-MM-dd',
                        value: Date.translate('now')
                    },
                    company: {
                        dataSource: dataSource,
                        optionLabel: '请选择所属企业...',
                        filter: 'startswith',
                        delay: 500,
                        dataTextField: 'name',
                        dataValueField: 'id',
                        change: function () {
                            var item = this.dataItem();
                            $scope.bd.company_name = item.name;
                            $scope.$apply();
                        }
                    },
                    person: {
                        dataSource: {
                            transport: {
                                read: {
                                    url: '/bd/user-list',
                                    dataType: 'json'
                                }
                            }
                        },
                        optionLabel: '请选择合作顾问...',
                        filter: 'startswith',
                        delay: 500,
                        dataTextField: 'nickname',
                        dataValueField: 'id',
                        change: function () {
                            var item = this.dataItems(), names = [];
                            for (var i = 0; i < item.length; i++) {
                                names.push(item[i].nickname);
                            }
                            $scope.bd.user_names = names;
                            $scope.$apply();
                        }
                    }
                };

                $scope.data = {
                    status: [
                        "后期跟进",
                        "持续跟进",
                        "重点跟进",
                        "签约合作",
                        "不合作"
                    ]
                };

                if ($routeParams.bd_id) {
                    model.getBdInfo(~~$routeParams.bd_id, function (data) {
                        $scope.bd = data;
                    });
                } else {
                    $scope.bd = model.getNewBd();
                }

                $scope.getBdId = function () {
                    $scope.bd.name = 'C' + model.getRandomId();
                };

                $scope.$on('saved.company', function (e, res, company) {
                    if(~~res > 0) {
                        dataSource.read();
                        $scope.bd.company_id = company.id;
                        $scope.bd.company_name = company.name;
                        $scope.win1.close();
                        $.$modal.alert('保存成功！');
                    } else {
                        $.$modal.alert(res);
                    }
                });

                $scope.$on('quit.company', function () {
                    $scope.win1.close();
                })

                $scope.saveBdInfo = function () {
                    var url = !$routeParams.bd_id ? '/bd/save-info' : '/bd/save-edit';
                    var bd = $.extend({}, $scope.bd);
                    bd.user_ids = bd.user_ids ? bd.user_ids.join(',') : '';
                    bd.user_names = bd.user_names.join(',');
                    $http.post(url, {bd: bd}).success(function (res) {
                        $scope.$emit('saved.bd', res, bd);
                    });
                }

                $scope.quit = function () {
                    $scope.$emit('quit.bd');
                }
            }]
        }
    });

    app.directive('huntForm', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: '/scripts/angular/templates/hunt-form.html',
            controller: ['$scope', '$http', 'model', '$routeParams', function ($scope, $http, model, $routeParams) {
                var dsJob = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: '/hunt/json-job-list-data',
                            dataType: 'json'
                        }
                    },
                    //serverFiltering: true
                });
                var dsPerson = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: '/hunt/json-candidate-list-data',
                            dataType: 'json',
                            data: {hunt_id: ~~$routeParams.hunt_id}
                        }
                    },
                    serverFiltering: true
                });

                $scope.config = {
                    datepicker: {
                        culture: 'zh-CN',
                        format: 'yyyy-MM-dd',
                        value: Date.translate('now')
                    },
                    company: {
                        dataSource: dsJob,
                        optionLabel: '请选择要操作的岗位...',
                        filter: 'contains',
                        delay: 500,
                        dataTextField: 'name',
                        dataValueField: 'id',
                        template: '<strong>#:name#</strong> <span class="dark-gray">[ #:company_name# ]</span>',
                        change: function () {
                            var item = this.dataItem();
                            $scope.hunt.job_name = item.name;
                            $scope.hunt.job_id = item.id;
                            $scope.hunt.company_id = item.company_id;
                            $scope.hunt.company_name = item.company_name;
                            $scope.$apply();
                        },
                        filtering: function (e) {
                            var key = e.filter.value.trim();
                            if (!key) {
                                dsJob.filter([]);
                            } else {
                                dsJob.filter({
                                    logic: 'or',
                                    filters: [
                                        {field: 'name', operator: 'contains', value: key},
                                        {field: 'company_name', operator: 'contains', value: key}
                                    ]
                                });
                            }
                            e.preventDefault();
                        },
                        dataBound: function () {
                            $scope.hunt.job_id = $scope.debug.job_id;
                        }
                    },
                    candidate: {
                        dataSource: dsPerson,
                        optionLabel: '请选择候选人...',
                        filter: 'contains',
                        delay: 500,
                        dataTextField: 'name',
                        dataValueField: 'id',
                        template: '<strong>#:name#</strong> <span class="dark-gray">[ #:real_id# / #:sex# / #:age#岁 / #:job# / #:company# ]</span>',
                        change: function () {
                            var item = this.dataItem();
                            $scope.hunt.person_id = item.id;
                            $scope.hunt.person_name = item.name;
                            $scope.$apply();
                        },
                        dataBound: function () {
                            $scope.hunt.person_id = $scope.debug.person_id;
                        }
                    }
                };

                $scope.data = {
                    status: [
                        "未接通或正忙，继续跟进",
                        "号码错误，先发邮件",
                        "匹配，意向不强，持续跟进",
                        "匹配，且意向强，重点跟进",
                        "推荐客户",
                        "一般匹配，储备",
                        "不再跟进（无意向、不匹配）"
                    ]
                };

                $scope.debug = {};

                if ($routeParams.hunt_id) {
                    model.getHuntInfo(~~$routeParams.hunt_id, function (data) {
                        $scope.hunt = data;
                        $scope.debug.job_id = data.job_id;
                        $scope.debug.person_id = data.person_id;
                    });
                } else {
                    $scope.hunt = model.getNewHunt();
                }

                $scope.$on('saved.job', function (e, res, job) {
                    if(~~res > 0) {
                        dsJob.read();
                        $scope.hunt.job_id = job.id;
                        $scope.hunt.job_name = job.name;
                        $scope.win1.close();
                        $.$modal.alert('保存成功！');
                    } else {
                        $.$modal.alert(res);
                    }
                });

                $scope.$on('quit.job', function () {
                    $scope.win1.close();
                });

                $scope.$on('saved.resume', function (e, res, person) {
                    if(~~res > 0) {
                        dsPerson.read();
                        $scope.bd.person_id = person.id;
                        $scope.bd.person_name = person.name;
                        $scope.win2.close();
                        $.$modal.alert('保存成功！');
                    } else {
                        $.$modal.alert(res);
                    }
                });

                $scope.$on('quit.resume', function () {
                    $scope.win2.close();
                });

                $scope.getId = function () {
                    $scope.hunt.name = 'J' +  model.getRandomId();
                };

                $scope.saveHuntInfo = function () {
                    console.log($scope.hunt);
                    var url = !$routeParams.hunt_id ? '/hunt/save-new' : '/hunt/save-edit'
                    $http.post(url, {hunt: $scope.hunt}).success(function (res) {
                        $scope.$emit('saved.hunt', res);
                    });
                };

                $scope.quit = function () {
                    $scope.$emit('quit.hunt');
                };
            }]
        }
    });

    app.directive('monthTarget', function () {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                'selMonth': '='
            },
            templateUrl: '/scripts/angular/templates/month-target.html',
            controller: ['$scope', '$http', 'model', function ($scope, $http, model) {
                //var date = new Date($scope.selMonth+'-01'), year = date.getFullYear(), month = date.getMonth(), firstDay = new Date(year, month, 1).getDay();
                //
                //$scope.month = month + 1;
                //$scope.days = new Date(year, month + 1, 0).getDate();
                //var dayList = [];
                //for (i = 0; i < firstDay; i++) {
                //    dayList.push('-');
                //}
                //for (var i = 0; i < $scope.days; i++) {
                //    dayList.push(i+1);
                //}
                //for (var i = 0, l = 7 - dayList.length % 7; i < l; i++) {
                //    dayList.push('-');
                //}
                //$scope.dayList = dayList;

                $scope.$watch('selMonth', function (n, o) {
                    var date = new Date(n+'-01'), year = date.getFullYear(), month = date.getMonth(), firstDay = new Date(year, month, 1).getDay();

                    $scope.month = month + 1;
                    $scope.days = new Date(year, month + 1, 0).getDate();
                    var dayList = [];
                    for (i = 0; i < firstDay; i++) {
                        dayList.push('-');
                    }
                    for (var i = 0; i < $scope.days; i++) {
                        dayList.push(i+1);
                    }
                    for (var i = 0, l = 7 - dayList.length % 7; i < l; i++) {
                        dayList.push('-');
                    }

                    $scope.weeks = [];
                    for (var i = 0; i < Math.ceil(dayList.length / 7); i++) {
                        var week = {id: month+'-'+i, days: []};
                    }

                    $scope.dayList = dayList;
                });

            }],
            link: function (scope, element, attr) {

            }
        }
    });

    app.directive('month', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                'month': '=',
                'tb': '=',
                'tp': '=',
                'tr': '=',
                'tf': '=',
                'to': '=',
                'ts': '=',
                'tt': '='
            },
            template: '<div class="panel panel-primary">' +
            '<div class="panel-heading"><h5 class="panel-title" ng-bind="month"></h5></div>' +
            '<div class="panel-body">' +
            '<div class="flex flex-row">' +
            '<span class="flex-1 text-center padding-top-10 padding-bottom-10"></span>' +
            '<span class="flex-1 text-center padding-top-10 padding-bottom-10" ng-repeat="w in [\'日\',\'一\',\'二\',\'三\',\'四\',\'五\',\'六\']" ng-bind="w"></span>' +
            '</div>' +
            '<div>' +
            '<week ng-repeat="week in weeks track by $index" week="week"></week>' +
            '</div>' +
            '</div>' +
            '</div>',
            controller: ['$scope', '$http', 'model', function ($scope, $http, model) {

                $scope.watchTarget = function () {
                    return $scope.month + $scope.tb + $scope.tp + $scope.tr + $scope.tf + $scope.to + $scope.ts + $scope.tt;
                };

                $scope.$watch($scope.watchTarget, function (nVal, oVal) {
                    //$scope.month = $scope.value;
                    var date = new Date($scope.month + '-01'), year = date.getFullYear(), month = date.getMonth(), day = date.getDate();
                    var firstDay = new Date(year, month, 1).getDay(), lastDay = new Date(year, month + 1, 0).getDay(), totalDates = new Date(year, month + 1, 0).getDate(), firstDate = new Date(year, month, 1), lastDate = new Date(year, month, totalDates);
                    var prevDays = ~~!firstDay * 7 + firstDay, nextDays = 42 - totalDates - prevDays, startWeek = prevDays == 7 ? 1 : 0;
                    var weekCount = Math.ceil((prevDays + totalDates + nextDays) / 7), startDate = date.translate('now-' + prevDays), endDate = lastDate.translate('now+' + nextDays);

                    var workCount = 20, p = 28, tmpDate = firstDate.translate('now+'+p);
                    while(tmpDate.getMonth() == month && tmpDate.getDate() <= totalDates) {
                        if (tmpDate.getDay() > 0 && tmpDate.getDay() < 6) workCount++;
                        p++;
                        tmpDate = firstDate.translate('now+'+p);
                    }

                    var Counter = function (total, split) {
                        this.total = Number(total);
                        this.split = Number(split);
                        this.rest = 0;
                        this.avg = this.total.divs(this.split);
                        this.empty = false;
                        this.count = 1;
                    }
                    Counter.prototype.next = function () {
                        if (this.empty) return 0;
                        if (this.total <= this.avg || this.count == this.split) {
                            this.empty = true;
                            return this.total;
                        }
                        var part_int = parseInt(this.avg), part_float = this.avg - part_int, rtnVal = 0;
                        this.rest = this.rest.plus(part_float);
                        if (this.rest >= 1) {
                            this.rest = this.rest.minus(1);
                            rtnVal = part_int + 1;
                        } else {
                            rtnVal = part_int;
                        }
                        this.total = this.total.minus(rtnVal);
                        this.count++;
                        return rtnVal;
                    }

                    var tb = new Counter($scope.tb, workCount),
                        tp = new Counter($scope.tp, workCount),
                        tr = new Counter($scope.tr, workCount),
                        tf = new Counter($scope.tf, workCount),
                        to = new Counter($scope.to, workCount),
                        ts = new Counter($scope.ts, workCount),
                        tt = new Counter($scope.tt, workCount);

                    var weeks = [], dayCount = 0, sdate = new Date(startDate), startWeek = prevDays == 7 ? 1 : 0, endWeek = nextDays >= 7 ? 4 : 5, w = 1, days = [];
                    for (var i = 0; i < weekCount; i++) {
                        var week = {'index': i, 'name': '', 'days': [], 'tb': 0, 'tp': 0, 'tr': 0, 'tf': 0, 'to': 0, 'ts': 0, 'tt': 0};
                        if (i >= startWeek && i <= endWeek) week.name = '第{0}周'.format(['', '一', '二', '三', '四', '五', '六'][w++]);
                        for (var j = 0; j < 7; j++, dayCount++) {
                            var d = startDate.translate('now+' + dayCount);
                            var day = {
                                'date': d.format(),
                                'day': d.getDate(),
                                'workable': d.getDay() > 0 && d.getDay() < 6,
                                'active': d.getMonth() == month,
                                'tb': d.getMonth() == month && d.getDay() > 0 && d.getDay() < 6 ? tb.next() : 0,
                                'tp': d.getMonth() == month && d.getDay() > 0 && d.getDay() < 6 ? tp.next() : 0,
                                'tr': d.getMonth() == month && d.getDay() > 0 && d.getDay() < 6 ? tr.next() : 0,
                                'tf': d.getMonth() == month && d.getDay() > 0 && d.getDay() < 6 ? tf.next() : 0,
                                'to': d.getMonth() == month && d.getDay() > 0 && d.getDay() < 6 ? to.next() : 0,
                                'ts': d.getMonth() == month && d.getDay() > 0 && d.getDay() < 6 ? ts.next() : 0,
                                'tt': d.getMonth() == month && d.getDay() > 0 && d.getDay() < 6 ? tt.next() : 0
                            };
                            if (day.active && day.workable) days.push(day);
                            week.days.push(day);
                            week.tb = week.tb.plus(day.tb);
                            week.tp = week.tp.plus(day.tp);
                            week.tr = week.tr.plus(day.tr);
                            week.tf = week.tf.plus(day.tf);
                            week.to = week.to.plus(day.to);
                            week.ts = week.ts.plus(day.ts);
                            week.tt = week.tt.plus(day.tt);
                        }
                        weeks.push(week);
                    }
                    $scope.weeks = weeks;

                    $scope.$emit('weeksData', days);

                    //console.log('firstDay:%s, lastDay:%s, totalDays:%s, startDate:%s, endDate:%s, weeks:%s, workdays:%s', firstDay, lastDay, totalDates, startDate.format(), endDate.format(), weekCount, workCount);
                });
            }],
            link: function (scope, element, attr) {

            }
        }
    });

    app.directive('week', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                'week': '='
            },
            template: '<div class="flex flex-row border-top border-width-1 border-color-gray">' +
            '<div class="flex-1 text-center padding-top-10 padding-bottom-10">' +
            '<span ng-bind="week.name" class="bold margin-5 inline-block"></span><br>' +
            '<span class="btn btn-xs btn-default dark-orange margin-bottom-5 width-50" ng-if="week.name"><i class="fa fa-heart" title="BD"></i> {{week.tb}}</span><br>' +
            '<span class="btn btn-xs btn-default dark-orange margin-bottom-5 width-50" ng-if="week.name"><i class="fa fa-user" title="人选"></i> {{week.tp}}</span><span class="btn btn-xs btn-default dark-orange margin-bottom-5 width-50 margin-left-20" ng-if="week.name"><i class="fa fa-file" title="报告"></i> {{week.tr}}</span><br>' +
            '<span class="btn btn-xs btn-default dark-orange margin-bottom-5 width-50" ng-if="week.name"><i class="fa fa-comments" title="面试"></i> {{week.tf}}</span><span class="btn btn-xs btn-default dark-orange margin-bottom-5 width-50 margin-left-20" ng-if="week.name"><i class="fa fa-print" title="Offer"></i> {{week.to}}</span><br>' +
            '<span class="btn btn-xs btn-default dark-orange margin-bottom-5 width-50" ng-if="week.name"><i class="fa fa-trophy" title="上岗"></i> {{week.ts}}</span><span class="btn btn-xs btn-default dark-orange margin-bottom-5 width-50 margin-left-20" ng-if="week.name"><i class="fa fa-money" title="业绩"></i> {{week.tt}}W</span><br>' +
            '</div>' +
            '<div class="flex-1 text-center padding-top-10 padding-bottom-10" ng-repeat="day in week.days">' +
            '<span ng-bind="day.day" class="margin-5 inline-block" ng-class="{\'gray\':!day.active, \'blue\':day.active, \'bold\':day.workable}"></span><br>' +
            '<span class="btn btn-xs btn-default dark-orange margin-bottom-5 width-50" ng-if="day.active && day.workable"><i class="fa fa-heart" title="BD"></i> {{day.tb}}</span><br>' +
            '<span class="btn btn-xs btn-default dark-orange margin-bottom-5 width-50" ng-if="day.active && day.workable"><i class="fa fa-user" title="人选"></i> {{day.tp}}</span><span class="btn btn-xs btn-default dark-orange margin-bottom-5 width-50 margin-left-20" ng-if="day.active && day.workable"><i class="fa fa-file" title="报告"></i> {{day.tr}}</span><br>' +
            '<span class="btn btn-xs btn-default dark-orange margin-bottom-5 width-50" ng-if="day.active && day.workable"><i class="fa fa-comments" title="面试"></i> {{day.tf}}</span><span class="btn btn-xs btn-default dark-orange margin-bottom-5 width-50 margin-left-20" ng-if="day.active && day.workable"><i class="fa fa-print" title="Offer"></i> {{day.to}}</span><br>' +
            '<span class="btn btn-xs btn-default dark-orange margin-bottom-5 width-50" ng-if="day.active && day.workable"><i class="fa fa-trophy" title="上岗"></i> {{day.ts}}</span><span class="btn btn-xs btn-default dark-orange margin-bottom-5 width-50 margin-left-20" ng-if="day.active && day.workable"><i class="fa fa-money" title="业绩"></i> {{day.tt}}W</span><br>' +
            '</div>' +
            '</div>',
            controller: ['$scope', '$http', 'model', function ($scope, $http, model) {

            }],
            link: function (scope, element, attr) {

            }
        }
    });

    app.directive('powerChecker', function () {
        return {
            restrict: 'AE',
            controller: ['$scope', '$http', 'model', function ($scope, $http, model) {
                $scope.power = model.getUserSession().power;
            }],
            link: function (scope, element, attr) {
                var power = scope.power;
                if (power != 9) {
                    element.remove();
                }
            }
        }
    })

})(window, angular);