<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FavoriteTargetDynamic extends Model
{
    use SoftDeletes;

    protected $table = 'favorite_target_dynamics';
}
