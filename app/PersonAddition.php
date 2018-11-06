<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PersonAddition extends Model
{
    use SoftDeletes;

    protected $table = 'person_addition';
}
