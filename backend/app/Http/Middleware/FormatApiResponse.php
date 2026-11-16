<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class FormatApiResponse
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($response instanceof JsonResponse) {
            $data = $response->getData(true);
            if (is_array($data)) {
                $status = $response->getStatusCode();
                if ($status >= 200 && $status < 300) {
                    if (!array_key_exists('success', $data)) {
                        $data['success'] = true;
                    }
                } elseif ($status >= 400) {
                    if (!array_key_exists('success', $data)) {
                        $data['success'] = false;
                    }
                    if (!array_key_exists('error', $data) && !empty($data['message'])) {
                        $data['error'] = $data['message'];
                    }
                }
                $response->setData($data);
            }
        }

        return $response;
    }
}
