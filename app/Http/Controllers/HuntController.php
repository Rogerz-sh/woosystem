<?php
/**
 * Created by PhpStorm.
 * User: roger
 * Date: 15/10/26
 * Time: 下午4:08
 */
namespace App\Http\Controllers;
use App\Candidate;
use App\Hunt;
use App\HuntFace;
use App\HuntReport;
use App\HuntResult;
use App\HuntSelect;
use App\HuntSuccess;
use App\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use App\HuntRecord;
use App\HuntFile;

class HuntController extends BaseController {

    public function getIndex () {
        return view('hunt.list')->with('navIndex', 5);
    }

    public function getList() {
        return view('hunt.list')->with('navIndex', 5);
    }

    public function getJsonHuntListData() {
        if (Session::get('power') == 9) {
            $hunt = Hunt::join('person', 'hunt.person_id', '=', 'person.id')
                ->select('hunt.id', 'hunt.job_name', 'hunt.company_name', 'hunt.person_name', 'hunt.name as HID', 'person.id as person_id', 'person.name as name', 'person.type', 'person.tel', 'person.email', 'person.sex', 'hunt.date', 'hunt.salary_month', 'hunt.salary_year', 'hunt.description')
                ->orderBy('hunt.updated_at', 'desc')->get();
        } else {
            $hunt = Hunt::join('person', 'hunt.person_id', '=', 'person.id')
                ->select('hunt.id', 'hunt.job_name', 'hunt.company_name', 'hunt.person_name', 'hunt.name as HID', 'person.id as person_id', 'person.name as name', 'person.type', 'person.tel', 'person.email', 'person.sex', 'hunt.date', 'hunt.salary_month', 'hunt.salary_year', 'hunt.description')
                ->where('hunt.user_id', Session::get('id'))
                ->orderBy('hunt.updated_at', 'desc')->get();
        }
        return response($hunt);
    }

    public function getCreate() {
        return view('hunt.create')->with('navIndex', 5);
    }

    public function getJsonJobListData() {
//        $filter = request()->input('filter');
//        $key = $filter['filters'][0]['value'];
        $job = DB::table('jobs')->select('id', 'name', 'company_id', 'company_name')->where('deleted_at', null)
//            ->orWhereRaw('name like ? or company_name like ?', ['%'.$key.'%', '%'.$key.'%'])
            ->orderBy('updated_at', 'desc')->get();
        return response($job);
    }

    public function getJsonCandidateListData() {
        $filter = request()->input('filter');
        if ($filter) {
            $key = $filter['filters'][0]['value'];
            $job = DB::table('person')
                ->select('id', 'name', 'real_id', 'job', 'company', 'sex', 'age')
                ->orWhereRaw('name like ? or job like ? or company like ?', ['%'.$key.'%', '%'.$key.'%', '%'.$key.'%'])
                ->where('deleted_at', null)
                ->orderBy('updated_at', 'desc')->get();
            return response($job);
        } else {
            $job = DB::table('person')->select('id', 'name', 'real_id', 'job', 'company', 'sex',
                'age')->where('deleted_at', null)->orderBy('updated_at', 'desc')->get();
            return response($job);
        }
    }

    public function postSaveNew() {
        $newHunt = request()->input('hunt');
        $exist = DB::table('hunt')->where('deleted_at', null)->where('job_id', $newHunt['job_id'])->where('person_id', $newHunt['person_id'])->first();
        if ($exist) {
            return response('该岗位已经推荐过该候选人，请不要重复操作');
        } else {
            $hunt = new Hunt();
            foreach ($newHunt as $key => $value) {
                $hunt->$key = $value;
            }
            $hunt->user_id = Session::get('id');
            $hunt->user_name = Session::get('nickname');
            $hunt->created_by = Session::get('id');
            $hunt->save();
            $this->updateHuntTime($hunt->job_id);
            return response($hunt->id);
        }
    }

    public function getEdit($id) {
        $hunt = Hunt::find($id);
        return view('hunt.edit')->with('navIndex', 5)->with('hunt', $hunt);
    }

    public function getHuntJsonData () {
        $id = request()->input('id');
        $hunt = Hunt::find($id);
        return response($hunt);
    }

    public function postSaveEdit() {
        $newHunt = request()->input('hunt');
        $exist = DB::table('hunt')->where('deleted_at', null)
            ->where('job_id', $newHunt['job_id'])->where('person_id', $newHunt['person_id'])
            ->where('id', '<>', $newHunt['id'])->first();
        if ($exist) {
            return response('该岗位已经推荐过该候选人，请不要重复操作');
        } else {
            $hunt = Hunt::find($newHunt['id']);
            foreach ($newHunt as $key => $value) {
                $hunt->$key = $value;
            }
            $hunt->updated_by = Session::get('id');
            $hunt->save();
            return response($hunt->id);
        }
    }

    public function getRecord($id) {
        $hunt = Hunt::find($id);
        return view('hunt.record')->with('navIndex', 5)->with('hunt', $hunt);
    }

