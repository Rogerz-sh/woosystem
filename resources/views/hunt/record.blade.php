@extends('layout.header')
@section('title', '寻访详情')
@section('content')
    <div class="wrap bg-white padding-15  margin-top-20 margin-bottom-50 bordered border-color-orange" ng-controller="huntController">
        <div class="container-fluid">
            <div class="row">
                <ul class="breadcrumb">
                    <li><a href="/dashboard/">首页</a></li>
                    <li><a href="/hunt/list">寻访管理</a></li>
                    <li>寻访详情</li>
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
                            <label class="form-control-static">{{$hunt->name}}</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-xs-2"><span class="red">*</span> 岗位名称</label>
                        <div class="col-xs-10">
                            <label class="form-control-static">{{$hunt->job_name}}</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4"><span class="red">*</span> 业务员</label>
                            <div class="col-xs-8">
                                <label class="form-control-static">{{$hunt->company_name}}</label>
                            </div>
                        </div>
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4"><span class="red">*</span> 接入日期</label>
                            <div class="col-xs-8">
                                <label class="form-control-static">{{$hunt->date}}</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">寻访费用</label>
                            <div class="col-xs-8">
                                <label class="form-control-static">{{$hunt->price}}</label>
                            </div>
                        </div>
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">状态</label>
                            <div class="col-xs-8">
                                <label class="form-control-static">{{$hunt->status}}</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-xs-2">备注</label>
                        <div class="col-xs-10">
                            <label class="form-control-static">{{$hunt->description}}</label>
                        </div>
                    </div>
                </form>
                <blockquote>
                    <p>操作记录</p>
                </blockquote>
                <ul class="list-group">
                    <li class="list-group-item" ng-repeat="rcd in records track by $index">
                        <p>
                            <span ng-bind="rcd.user_name" class="bold orange"></span>
                            <span class="pull-right" ng-if="rcd.user_id == user_id">
                                <a ng-click="delRecord($index)" class="red underline"><small>删除这条记录</small></a>
                            </span>
                        </p>
                        <pre ng-bind="rcd.text" class="padding-20"></pre>
                        <div class="text-right">记录时间： <span ng-bind="rcd.created_at"></span></div>
                    </li>
                    <li class="list-group-item list-group-item-warning">
                        <form action="" class="form" name="recForm">
                        <textarea ng-model="record.text" cols="30" rows="5" class="form-control" required></textarea>
                        <div class="text-right margin-top-10"><button class="btn btn-default" ng-disabled="recForm.$invalid" ng-click="addRecord()">添加记录</button></div>
                        </form>
                    </li>
                </ul>
                <blockquote>
                    <p>附件列表</p>
                </blockquote>
                <div class="col-xs-12 bordered border-color-gray no-padding">
                    <div id="grid"></div>
                </div>
            </div>
        </div>
    </div>
@stop
@section('body-script')
    <script>
        $(function () {

            var hunt_id = {{$hunt->id}};

            $('#grid').kendoGrid({
                dataSource: {
                    transport: {
                        read: {
                            url: '/hunt/file-list?hunt_id='+hunt_id
                        }
                    },
                    pageSize: 10,
                    schema: {
                        model: {
                            id: 'id'
                        }
                    },
                    filter: {field: 'deleted', operator: 'neq', value: true}
                },
                toolbar: [
                    {
                        template: '<a class="btn btn-success" id="addFile">添加附件</a>'
                    }
                ],
                columns: [
                    {field: 'id', title: 'ID'},
                    {field: 'path', title: '文件名称', template: getFileName},
                    {field: 'desc', title: '备注'},
                    {field: 'created_at', title: '上传时间'},
                    {title: '操作', template: '<a href="/hunt/download-file/?path=#:path#&name=#:path.split(\'/\').pop()#" class="btn btn-info btn-sm" title="下载文件"><i class="fa fa-download"></i></a>' +
                    ' <a href="/hunt/delete-file/?id=#:id#&path=#:path#" class="btn btn-danger btn-sm" title="删除文件"><i class="fa fa-trash-o"></i></a>', width: 140}
                ],
                scrollable: false,
                pageable: true,

            });

            function getFileName(item) {
                return '<a href="'+item.path+'">'+item.path.split('/').pop()+'</a>';
            }

            var dialog = $.$modal.dialog({
                title: '添加附件',
                size: 'lg',
                content: '<form name="dlgForm" class="form form-horizontal" onsubmit="return false" novalidate>' +
                            '<div class="form-group">' +
                                '<label class="control-label col-xs-2"><span class="red">*</span> 上传附件</label>' +
                                '<div class="col-xs-10">' +
                                    '<input type="file" class="form-control" id="file"><input type="hidden" id="filePath">' +
                                '</div>' +
                            '</div>' +
                            '<div class="form-group">' +
                                '<label class="control-label col-xs-2">文件备注</label>' +
                                '<div class="col-xs-10">' +
                                    '<textarea id="fileDesc" rows="5" class="form-control"></textarea>' +
                                '</div>' +
                            '</div>' +
                        '</form>',
                footer: {
                    buttons: [
                        {
                            name: 'ok',
                            handler: function () {
                                var self = this, dom = this.dom;
                                var filePath = dom.find('#filePath').val(), fileDesc = dom.find('#fileDesc').val();
                                if (filePath == '') return;
                                $.$ajax.post('/hunt/add-file', {hunt_id: hunt_id, filePath: filePath, fileDesc: fileDesc}, function (res) {
                                    if (~~res) {
                                        self.hide();
                                        $.$modal.alert('文件保存成功', function () {
                                            $('#grid').data('kendoGrid').dataSource.read();
                                        });
                                    }
                                });
                            }
                        },
                        {
                            name: 'cancel',
                            handler: function () {
                                this.hide();
                            }
                        }
                    ]
                },
                onLoaded: function () {
                    var dom = this.dom;
                    dom.find('#file').kendoUpload({
                        async: {
                            saveUrl: '/file/upload?_token={{csrf_token()}}',
                            saveField: 'file',
                        },
                        success: function (e) {
                            console.log(e);
                            dom.find('#filePath').val(e.response);
                        },
                        complete: function (e) {
                            console.log('complete');
                        }
                    });
                },
                onShown: function () {
                    this.dom.find('form').trigger('reset');
                }
            });

            $('#grid').delegate('#addFile', 'click', function () {
                dialog.show();
            });

            $('select').kendoDropDownList();
        });
    </script>
    <script>
        (function () {
            var app = window.RZ.app;

            var hunt_id = {{$hunt->id}}, sessionId = {{Session::get('id')}}, sessionNickname = '{{Session::get('nickname')}}';

            app.controller('huntController', ['$scope', '$http', function ($scope, $http) {
                $scope.records = [];

                $http.get('/hunt/record-list?hunt_id='+hunt_id).success(function (res) {
                    $scope.records = res;
                });

                $scope.user_id = sessionId;

                var newRecord = {
                    hunt_id: hunt_id,
                    user_id: sessionId,
                    user_name: sessionNickname,
                    text: '',
                };

                $scope.record = $.extend({}, newRecord);

                $scope.delRecord = function (idx) {
                    $scope.records.splice(idx, 1);
                };

                $scope.addRecord = function () {

                    $http.post('/hunt/add-record', {record: $scope.record}).success(function (res) {
                        if (res && res.id) {
                            $scope.record.id = res.id;
                            $scope.record.created_at = res.created_at;
                            $scope.records.push($.extend({}, $scope.record));
                            $scope.record = $.extend({}, newRecord);
                        }
                    });
                }
            }])
        })();
    </script>
@stop