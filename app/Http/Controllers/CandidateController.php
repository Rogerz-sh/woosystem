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
use App\PersonAddition;
use App\PersonRecord;
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
        $filter = request()->input('filter');
        if ($filter) {
            $whereStr = ' where deleted_at is null';
            if (isset($filter['name'])) {
                $whereStr = $whereStr.' and name like "%'.$filter['name'].'%"';
            }
            if (isset($filter['sage'])) {
                $whereStr = $whereStr.' and age >= '.$filter['sage'].'';
            }
            if (isset($filter['eage'])) {
                $whereStr = $whereStr.' and age <= '.$filter['eage'].'';
            }
            if (isset($filter['sex'])) {
                $whereStr = $whereStr.' and sex = "'.$filter['sex'].'"';
            }
            if (isset($filter['source'])) {
                $whereStr = $whereStr.' and source = "'.$filter['source'].'"';
            }
            if (isset($filter['degree'])) {
                $whereStr = $whereStr.' and degree = "'.$filter['degree'].'"';
            }
            if (isset($filter['job'])) {
                $whereStr = $whereStr.' and job like "%'.$filter['job'].'%"';
            }
            if (isset($filter['company'])) {
                $whereStr = $whereStr.' and company like "%'.$filter['company'].'%"';
            }
            if (isset($filter['tel'])) {
                $whereStr = $whereStr.' and tel like "%'.$filter['tel'].'%"';
            }
            $candidate = DB::select('select *, (select nickname from users where users.id = person.created_by) as user_name, (select count(hunt.id) from hunt where hunt.person_id = person.id and hunt.deleted_at is null) as hunt_count from person'.$whereStr.' order by created_at desc limit 100');
        } else {
            $candidate = DB::select('select *, (select nickname from users where users.id = person.created_by) as user_name, (select count(hunt.id) from hunt where hunt.person_id = person.id and hunt.deleted_at is null) as hunt_count from person order by created_at desc limit 100');
        }
        return response([$candidate, $filter]);
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

        $exist = Candidate::where('tel', $person['tel'])->first();

        if ($exist) {
            return response(-1);
        } else {
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

        $exist = Candidate::where('tel', $person['tel'])->where('id', '<>', $person['id'])->first();

        if ($exist) {
            return response(-1);
        } else {

            $candidate = Candidate::find($person['id']);
            foreach ($person as $key => $value) {
                $candidate->$key = $value;
            }
            $candidate->updated_by = Session::get('id');
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
            Hunt::where('person_id', $candidate->id)->update(['person_id' => $candidate->id, 'person_name' => $candidate->name]);
            HuntReport::where('person_id', $candidate->id)->update(['person_id' => $candidate->id, 'person_name' => $candidate->name]);
            HuntFace::where('person_id', $candidate->id)->update(['person_id' => $candidate->id, 'person_name' => $candidate->name]);
            HuntSuccess::where('person_id', $candidate->id)->update(['person_id' => $candidate->id, 'person_name' => $candidate->name]);
            HuntResult::where('person_id', $candidate->id)->update(['person_id' => $candidate->id, 'person_name' => $candidate->name]);
            return response($candidate->id);
        }
    }

    public function postDelete () {
        $id = request()->input('id');
        $person = Candidate::find($id);
        $person->delete();
        return response($person->id);
    }

    public function getHuntList() {
        $id = request()->input('id');
        $hunt = Hunt::select('id', 'job_name', 'company_name', 'description')->where('person_id', $id)->get();
        return response($hunt);
    }

    public function getReportList() {
        $id = request()->input('id');
        $report = DB::select('select hunt.id, hunt.job_name, hunt.company_name, hunt.date,
                            (select max(hunt_report.date) from hunt_report where hunt_report.hunt_id = hunt.id and hunt_report.type = "report" and deleted_at is null) as report_date,
                            (select max(hunt_face.date) from hunt_face where hunt_face.hunt_id = hunt.id and deleted_at is null) as face_date,
                            (select max(hunt_report.date) from hunt_report where hunt_report.hunt_id = hunt.id and hunt_report.type = "offer" and deleted_at is null) as offer_date,
                            (select max(hunt_success.date) from hunt_success where hunt_success.hunt_id = hunt.id and deleted_at is null) as success_date
                            from hunt where hunt.person_id = '.$id.' and deleted_at is null');
        return response($report);
    }

    public function getAdditionList() {
        $id = request()->input('id');
        $list = PersonAddition::where('person_id', $id)->orderBy('created_at', 'desc')->get();
        return response($list);
    }

    public function postPushAddition() {
        $person_id = request()->input('person_id');
        $content = request()->input('content');
        $addition = new PersonAddition();
        $addition->person_id = $person_id;
        $addition->content = $content;
        $addition->user_name = Session::get('nickname');
        $addition->created_by = Session::get('id');
        $addition->save();
        return response($addition);
    }

    public function postRemoveAddition() {
        $id = request()->input('id');
        $addition = PersonAddition::find($id);
        $addition->delete();
        return response(1);
    }

    public function getRecordList() {
        $id = request()->input('id');
        $list = PersonRecord::where('person_id', $id)->orderBy('created_at', 'desc')->get();
        return response($list);
    }

    public function postPushRecord() {
        $person_id = request()->input('person_id');
        $content = request()->input('content');
        $addition = new PersonRecord();
        $addition->person_id = $person_id;
        $addition->content = $content;
        $addition->user_id = Session::get('id');
        $addition->user_name = Session::get('nickname');
        $addition->save();
        return response($addition);
    }

    public function postRemoveRecord() {
        $id = request()->input('id');
        $addition = PersonRecord::find($id);
        $addition->delete();
        return response(1);
    }
}