@extends('layout.header')
@section('title', '职位列表')
@section('content')
    <div class="wrapper bg-white padding-15 margin-top-20 margin-bottom-50">
        <div class="container-fluid">
            <div class="row">
                <ul class="breadcrumb">
                    <li><a href="/dashboard/">首页</a></li>
                    <li>职位列表</li>
                </ul>
            </div>
            <div class="row margin-bottom-10">
                <div class="col-xs-1"><a href="/job/create" class="btn btn-success"><i class="fa fa-plus"></i> 新增职位</a></div>
            </div>
            <div class="row">
                <div class="col-xs-12">
                    <div id="grid"></div>
                </div>
            </div>
        </div>
    </div>
    <script src="/scripts/job/index.js"></script>
@stop