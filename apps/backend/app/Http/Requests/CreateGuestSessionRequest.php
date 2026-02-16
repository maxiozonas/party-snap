<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateGuestSessionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'token' => 'required|string|min:1',
            'guest_name' => 'required|string|min:2|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'token.required' => 'El token es requerido.',
            'token.min' => 'El token es requerido.',
            'guest_name.required' => 'Por favor, ingresa tu nombre.',
            'guest_name.min' => 'El nombre debe tener al menos 2 caracteres.',
            'guest_name.max' => 'El nombre no puede exceder 100 caracteres.',
        ];
    }
}
