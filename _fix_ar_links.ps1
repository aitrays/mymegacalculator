$root = "c:\Users\aitra\Desktop\mymegacalculator.com\ar"
Get-ChildItem -Path $root -Recurse -Filter "*.html" | ForEach-Object {
    $text = Get-Content $_.FullName -Raw -Encoding UTF8
    $original = $text
    $text = $text -replace ' target="_blank" rel="noopener noreferrer"', ''
    $text = $text -replace 'https://mymegacalculator\.com/assets/og-[^"]+\.jpg', 'https://mymegacalculator.com/images/og-home.jpg'
    if ($text -ne $original) {
        Set-Content $_.FullName $text -Encoding UTF8 -NoNewline
        Write-Output "updated: $($_.Name)"
    }
}
