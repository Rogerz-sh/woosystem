@extends('layout.header')
@section('title', '新增寻访记录')
@section('content')
    <div class="wrap bg-white padding-15  margin-top-20 margin-bottom-50 bordered border-color-orange" ng-controller="huntController">
        <div class="container-fluid">
            <div class="row">
                <ul class="breadcrumb">
                    <li><a href="/dashboard/">首页</a></li>
                    <li><a href="/hunt/list">寻访管理</a></li>
                    <li>新增寻访记录</li>
                </ul>
            </div>
            <div class="row">
                <form name="form" class="form form-horizontal" onsubmit="return false" novalidate>
                    <blockquote>
                        <p>基本信息</p>
                    </blockquote>
                    <div class="form-group">
                        <label class="control-label col-xs-2"><span class="red">*</span> 业务编号</label>
                        <div class="col-xs-10">
                            <div class="input-group">
                                <input type="text" ng-model="hunt.name" readonly class="form-control" required />
                                <span class="input-group-btn"><button class="btn btn-default" ng-click="getId()" ng-disabled="hunt.name">生成ID</button></span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-xs-2"><span class="red">*</span> 岗位名称</label>
                        <div class="col-xs-10">
                            <select kendo-drop-down-list k-options="config.company" ng-model="hunt.job_id" class="form-control size-full" required></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4"><span class="red">*</span> 业务员</label>
                            <div class="col-xs-8">
                                <input ng-model="hunt.user" type="text" class="form-control" required>
                            </div>
                        </div>
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4"><span class="red">*</span> 接入日期</label>
                            <div class="col-xs-8">
                                <input kendo-date-picker k-options="config.datepicker" ng-model="hunt.date" type="text" class="form-control size-full" required>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">寻访费用</label>
                            <div class="col-xs-8">
                                <div class="input-group">
                                    <input ng-model="hunt.price" type="text" class="form-control">
                                    <span class="input-group-addon">%</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">状态</label>
                            <div class="col-xs-8">
                                <select kendo-drop-down-list ng-model="hunt.status" class="size-full">
                                    <option value="进行中">进行中</option>
                                    <option value="已暂停">已暂停</option>
                                    <option value="已结束">已结束</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-xs-2">备注</label>
                        <div class="col-xs-10">
                            <textarea ng-model="hunt.description" rows="6" class="form-control"></textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-10 col-xs-offset-2">
                            <button class="btn btn-success col-xs-2" ng-click="saveBdInfo()" ng-disabled="form.$invalid">保存</button>
                            <button class="btn btn-danger col-xs-2 margin-left-20">取消</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
@stop
@section('body-script')
    <script>
        $(function () {
            $('#file').kendoUpload({
                async: {
                    saveUrl: '/file/upload?_token={{csrf_token()}}',
                    saveField: 'file',
                    withCredentials: true
                }
            });

            $('select').kendoDropDownList();
        });
    </script>
    <script>
        (function () {
            var app = window.RZ.app;

            app.controller('huntController', ['$scope', '$http', function ($scope, $http) {
                $scope.config = {
                    datepicker: {
                        culture: 'zh-CN',
                        format: 'yyyy-MM-dd',
                        value: Date.translate('now')
                    },
                    company: {
                        dataSource: {
                            transport: {
                                read: {
                                    url: '/hunt/json-job-list-data',
                                    dataType: 'json'
                                }
                            }
                        },
                        optionLabel: '请选择要操作的岗位...',
                        filter: 'startswith',
                        delay: 500,
                        dataTextField: 'name',
                        dataValueField: 'id',
                        template: '#:name# (#:company_name#)',
                        change: function () {
                            var item = this.dataItem();
                            $scope.hunt.job_name = item.name;
                            $scope.hunt.company_id = item.company_id;
                            $scope.hunt.company_name = item.company_name;
                        }
                    }
                };

                $scope.hunt = {
                    name: '',
                    job_id: '',
                    job_name: '',
                    company_id: '',
                    company_name: '',
                    user: '',
                    date: '',
                    price: '',
                    status: '',
                    description: ''
                };

                $scope.getId = function () {
                    var now = new Date(), timeStr = now.toLocaleDateString() + ' 0000 ' + now.toTimeString();
                    var id = 'J' + timeStr.match(/\d+/g).splice(0, 7).join('') + ('00000' + ~~(Math.random()*10)).substr(-5);
                    $scope.hunt.name = id;
                };

                $scope.saveBdInfo = function () {
                    console.log($scope.hunt);
                    //return;
                    $http.post('/hunt/save-info', {hunt: $scope.hunt}).success(function (res) {
                        if (~~res) $.$modal.alert('保存成功', function () {
                            location.href = '/hunt/list';
                        });
                    });
                }
            }])
        })();
    </script>
@stop