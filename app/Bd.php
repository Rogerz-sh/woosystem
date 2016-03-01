<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bd extends Model
{
    use SoftDeletes;

    protected $table = 'bd';
}
