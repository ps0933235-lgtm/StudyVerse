# ===================================================================
# StudyVerse — Local Static Web Server Launcher (PowerShell)
# Launches an instant local web server on http://localhost:8080/
# or opens index.html in the default web browser.
# ===================================================================

$port = 8080
$url = "http://localhost:$port/"
$folder = $PSScriptRoot

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   StudyVerse — Your Smart Student Universe" -ForegroundColor Yellow
Write-Host "   Plan Smart. Learn Better. Achieve More." -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

# Check if user wants to launch directly in browser or run HttpListener
Write-Host "Starting local server at $url ..." -ForegroundColor Green

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)

try {
    $listener.Start()
    Write-Host "Server running at $url (Press Ctrl+C to stop)" -ForegroundColor Green
    Start-Process $url

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $relPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($relPath)) {
            $relPath = "index.html"
        }

        $filePath = Join-Path $folder $relPath

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            # MIME types
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            switch ($ext) {
                ".html" { $response.ContentType = "text/html; charset=utf-8" }
                ".css"  { $response.ContentType = "text/css; charset=utf-8" }
                ".js"   { $response.ContentType = "application/javascript; charset=utf-8" }
                ".json" { $response.ContentType = "application/json; charset=utf-8" }
                ".png"  { $response.ContentType = "image/png" }
                ".jpg"  { $response.ContentType = "image/jpeg" }
                ".svg"  { $response.ContentType = "image/svg+xml" }
                default { $response.ContentType = "application/octet-stream" }
            }

            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $err = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($err, 0, $err.Length)
        }

        $response.Close()
    }
} catch {
    Write-Warning "HttpListener notice: Opening index.html directly via default browser..."
    Start-Process (Join-Path $folder "index.html")
} finally {
    if ($listener) {
        $listener.Stop()
        $listener.Close()
    }
}
