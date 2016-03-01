<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BdRecord extends Model
{
    use SoftDeletes;

    protected $table = 'bd_records';
}
