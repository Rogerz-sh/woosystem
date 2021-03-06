@extends('layout.header')
@section('title', '企业管理')
@section('content')
    <div class="wrapper bg-white padding-15 margin-top-20 margin-bottom-50 box-shadow">
        <div class="container-fluid">
            <div class="row">
                <ul class="breadcrumb">
                    <li><a href="/dashboard/">首页</a></li>
                    <li>企业管理</li>
                </ul>
            </div>
            <div class="row margin-bottom-10">
                <div class="col-xs-1"><a href="/company/create" class="btn btn-success"><i class="fa fa-plus"></i> 添加企业</a></div>
            </div>
            <div class="row">
                <div class="col-xs-12">
                    <div id="grid"></div>
                </div>
            </div>
        </div>
    </div>
    <script src="/scripts/company/list.js"></script>
@stop