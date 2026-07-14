$directory = "C:\Users\anton\Downloads\web.github.io-main\web.github.io-main"
$files = Get-ChildItem -Path $directory -Filter *.html -File

$count = 0
foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    # We use regex to find the tailwind config and inject the new color
    $pattern = "'rp-teal':\s*'(#79C7C7|#79c7c7)'(?!, 'rp-teal-dark')"
    $replacement = "'rp-teal': '`$1', 'rp-teal-dark': '#3B7A7A'"
    
    $newContent = [regex]::Replace($content, $pattern, $replacement, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    
    if ($newContent -ne $content) {
        # Explicitly write without BOM for standard UTF-8 (which is important for web files)
        [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.Encoding]::UTF8)
        Write-Host "Updated $($file.Name)"
        $count++
    }
}
Write-Host "Total files updated: $count"
