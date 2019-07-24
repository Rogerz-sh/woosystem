<?php
/**
 * Created by PhpStorm.
 * User: roger
 * Date: 15/10/26
 * Time: 下午4:08
 */
namespace App\Http\Controllers;

use App\Candidate;
use App\Company;
use App\Hunt;
use App\HuntFace;
use App\HuntReport;
use App\HuntResult;
use App\HuntSelect;
use App\HuntSuccess;
use App\Job;
use App\Performance;
use App\User;
use App\Belongs;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use App\HuntRecord;
use App\HuntFile;

class HuntController extends BaseController
{

    public function getIndex()
    {
        return view('hunt.list')->with('navIndex', 5);
    }

    public function getList()
    {
        return view('hunt.list')->with('navIndex', 5);
    }

    public function getJsonHuntListData()
    {
        if (Session::get('power') >= 10) {
            $hunt = Hunt::join('person', 'hunt.person_id', '=', 'person.id')
                ->select('hunt.id', 'hunt.job_name', 'hunt.company_name', 'hunt.person_name', 'hunt.name as HID', 'person.id as person_id', 'person.name as name', 'person.type', 'person.tel', 'person.email', 'person.sex', 'hunt.date', 'hunt.salary_month', 'hunt.salary_year', 'hunt.description')
                ->orderBy('hunt.updated_at', 'desc')->limit(1000)->get();
            return response($hunt);
        } else {
            $belong = Belongs::where('user_id', Session::get('id'))->first();
            if ($belong) {
                $path = Belongs::whereRaw('root_path like "' . $belong->root_path . '%"')->select('user_id')->get();
                if (sizeof($path) > 0) {
                    $ids = '';
                    foreach ($path as $p) {
                        $ids = $ids . ',' . $p->user_id;
                    }
                    $ids = substr($ids, 1);
                    $hunt = Hunt::join('person', 'hunt.person_id', '=', 'person.id')
                        ->select('hunt.id', 'hunt.job_name', 'hunt.company_name', 'hunt.person_name', 'hunt.name as HID', 'person.id as person_id', 'person.name as name', 'person.type', 'person.tel', 'person.email', 'person.sex', 'hunt.date', 'hunt.salary_month', 'hunt.salary_year', 'hunt.description')
                        ->whereRaw('hunt.user_id in (' . $ids . ')')
                        ->orderBy('hunt.updated_at', 'desc')->get();
                    return response($hunt);
                } else {
                    return response([]);
                }
            } else {
                return response([]);
            }
        }
    }

    public function getCreate()
    {
        return view('hunt.create')->with('navIndex', 5);
    }

    public function getJsonJobListData()
    {
        $filter = request()->input('filter');
        if ($filter && isset($filter['filters'])) {
            $key = $filter['filters'][0]['value'];
            $job = DB::table('jobs')->select('id', 'name', 'company_id', 'company_name')->where('deleted_at', null)
                ->WhereRaw('(jobs.name like ? or jobs.company_name like ?) and jobs.id not in (select distinct(job_id) from hunt_select where (hunt_select.status = "已暂停" or hunt_select.status = "已停止"))', ['%' . $key . '%', '%' . $key . '%'])
                ->orderBy('updated_at', 'desc')->get();
        } else {
            $job = DB::table('jobs')->select('id', 'name', 'company_id', 'company_name')->where('deleted_at', null)
                ->WhereRaw('jobs.id not in (select distinct(job_id) from hunt_select where (hunt_select.status = "已暂停" or hunt_select.status = "已停止"))')
                ->orderBy('updated_at', 'desc')->limit(100)->get();
        }
        return response($job);
    }

    public function getJsonCandidateListData()
    {
        $filter = request()->input('filter');
        $hunt_id = request()->input('hunt_id');
        if ($filter) {
            $key = $filter['filters'][0]['value'];
            $job = DB::table('person')
                ->select('id', 'name', 'real_id', 'tel', 'job', 'company', 'sex', 'age')
                ->orWhereRaw('name like ? or tel like ? or job like ? or company like ?', ['%' . $key . '%', '%' . $key . '%', '%' . $key . '%', '%' . $key . '%'])
                ->where('deleted_at', null)
                ->orderBy('updated_at', 'desc');
            //return response($job);
        } else {
            $job = DB::table('person')->select('id', 'name', 'real_id', 'tel', 'job', 'company', 'sex',
                'age')->where('deleted_at', null)->orderBy('updated_at', 'desc');
            //return response($job);
        }
        if ($hunt_id) {
            $job = $job->get();
        } else {
            $job = $job->limit(100)->get();
        }
        return response($job);
    }