    public function getRecordList() {
        $hunt_id = request()->input('hunt_id');
        $records = DB::table('hunt_records')->where('hunt_id', $hunt_id)->where('deleted_at', null)->get();
        return response($records);
    }

    public function postAddRecord() {
        $rec = request()->input('record');
        $record = new HuntRecord();
        foreach ($rec as $key=>$value) {
            $record->$key = $value;
        }
        $record->save();
        return response($record);
    }

    public function getFileList() {
        $hunt_id = request()->input('hunt_id');
        $files = DB::table('hunt_files')->where('hunt_id', $hunt_id)->where('deleted_at', null)->get();
        return response($files);
    }

    public function postAddFile() {
        $file = request()->input('file');
        $filePath = $file['path'];
        $newPath = str_replace('temp', 'real', $filePath);
        if (Storage::exists($filePath)) {
            Storage::move($filePath, $newPath);
            $huntFile = new HuntFile();
            foreach ($file as $key=>$value) {
                $huntFile->$key = $value;
            }
            $huntFile->path = $newPath;
            $huntFile->created_by = Session::get('id');
            $huntFile->save();
            return response($huntFile->id);
        } else {
            return response(0);
        }
    }

    public function getPersonHuntList() {
        $id = request()->input('person_id');
        $list = Hunt::where('person_id', $id)->get();
        return response($list);
    }

    public function getJobHuntList() {
        $id = request()->input('job_id');
        $list = DB::table('hunt')
        ->join('person', 'hunt.person_id', '=', 'person.id')
        ->where('hunt.deleted_at', null)
        ->where('job_id', $id)
//        ->select('hunt.id', 'person.real_id', 'person.name', 'person.age', 'person.sex', 'person.job_name', 'person.year')
        ->get();
        return response($list);
    }

    public function postDelete($id) {
        $hunt = Hunt::find($id);
        $hunt->delete();
        return response($id);
    }

    private function updateHuntTime($id) {
        $hs = HuntSelect::where('job_id', $id)->first();
        if ($hs) {
            $hs->save();
        }
    }

    public function postSaveReport() {
        $rpt = request()->input('report');
        $oldRpt = HuntReport::withTrashed()->where('hunt_id', $rpt['hunt_id'])->where('type', $rpt['type'])->first();
        if ($oldRpt) {
            foreach ($rpt as $key => $value) {
                $oldRpt->$key = $value;
            }
            $oldRpt->updated_by = Session::get('id');
            $oldRpt->save();
            $oldRpt->restore();
            $this->updateHuntTime($oldRpt->job_id);
            return response($oldRpt->id);
        } else {
            $newRpt = new HuntReport();
            foreach ($rpt as $key => $value) {
                $newRpt->$key = $value;
            }
            $newRpt->created_by = Session::get('id');
            $newRpt->save();
            $this->updateHuntTime($newRpt->job_id);
            return response($newRpt->id);
        }
    }

    public function postDeleteReport() {
        $id = request()->input('id');
        $oldRpt = HuntReport::find($id);
        if ($oldRpt) {
            $oldRpt->deleted_by = Session::get('id');
            $oldRpt->save();
            $oldRpt->delete();
            return response($oldRpt->id);
        } else {
            return response(-1);
        }
    }

    public function postSaveSuccess() {
        $rst = request()->input('success');
        $oldRst = HuntSuccess::where('hunt_id', $rst['hunt_id'])->first();
        if ($oldRst) {
            foreach ($rst as $key => $value) {
                $oldRst->$key = $value;
            }
            $oldRst->deleted_at = null;
            $oldRst->updated_by = Session::get('id');
            $oldRst->save();
            $this->updateHuntTime($oldRst->job_id);
            return response($oldRst->id);
        } else {
            $newRst = new HuntSuccess();
            foreach ($rst as $key => $value) {
                $newRst->$key = $value;
            }
            $newRst->created_by = Session::get('id');
            $newRst->save();
            $this->updateHuntTime($newRst->job_id);
            return response($newRst->id);
        }
    }

    public function postSaveResult() {
        $rst = request()->input('result');
        $oldRst = HuntResult::where('hunt_id', $rst['hunt_id'])->first();
        if ($oldRst) {
            foreach ($rst as $key => $value) {
                $oldRst->$key = $value;
            }
            $oldRst->deleted_at = null;
            $oldRst->updated_by = Session::get('id');
            $oldRst->save();
            $this->updateHuntTime($oldRst->job_id);
            return response($oldRst->id);
        } else {
            $newRst = new HuntResult();
            foreach ($rst as $key => $value) {
                $newRst->$key = $value;
            }
            $newRst->created_by = Session::get('id');
            $newRst->save();
            $this->updateHuntTime($newRst->job_id);
            return response($newRst->id);
        }
    }

    public function postDeleteResult() {
        $id = request()->input('id');
        $oldRst = HuntResult::find($id);
        if ($oldRst) {
            $oldRst->deleted_by = Session::get('id');
            $oldRst->save();
            $oldRst->delete();
            return response($oldRst->id);
        } else {
            return response(-1);
        }
    }

