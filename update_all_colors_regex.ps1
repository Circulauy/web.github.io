$files = Get-ChildItem -Path "." -Filter *.html -File

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $lines = $content -split "`r`n"
    $changed = $false
    
    for ($i = 0; $i -lt $lines.Length; $i++) {
        if ($lines[$i] -match "tailwind\.config") { continue }
        if ($lines[$i] -match '\$[0-9]') { continue } # Skip prices
        
        $original = $lines[$i]
        
        $lines[$i] = [regex]::Replace($lines[$i], 'text-rp-teal([^a-zA-Z0-9\-])', 'text-rp-teal-dark$1')
        $lines[$i] = [regex]::Replace($lines[$i], 'text-rp-teal/', 'text-rp-teal-dark/')
        $lines[$i] = [regex]::Replace($lines[$i], 'bg-rp-teal([^a-zA-Z0-9\-])', 'bg-rp-teal-dark$1')
        $lines[$i] = [regex]::Replace($lines[$i], 'bg-rp-teal/', 'bg-rp-teal-dark/')
        $lines[$i] = [regex]::Replace($lines[$i], 'border-rp-teal([^a-zA-Z0-9\-])', 'border-rp-teal-dark$1')
        $lines[$i] = [regex]::Replace($lines[$i], 'border-rp-teal/', 'border-rp-teal-dark/')
        $lines[$i] = [regex]::Replace($lines[$i], 'ring-rp-teal([^a-zA-Z0-9\-])', 'ring-rp-teal-dark$1')
        $lines[$i] = [regex]::Replace($lines[$i], 'ring-rp-teal/', 'ring-rp-teal-dark/')
        
        if ($lines[$i] -ne $original) {
            $changed = $true
        }
    }
    
    if ($changed) {
        $newContent = $lines -join "`r`n"
        $utf8NoBom = New-Object System.Text.UTF8Encoding($False)
        [System.IO.File]::WriteAllText($file.FullName, $newContent, $utf8NoBom)
        Write-Host "Updated $($file.Name)"
    }
}
