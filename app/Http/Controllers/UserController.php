<?php
/**
 * Created by PhpStorm.
 * User: roger
 * Date: 15/10/14
 * Time: 上午12:00
 */
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Support\Facades\Session;

class UserController extends Controller {
    public function getIndex () {
        return view('user.index');
    }

    public function getLogin () {
        return view('user.login');
    }

    public function getRegister () {
        return view('user.register');
    }

    public function anyForget () {
        return redirect('/user/login');
    }

    public function getJsonUserInfo() {
        $id = Session::get('id');
        $user = User::join('groups', 'users.group_id', '=', 'groups.id')
            ->join('areas', 'users.area_id', '=', 'areas.id')
        ->where('users.id', $id)->first();
        return response($user);
    }

    public function postSaveInfo() {
        $info = request()->input('user');
        $user = User::find(Session::get('id'));
        if ($user) {
            $user->date = $info['date'];
            $user->group = $info['group'];
            $user->job = $info['job'];
            $user->save();
            return response(1);
        } else {
            return response(0);
        }
    }

    public function postSavePassword() {
        $password = request()->input('password');
        $user = User::find(Session::get('id'));
        if ($user->password == md5($password['old'])) {
            $user->password = md5($password['new']);
            $user->save();
            return response(1);
        } else {
            return response(0);
        }
    }
}