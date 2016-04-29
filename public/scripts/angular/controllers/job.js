/**
 * Created by roger on 16/2/15.
 */
/**
 * Created by roger on 16/1/14.
 */
(function (window) {
    var app = window.RZ.app;

    app.controller('jobCreateController', ['$scope', '$http', 'jobModel', function ($scope, $http, jobModel) {
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

        $scope.job = jobModel.getNewJob();

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

            console.log(job);
            //return;
            $http.post('/job/save-new', {job: job}).success(function (res) {
                console.log(res);
                if (~~res > 0) {
                    $.$modal.alert('保存成功！', function () {
                        location.href = '/job/list';
                    });
                } else {
                    $.$modal.alert(res);
                }
            });
        }
    }]);

    app.controller('jobEditController', ['$scope', '$http', 'jobModel', function ($scope, $http, jobModel) {
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

        //$scope.job = jobModel.getNewJob();

        $scope.loadJobInfo = function (id) {
            jobModel.getJobInfo(id, function (data) {
                $scope.job = data;
            })
        }

        $scope.saveEditInfo = function () {
            var job = $.extend(true, {}, $scope.job);
            job.area = job.location.p + '-' + job.location.c;
            job.salary = job.salarys.s + '-' + job.salarys.e;
            job.year = job.years.s + '-' + job.years.e;
            job.age = job.ages.s + '-' + job.ages.e;

            delete job.location;
            delete job.salarys;
            delete job.years;
            delete job.ages;

            console.log(job);
            //return;
            $http.post('/job/save-edit', {job: job}).success(function (res) {
                console.log(res);
                if (~~res > 0) {
                    $.$modal.alert('保存成功！', function () {
                        location.href = '/job/list';
                    });
                } else {
                    $.$modal.alert(res);
                }
            });
        }
    }]);


})(window);