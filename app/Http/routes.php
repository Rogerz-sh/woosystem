<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function() {
    return view('user.login');
});

Route::controller('user', 'UserController');

Route::controller('account', 'AccountController');

//Route::controller('system', 'SystemController');


Route::group(['middleware' => 'login'], function () {

    Route::controller('dashboard', 'DashboardController');

    Route::controller('company', 'CompanyController');

    Route::controller('job', 'JobController');

    Route::controller('candidate', 'CandidateController');

    Route::controller('record', 'RecordController');

    Route::controller('bd', 'BdController');

    Route::controller('hunt', 'HuntController');

    Route::controller('file', 'FileController');

    Route::controller('performance', 'PerformanceController');

    Route::controller('result', 'ResultController');

    Route::controller('team', 'TeamController');

});
