<?php
/**
 * Created by PhpStorm.
 * User: roger
 * Date: 15/10/26
 * Time: 下午4:08
 */
namespace App\Http\Controllers;

use App\Bd;
use App\Candidate;
use App\Hunt;
use App\HuntFace;
use App\HuntReport;
use App\Job;
use App\MonthTarget;
use App\User;
use App\HuntSuccess;
use App\Invoice;
use App\ResultTarget;
use App\ResultUser;
use App\Belongs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class VPersonController extends BaseController {

    public function getIndex() {
        return view('vue.persons');
    }

    public function getVuePersonList() {
        $limit = request()->input('limit');
        $skip = request()->input('skip');

        $persons = Candidate::orderBy('created_at', 'desc')->skip($skip)->take($limit)->get();

        return response($persons);
    }

}
