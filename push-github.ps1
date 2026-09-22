# Push Cyber-Ops 3D to GitHub repository: https://github.com/YenukaRanathunga/siragame
param (
    [string]$Token
)

$git = "C:\Users\Asus\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd\git.exe"

if (-not $Token) {
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host " Enter your GitHub Personal Access Token (PAT) with repo scope" -ForegroundColor White
    Write-Host " Generate one in 10s at: https://github.com/settings/tokens/new?scopes=repo" -ForegroundColor Yellow
    Write-Host "==========================================================" -ForegroundColor Cyan
    $Token = Read-Host -Prompt "GitHub Token"
}

if (-not $Token) {
    Write-Host "[-] No token provided. Exiting." -ForegroundColor Red
    exit 1
}

$repoUrl = "https://$Token@github.com/YenukaRanathunga/siragame.git"

Write-Host "Pushing files to https://github.com/YenukaRanathunga/siragame..." -ForegroundColor Yellow

try {
    & $git push -u $repoUrl main --force
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "   PUSH TO GITHUB SUCCESSFUL!                             " -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host " View your repository at: https://github.com/YenukaRanathunga/siragame" -ForegroundColor Cyan
    Start-Process "https://github.com/YenukaRanathunga/siragame"
} catch {
    Write-Host "[-] Push failed: $_" -ForegroundColor Red
}
