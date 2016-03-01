/**
 * Created by roger on 16/1/15.
 */
(function (window) {
    var app = window.RZ.app;

    app.service('personModel', [function () {
        this.getNewPerson = function () {
            return {
                name: '',
                sex: '男',
                age: '',
                year: '',
                email: '',
                tel: '',
                degree: '',
                marry: '',
                location: {
                    p: '上海',
                    c: '上海'
                },
                belong: {
                    p: '上海',
                    c: '上海'
                },
                companys: [],
                schools: [],
                trainings: [],
                keywords: '',
                appraise: ''
            }
        };

        this.getNewCompany = function () {
            return {
                company_name: '',
                start_time: '',
                end_time: '',
                salary: '',
                job: '',
                depart: '',
                master: '',
                slave: '',
                description: ''
            }
        };

        this.getNewSchool = function () {
            return {
                school_name: '',
                start_time: '',
                end_time: '',
                degree: '',
                profession: '',
                is_usual: '是'
            }
        };

        this.getNewTraining = function () {
            return {
                train_name: '',
                start_time: '',
                end_time: '',
                company_name: '',
                description: ''
            }
        };
    }]);

    app.service('companyModel', ['$http', function ($http) {
        this.getNewCompany = function () {
            return {
                //id: '',
                name: '',
                location: {
                    p: '上海',
                    c: '上海'
                },
                scale: '',
                industry: '',
                type: '',
                introduce: '',
                contact: '',
                tel: '',
                email: '',
                other: '',
                description: ''
            }
        };

        this.getCompanyInfo = function (id, callback) {
            if (!id || !_.isNumber(id)) {
                callback(this.getNewCompany());
            } else {
                $http.get('/company/company-json-data/', {params: {id: id}}).success(function (res) {
                    callback(res);
                });
            }
        }
    }]);

    app.service('jobModel', ['$http', function ($http) {
        this.getNewJob = function () {
            return {
                company_id: 0,
                company_name: '',
                location: {
                    p: '上海',
                    c: '上海'
                },
                salarys: {
                    s: '',
                    e: ''
                },
                years: {
                    s: '',
                    e: ''
                },
                ages: {
                    s: '',
                    e: ''
                },
                degree: '',
                sex: '女',
                number: '',
                type: '',
                duty: '',
                request: ''
            }
        };

        this.getJobInfo = function (id, callback) {
            if (!id || !_.isNumber(id)) {
                callback(this.getNewJob());
            } else {
                $http.get('/job/job-json-data/', {params: {id: id}}).success(function (res) {
                    var data = res,
                        location = data['area'].split('-'),
                        salarys = data['salary'].split('-'),
                        years = data['year'].split('-'),
                        ages = data['age'].split('-');
                    data.location = {p: location[0], c: location[1]};
                    data.salarys = {s: salarys[0], e: salarys[1]};
                    data.years = {s: years[0], e: years[1]};
                    data.ages = {s: ages[0], e: ages[1]};
                    delete data.area;
                    delete data.salary;
                    delete data.year;
                    delete data.age;
                    callback(data);
                });
            }
        };
    }])
})(window);