<?php

namespace Tests\Feature;

use App\Models\Photo;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PhotoFeedPaginationTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_returns_first_page_with_cursor_metadata(): void
    {
        $base = CarbonImmutable::parse('2026-02-21 20:00:00');

        for ($i = 1; $i <= 12; $i++) {
            $this->createApprovedPhoto(
                guestName: "Guest {$i}",
                createdAt: $base->addSeconds($i)
            );
        }

        $response = $this->getJson('/api/v1/photos/feed?limit=10');

        $response
            ->assertOk()
            ->assertJsonStructure([
                'data',
                'has_more',
                'next_cursor',
            ]);

        $payload = $response->json();

        $this->assertCount(10, $payload['data']);
        $this->assertTrue($payload['has_more']);
        $this->assertNotNull($payload['next_cursor']);
        $this->assertSame('Guest 12', $payload['data'][0]['guest_name']);
    }

    public function test_it_uses_cursor_pagination_without_duplicates(): void
    {
        $base = CarbonImmutable::parse('2026-02-21 21:00:00');

        for ($i = 1; $i <= 21; $i++) {
            $this->createApprovedPhoto(
                guestName: "Guest {$i}",
                createdAt: $base->addSeconds($i)
            );
        }

        Photo::query()->create([
            'cloudinary_public_id' => 'rejected-photo',
            'secure_url' => 'https://example.com/rejected.jpg',
            'guest_name' => 'Rejected',
            'is_approved' => false,
            'created_at' => $base->addSeconds(999),
            'updated_at' => $base->addSeconds(999),
        ]);

        $firstPage = $this->getJson('/api/v1/photos/feed?limit=10')->assertOk()->json();
        $secondPage = $this
            ->getJson('/api/v1/photos/feed?limit=10&cursor='.$firstPage['next_cursor'])
            ->assertOk()
            ->json();
        $thirdPage = $this
            ->getJson('/api/v1/photos/feed?limit=10&cursor='.$secondPage['next_cursor'])
            ->assertOk()
            ->json();

        $this->assertCount(10, $firstPage['data']);
        $this->assertCount(10, $secondPage['data']);
        $this->assertCount(1, $thirdPage['data']);
        $this->assertTrue($firstPage['has_more']);
        $this->assertTrue($secondPage['has_more']);
        $this->assertFalse($thirdPage['has_more']);
        $this->assertNull($thirdPage['next_cursor']);

        $ids = array_merge(
            array_column($firstPage['data'], 'id'),
            array_column($secondPage['data'], 'id'),
            array_column($thirdPage['data'], 'id')
        );

        $this->assertCount(21, $ids);
        $this->assertCount(21, array_unique($ids));

        $guestNames = array_merge(
            array_column($firstPage['data'], 'guest_name'),
            array_column($secondPage['data'], 'guest_name'),
            array_column($thirdPage['data'], 'guest_name')
        );

        $this->assertNotContains('Rejected', $guestNames);
    }

    private function createApprovedPhoto(string $guestName, CarbonImmutable $createdAt): void
    {
        Photo::query()->create([
            'cloudinary_public_id' => strtolower(str_replace(' ', '-', $guestName)),
            'secure_url' => 'https://example.com/'.strtolower(str_replace(' ', '-', $guestName)).'.jpg',
            'guest_name' => $guestName,
            'is_approved' => true,
            'created_at' => $createdAt,
            'updated_at' => $createdAt,
        ]);
    }
}
