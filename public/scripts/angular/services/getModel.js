/**
 * Created by roger on 16/1/15.
 */
(function (window) {
    var app = window.RZ.app;

    app.service('model', ['$http', function ($http) {
        this.getNewPerson = function () {
            return {
                real_id: '',
                source: '',
                web_id: '',
                type: 'basic',
                name: '',
                sex: '男',
                age: '',
                birthday: '',
                year: '',
                email: '',
                tel: '',
                degree: '',
                marry: '单身',
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
                appraise: '',
                file_path: ''
            }
        };

        this.getPersonInfo = function (id, callback) {
            if (!id || !_.isNumber(id)) {
                callback(this.getNewPerson());
            } else {
                var person;
                $http.get('/candidate/person-json-data/', {params: {id: id}}).success(function (p) {
                    person = p;
                    var location = p.location.split('-'), belong = p.belong.split('-');
                    person.location = {p: location[0], c: location[1]};
                    person.belong = {p: belong[0], c: belong[1]};
                    callback(person);
                });
            }
        };

        this.getNewPersonCompany = function () {
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

        this.getNewPersonSchool = function () {
            return {
                school_name: '',
                start_time: '',
                end_time: '',
                degree: '',
                profession: '',
                is_usual: '是'
            }
        };

        this.getNewPersonTraining = function () {
            return {
                train_name: '',
                start_time: '',
                end_time: '',
                company_name: '',
                description: ''
            }
        };

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
        };

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

        this.getNewBd = function () {
            return {
                name: '',
                company_id: '',
                company_name: '',
                user_ids: [],
                user_names: [],
                date: '',
                type: '',
                status: '',
                source: '',
                description: ''
            }
        };

        this.getBdInfo = function (id, callback) {
            if (!id || !_.isNumber(id)) {
                callback(this.getNewJob());
            } else {
                $http.get('/bd/bd-json-data/', {params: {id: id}}).success(function (res) {
                    var data = res;
                    data.user_ids = res.user_ids ? res.user_ids.split(',') : [];
                    data.user_names = res.user_names ? res.user_names.split(',') : [];
                    callback(data);
                });
            }
        };

        this.getNewHunt = function () {
            return {
                name: '',
                job_id: '',
                job_name: '',
                company_id: '',
                company_name: '',
                person_id: '',
                person_name: '',
                date: '',
                salary_month: '',
                salary_year: '',
                status: '',
                description: ''
            }
        };

        this.getHuntInfo = function (id, callback) {
            if (!id || !_.isNumber(id)) {
                callback(this.getNewHunt());
            } else {
                $http.get('/hunt/hunt-json-data/', {params: {id: id}}).success(function (res) {
                    var data = res;
                    data.job_id = data.job_id + '';
                    data.person_id = data.person_id + '';
                    callback(data);
                });
            }
        };

        this.getNewHuntSelect = function () {
            return {
                job_id: '',
                job_name: '',
                user_ids: '',
                user_names: '',
                type: '',
                status: ''
            }
        };

        this.getHuntSelectInfo = function (id, callback) {
            if (!id || !_.isNumber(id)) {
                callback(this.getNewHuntSelect());
            } else {
                $http.get('/hunt/hunt-select-json-data/', {params: {id: id}}).success(function (res) {
                    var data = res;
                    data.user_ids = res.user_ids ? res.user_ids.split(',') : [];
                    data.user_names = res.user_names ? res.user_names.split(',') : [];
                    callback(data);
                });
            }
        };

        this.getUserSession = function () {
            return {
                id: angular.element('meta[name="_sessionId"]').attr('content'),
                name: angular.element('meta[name="_sessionName"]').attr('content'),
                nickname: angular.element('meta[name="_sessionNickname"]').attr('content'),
                power: angular.element('meta[name="_sessionPower"]').attr('content')
            }
        };

        this.getRandomId = function () {
            var now = new Date(), timeStr = now.format() + ' 0000 ' + now.toTimeString();
            var id = timeStr.match(/\d+/g).splice(0, 7).join('') + (('00000' + ~~(Math.random()*10)).substr(-5));
            return id;
        };

        this.getRecordFile = function () {
            return {
                name: '',
                coded: 0,
                path: '',
                desc: ''
            };
        };

        this.getRecordReport = function () {
            return {
                type: 'report',
                filename: '',
                filecoded: 0,
                filepath: '',
                date: (new Date()).format(),
                desc: ''
            };
        };

        this.getRecordNewFace = function () {
            return {
                type: '一面',
                person_id: '',
                person_name: '',
                date: (new Date()).format(),
                time: '00:00',
                job_id: '',
                job_name: '',
                tel: '',
                num: '',
                desc: ''
            }
        };

        this.getRecordSuccess = function () {
            return {
                date: '',
                protected: '',
                job_id: '',
                job_name: '',
                company_id: '',
                company_name: '',
                person_id: '',
                person_name: '',
            }
        }

        this.getRecordOffer = function () {
            return {
                type: 'offer',
                filename: '',
                filecoded: 0,
                filepath: '',
                date: (new Date()).format(),
                desc: ''
            };
        };

        this.getHuntReportInfo = function (id, callback) {
            if (!id || !_.isNumber(id)) {
                callback({});
            } else {
                $http.get('/hunt/hunt-report-json-data/', {params: {hunt_id: id, type: 'report'}}).success(function (res) {
                    callback(res);
                });
            }
        };

        this.getHuntOfferInfo = function (id, callback) {
            if (!id || !_.isNumber(id)) {
                callback({});
            } else {
                $http.get('/hunt/hunt-report-json-data/', {params: {hunt_id: id, type: 'offer'}}).success(function (res) {
                    callback(res);
                });
            }
        };

        this.getUserInfo = function (callback) {
            $http.get('/user/json-user-info/').success(function (res) {
                callback(res);
            });
        }
    }]);

    app.service('token', [function () {
        this.getCsrfToken = function () {
            return angular.element('meta[name="_token"]').attr('content')
        }
    }])
})(window);