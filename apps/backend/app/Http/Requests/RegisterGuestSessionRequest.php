<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterGuestSessionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'master_token' => 'required|string|min:1',
            'guest_name' => 'required|string|min:2|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'master_token.required' => 'El token del evento es requerido.',
            'master_token.min' => 'El token del evento es requerido.',
            'guest_name.required' => 'Por favor, ingresa tu nombre.',
            'guest_name.min' => 'El nombre debe tener al menos 2 caracteres.',
            'guest_name.max' => 'El nombre no puede tener más de 100 caracteres.',
        ];
    }
}
