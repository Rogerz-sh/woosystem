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
            .when('/bd/call-in', {
                templateUrl: '/scripts/angular/templates/bd-call-in.html',
                controller: 'routeTempController'
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
            .when('/performance/ranks', {
                templateUrl: '/scripts/angular/templates/performance-ranks.html',
                controller: 'routeTempController'
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
            .when('/result/count', {
                templateUrl: '/scripts/angular/templates/result-count.html',
                controller: 'resultCountController'
            })
            .when('/result/user', {
                templateUrl: '/scripts/angular/templates/result-user.html',
                controller: 'routeTempController'
            })
            .when('/result/company', {
                templateUrl: '/scripts/angular/templates/result-company.html',
                controller: 'routeTempController'
            })
            .when('/result/job', {
                templateUrl: '/scripts/angular/templates/result-job.html',
                controller: 'routeTempController'
            })
            .when('/target/list', {
                templateUrl: '/scripts/angular/templates/target-list.html',
                controller: 'routeTempController'
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
            .when('/team/powers', {
                templateUrl: '/scripts/angular/templates/team-powers.html',
                controller: 'routeTempController'
            })
            .when('/team/belongs', {
                templateUrl: '/scripts/angular/templates/team-belongs.html',
                controller: 'routeTempController'
            })
            .when('/finance/invoice', {
                templateUrl: '/scripts/angular/templates/finance-invoice.html',
                controller: 'routeTempController'
            })
            .when('/finance/pay-notice', {
                templateUrl: '/scripts/angular/templates/pay-notice.html',
                controller: 'routeTempController'
            })
            .when('/user/info', {
                templateUrl: '/scripts/angular/templates/user-info.html',
                controller: 'userInfoController'
            })
            .when('/personal/favorite', {
                templateUrl: '/scripts/angular/templates/personal-favorite.html',
                controller: 'routeTempController'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);

})(window, angular);