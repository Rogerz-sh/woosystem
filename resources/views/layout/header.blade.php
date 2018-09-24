<?php
use Illuminate\Support\Facades\Session;
$sessionId = Session::get('id');
$sessionName = Session::get('name');
$sessionNickname = Session::get('nickname');
$sessionPower = Session::get('power');

?>
<!DOCTYPE html>
<html>
<head>
    <title>@yield('title')</title>
    <meta name="_token" content="{{csrf_token()}}">
    <meta name="_sessionId" content="{{$sessionId}}">
    <meta name="_sessionName" content="{{$sessionName}}">
    <meta name="_sessionNickname" content="{{$sessionNickname}}">
    <meta name="_sessionPower" content="{{$sessionPower}}">
    <link rel="stylesheet" href="/styles/bootstrap.min.css">
    <link rel="stylesheet" href="/styles/bootstrap.replace.css">
    <link rel="stylesheet" href="/styles/font-awesome.min.css">
    <link rel="stylesheet" href="/styles/kendo.common-bootstrap.min.css">
    <link rel="stylesheet" href="/styles/kendo.bootstrap.min.css">
    <link rel="stylesheet" href="/styles/kendo.dataviz.min.css">
    <link rel="stylesheet" href="/styles/kendo.dataviz.bootstrap.min.css">
    <link rel="stylesheet" href="/styles/kendo.replace.css">
    <link rel="stylesheet" href="/styles/style.css">
    <link rel="stylesheet" href="/styles/main.css">
    <script src="/scripts/jquery.min.js"></script>
    <script src="/scripts/jquery.cookie.js"></script>
    <script src="/scripts/underscore.min.js"></script>
    <script src="/scripts/bootstrap.min.js"></script>
    <script src="/scripts/vue.min.js"></script>
    <script src="/scripts/vue.component.js"></script>
    <script src="/scripts/angular.min.js"></script>
    <script src="/scripts/angular-route.min.js"></script>
    <script src="/scripts/angular-sanitize.min.js"></script>
    <script src="/scripts/kendo.all.min.js"></script>
    <script src="/scripts/kendo.culture.zh-CN.min.js"></script>
    <script src="/scripts/kendo.messages.zh-CN.min.js"></script>
    <script src="/scripts/prototype.js"></script>
    <script src="/scripts/plugins/ajax.js"></script>
    <script src="/scripts/plugins/dialog.js"></script>

    <!--[if lt IE 9]><script src="/scripts/html5shiv.min.js"></script><![endif]-->
    <!--[if lte IE 8]><script src="/scripts/selectivizr.js"></script><![endif]-->
    @yield('page-head')
</head>
<body>
<div id="loading">
    <div class="circle animation"></div>
    <div class="circle text"></div>
</div>
<div class="wrapper">
    <div id="header" class="bg-white">
        <div class="padding-left-50 padding-right-50">
            <div class="float-left orange"><h2 class="float-left"><i class="fa fa-cog"></i> 即沃客户申报管理系统</h2></div>
            <div class="float-left blue margin-left-50 margin-top-20"><h4 class="float-left bold"><i class="fa fa-info-circle"></i> 即沃，中国领先的猎头服务机构，一站式招聘解决方案的提供商。</h4></div>
            <div class="float-right">
                <div id="user" ng-controller="userInfoController">
                    <p class="orange bold">{{ $sessionNickname }}</p>
                    <img ng-show="pic_path" ng-src="@{{pic_path}}" alt="照片" />
                    <a class="btn btn-info btn-xs margin-left-10" href="#/user/info"><i class="fa fa-user"></i> 个人资料</a>
                    <a class="btn btn-danger btn-xs margin-left-10" href="/account/logout"><i class="fa fa-sign-out"></i> 退出</a>
                </div>
            </div>
            <div class="clear"></div>
        </div>
    </div>
    <div id="nav">
        <div class="padding-left-50 padding-right-50">
            {{--<ul class="nav-list">--}}
                {{--@foreach($menus as $menu)--}}
                    {{--<li>--}}
                        {{--@if(count($submenus[$menu->id]) > 0)--}}
                        {{--<a>{{$menu->label}} <span class="caret"></span></a>--}}
                        {{--<ul class="sub-nav">--}}
                        {{--@foreach($submenus[$menu->id] as $sub)--}}
                        {{--<li><a href="{{$sub->url}}">{{$sub->label}}</a></li>--}}
                        {{--@endforeach--}}
                        {{--</ul>--}}
                        {{--@else--}}
                        {{--<a href="{{$menu->url}}">{{$menu->label}}</a>--}}
                        {{--@endif--}}
                    {{--</li>--}}
                {{--@endforeach--}}
            {{--</ul>--}}
            <nav-bar :nav-index="navIndex"></nav-bar>
        </div>
    </div>
    {{--@yield('content')--}}
    <div ng-view></div>
    <div class="notice-container">
        <div class="notice-content">
            <ul class="notice-list"></ul>
        </div>
        <div class="notice-handler">系<br>统<br>通<br>知</div>
    </div>
</div>
<script src="/scripts/angular/ng-bootstrap.js"></script>
<script src="/scripts/angular/ng-controller.js"></script>
<script src="/scripts/angular/ng-route.js"></script>
<script src="/scripts/angular/directives/common.js"></script>
<script src="/scripts/angular/services/getModel.js"></script>
<script src="/scripts/main.js"></script>
@yield('body-script')
</body>
</html>
