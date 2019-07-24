<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Performance extends Model
{
    public $timestamps = false;
    protected $table = 'performance';
}
