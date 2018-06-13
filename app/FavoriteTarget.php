<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FavoriteTarget extends Model
{
    use SoftDeletes;

    protected $table = 'favorite_targets';
}
