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
                    {url: '/', label: '首页', power: 1},
                    {url: '#', label: '数据管理', power: 9, items: [
                        {url: '/company/list', label: '企业库', power: 9},
                        {url: '/job/list', label: '职位库', power: 9},
                        {url: '/candidate/list', label: '简历库', power: 9},
                    ]},
                    {url: '/bd/list', label: 'BD管理', power: 9},
                    {url: '/hunt/list', label: '职位管理', power: 1}
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

                if ($routeParams.person_id) {
                    model.getPersonInfo(~~$routeParams.person_id, function (data) {
                        $scope.person = data;
                    });
                } else {
                    $scope.person = model.getNewPerson();
                }



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
                        var url = !$routeParams.person_id ? '/candidate/save-new' : '/candidate/save-edit';
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
                            dataType: 'json'
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

})(window, angular);