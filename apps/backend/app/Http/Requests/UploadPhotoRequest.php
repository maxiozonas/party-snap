<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadPhotoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'photo' => 'required|image|mimes:jpeg,png,jpg,webp|max:8192',
            'guest_name' => 'nullable|string|max:20',
        ];
    }

    public function messages(): array
    {
        return [
            'photo.required' => 'The photo field is required.',
            'photo.image' => 'The file must be an image.',
            'photo.mimes' => 'The photo must be a file of type: jpeg, png, jpg, webp.',
            'photo.max' => 'The photo may not be greater than 8MB.',
            'guest_name.max' => 'The guest name may not be greater than 20 characters.',
        ];
    }
}
