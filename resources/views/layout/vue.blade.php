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
    <link rel="stylesheet" href="/styles/common.css">
    <script src="/scripts/jquery.min.js"></script>
    <script src="/scripts/jquery.cookie.js"></script>
    <script src="/scripts/underscore.min.js"></script>
    <script src="/scripts/bootstrap.min.js"></script>
    <script src="/scripts/vue.min.js"></script>
    <script src="/scripts/vue.component.js"></script>
    <script src="/scripts/kendo.all.min.js"></script>
    <script src="/scripts/kendo.culture.zh-CN.min.js"></script>
    <script src="/scripts/kendo.messages.zh-CN.min.js"></script>
    <script src="/scripts/prototype.js"></script>
    <script src="/scripts/plugins/ajax.js"></script>
    <script src="/scripts/plugins/dialog.js"></script>
    @yield('page-head')
</head>
<body>
<div id="app">
    <view-header></view-header>
    <div class="view-body">
        <view-side-nav actived="0"></view-side-nav>
        <div class="view-container">
            @yield('content')
        </div>
    </div>
</div>
@yield('body-script')
</body>
</html>
