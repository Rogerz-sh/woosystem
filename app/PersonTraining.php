<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PersonTraining extends Model
{
    use SoftDeletes;

    protected $table = 'person_training';
}
