<?php
use Illuminate\Support\Facades\Session;
$name = Session::get('name');
$navData = Session::get('navData');
$menus = $navData['menus'];
$submenus = $navData['submenus'];
?>
<!DOCTYPE html>
<html>
<head>
    <title>@yield('title')</title>
    <meta name="_token" content="{{csrf_token()}}">
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
    <script src="/scripts/kendo.all.min.js"></script>
    <script src="/scripts/kendo.culture.zh-CN.min.js"></script>
    <script src="/scripts/kendo.messages.zh-CN.min.js"></script>
    <script src="/scripts/prototype.js"></script>
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
            <div class="float-right">
                <div id="user">
                    <p class="orange bold">{{ $name }}</p>
                    <img src="/images/logo.jpg" alt="照片" />
                    <a href="/account/logout">退出</a>
                </div>
            </div>
            <div class="clear"></div>
        </div>
    </div>
    <div id="nav">
        <div class="padding-left-50 padding-right-50">
            <ul class="nav-list">
                @foreach($menus as $menu)
                    <li>
                        {{--@if(count($submenus[$menu->id]) > 0)--}}
                            {{--<a>{{$menu->label}} <span class="caret"></span></a>--}}
                            {{--<ul class="sub-nav">--}}
                            {{--@foreach($submenus[$menu->id] as $sub)--}}
                                {{--<li><a href="{{$sub->url}}">{{$sub->label}}</a></li>--}}
                            {{--@endforeach--}}
                            {{--</ul>--}}
                        {{--@else--}}
                            <a href="{{$menu->url}}">{{$menu->label}}</a>
                        {{--@endif--}}
                    </li>
                @endforeach
            </ul>
        </div>
    </div>
    @yield('content')
</div>
<script src="/scripts/main.js"></script>
@yield('body-script')
<script>
    $(function () {
        var navIndex = {{$navIndex}};
        $('.nav-list>li').eq(navIndex).addClass('active');
    });
</script>
</body>
</html>
