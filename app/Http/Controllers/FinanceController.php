<?php
/**
 * Created by PhpStorm.
 * User: roger
 * Date: 15/10/26
 * Time: 下午4:08
 */
namespace App\Http\Controllers;
use App\Invoice;
use App\User;
use App\Hunt;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;


class FinanceController extends BaseController {

    public function getInvoiceJsonList() {
        $list = Invoice::orderBy('created_at', 'desc')->get();
        return response($list);
    }

    public function getJsonJobPersonList() {
        $job_id = request()->input('job_id');
        $hunts = Hunt::join('hunt_success', 'hunt.id', '=', 'hunt_success.hunt_id')
            ->select('hunt.person_id', 'hunt.person_name', 'hunt_success.date')
            ->where('hunt_success.deleted_at', null)
            ->where('hunt.job_id', $job_id)->get();
        return response($hunts);
    }

    public function getSearchJobWithCompany() {
        $filter = request()->input('filter');
        if (isset($filter) && isset($filter['filters'])) {
            $key = $filter['filters'][0]['value'];
        } else {
            $key = '';
        }
        if (strlen($key) < 2) {
            $jobs = [];
        } else {
            $jobs = DB::table('jobs')->join('company', 'jobs.company_id', '=', 'company.id')
                ->select('jobs.id as job_id', 'jobs.name as job_name', 'company.id as company_id', 'company.name as company_name')
                ->whereRaw('jobs.name like "%' . $key . '%" or company.name like "%' . $key . '%"')->get();
        }
        return response($jobs);
    }

    public function getJsonUserList() {
        $users = User::join('groups', 'users.group_id', '=', 'groups.id')
            ->join('areas', 'users.area_id', '=', 'areas.id')
            ->select('users.id as user_id', 'users.nickname as user_name', 'groups.g_name as group_name', 'areas.a_name as area_name')
            ->where('status', 1)->get();
        return response($users);
    }

    public function postSaveInvoice() {
        $new_invoice = request()->input('invoice');
        $invoice = new Invoice();
        foreach ($new_invoice as $key => $value) {
            $invoice->$key = $value;
        }
        $invoice->created_by = Session::get('id');
        $invoice->save();
        return response($invoice->id);
    }

    public function postEditInvoice() {
        $new_invoice = request()->input('invoice');
        $invoice = Invoice::find($new_invoice['id']);
        foreach ($new_invoice as $key => $value) {
            $invoice->$key = $value;
        }
        $invoice->updated_by = Session::get('id');
        $invoice->save();
        return response($invoice->id);
    }

    public function postDeleteInvoice() {
        $id = request()->input('id');
        $invoice = Invoice::find($id);
        $invoice->delete();
        return response(1);
    }

}
