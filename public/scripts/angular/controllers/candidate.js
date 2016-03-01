/**
 * Created by roger on 16/1/14.
 */
(function (window) {
    var app = window.RZ.app;

    app.controller('candidateController', ['$scope', '$http', 'personModel', function ($scope, $http, personModel) {
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

        $scope.person = personModel.getNewPerson();

        $scope.operator = {
            getId: function () {
                var now = new Date(), timeStr = now.toLocaleDateString() + ' 0000 ' + now.toTimeString();
                var id = 'R' + timeStr.match(/\d+/g).splice(0, 7).join('') + ('00000' + ~~(Math.random()*10)).substr(-5);
                $scope.person.real_id = id;
            },
            addWorkGroup: function () {
                $scope.person.companys.push(personModel.getNewCompany());
            },
            delWorkGroup: function (idx) {
                $scope.person.companys.splice(idx, 1);
            },
            addSchoolGroup: function () {
                $scope.person.schools.push(personModel.getNewSchool());
            },
            delSchoolGroup: function (idx) {
                $scope.person.schools.splice(idx, 1);
            },
            addTrainingGroup: function () {
                $scope.person.trainings.push(personModel.getNewTraining());
            },
            delTrainingGroup: function (idx) {
                $scope.person.trainings.splice(idx, 1);
            },
            savePersonData: function () {
                console.log($scope.person);
                var person = $.extend({}, $scope.person),
                    companys = $.extend({}, person.companys),
                    schools = $.extend({}, person.schools),
                    trainings = $.extend({}, person.trainings);
                delete person.companys;
                delete person.schools;
                delete person.trainings;
                console.log(companys, schools, trainings);
            }
        };
    }]);
})(window);