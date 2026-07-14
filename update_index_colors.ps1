$content = Get-Content -Path "C:\Users\anton\Downloads\web.github.io-main\web.github.io-main\index.html" -Raw -Encoding UTF8

# Define lines to process (roughly lines 1120 to 2000, excluding prices and nav bars)
$lines = $content -split "`r`n"
for ($i = 1120; $i -lt 1990; $i++) {
    # Skip catalog prices which should stay bright
    if ($lines[$i] -match '\$[0-9]') {
        continue
    }
    
    # Replace text-rp-teal with text-rp-teal-dark for better contrast
    if ($lines[$i] -match 'text-rp-teal(?!\/|-)((?:\s|").*)$') {
        $lines[$i] = [regex]::Replace($lines[$i], 'text-rp-teal(?!\/|-)', 'text-rp-teal-dark')
    }
    
    # Also replace text-rp-teal/80 or text-rp-teal/15 with dark version
    if ($lines[$i] -match 'text-rp-teal/') {
        $lines[$i] = [regex]::Replace($lines[$i], 'text-rp-teal/', 'text-rp-teal-dark/')
    }
}

$newContent = $lines -join "`r`n"
[System.IO.File]::WriteAllText("C:\Users\anton\Downloads\web.github.io-main\web.github.io-main\index.html", $newContent, [System.Text.Encoding]::UTF8)
Write-Host "Updated index.html text colors for contrast"
