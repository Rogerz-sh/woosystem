<?php
/**
 * Created by PhpStorm.
 * User: roger
 * Date: 15/10/26
 * Time: 下午4:08
 */
namespace App\Http\Controllers;
use App\File;
use Illuminate\Routing\Controller as BaseController;
use App\Company;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;


class CompanyController extends BaseController {

    public function getList() {
        return view('company.list')->with('navIndex', 1);
    }

    public function getJsonListData() {
        $company = Company::select('id', 'name', 'area', 'industry', 'type', 'scale', 'found', 'created_by')->orderBy('created_at', 'desc')->get();
        return response($company);
    }

    public function getCreate() {
        return view('company.create')->with('navIndex', 1);
    }

    public function getExistCompany() {
        $filter = request()->input('filter');
        $key = '%'.$filter['filters'][0]['value'].'%';
        if (strlen($key) < 2) {
            $suggest = array();
        } else {
            $suggest = DB::table('company')->where('deleted_at', null)->whereRaw('name like ?', [$key])->take(10)->get();
        }
        return response($suggest);
    }

    public function postSaveNew() {
        $newCompany = request()->input('company');
        $exist = DB::table('company')->where('deleted_at', null)->where('name', $newCompany['name'])->first();
        if ($exist) {
            return response('该公司名称已经被录入了，<a href="/company/detail/'.$exist->id.'">点击查看</a>');
        } else {
            $company = new Company();
            foreach ($newCompany as $key => $value) {
                $company->$key = $value;
            }
            $company->created_by = Session::get('id');
            $company->save();
            return response($company->id);
        }
    }

    public function getEdit($id) {
        $company = Company::find($id);
        return view('company.edit')->with('navIndex', 1)->with('company', $company);
    }

    public function getCompanyJsonData() {
        $id = request()->input('id');
        $company = Company::find($id);
        return response($company);
    }

    public function postSaveEdit() {
        $editCompany = request()->input('company');
        $exist = DB::table('company')->where('deleted_at', null)->where('name', $editCompany['name'])->where('id', '<>', $editCompany['id'])->first();
        if ($exist) {
            return response('该公司名称已经被录入了，<a href="/company/detail/'.$exist->id.'">点击查看</a>');
        } else {
            $company = Company::find($editCompany['id']);
            foreach ($editCompany as $key => $value) {
                $company->$key = $value;
            }
            $company->updated_by = Session::get('id');
            $company->save();
            return response($company->id);
        }
    }

    public function getDetail($id) {
        $company = Company::find($id);
        return view('company.detail')->with('navIndex', 1)->with('company', $company);
    }

    public function getJobList() {
        $id = request()->input('id');
        $job = DB::table('jobs')->select('id', 'name')->where('company_id', $id)->where('deleted_at', null)->get();
        return response($job);
    }

    public function postDelete($id) {
        $company = Company::find($id);
        $company->delete();
        return response($company->id);
    }

    public function getFileList() {
        $id = request()->input('id');
        $file = File::where('fk_id', $id)->where('type', 'company')->get();
        return response($file);
    }

    public function postSaveFile() {
        $fk_id = request()->input('company_id');
        $name = request()->input('name');
        $filename = request()->input('filename');
        $filepath = request()->input('filepath');

        $file = new File();
        $file->type = "company";
        $file->fk_id = $fk_id;
        $file->created_by = Session::get('id');
        $file->name = $name;
        $file->filename = $filename;
        $file->filepath = $filepath;
        $file->save();

        return response($file->id);
    }

    public function postDeleteFile() {
        $id = request()->input('id');
        $file = File::find($id);
        $file->delete();
        return response($file->id);
    }
}