    public function postSaveNew()
    {
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

    public function getEdit($id)
    {
        $hunt = Hunt::find($id);
        return view('hunt.edit')->with('navIndex', 5)->with('hunt', $hunt);
    }

    public function getHuntJsonData()
    {
        $id = request()->input('id');
        $hunt = Hunt::find($id);
        return response($hunt);
    }

    public function postSaveEdit()
    {
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
            HuntReport::where('hunt_id', $hunt->id)->update(['person_id' => $hunt->person_id, 'person_name' => $hunt->person_name, 'job_id' => $hunt->job_id, 'job_name' => $hunt->job_name, 'company_id' => $hunt->company_id, 'company_name' => $hunt->company_name]);
            HuntFace::where('hunt_id', $hunt->id)->update(['person_id' => $hunt->person_id, 'person_name' => $hunt->person_name, 'job_id' => $hunt->job_id, 'job_name' => $hunt->job_name]);
            HuntSuccess::where('hunt_id', $hunt->id)->update(['person_id' => $hunt->person_id, 'person_name' => $hunt->person_name, 'job_id' => $hunt->job_id, 'job_name' => $hunt->job_name, 'company_id' => $hunt->company_id, 'company_name' => $hunt->company_name]);
            HuntResult::where('hunt_id', $hunt->id)->update(['person_id' => $hunt->person_id, 'person_name' => $hunt->person_name, 'job_id' => $hunt->job_id, 'job_name' => $hunt->job_name, 'company_id' => $hunt->company_id, 'company_name' => $hunt->company_name]);
            return response($hunt->id);
        }
    }

    public function getRecord($id)
    {
        $hunt = Hunt::find($id);
        return view('hunt.record')->with('navIndex', 5)->with('hunt', $hunt);
    }

    public function getRecordList()
    {
        $hunt_id = request()->input('hunt_id');
        $records = DB::table('hunt_records')->where('hunt_id', $hunt_id)->where('deleted_at', null)->get();
        return response($records);
    }

    public function postAddRecord()
    {
        $rec = request()->input('record');
        $record = new HuntRecord();
        foreach ($rec as $key => $value) {
            $record->$key = $value;
        }
        $record->save();
        return response($record);
    }

    public function getFileList()
    {
        $hunt_id = request()->input('hunt_id');
        $files = DB::table('hunt_files')->where('hunt_id', $hunt_id)->where('deleted_at', null)->get();
        return response($files);
    }

