<?php
/**
 * Created by PhpStorm.
 * User: roger
 * Date: 15/10/26
 * Time: 下午4:08
 */
namespace App\Http\Controllers;
use App\Invoice;
use App\PayNotice;
use App\User;
use App\Hunt;
use App\Belongs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;


class FinanceController extends BaseController {

    public function getInvoiceJsonList() {
        $power = Session::get('power');
        if ($power >= 10) {
            $list = Invoice::orderBy('created_at', 'desc')->get();
            return response($list);
        } else {
            $area = Session::get('area');
            if ($area == 1) {
                $area_name = '上海';
            } else if ($area == 2) {
                $area_name = '湖南';
            } else {
                $area_name = '武汉';
            }
            $list = Invoice::where('belong', $area_name)->orderBy('created_at', 'desc')->get();
            return response($list);
        }
    }

    public function getInvoiceRequestList() {
        $power = Session::get('power');
        if ($power >= 10) {
            $list = PayNotice::where('need_invoice', 1)->where('request_status', 1)->orderBy('created_at', 'desc')->get();
            return response($list);
        } else {
            $area = Session::get('area');
            if ($area == 1) {
                $area_name = '上海';
            } else if ($area == 2) {
                $area_name = '湖南';
            } else {
                $area_name = '武汉';
            }
            $list = PayNotice::where('need_invoice', 1)->where('request_status', 1)->where('belong', $area_name)->orderBy('created_at', 'desc')->get();
            return response($list);
        }
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
        $request_id = request()->input('request_id');
        $invoice = new Invoice();
        foreach ($new_invoice as $key => $value) {
            $invoice->$key = $value;
        }
        $invoice->created_by = Session::get('id');
        $invoice->save();
        if ($request_id > 0) {
            $pay_notice = PayNotice::find($request_id);
            $pay_notice->request_status = 2;
            $pay_notice->save();
        }
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

    /***********************************************************************************************************/

    public function getPayNoticeJsonList() {
        $power = Session::get('power');
        if ($power == 2 || $power >= 10) {
            $list = PayNotice::orderBy('created_at', 'desc')->get();
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
                    $list = PayNotice::whereRaw('created_by in (' . $ids . ')');
                } else {
                    $list = PayNotice::where('created_by', Session::get('id'));
                }
            } else {
                $list = PayNotice::where('created_by', Session::get('id'));
            }
            $list = $list->orderBy('created_at', 'desc')->get();
        }
        return response($list);
    }

    public function postSavePayNotice() {
        $new_notice = request()->input('notice');
        $notice = new PayNotice();
        foreach ($new_notice as $key => $value) {
            $notice->$key = $value;
        }
        $notice->request_status = 1;
        $notice->created_by = Session::get('id');
        $notice->save();
        return response($notice->id);
    }

    public function postEditPayNotice() {
        $new_notice = request()->input('notice');
        $notice = PayNotice::find($new_notice['id']);
        foreach ($new_notice as $key => $value) {
            $notice->$key = $value;
        }
        $notice->updated_by = Session::get('id');
        $notice->save();
        return response($notice->id);
    }

    public function postAuditPayNotice() {
        $id = request()->input('id');
        $notice = PayNotice::find($id);
        $notice->status = 1;
        $notice->save();
        return response(1);
    }

    public function postPayNoticeInvoiced() {
        $id = request()->input('id');
        $notice = PayNotice::find($id);
        $notice->request_status = 2;
        $notice->save();
        return response(1);
    }

    public function postDeletePayNotice() {
        $id = request()->input('id');
        $notice = PayNotice::find($id);
        $notice->delete();
        return response(1);
    }

}
