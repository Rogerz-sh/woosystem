@extends('layout.header')
@section('title', '企业详情')
@section('content')
    <div class="wrap bg-white padding-15 margin-top-20 margin-bottom-50 bordered border-color-orange">
        <div class="container-fluid">
            <div class="row">
                <ul class="breadcrumb">
                    <li><a href="/dashboard/">首页</a></li>
                    <li><a href="/company/list">企业管理</a></li>
                    <li>企业详情</li>
                </ul>
            </div>
            <div class="row">
                <form id="form" name="companyForm" action="" class="form form-horizontal" onsubmit="return false" novalidate>
                    <blockquote>
                        <p>基本信息</p>
                    </blockquote>
                    <div class="form-group">
                        <label class="control-label col-xs-2"><span class="red">*</span> 公司名称</label>
                        <div class="col-xs-10">
                            <label class="form-control-static">{{$company->name}}</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">所在地区</label>
                            <div class="col-xs-8">
                                <label class="form-control-static">{{$company->area}}</label>
                            </div>
                        </div>
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">公司规模</label>
                            <div class="col-xs-8">
                                <label class="form-control-static">{{$company->scale}}</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">所属行业</label>
                            <div class="col-xs-8">
                                <label class="form-control-static">{{$company->industry}}</label>
                            </div>
                        </div>
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">公司性质</label>
                            <div class="col-xs-8">
                                <label class="form-control-static">{{$company->type}}</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-xs-2">企业简介</label>
                        <div class="col-xs-10">
                            <pre>{!! nl2br($company->introduce) !!}</pre>
                        </div>
                    </div>
                    <blockquote>
                        <p>联系人信息</p>
                    </blockquote>
                    <div class="form-group">
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4"><span class="red">*</span> 联系人</label>
                            <div class="col-xs-8">
                                <label class="form-control-static">{{$company->contact}}</label>
                            </div>
                        </div>
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4"><span class="red">*</span> 联系电话</label>
                            <div class="col-xs-8">
                                <label class="form-control-static">{{$company->tel}}</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">电子邮箱</label>
                            <div class="col-xs-8">
                                <label class="form-control-static">{{$company->email}}</label>
                            </div>
                        </div>
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">QQ/其它</label>
                            <div class="col-xs-8">
                                <label class="form-control-static">{{$company->other}}</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-xs-2">备注信息</label>
                        <div class="col-xs-10">
                            <pre>{!! nl2br($company->description) !!}</pre>

                        </div>
                    </div>
                    <blockquote>
                        <p>职位列表</p>
                    </blockquote>
                    <div id="grid"></div>
                    <div class="form-group">
                        <div class="col-xs-10 col-xs-offset-2">
                            <a href="/company/list" class="btn btn-default size-mini">返回</a>
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
            $('#grid').kendoGrid({
                dataSource: {
                    data: [],
                    pageSize: 10,
                    schema: {
                        model: {
                            id: 'id'
                        }
                    },
                    filter: {field: 'deleted', operator: 'neq', value: true}
                },
                columns: [
                    {field: 'id', title: 'ID'},
                    {field: 'name', title: '职位名称'},
                    {field: 'area', title: '工作地点'},
                    {field: 'salary', title: '岗位薪资'},
                    {field: 'updated_at', title: '更新时间', template: getDate},
                    {title: '操作', template: '<a href="/job/edit/#:id#" class="btn btn-default btn-sm"><i class="fa fa-pencil"></i></a> ' +
                    '<a href="/job/detail/#:id#" class="btn btn-info btn-sm"><i class="fa fa-search"></i></a> ' +
                    '<a data-id="#:id#" class="btn btn-danger btn-sm"><i class="fa fa-trash-o"></i></a>', width: 140}
                ],
                scrollable: false,
                pageable: true,

            });

            function getDate(item) {
                return new Date(item.updated_at.replace(/-/g, '/')).format();
            }

            $.$ajax.get('/job/json-job-list-data', function (res) {
                $('#grid').data('kendoGrid').dataSource.data(res);
            });
        });
    </script>
@stop