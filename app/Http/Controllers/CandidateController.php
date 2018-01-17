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
use App\Candidate;
use App\Hunt;
use App\HuntFace;
use App\HuntReport;
use App\HuntResult;
use App\HuntSuccess;
use App\PersonCompany;
use App\PersonSchool;
use App\PersonTraining;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;


class CandidateController extends BaseController {

    public function getIndex () {
        return view('candidate.index')->with('navIndex', 2);
    }

    public function getJsonListData() {
        $candidate = Candidate::orderBy('created_at', 'desc')->limit(1000)->get();
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

    public function postSaveNew() {
        $person = request()->input('person');
        $company = request()->input('company');
        $school = request()->input('school');
        $training = request()->input('training');

        $candidate = new Candidate();
        foreach ($person as $key => $value) {
            $candidate->$key = $value;
        }
        $candidate->created_by = Session::get('id');
        $candidate->save();

        if ($person['type'] == 'basic') {
            for ($c = 0; $c < count($company); $c++) {
                $com = $company[$c];
                $perCom = new PersonCompany();
                foreach ($com as $key => $value) {
                    $perCom->$key = $value;
                }
                $perCom->person_id = $candidate->id;
                $perCom->created_by = Session::get('id');
                $perCom->save();
            }
            for ($s = 0; $s < count($school); $s++) {
                $scl = $school[$s];
                $perS = new PersonSchool();
                foreach ($scl as $key => $value) {
                    $perS->$key = $value;
                }
                $perS->person_id = $candidate->id;
                $perS->created_by = Session::get('id');
                $perS->save();
            }
            for ($t = 0; $t < count($training); $t++) {
                $tr = $training[$t];
                $perTr = new PersonTraining();
                foreach ($tr as $key => $value) {
                    $perTr->$key = $value;
                }
                $perTr->person_id = $candidate->id;
                $perTr->created_by = Session::get('id');
                $perTr->save();
            }
        }
        return response($candidate->id);
    }

    public function getEdit($id) {
        return view('candidate.edit');
    }

    public function getPersonJsonData () {
        $id = request()->input('id');
        $person = Candidate::find($id);
        if ($person->type == 'basic') {
            $company = PersonCompany::where('person_id', $id)->get();
            $school = PersonSchool::where('person_id', $id)->get();
            $training = PersonTraining::where('person_id', $id)->get();
            $person->companys = $company;
            $person->schools = $school;
            $person->trainings = $training;
        } else {
            $person->companys = [];
            $person->schools = [];
            $person->trainings = [];
        }
        return response($person);
    }

    public function getCompanyJsonData () {
        $id = request()->input('id');
        $company = PersonCompany::where('person_id', $id)->get();
        return response($company);
    }

    public function getSchoolJsonData () {
        $id = request()->input('id');
        $school = PersonSchool::where('person_id', $id)->get();
        return response($school);
    }

    public function getTrainingJsonData () {
        $id = request()->input('id');
        $training = PersonTraining::where('person_id', $id)->get();
        return response($training);
    }

    public function postSaveEdit() {
        $person = request()->input('person');
        $company = request()->input('company');
        $school = request()->input('school');
        $training = request()->input('training');

        $candidate = Candidate::find($person['id']);
        foreach ($person as $key => $value) {
            $candidate->$key = $value;
        }
        $candidate->created_by = Session::get('id');
        $candidate->save();

        if ($person['type'] == 'basic') {
            PersonCompany::where('person_id', $person['id'])->delete();
            for ($c = 0; $c < count($company); $c++) {
                $com = $company[$c];
                $perCom = new PersonCompany();
                foreach ($com as $key => $value) {
                    if ($key != 'id') {
                        $perCom->$key = $value;
                    }
                }
                $perCom->person_id = $candidate->id;
                $perCom->created_by = Session::get('id');
                $perCom->save();
            }
            PersonSchool::where('person_id', $person['id'])->delete();
            for ($s = 0; $s < count($school); $s++) {
                $scl = $school[$s];
                $perS = new PersonSchool();
                foreach ($scl as $key => $value) {
                    if ($key != 'id') {
                        $perS->$key = $value;
                    }
                }
                $perS->person_id = $candidate->id;
                $perS->created_by = Session::get('id');
                $perS->save();
            }
            PersonTraining::where('person_id', $person['id'])->delete();
            for ($t = 0; $t < count($training); $t++) {
                $tr = $training[$t];
                $perTr = new PersonTraining();
                foreach ($tr as $key => $value) {
                    if ($key != 'id') {
                        $perTr->$key = $value;
                    }
                }
                $perTr->person_id = $candidate->id;
                $perTr->created_by = Session::get('id');
                $perTr->save();
            }
        }
        Hunt::where('person_id', $candidate->id)->update(['person_id'=>$candidate->id, 'person_name'=>$candidate->name]);
        HuntReport::where('person_id', $candidate->id)->update(['person_id'=>$candidate->id, 'person_name'=>$candidate->name]);
        HuntFace::where('person_id', $candidate->id)->update(['person_id'=>$candidate->id, 'person_name'=>$candidate->name]);
        HuntSuccess::where('person_id', $candidate->id)->update(['person_id'=>$candidate->id, 'person_name'=>$candidate->name]);
        HuntResult::where('person_id', $candidate->id)->update(['person_id'=>$candidate->id, 'person_name'=>$candidate->name]);
        return response($candidate->id);
    }

    public function getHuntList() {
        $id = request()->input('id');
        $hunt = DB::table('hunt')->select('id', 'job_name', 'company_name')->where('person_id', $id)->where('deleted_at', null)->get();
        return response($hunt);
    }
}