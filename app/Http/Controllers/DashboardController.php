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
use App\Invoice;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class DashboardController extends BaseController {

    public function getIndex() {
        return view('user.dashboard')->with('navIndex', 0);
    }

    public function getRecentFaceList() {
        $face = HuntFace::where('created_by', Session::get('id'))
            ->whereRaw('datediff(now(), date) < 30')->orderBy('date', 'desc')->get();
        return response($face);
    }

    public function getRecentOfferList() {
        $offer = HuntReport::where('created_by', Session::get('id'))
            ->where('type', 'offer')
            ->whereRaw('datediff(now(), date) < 30')->orderBy('date', 'desc')->get();
        return response($offer);
    }

    public function getRecentSuccessList() {
        $offer = HuntSuccess::where('created_by', Session::get('id'))
            ->whereRaw('datediff(now(), date) < 30')->orderBy('date', 'desc')->get();
        return response($offer);
    }

    public function getRecentHuntList() {
        $hs = DB::table('hunt_count')->whereRaw('locate(concat(",", ?, ","), concat(",", user_ids, ",")) > 0 and datediff(now(), updated_at) < 30', [Session::get('id')])->orderBy('updated_at', 'desc')->get();

        return response($hs);
    }

    public function getRecentHuntPerson() {
        $hunt = DB::table('hunt_person_status')
            ->join('person', 'hunt_person_status.person_id', '=', 'person.id')
            ->select('hunt_person_status.id', 'person.id as person_id', 'person.name', 'hunt_person_status.company_name', 'hunt_person_status.job_name', 'person.sex', 'person.age', 'person.degree', 'person.tel', 'hunt_person_status.user_name', 'hunt_person_status.updated_at', 'hunt_person_status.reported', 'hunt_person_status.faced', 'hunt_person_status.offered', 'hunt_person_status.succeed')
            ->where('hunt_person_status.user_id', Session::get('id'))
            ->whereRaw('datediff(now(), hunt_person_status.updated_at) < 30')
            ->where('hunt_person_status.deleted_at', null)
            ->orderBy('hunt_person_status.updated_at', 'desc')->get();
        return response($hunt);
    }

    public function getNoticeJsonList() {
        $user_id = Session::get('id');
        $hunt_success = HuntSuccess::where('created_by', $user_id)->whereRaw('datediff(now(), protected) >= -7 and datediff(now(), protected) <= 0')->get();
        $invoice = Invoice::where('request_user', $user_id)->where('status', '未付')->whereRaw('datediff(now(), estimate_date) >= -7 and datediff(now(), estimate_date) <= 30')->get();
        return response([$hunt_success, $invoice]);
    }
}
