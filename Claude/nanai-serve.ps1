$root = "C:\Users\Trabajo\Documents\Claude"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:4321/")
$listener.Prefixes.Add("http://127.0.0.1:4321/")
$listener.Start()
Write-Host "Nanai preview (multi-hilo) en http://localhost:4321/"

# Cada hilo ejecuta este bucle: acepta una peticion y la sirve. Varios hilos
# llaman a GetContext() sobre el mismo HttpListener (es seguro) => concurrencia
# real, el servidor no se bloquea aunque el navegador abra varias conexiones.
$worker = {
    param($listener, $root)
    $mime = @{
        ".html" = "text/html; charset=utf-8"
        ".css"  = "text/css; charset=utf-8"
        ".js"   = "application/javascript; charset=utf-8"
        ".json" = "application/json; charset=utf-8"
        ".svg"  = "image/svg+xml"
        ".png"  = "image/png"
        ".jpg"  = "image/jpeg"
        ".jpeg" = "image/jpeg"
        ".webp" = "image/webp"
        ".gif"  = "image/gif"
        ".ico"  = "image/x-icon"
        ".mp4"  = "video/mp4"
        ".webm" = "video/webm"
        ".woff" = "font/woff"
        ".woff2"= "font/woff2"
        ".ttf"  = "font/ttf"
    }
    while ($listener.IsListening) {
        try { $ctx = $listener.GetContext() } catch { break }
        $req = $ctx.Request
        $res = $ctx.Response
        try {
            $res.KeepAlive = $false
            $res.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")
            $path = [System.Uri]::UnescapeDataString($req.Url.LocalPath).TrimStart("/")
            if ($path -eq "" -or $path -eq "/") { $path = "index.html" }
            $file = Join-Path $root $path
            if (Test-Path $file -PathType Leaf) {
                $bytes = [System.IO.File]::ReadAllBytes($file)
                $ext = [System.IO.Path]::GetExtension($file).ToLower()
                if ($mime.ContainsKey($ext)) { $res.ContentType = $mime[$ext] } else { $res.ContentType = "application/octet-stream" }
                $res.ContentLength64 = $bytes.Length
                $res.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $res.StatusCode = 404
            }
        } catch {
            try { $res.StatusCode = 500 } catch {}
        } finally {
            try { $res.OutputStream.Close() } catch {}
            try { $res.Close() } catch {}
        }
    }
}

# Lanzar 6 hilos trabajadores
$pss = @()
for ($i = 0; $i -lt 6; $i++) {
    $ps = [powershell]::Create()
    [void]$ps.AddScript($worker).AddArgument($listener).AddArgument($root)
    [void]$ps.BeginInvoke()
    $pss += $ps
}
Write-Host "6 hilos escuchando."

# Mantener vivo el proceso principal
try {
    while ($listener.IsListening) { Start-Sleep -Milliseconds 500 }
} finally {
    $listener.Stop()
}
