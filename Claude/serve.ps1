$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:3456/")
$listener.Start()
while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response
    $path = $req.Url.LocalPath.TrimStart("/")
    if ($path -eq "" -or $path -eq "/") { $path = "datos-primero-preview.html" }
    $file = Join-Path "C:\Users\Trabajo\Documents\Claude" $path
    if (Test-Path $file) {
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $ext = [System.IO.Path]::GetExtension($file)
        $res.ContentType = if ($ext -eq ".html") { "text/html; charset=utf-8" } else { "text/plain" }
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $res.StatusCode = 404
    }
    $res.OutputStream.Close()
}
