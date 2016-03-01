<?php
/**
 * Created by PhpStorm.
 * User: roger
 * Date: 15/11/27
 * Time: 下午4:39
 */
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Http\Middleware\Authenticate;
use Illuminate\Routing\Controller as BaseController;
use App\SuggestCompany;
use Illuminate\Support\Facades\DB;
use App\Candidate;


class CandidateController extends BaseController {

    public function getIndex () {
        return view('candidate.index')->with('navIndex', 2);
    }

    public function getJsonListData() {
        $candidate = Candidate::all();
        return response($candidate);
    }

    public function getCreate() {
        return view('candidate.create')->with('navIndex', 2);
    }

    public function getView ($id) {
        return view('candidate.detail')->with('navIndex', 2)->with('id', $id);
    }

    public function getSuggestCompany() {
        $filter = request()->input('filter');
        $key = $filter['filters'][0]['value'].'%';
        if (strlen($key) < 2) {
            $suggest = array();
        } else {
            $suggest = DB::table('suggest_company')->whereRaw('name like ?', [$key])->take(10)->get();
        }
        return response($suggest);
    }

    public function getSuggestSchool() {
        $filter = request()->input('filter');
        $key = $filter['filters'][0]['value'].'%';
        if (strlen($key) < 2) {
            $suggest = array();
        } else {
            $suggest = DB::table('suggest_school')->whereRaw('name like ?', [$key])->take(10)->get();
        }
        return response($suggest);
    }

    public function postCreateBasic() {

    }
}