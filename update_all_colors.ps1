$directory = "C:\Users\anton\Downloads\web.github.io-main\web.github.io-main"
$files = Get-ChildItem -Path $directory -Filter *.html -File

$count = 0
foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $lines = $content -split "`r`n"
    $changed = $false
    
    for ($i = 0; $i -lt $lines.Length; $i++) {
        # Skip tailwind config script tag line
        if ($lines[$i] -match "tailwind\.config") {
            continue
        }
        
        # Skip lines with prices (e.g. $379, $1.400)
        if ($lines[$i] -match '\$[0-9]') {
            continue
        }
        
        # Skip SVG lines (icons can stay bright teal, or maybe they should be dark too? 
        # Actually, let's make everything dark teal for maximum premium feel except prices)

        $original = $lines[$i]
        
        # Replace occurrences, but avoid replacing already dark ones
        $lines[$i] = [regex]::Replace($lines[$i], 'text-rp-teal(?!\/|-dark)', 'text-rp-teal-dark')
        $lines[$i] = [regex]::Replace($lines[$i], 'bg-rp-teal(?!\/|-dark)', 'bg-rp-teal-dark')
        $lines[$i] = [regex]::Replace($lines[$i], 'border-rp-teal(?!\/|-dark)', 'border-rp-teal-dark')
        $lines[$i] = [regex]::Replace($lines[$i], 'text-rp-teal/', 'text-rp-teal-dark/')
        $lines[$i] = [regex]::Replace($lines[$i], 'bg-rp-teal/', 'bg-rp-teal-dark/')
        $lines[$i] = [regex]::Replace($lines[$i], 'border-rp-teal/', 'border-rp-teal-dark/')
        
        if ($lines[$i] -ne $original) {
            $changed = $true
        }
    }
    
    if ($changed) {
        $newContent = $lines -join "`r`n"
        $utf8NoBom = New-Object System.Text.UTF8Encoding($False)
        [System.IO.File]::WriteAllText($file.FullName, $newContent, $utf8NoBom)
        Write-Host "Updated $($file.Name)"
        $count++
    }
}
Write-Host "Total files updated: $count"
