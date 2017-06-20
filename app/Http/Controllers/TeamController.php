<?php
/**
 * Created by PhpStorm.
 * User: roger
 * Date: 15/10/26
 * Time: 下午4:08
 */
namespace App\Http\Controllers;

use App\HuntFace;
use App\HuntReport;
use App\HuntSuccess;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class TeamController extends BaseController {

    public function getRecentFaceList() {
        $face = HuntFace::select(DB::raw('*, (select nickname from users where users.id = hunt_face.created_by) as nickname'))->whereRaw('datediff(now(), date) < 30')->orderBy('date', 'desc')->get();
        return response($face);
    }

    public function getRecentOfferList() {
        $offer = HuntReport::select(DB::raw('*, (select nickname from users where users.id = hunt_report.created_by) as nickname'))->where('type', 'offer')
            ->whereRaw('datediff(now(), date) < 30')->orderBy('date', 'desc')->get();
        return response($offer);
    }

    public function getRecentSuccessList() {
        $offer = HuntSuccess::select(DB::raw('*, (select nickname from users where users.id = hunt_success.created_by) as nickname'))->whereRaw('datediff(now(), date) < 30')->orderBy('date', 'desc')->get();
        return response($offer);
    }
}
