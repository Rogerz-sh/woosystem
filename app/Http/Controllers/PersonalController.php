<?php
/**
 * Created by PhpStorm.
 * User: roger
 * Date: 15/10/26
 * Time: 下午4:08
 */
namespace App\Http\Controllers;

use App\Areas;
use App\Favorite;
use App\FavoriteTarget;
use App\Groups;
use App\User;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class PersonalController extends BaseController {

    public function getJsonFavoriteList() {
        $type = request()->input('type');
        $favorites = Favorite::where('user_id', Session::get('id'))->where('type', $type)->get();

        return response($favorites);
    }

    public function postAddFavorite() {
        $parent_id = request()->input('parent_id');
        $name = request()->input('name');
        $user_id = Session::get('id');
        $type = 'person';

        $favorite = new Favorite();
        $favorite->parent_id = $parent_id;
        $favorite->name = $name;
        $favorite->user_id = $user_id;
        $favorite->type = $type;
        $favorite->save();

        return response($favorite->id);
    }

    public function postEditFavorite() {
        $id = request()->input('id');
        $name = request()->input('name');

        $favorite = Favorite::find($id);
        if ($favorite) {
            $favorite->name = $name;
            $favorite->save();
            return response($favorite->id);
        } else {
            return response(-1);
        }
    }

    public function postDeleteFavorite() {
        $id = request()->input('id');

        $targets = FavoriteTarget::where('favorite_id', $id)->first();
        if ($targets) {
            return response(-1);
        } else {
            $favorite = Favorite::find($id);
            if ($favorite) {
                $favorite->delete();
                return response(1);
            } else {
                return response(0);
            }
        }
    }

    public function getJsonPersonFavoriteData() {
        $favorite_id = request()->input('favorite_id');

        if ($favorite_id == 0) {
            $favorite_targets = FavoriteTarget::join('person', 'favorite_targets.target_id', '=', 'person.id');
        } else {
            $favorite_targets = FavoriteTarget::join('person', 'favorite_targets.target_id', '=', 'person.id')
                ->whereRaw('favorite_targets.favorite_id in (select favorites.id from favorites where favorites.id = ' . $favorite_id . ' or favorites.parent_id = ' . $favorite_id . ')');
        }
        $favorite_targets = $favorite_targets->select('favorite_targets.id', 'person.id as person_id', 'person.name', 'person.age', 'person.sex', 'person.degree', 'person.job', 'person.company', 'person.tel', 'person.source', 'person.created_at', 'person.updated_at')->get();
        return response($favorite_targets);
    }

    public function getJsonPersonNonFavoriteData() {
        $filter = request()->input('filter');
        $favorite_id = request()->input('favorite_id');

        if ($favorite_id == 0) {
            $whereStr = ' where person.id not in (select favorite_targets.target_id from favorite_targets where favorite_targets.user_id = '.Session::get('id').')';
        } else {
            $whereStr = ' where person.id not in (select favorite_targets.target_id from favorite_targets where favorite_targets.favorite_id in (select favorites.id from favorites where favorites.id = ' . $favorite_id . ' or favorites.parent_id = ' . $favorite_id . '))';
        }

        if ($filter) {
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
            $candidate = DB::select('select *, (select nickname from users where users.id = person.created_by) as user_name from person'.$whereStr.' order by created_at desc limit 100');
        } else {
            $candidate = DB::select('select *, (select nickname from users where users.id = person.created_by) as user_name from person'.$whereStr.' order by created_at desc limit 100');
        }
        return response([$candidate, $filter]);
    }

    public function postAddFavoriteTarget() {
        $favorite_id = request()->input('favorite_id');
        $ids = request()->input('ids');

        foreach($ids as $id) {
            $fav_tar = new FavoriteTarget();
            $fav_tar->favorite_id = $favorite_id;
            $fav_tar->target_id = $id;
            $fav_tar->user_id = Session::get('id');
            $fav_tar->save();
        }

        return response(1);
    }

    public function postDeleteFavoriteTarget() {
        $id = request()->input('id');

        $fav_tar = FavoriteTarget::find($id);
        if ($fav_tar) {
            $fav_tar->delete();
            return response(1);
        } else {
            return response(0);
        }
    }

}
