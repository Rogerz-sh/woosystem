/**
 * Created by roger on 16/1/14.
 */
(function (window) {
    var app = window.RZ.app;

    app.controller('companyCreateController', ['$scope', '$http', 'companyModel', function ($scope, $http, companyModel) {
        $scope.kendoConfig = {
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

        $scope.company = companyModel.getNewCompany();

        $scope.saveInfo = function () {
            var company = $.extend(true, {}, $scope.company);
            company.area = company.location.p + '-' + company.location.c;
            delete company.location;
            $http.post('/company/save-new', {company: company}).success(function (res) {
                console.log(res);
                if (~~res) {
                    $.$modal.alert('保存成功！', function () {
                        location.href = '/company/list';
                    });
                } else {
                    $.$modal.alert(res);
                }
            });
        }
    }]);

    app.controller('companyEditController', ['$scope', '$http', 'companyModel', function ($scope, $http, companyModel) {
        $scope.kendoConfig = {
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

        //$scope.company = companyModel.getNewCompany();

        $scope.loadCompanyInfo = function (id) {
            var company = companyModel.getCompanyInfo(id, function (res) {
                $scope.company = res;
                var area = $scope.company.area.split('-');
                $scope.company.location = {
                    p: area[0],
                    c: area[1]
                }
            });
        };

        $scope.saveEditInfo = function () {
            var company = $.extend(true, {}, $scope.company);
            company.area = company.location.p + '-' + company.location.c;
            delete company.location;
            $http.post('/company/save-edit', {company: company}).success(function (res) {
                console.log(res);
                if (~~res) {
                    $.$modal.alert('保存成功！', function () {
                        location.href = '/company/list';
                    });
                } else {
                    $.$modal.alert(res);
                }
            });
        }
    }]);


})(window);