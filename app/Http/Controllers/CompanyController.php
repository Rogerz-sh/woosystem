<?php
/**
 * Created by PhpStorm.
 * User: roger
 * Date: 15/10/26
 * Time: 下午4:08
 */
namespace App\Http\Controllers;
use Illuminate\Routing\Controller as BaseController;
use App\Company;
use Illuminate\Support\Facades\Session;


class CompanyController extends BaseController {

    public function getList() {
        return view('company.list')->with('navIndex', 1);
    }

    public function getJsonListData() {
        $company = Company::all();
        return response($company);
    }

    public function getCreate() {
        return view('company.create')->with('navIndex', 1);
    }

    public function postSaveNew() {
        $newCompany = request()->input('company');
        $company = new Company();
        foreach ($newCompany as $key=>$value) {
            $company->$key = $value;
        }
        $company->created_by = Session::get('id');
        $company->save();
        return response($company->id);
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
        $company = Company::find($editCompany['id']);
        foreach ($editCompany as $key=>$value) {
            $company->$key = $value;
        }
        $company->updated_by = Session::get('id');
        $company->save();
        return response($company->id);
    }

    public function getDetail($id) {
        $company = Company::find($id);
        return view('company.detail')->with('navIndex', 1)->with('company', $company);
    }

    public function postDelete($id) {
        $company = Company::find($id);
        $company->delete();
        return response($company->id);
    }
}
