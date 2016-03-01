<?php
/**
 * Created by PhpStorm.
 * User: roger
 * Date: 15/10/26
 * Time: 下午4:08
 */
namespace App\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;

class DashboardController extends BaseController {

    public function getIndex() {
        return view('user.dashboard')->with('navIndex', 0);
    }

}
