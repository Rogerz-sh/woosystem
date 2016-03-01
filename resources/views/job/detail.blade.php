@extends('layout.header')
@section('title', '新增职位')
@section('content')
    <div class="wrap bg-white padding-15 margin-top-20 margin-bottom-50 bordered border-color-orange">
        <div class="container-fluid">
            <div class="row">
                <ul class="breadcrumb">
                    <li><a href="/dashboard/">首页</a></li>
                    <li><a href="/job/list">职位管理</a></li>
                    <li>新增职位</li>
                </ul>
            </div>
            <div class="row">
                <form name="form" class="form form-horizontal" onsubmit="return false" novalidate>
                    <blockquote>
                        <p>职位基本信息</p>
                    </blockquote>
                    <div class="form-group">
                        <label class="control-label col-xs-2"><span class="red">*</span> 职位名称</label>
                        <div class="col-xs-10">
                            <label class="form-control-static">{{$job->name}}</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-xs-2"><span class="red">*</span> 所属企业</label>
                        <div class="col-xs-10">
                            <label class="form-control-static">{{$job->company_name}}</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">所在地区</label>
                            <div class="col-xs-8">
                                <label class="form-control-static">{{$job->area}}</label>
                            </div>
                        </div>
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">年薪范围</label>
                            <div class="col-xs-8">
                                <label class="form-control-static">{{$job->salary}}万</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">工作年限</label>
                            <div class="col-xs-8">
                                <label class="form-control-static">{{$job->year}}年</label>
                            </div>
                        </div>
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">年龄要求</label>
                            <div class="col-xs-8">
                                <label class="form-control-static">{{$job->age}}岁</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">学历要求</label>
                            <div class="col-xs-8">
                                <label class="form-control-static">{{$job->degree}}</label>
                            </div>
                        </div>
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">性别要求</label>
                            <div class="col-xs-8">
                                <label class="form-control-static">{{$job->sex}}</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">招聘人数</label>
                            <div class="col-xs-8">
                                <label class="form-control-static">{{$job->number}}人</label>
                            </div>
                        </div>
                        <div class="col-xs-6 no-padding error-box">
                            <label class="control-label col-xs-4">岗位类别</label>
                            <div class="col-xs-8">
                                <label class="form-control-static">{{$job->type}}</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-xs-2">岗位职责</label>
                        <div class="col-xs-10">
                            <pre>{!! nl2br($job->duty) !!}</pre>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-xs-2"><span class="red">*</span> 任职要求</label>
                        <div class="col-xs-10">
                            <pre>{!! nl2br($job->request) !!}</pre>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-10 col-xs-offset-2">
                            <a href="/job/list" class="btn btn-default size-mini">返回</a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
@stop