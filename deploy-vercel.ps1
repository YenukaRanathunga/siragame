# Deploy Cyber-Ops 3D to Vercel via Official Vercel REST API
param (
    [string]$Token
)

if (-not $Token) {
    Write-Host "Please enter your Vercel Access Token (create one at https://vercel.com/account/tokens):" -ForegroundColor Cyan
    $Token = Read-Host -Prompt "Token"
}

if (-not $Token) {
    Write-Host "[-] No token provided. Exiting." -ForegroundColor Red
    exit 1
}

$root = $PSScriptRoot
$fileNames = @("index.html", "style.css", "game.js", "character.js", "world.js", "terminal-ui.js", "challenges.js", "audio.js", "three.min.js", "confetti.browser.min.js", "vercel.json")
$filesList = @()

foreach ($fn in $fileNames) {
    $fp = Join-Path $root $fn
    if (Test-Path $fp) {
        $content = [System.IO.File]::ReadAllText($fp, [System.Text.Encoding]::UTF8)
        $filesList += @{
            file = $fn
            data = $content
        }
        Write-Host "Packed: $fn" -ForegroundColor Gray
    }
}

$payload = @{
    name = "ghostbit-3d"
    files = $filesList
    projectSettings = @{
        framework = $null
    }
} | ConvertTo-Json -Depth 5

Write-Host "Deploying to Vercel..." -ForegroundColor Yellow

try {
    $headers = @{
        "Authorization" = "Bearer $Token"
        "Content-Type" = "application/json"
    }

    $response = Invoke-RestMethod -Uri "https://api.vercel.com/v13/deployments" -Method Post -Headers $headers -Body $payload
    
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "   DEPLOYMENT SUCCESSFUL!                                 " -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "Project Name: $($response.name)" -ForegroundColor White
    Write-Host "Live URL    : https://$($response.url)" -ForegroundColor Cyan
    Write-Host "Inspector   : $($response.inspectorUrl)" -ForegroundColor Gray
    Write-Host "==========================================================" -ForegroundColor Green

    # Open the deployed URL in browser
    Start-Process "https://$($response.url)"
} catch {
    Write-Host "[-] Deployment Failed: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        Write-Host "API Error: $($reader.ReadToEnd())" -ForegroundColor Red
    }
}
