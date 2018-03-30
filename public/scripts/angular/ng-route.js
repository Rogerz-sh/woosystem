/**
 * Created by roger on 16/3/15.
 */
(function (window, angular) {
    var app = window.RZ.app;

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/scripts/angular/templates/dashboard.html',
                controller: 'dashboardController'
            })
            .when('/company/list', {
                templateUrl: '/scripts/angular/templates/company-list.html',
                controller: 'routeTempController'
            })
            .when('/company/create', {
                templateUrl: '/scripts/angular/templates/company-create.html',
                controller: 'companyController'
            })
            .when('/company/edit/:company_id', {
                templateUrl: '/scripts/angular/templates/company-edit.html',
                controller: 'companyController'
            })
            .when('/company/detail/:company_id', {
                templateUrl: '/scripts/angular/templates/company-detail.html',
                controller: 'companyController'
            })
            .when('/job/list', {
                templateUrl: '/scripts/angular/templates/job-list.html',
                controller: 'routeTempController'
            })
            .when('/job/create', {
                templateUrl: '/scripts/angular/templates/job-create.html',
                controller: 'jobController'
            })
            .when('/job/edit/:job_id', {
                templateUrl: '/scripts/angular/templates/job-edit.html',
                controller: 'jobController'
            })
            .when('/job/detail/:job_id', {
                templateUrl: '/scripts/angular/templates/job-detail.html',
                controller: 'jobController'
            })
            .when('/candidate/list', {
                templateUrl: '/scripts/angular/templates/resume-list.html',
                controller: 'routeTempController'
            })
            .when('/candidate/create', {
                templateUrl: '/scripts/angular/templates/resume-create.html',
                controller: 'candidateController'
            })
            .when('/candidate/edit/:person_id', {
                templateUrl: '/scripts/angular/templates/resume-edit.html',
                controller: 'candidateController'
            })
            .when('/candidate/detail/:person_id', {
                templateUrl: '/scripts/angular/templates/resume-detail.html',
                controller: 'candidateController'
            })
            .when('/bd/list', {
                templateUrl: '/scripts/angular/templates/bd-list.html',
                controller: 'bdListController'
            })
            .when('/bd/create', {
                templateUrl: '/scripts/angular/templates/bd-create.html',
                controller: 'bdController'
            })
            .when('/bd/edit/:bd_id', {
                templateUrl: '/scripts/angular/templates/bd-edit.html',
                controller: 'bdController'
            })
            .when('/bd/record/:bd_id', {
                templateUrl: '/scripts/angular/templates/bd-record.html',
                controller: 'bdRecordController'
            })
            .when('/hunt/list', {
                templateUrl: '/scripts/angular/templates/hunt-list.html',
                controller: 'huntListController'
            })
            .when('/hunt/select/:hs_id', {
                templateUrl: '/scripts/angular/templates/hunt-select.html',
                controller: 'huntSelectController'
            })
            .when('/hunt/create', {
                templateUrl: '/scripts/angular/templates/hunt-create.html',
                controller: 'huntController'
            })
            .when('/hunt/edit/:hunt_id', {
                templateUrl: '/scripts/angular/templates/hunt-edit.html',
                controller: 'huntController'
            })
            .when('/hunt/record/:hunt_id', {
                templateUrl: '/scripts/angular/templates/hunt-record.html',
                controller: 'huntRecordController'
            })
            .when('/performance/list', {
                templateUrl: '/scripts/angular/templates/performance-list.html',
                controller: 'performanceListController'
            })
            .when('/performance/charts', {
                templateUrl: '/scripts/angular/templates/performance-chart.html',
                controller: 'performanceChartController'
            })
            .when('/result/list', {
                templateUrl: '/scripts/angular/templates/result-list.html',
                controller: 'routeTempController'
            })
            .when('/result/create', {
                templateUrl: '/scripts/angular/templates/result-create.html',
                controller: 'routeTempController'
            })
            .when('/result/edit', {
                templateUrl: '/scripts/angular/templates/result-edit.html',
                controller: 'routeTempController'
            })
            .when('/target/list', {
                templateUrl: '/scripts/angular/templates/target-list.html',
                controller: 'targetListController'
            })
            .when('/target/daily-report', {
                templateUrl: '/scripts/angular/templates/daily-report.html',
                controller: 'dailyReportController'
            })
            .when('/team/recent', {
                templateUrl: '/scripts/angular/templates/team-recent.html',
                controller: 'teamRecentController'
            })
            .when('/team/users', {
                templateUrl: '/scripts/angular/templates/team-users.html',
                controller: 'teamUsersController'
            })
            .when('/team/groups', {
                templateUrl: '/scripts/angular/templates/team-groups.html',
                controller: 'teamGroupsController'
            })
            .when('/team/areas', {
                templateUrl: '/scripts/angular/templates/team-areas.html',
                controller: 'teamAreasController'
            })
            .when('/user/info', {
                templateUrl: '/scripts/angular/templates/user-info.html',
                controller: 'userInfoController'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);

})(window, angular);