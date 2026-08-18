$root = "c:\Users\aitra\Desktop\mymegacalculator.com"
Get-ChildItem -Path $root -Recurse -Filter "*.html" | ForEach-Object {
    $text = Get-Content $_.FullName -Raw -Encoding UTF8
    $original = $text
    $text = $text -replace '<base target="_blank">\r?\n', ''
    $text = $text -replace 'https://mymegacalculator\.com/og-image\.jpg', 'https://mymegacalculator.com/images/og-home.jpg'
    $text = $text -replace 'https://mymegacalculator\.com/ar/index\.html', 'https://mymegacalculator.com/ar/'
    $text = $text -replace 'https://mymegacalculator\.com/index\.html', 'https://mymegacalculator.com/'
    $text = [regex]::Replace($text, 'https://mymegacalculator\.com/([a-z0-9\-/]+)\.html', 'https://mymegacalculator.com/$1')
    if ($text -ne $original) {
        Set-Content $_.FullName $text -Encoding UTF8 -NoNewline
        Write-Output "updated: $($_.FullName)"
    }
}