    public function postAddFile()
    {
        $file = request()->input('file');
        $filePath = $file['path'];
        $newPath = str_replace('temp', 'real', $filePath);
        if (Storage::exists($filePath)) {
            Storage::move($filePath, $newPath);
            $huntFile = new HuntFile();
            foreach ($file as $key => $value) {
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

    public function getPersonHuntList()
    {
        $id = request()->input('person_id');
        $list = Hunt::where('person_id', $id)->get();
        return response($list);
    }

    public function getJobHuntList()
    {
        $id = request()->input('job_id');
        $list = DB::table('hunt')
            ->join('person', 'hunt.person_id', '=', 'person.id')
            ->where('hunt.deleted_at', null)
            ->where('job_id', $id)
//        ->select('hunt.id', 'person.real_id', 'person.name', 'person.age', 'person.sex', 'person.job_name', 'person.year')
            ->get();
        return response($list);
    }

    public function postDelete($id)
    {
        $hunt = Hunt::find($id);
        $hunt->delete();
        //同时删除相关信息
        HuntReport::where('hunt_id', $id)->delete();
        HuntFace::where('hunt_id', $id)->delete();
        HuntSuccess::where('hunt_id', $id)->delete();
        HuntResult::where('hunt_id', $id)->delete();
        return response($id);
    }

    private function updateHuntTime($id)
    {
        $hs = HuntSelect::where('job_id', $id)->first();
        if ($hs) {
            $hs->last_update = time() % 100000000;
            $hs->save();
            $this->updateJobAndCompanyTime($id);
        }
    }

    private function updateJobAndCompanyTime($job_id)
    {
        $job = Job::where('id', $job_id)->first();
        if ($job) {
            $job->last_update = time() % 100000000;
            $job->save();
            $company = Company::where('id', $job->company_id)->first();
            if ($company) {
                $company->last_update = time() % 100000000;
                $company->save();
            }
        }
    }

    private function insertPerformanceRecord($cid, $jid, $pid, $uid, $date, $type)
    {
        $p = new Performance();
        $p->company_id = $cid;
        $p->job_id = $jid;
        $p->person_id = $pid;
        $p->user_id = $uid;
        $p->date = $date;
        $p->{$type} = 1;
        $p->type = $type;
        $p->sign = $type.'_'.$cid . '_' . $jid . '_' . $pid . '_' . $uid . '_' . substr(str_replace('-', '', $date), 0, 8);
        $p->save();
    }

    private function deletePerformanceRecord($cid, $jid, $pid, $uid, $date, $type)
    {
        $sign = $type.'_'.$cid . '_' . $jid . '_' . $pid . '_' . $uid . '_' . substr(str_replace('-', '', $date), 0, 8);
        $p = Performance::where('sign', $sign)->where('type', $type)->first();
        if ($p) {
            $p->delete();
        }
    }

    public function postSaveReport()
    {
        $rpt = request()->input('report');
        $oldRpt = HuntReport::withTrashed()->where('hunt_id', $rpt['hunt_id'])->where('type', $rpt['type'])->first();
        if ($oldRpt) {
            foreach ($rpt as $key => $value) {
                $oldRpt->$key = $value;
            }
            $oldRpt->updated_by = Session::get('id');
            $oldRpt->is_confirm = 0;
            $oldRpt->save();
            $oldRpt->restore();
            $this->updateHuntTime($oldRpt->job_id);
            return response($oldRpt->id);
        } else {
            $newRpt = new HuntReport();
            foreach ($rpt as $key => $value) {
                $newRpt->$key = $value;
            }
            $newRpt->is_confirm = 0;
            $newRpt->created_by = Session::get('id');
            $newRpt->save();
            $this->updateHuntTime($newRpt->job_id);
            $this->insertPerformanceRecord($newRpt->company_id, $newRpt->job_id, $newRpt->person_id, Session::get('id'), $newRpt->date, $rpt['type']);
            return response($newRpt->id);
        }
    }

    public function postConfirmReport()
    {
        $id = request()->input('id');
        $oldRpt = HuntReport::find($id);
        if ($oldRpt) {
            $oldRpt->is_confirm = 1;
            $oldRpt->save();
            return response($oldRpt->id);
        } else {
            return response(-1);
        }
    }

    public function postDeleteReport()
    {
        $id = request()->input('id');
        $oldRpt = HuntReport::find($id);
        if ($oldRpt) {
            if ($oldRpt['type'] == 'report') {
                $this->deletePerformanceRecord($oldRpt->company_id, $oldRpt->job_id, $oldRpt->person_id, $oldRpt->created_by, $oldRpt->date, 'report');
            } else {
                $this->deletePerformanceRecord($oldRpt->company_id, $oldRpt->job_id, $oldRpt->person_id, $oldRpt->created_by, $oldRpt->date, 'offer');
            }
            $oldRpt->deleted_by = Session::get('id');
            $oldRpt->save();
            $oldRpt->delete();
            return response($oldRpt->id);
        } else {
            return response(-1);
        }
    }

    public function postSaveSuccess()
    {
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
            $this->insertPerformanceRecord($newRst->company_id, $newRst->job_id, $newRst->person_id, Session::get('id'), $newRst->date, 'success');
            return response($newRst->id);
        }
    }

    public function postDeleteSuccess()
    {
        $id = request()->input('id');
        $oldRst = HuntSuccess::find($id);
        if ($oldRst) {
            $this->deletePerformanceRecord($oldRst->company_id, $oldRst->job_id, $oldRst->person_id, $oldRst->created_by, $oldRst->date, 'success');
            $oldRst->deleted_by = Session::get('id');
            $oldRst->save();
            $oldRst->delete();
            return response($oldRst->id);
        } else {
            return response(-1);
        }
    }

    public function postSaveResult()
    {
        $rst = request()->input('result');
//        $oldRst = HuntResult::where('hunt_id', $rst['hunt_id'])->first();
//        if ($oldRst) {
//            foreach ($rst as $key => $value) {
//                $oldRst->$key = $value;
//            }
//            $oldRst->deleted_at = null;
//            $oldRst->updated_by = Session::get('id');
//            $oldRst->save();
//            $this->updateHuntTime($oldRst->job_id);
//            return response($oldRst->id);
//        } else {
//            $newRst = new HuntResult();
//            foreach ($rst as $key => $value) {
//                $newRst->$key = $value;
//            }
//            $newRst->created_by = Session::get('id');
//            $newRst->save();
//            $this->updateHuntTime($newRst->job_id);
//            return response($newRst->id);
//        }
        if (isset($rst['id'])) {
            $existRst = HuntResult::where('type', $rst['type'])->where('hunt_id', $rst['hunt_id'])->where('id', '<>', $rst['id'])->first();
            if ($existRst) {
                return response(-1);
            }
            $oldRst = HuntResult::where('id', $rst['id'])->where('created_by', Session::get('id'))->where('hunt_id', $rst['hunt_id'])->first();
            foreach ($rst as $key => $value) {
                if ($key != 'id') {
                    $oldRst->$key = $value;
                }
            }
            $oldRst->updated_by = Session::get('id');
            $oldRst->save();
            $this->updateHuntTime($oldRst->job_id);
            return response($oldRst->id);
        } else {
            $existRst = HuntResult::where('type', $rst['type'])->where('hunt_id', $rst['hunt_id'])->first();
            if ($existRst) {
                return response(-1);
            }
            $newRst = new HuntResult();
            foreach ($rst as $key => $value) {
                if ($key != 'id') {
                    $newRst->$key = $value;
                }
            }
            $newRst->created_by = Session::get('id');
            $newRst->save();
            $this->updateHuntTime($newRst->job_id);
            return response($newRst->id);
        }
    }

    public function postDeleteResult()
    {
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

    public function getHuntReportJsonData()
    {
        $hunt_id = request()->input('hunt_id');
        $type = request()->input('type');
        $rpt = HuntReport::where('hunt_id', $hunt_id)->where('type', $type)->orderBy('updated_at', 'desc')->first();
        return response($rpt);
    }

    public function getHuntSuccessJsonData()
    {
        $hunt_id = request()->input('hunt_id');
        $rst = HuntSuccess::where('hunt_id', $hunt_id)->orderBy('updated_at', 'desc')->first();
        return response($rst);
    }

    public function getHuntResultJsonData()
    {
        $hunt_id = request()->input('hunt_id');
        $rst = HuntResult::where('hunt_id', $hunt_id)->orderBy('updated_at', 'desc')->first();
        return response($rst);
    }

    public function postSaveFace()
    {
        $face = request()->input('face');
        if (isset($face['id'])) {
            $existFace = HuntFace::where('type', $face['type'])->where('hunt_id', $face['hunt_id'])->where('id', '<>', $face['id'])->first();
            if ($existFace) {
                return response(-1);
            }
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
            $existFace = HuntFace::where('type', $face['type'])->where('hunt_id', $face['hunt_id'])->first();
            if ($existFace) {
                return response(-1);
            }
            $newFace = new HuntFace();
            foreach ($face as $key => $value) {
                if ($key != 'id') {
                    $newFace->$key = $value;
                }
            }
            $newFace->created_by = Session::get('id');
            $newFace->save();
            $this->updateHuntTime($newFace->job_id);
            if ($face['type'] == '一面') {
                $this->insertPerformanceRecord($newFace->company_id, $newFace->job_id, $newFace->person_id, Session::get('id'), $newFace->date, 'face');
            }
            if ($face['type'] == '二面') {
                $this->insertPerformanceRecord($newFace->company_id, $newFace->job_id, $newFace->person_id, Session::get('id'), $newFace->date, 'faces');
            }
            return response($newFace->id);
        }
    }

    public function postDeleteFace()
    {
        $id = request()->input('id');
        $oldFace = HuntFace::find($id);
        if ($oldFace) {
            if ($oldFace['type'] == '一面') {
                $this->deletePerformanceRecord($oldFace->company_id, $oldFace->job_id, $oldFace->person_id, $oldFace->created_by, $oldFace->date, 'face');
            }
            if ($oldFace['type'] == '二面') {
                $this->deletePerformanceRecord($oldFace->company_id, $oldFace->job_id, $oldFace->person_id, $oldFace->created_by, $oldFace->date, 'faces');
            }
            $oldFace->deleted_by = Session::get('id');
            $oldFace->save();
            $oldFace->delete();
            return response($oldFace->id);
        } else {
            return response(-1);
        }
    }

    public function getFaceList()
    {
        $hunt_id = request()->input('hunt_id');
        $face = HuntFace::where('hunt_id', $hunt_id)->get();
        return response($face);
    }

    public function getPersonBasicInfo()
    {
        $id = request()->input('person_id');
        $person = Candidate::find($id);
        return response($person);
    }

    //职位分配相关操作
    public function getJsonHuntSelectListData()
    {
        if (Session::get('power') >= 10) {
            $hs = DB::table('hunt_count')->orderBy('updated_at', 'desc')->get();
            return response($hs);
        } else {
            $belong = Belongs::where('user_id', Session::get('id'))->first();
            if ($belong) {
                $path = Belongs::whereRaw('root_path like "' . $belong->root_path . '%"')->select('user_id')->get();
                if (sizeof($path) > 0) {
                    $ids = array();
                    foreach ($path as $p) {
                        array_push($ids, $p->user_id);
                    }
                    $hunt_select = array();
                    $hs = DB::table('hunt_count')->orderBy('updated_at', 'desc')->get();
                    foreach ($hs as $h) {
                        $users = explode(',', $h->user_ids);
                        foreach ($users as $u) {
                            if (in_array($u, $ids)) {
                                array_push($hunt_select, $h);
                            }
                        }
                    }
                    return response($hunt_select);
                } else {
                    return response([]);
                }
            } else {
                return response([]);
            }
        }
    }

    public function getJsonHuntSelectJobData()
    {
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

    public function getHuntSelectJsonData()
    {
        $id = request()->input('id');
        $hs = HuntSelect::find($id);
        return response($hs);
    }

    public function getUserList()
    {
        $user = User::all();
        return response($user);
    }

    public function postSaveSelectNew()
    {
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

    public function postSaveSelectEdit()
    {
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

    public function getReportInfo()
    {
        $hid = request()->input('hunt_id');
        $hunt = Hunt::find($hid);
        $companyId = $hunt->company_id;
        $hRpt = HuntReport::where('company_id', $companyId)->where('type', 'report')->orderBy('created_at', 'desc')->limit(5)->get();
        return response($hRpt);
    }

    public function getResultList()
    {
        $hunt_id = request()->input('hunt_id');
        $rst = HuntResult::where('hunt_id', $hunt_id)->get();
        return response($rst);
    }

    public function postJoinHuntSelect()
    {
        $job_id = request()->input('job_id');
        $job_name = request()->input('job_name');
        $company_id = request()->input('company_id');
        $company_name = request()->input('company_name');
        $user_id = Session::get('id');
        $user_name = Session::get('nickname');

        $exist = HuntSelect::where('job_id', $job_id)->first();
        if ($exist) {
            $exist->user_ids = $exist->user_ids . ',' . $user_id;
            $exist->user_names = $exist->user_names . ',' . $user_name;
            $exist->save();

            return response($exist);
        } else {
            $hs = new HuntSelect();
            $hs->job_id = $job_id;
            $hs->job_name = $job_name;
            $hs->company_id = $company_id;
            $hs->company_name = $company_name;
            $hs->user_ids = $user_id;
            $hs->user_names = $user_name;
            $hs->type = '一级';
            $hs->status = '进行中';
            $hs->save();
            return response($hs);
        }
    }
}
