@extends('layout.vue')
@section('content')
    <div class="flex full-height">
        <view-container-side-nav></view-container-side-nav>
        <div class="flex-1">
            <ul>
                <li v-for="person in persons" is="view-person-list-item" :person="person"></li>
            </ul>
        </div>
    </div>
@stop
@section('body-script')
<script src="/scripts/vue/persons/main.js"></script>
@stop