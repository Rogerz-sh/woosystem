@extends('layout.header')
@section('title', '修改BD记录')
@section('content')
    <div class="wrap bg-white padding-15  margin-top-20 margin-bottom-50 bordered border-color-orange" ng-controller="bdController">
        <div class="container-fluid">
            <div class="row">
                <ul class="breadcrumb">
                    <li><a href="/dashboard/">首页</a></li>
                    <li><a href="/bd/list">BD管理</a></li>
                    <li>修改BD记录</li>
                </ul>
            </div>
            <div class="row">
                <form name="form" class="form form-horizontal" onsubmit="return false" novalidate>
                    <blockquote>
                        <p>基本信息</p>
                    </blockquote>
                    <div class="form-group">
                        <label class="control-label col-xs-2"><span class="red">*</span> BD编号</label>
                        <div class="col-xs-10">
                            <div class="input-group">
                                <input type="text" ng-model="bd.name" readonly class="form-control" required />
                                <span class="input-group-btn"><button class="btn btn-default" ng-click="getBdId()" disabled>生成ID</button></span>
                                <input type="hidden" ng-model="bd.id">
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-xs-2"><span class="red">*</span> 企业名称</label>
                        <div class="col-xs-10">
                            <select kendo-drop-down-list k-options="config.company" ng-model="bd.company_id" class="form-control size-full" disabled required></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4"><span class="red">*</span> 业务员</label>
                            <div class="col-xs-8">
                                <input ng-model="bd.user" type="text" class="form-control" required>
                            </div>
                        </div>
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4"><span class="red">*</span> 接入日期</label>
                            <div class="col-xs-8">
                                <input kendo-date-picker k-options="config.datepicker" ng-model="bd.date" type="text" class="form-control size-full" required>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">业务意向</label>
                            <div class="col-xs-8">
                                <select ng-model="bd.type" class="form-control size-full">
                                    <option value="猎头服务" selected>猎头服务</option>
                                    <option value="极速猎车">极速猎车</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">状态</label>
                            <div class="col-xs-8">
                                <select kendo-drop-down-list ng-model="bd.status" class="size-full">
                                    <option value="进行中" selected>进行中</option>
                                    <option value="已暂停">已暂停</option>
                                    <option value="已结束">已结束</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-xs-2">备注</label>
                        <div class="col-xs-10">
                            <textarea ng-model="bd.description" rows="6" class="form-control"></textarea>
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

            $('select').kendoDropDownList();
        });
    </script>
    <script>
        (function () {
            var app = window.RZ.app;

            app.controller('bdController', ['$scope', '$http', function ($scope, $http) {
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
                            $scope.bd.company_name = item.name;
                        }
                    }
                };

                $scope.bd = {
                    id: {{$bd->id}},
                    name: '{{$bd->name}}',
                    company_id: '{{$bd->company_id}}',
                    company_name: '{{$bd->company_name}}',
                    user: '{{$bd->user}}',
                    date: '{{$bd->date}}',
                    type: '{{$bd->type}}',
                    status: '{{$bd->status}}',
                    description: '{{$bd->description}}'
                }

                $scope.getBdId = function () {
                    var now = new Date(), timeStr = now.toLocaleDateString() + ' 0000 ' + now.toTimeString();
                    var id = 'C' + timeStr.match(/\d+/g).splice(0, 7).join('') + ('00000' + ~~(Math.random()*10)).substr(-5);
                    $scope.bd.name = id;
                }

                $scope.saveBdInfo = function () {
                    console.log($scope.bd);
                    //return;
                    $http.post('/bd/save-edit', {bd: $scope.bd}).success(function (res) {
                        if (~~res) $.$modal.alert('保存成功', function () {
                            location.href = '/bd/list';
                        });
                    });
                }
            }])
        })();
    </script>
@stop