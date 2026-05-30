<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\ResetsUserPasswords;

class ResetUserPassword implements ResetsUserPasswords
{
    use PasswordValidationRules;

    /**
     * Validate and reset the user's forgotten password.
     *
     * @param  array<string, string>  $input
     */
    public function reset(User $user, array $input): void
    {
        // creates a new validator instance
        Validator::make($input, [
            // specifies the password field fromt the user's input must pass
            // the rules defined in the passwordRules() methon
            'password' => $this->passwordRules(),
        ])->validate(); // runs validation, if rules not met, it stops

        // if validation passes, this code updates the users password in the db
        $user->forceFill([
            'password' => $input['password'],
        ])->save();
    }
}
