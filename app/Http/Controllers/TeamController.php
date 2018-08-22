<?php
/**
 * Created by PhpStorm.
 * User: roger
 * Date: 15/10/26
 * Time: 下午4:08
 */
namespace App\Http\Controllers;

use App\Areas;
use App\Groups;
use App\HuntFace;
use App\HuntReport;
use App\HuntSuccess;
use App\Powers;
use App\User;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class TeamController extends BaseController {

    public function getRecentFaceList() {
        $face = HuntFace::select(DB::raw('*, (select nickname from users where users.id = hunt_face.created_by) as nickname'))->whereRaw('datediff(now(), date) < 30')->orderBy('date', 'desc')->get();
        return response($face);
    }

    public function getRecentOfferList() {
        $offer = HuntReport::select(DB::raw('*, (select nickname from users where users.id = hunt_report.created_by) as nickname'))->where('type', 'offer')
            ->whereRaw('datediff(now(), date) < 30')->orderBy('date', 'desc')->get();
        return response($offer);
    }

    public function getRecentSuccessList() {
        $offer = HuntSuccess::select(DB::raw('*, (select nickname from users where users.id = hunt_success.created_by) as nickname'))->whereRaw('datediff(now(), date) < 30')->orderBy('date', 'desc')->get();
        return response($offer);
    }

    public function getJsonAreaList() {
        $area = Areas::orderBy('created_at', 'desc')->get();
        return response($area);
    }

    public function getJsonGroupList() {
        $group = Groups::orderBy('created_at', 'desc')->get();
        return response($group);
    }

    public function getJsonUserList() {
        $user = User::where('id', '<>', 1)->orderBy('status', 'desc')->orderBy('created_at')->get();
        return response($user);
    }

    //区域管理：增删改
    public function postSaveArea() {
        $a_name = request()->input('a_name');
        if (isset($a_name)) {
            $area = new Areas();
            $area->a_name = $a_name;
            $area->save();
            return response($area->id);
        } else {
            return response(-1);
        }
    }

    public function postEditArea() {
        $id = request()->input('id');
        $a_name = request()->input('a_name');
        $area = Areas::find($id);
        if ($area) {
            $area->a_name = $a_name;
            $area->save();
            Groups::where('area_id', $id)->update(['area_name'=>$area->a_name]);
            User::where('area_id', $id)->update(['area_name'=>$area->a_name]);
            return response($area->id);
        } else {
            return response(-1);
        }
    }

    public function postDeleteArea() {
        $id = request()->input('id');
        $area = Areas::find($id);
        if ($area) {
            $area->delete();
            return response($area->id);
        } else {
            return response(-1);
        }
    }

    //项目组管理：增删改
    public function postSaveGroup() {
        $g_name = request()->input('g_name');
        $area_id = request()->input('area_id');
        $area_name = request()->input('area_name');
        if (isset($g_name)) {
            $group = new Groups();
            $group->g_name = $g_name;
            $group->area_id = $area_id;
            $group->area_name = $area_name;
            $group->save();
            return response($group->id);
        } else {
            return response(-1);
        }
    }

    public function postEditGroup() {
        $id = request()->input('id');
        $g_name = request()->input('g_name');
        $area_id = request()->input('area_id');
        $area_name = request()->input('area_name');
        $group = Groups::find($id);
        if ($group) {
            $group->g_name = $g_name;
            $group->area_id = $area_id;
            $group->area_name = $area_name;
            $group->save();
            User::where('group_id', $id)->update(['group_name'=>$group->g_name]);
            return response($group->id);
        } else {
            return response(-1);
        }
    }

    public function postDeleteGroup() {
        $id = request()->input('id');
        $group = Groups::find($id);
        if ($group) {
            $group->delete();
            return response($group->id);
        } else {
            return response(-1);
        }
    }

    //用户管理：修改所属项目组或状态
    public function postNewUser() {
        $id = request()->input('id');
        $name = request()->input('name');
        $nickname = request()->input('nickname');
        $password = request()->input('password');
        $email = request()->input('email');
        $job = request()->input('job');
        $date = request()->input('date');
        $group_id = request()->input('group_id');
        $group_name = request()->input('group_name');
        $area_id = request()->input('area_id');
        $area_name = request()->input('area_name');
        $user = User::where('name', $name)->orWhere('email', $email)->count();

        if ($user > 0) {
            return response(-1);
        } else {
            $user = new User();
            $user->name = $name;
            $user->nickname = $nickname;
            $user->password = md5($password);
            $user->email = $email;
            $user->job = $job;
            $user->date = $date;
            $user->group_id = $group_id;
            $user->group_name = $group_name;
            $user->area_id = $area_id;
            $user->area_name = $area_name;
            $user->save();
            return response($user->id);
        }
    }

    public function postEditUser() {
        $id = request()->input('id');
        $nickname = request()->input('nickname');
        $job = request()->input('job');
        $date = request()->input('date');
        $group_id = request()->input('group_id');
        $group_name = request()->input('group_name');
        $area_id = request()->input('area_id');
        $area_name = request()->input('area_name');
        $user = User::find($id);
        if ($user) {
            $user->nickname = $nickname;
            $user->job = $job;
            $user->date = $date;
            $user->group_id = $group_id;
            $user->group_name = $group_name;
            $user->area_id = $area_id;
            $user->area_name = $area_name;
            $user->save();
            return response($user->id);
        } else {
            return response(-1);
        }
    }

    public function postEditUserStatus() {
        $id = request()->input('id');
        $status = request()->input('status');
        $user = User::find($id);
        if ($user) {
            $user->status = $status;
            $user->save();
            return response($user->id);
        } else {
            return response(-1);
        }
    }

    public function  getJsonPowerUserListData() {
        $user = User::join('powers', 'users.power', '=', 'powers.id')
            ->select('users.id', 'users.name', 'users.nickname', 'users.group_name', 'users.area_name', 'users.date', 'users.created_at', 'powers.id as pow_id', 'powers.pow_name')
            ->where('users.id', '<>', 1)
            ->where('status', 1)->orderBy('created_at')->get();
        return response($user);
    }

    public function getJsonPowerListData() {
        $powers = Powers::orderBy('pow_sort')->get();
        return response($powers);
    }

    public function postEditUserPower() {
        $id = request()->input('id');
        $power = request()->input('power');
        $user = User::find($id);
        if ($user) {
            $user->power = $power;
            $user->save();
            return response(1);
        } else {
            return response(0);
        }
    }
}