    public function getHuntReportJsonData() {
        $hunt_id = request()->input('hunt_id');
        $type = request()->input('type');
        $rpt = HuntReport::where('hunt_id', $hunt_id)->where('type', $type)->orderBy('updated_at', 'desc')->first();
        return response($rpt);
    }

    public function getHuntResultJsonData() {
        $hunt_id = request()->input('hunt_id');
        $rst = HuntResult::where('hunt_id', $hunt_id)->orderBy('updated_at', 'desc')->first();
        return response($rst);
    }

    public function postSaveFace() {
        $face = request()->input('face');
//        return response(isset($face['id']) ? '1' : '0');
        if (isset($face['id'])) {
            $oldFace = HuntFace::where('id', $face['id'])->where('created_by', Session::get('id'))->where('hunt_id', $face['hunt_id'])->first();
            foreach ($face as $key => $value) {
                if ($key != 'id') {
                    $oldFace->$key = $value;
                }
            }
            $oldFace->updated_by = Session::get('id');
            $oldFace->save();
            $this->updateHuntTime($oldFace->job_id);
            return response($oldFace->id);
        } else {
            $newFace = new HuntFace();
            foreach ($face as $key => $value) {
                if ($key != 'id') {
                    $newFace->$key = $value;
                }
            }
            $newFace->created_by = Session::get('id');
            $newFace->save();
            $this->updateHuntTime($newFace->job_id);
            return response($newFace->id);
        }
    }

    public function postDeleteFace() {
        $id = request()->input('id');
        $oldFace = HuntFace::find($id);
        if ($oldFace) {
            $oldFace->deleted_by = Session::get('id');
            $oldFace->save();
            $oldFace->delete();
            return response($oldFace->id);
        } else {
            return response(-1);
        }
    }

    public function getFaceList() {
        $hunt_id = request()->input('hunt_id');
        $face = HuntFace::where('hunt_id', $hunt_id)->get();
        return response($face);
    }

    public function getPersonBasicInfo() {
        $id = request()->input('person_id');
        $person = Candidate::find($id);
        return response($person);
    }

    //职位分配相关操作
    public function getJsonHuntSelectListData() {
        if (Session::get('power') == 9) {
            $hs = DB::table('hunt_count')->orderBy('updated_at', 'desc')->get();
        } else {
            $hs = DB::table('hunt_count')->whereRaw('locate(concat(",", ?, ","), concat(",", user_ids, ",")) > 0', [Session::get('id')])->orderBy('updated_at', 'desc')->get();
        }
        return response($hs);
    }

    public function getJsonHuntSelectJobData() {
        $job_id = request()->input('job_id');
        $hunt = DB::table('hunt_person_status')
            ->join('person', 'hunt_person_status.person_id', '=', 'person.id')
            ->select('hunt_person_status.id', 'person.id as person_id', 'person.type', 'person.name', 'person.company', 'person.job', 'person.sex', 'person.age', 'person.degree', 'person.tel', 'hunt_person_status.user_name', 'hunt_person_status.date', 'hunt_person_status.salary_month', 'hunt_person_status.salary_year', 'hunt_person_status.reported', 'hunt_person_status.faced', 'hunt_person_status.offered', 'hunt_person_status.succeed')
            ->where('hunt_person_status.deleted_at', null)
            ->where('hunt_person_status.job_id', $job_id)
            ->orderBy('hunt_person_status.updated_at', 'desc')
            ->orderBy('hunt_person_status.reported', 'desc')->get();
        return response($hunt);
    }

    public function getHuntSelectJsonData () {
        $id = request()->input('id');
        $hs = HuntSelect::find($id);
        return response($hs);
    }

    public function getUserList() {
        $user = User::all();
        return response($user);
    }

    public function postSaveSelectNew() {
        $newHs = request()->input('hs');

        $exist = DB::table('hunt_select')->where('deleted_at', null)->where('job_id', $newHs['job_id'])->first();
        if ($exist) {
            return response('该岗位已经分配过了，请不要重复分配');
        } else {
            $hs = new HuntSelect();
            foreach ($newHs as $key => $value) {
                $hs->$key = $value;
            }
            $hs->save();
            return response($hs->id);
        }
    }

    public function postSaveSelectEdit() {
        $newHs = request()->input('hs');
        $exist = DB::table('hunt_select')->where('deleted_at', null)
            ->where('job_id', $newHs['job_id'])
            ->where('id', '<>', $newHs['id'])->first();
        if ($exist) {
            return response('该岗位已经分配过了，请不要重复分配');
        } else {
            $hs = HuntSelect::find($newHs['id']);
            foreach ($newHs as $key => $value) {
                $hs->$key = $value;
            }
            $hs->save();
            return response($hs->id);
        }
    }

    public function getReportInfo() {
        $hid = request()->input('hunt_id');
        $hunt = Hunt::find($hid);
        $companyId = $hunt->company_id;
        $hRpt = HuntReport::where('company_id', $companyId)->where('type', 'report')->orderBy('updated_at', 'desc')->get();
        return response($hRpt);
    }
}
