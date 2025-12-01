# GitHub 자동 Push 스크립트
# 사용법: .\git_auto_push.ps1

$ErrorActionPreference = "Stop"
$projectPath = "D:\No Procrastination App"
$remoteUrl = "https://github.com/Christina0922/No-Procrastination-App.git"
$branchName = "main"
$commitMessage = "Update: 최신 기능 수정 및 미루기 방지 앱 개선"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GitHub 자동 Push 스크립트 시작" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 프로젝트 디렉토리로 이동
Set-Location $projectPath
Write-Host "[1/8] 프로젝트 디렉토리로 이동: $projectPath" -ForegroundColor Green

# 1. Git 연결 상태 확인
Write-Host ""
Write-Host "[2/8] Git 연결 상태 확인 중..." -ForegroundColor Yellow

# Remote origin 확인
$remoteExists = $false
try {
    $remotes = git remote -v 2>&1
    if ($remotes -match "origin") {
        $remoteExists = $true
        Write-Host "✓ Remote 'origin' 존재함" -ForegroundColor Green
        $currentRemote = git remote get-url origin 2>&1
        Write-Host "  현재 origin URL: $currentRemote" -ForegroundColor Gray
    } else {
        Write-Host "✗ Remote 'origin' 없음" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Remote 확인 중 오류: $_" -ForegroundColor Red
}

# 브랜치 확인
Write-Host ""
Write-Host "브랜치 확인 중..." -ForegroundColor Yellow
try {
    $currentBranch = git branch --show-current 2>&1
    if ($currentBranch) {
        Write-Host "✓ 현재 브랜치: $currentBranch" -ForegroundColor Green
    } else {
        Write-Host "✗ 브랜치 정보 없음" -ForegroundColor Red
    }
    
    $allBranches = git branch -a 2>&1
    $mainBranchExists = $allBranches -match "main|master"
    if ($mainBranchExists) {
        Write-Host "✓ main/master 브랜치 존재함" -ForegroundColor Green
    } else {
        Write-Host "✗ main/master 브랜치 없음" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ 브랜치 확인 중 오류: $_" -ForegroundColor Red
}

# 2. Remote origin 설정
Write-Host ""
Write-Host "[3/8] Remote origin 설정 중..." -ForegroundColor Yellow
if (-not $remoteExists) {
    try {
        git remote add origin $remoteUrl 2>&1 | Out-Null
        Write-Host "✓ Remote 'origin' 추가됨: $remoteUrl" -ForegroundColor Green
    } catch {
        Write-Host "✗ Remote 추가 실패: $_" -ForegroundColor Red
        exit 1
    }
} else {
    # 기존 remote URL 확인 및 업데이트
    $currentUrl = git remote get-url origin 2>&1
    if ($currentUrl -ne $remoteUrl) {
        Write-Host "Remote URL 업데이트 중..." -ForegroundColor Yellow
        git remote set-url origin $remoteUrl 2>&1 | Out-Null
        Write-Host "✓ Remote URL 업데이트됨: $remoteUrl" -ForegroundColor Green
    } else {
        Write-Host "✓ Remote URL 이미 올바름" -ForegroundColor Green
    }
}

# 3. Main 브랜치로 전환/생성
Write-Host ""
Write-Host "[4/8] Main 브랜치 설정 중..." -ForegroundColor Yellow
try {
    $currentBranch = git branch --show-current 2>&1
    $mainExists = git branch -a 2>&1 | Select-String -Pattern "\bmain\b|\bmaster\b"
    
    if ($mainExists) {
        if ($currentBranch -ne "main" -and $currentBranch -ne "master") {
            Write-Host "Main 브랜치로 전환 중..." -ForegroundColor Yellow
            git checkout main 2>&1 | Out-Null
            if ($LASTEXITCODE -ne 0) {
                git checkout master 2>&1 | Out-Null
                git branch -m master main 2>&1 | Out-Null
            }
            Write-Host "✓ Main 브랜치로 전환됨" -ForegroundColor Green
        } else {
            Write-Host "✓ 이미 main 브랜치에 있음" -ForegroundColor Green
        }
    } else {
        Write-Host "Main 브랜치 생성 중..." -ForegroundColor Yellow
        if ($currentBranch) {
            git checkout -b main 2>&1 | Out-Null
        } else {
            git checkout -b main --orphan 2>&1 | Out-Null
        }
        Write-Host "✓ Main 브랜치 생성됨" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ 브랜치 설정 실패: $_" -ForegroundColor Red
    exit 1
}

# 4. 모든 변경사항 추가
Write-Host ""
Write-Host "[5/8] 변경사항 스테이징 중 (git add .)..." -ForegroundColor Yellow
try {
    git add . 2>&1 | Out-Null
    $stagedFiles = git diff --cached --name-only 2>&1
    $modifiedFiles = git diff --name-only 2>&1
    $untrackedFiles = git ls-files --others --exclude-standard 2>&1
    
    $totalChanges = ($stagedFiles.Count + $modifiedFiles.Count + $untrackedFiles.Count)
    if ($totalChanges -gt 0) {
        Write-Host "✓ $totalChanges 개 파일 스테이징됨" -ForegroundColor Green
        if ($stagedFiles.Count -gt 0) {
            Write-Host "  스테이징된 파일:" -ForegroundColor Gray
            $stagedFiles | ForEach-Object { Write-Host "    - $_" -ForegroundColor Gray }
        }
    } else {
        Write-Host "⚠ 변경사항 없음 (이미 커밋됨)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ git add 실패: $_" -ForegroundColor Red
    exit 1
}

# 5. 커밋
Write-Host ""
Write-Host "[6/8] 커밋 생성 중..." -ForegroundColor Yellow
try {
    $hasChanges = git diff --cached --quiet 2>&1
    if ($LASTEXITCODE -ne 0) {
        git commit -m $commitMessage 2>&1 | Out-Null
        Write-Host "✓ 커밋 생성됨: $commitMessage" -ForegroundColor Green
        $commitHash = git log -1 --format="%h" 2>&1
        Write-Host "  커밋 해시: $commitHash" -ForegroundColor Gray
    } else {
        Write-Host "⚠ 커밋할 변경사항 없음" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ 커밋 실패: $_" -ForegroundColor Red
    exit 1
}

# 6. GitHub로 Push
Write-Host ""
Write-Host "[7/8] GitHub로 Push 중..." -ForegroundColor Yellow
try {
    $pushOutput = git push -u origin main 2>&1
    $pushSuccess = $LASTEXITCODE -eq 0
    
    if ($pushSuccess) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "✓ Successfully pushed to GitHub!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Push 로그:" -ForegroundColor Cyan
        Write-Host $pushOutput -ForegroundColor White
        Write-Host ""
        
        # 최신 커밋 정보 출력
        $latestCommit = git log -1 --format="%h - %s (%ar)" 2>&1
        Write-Host "최신 커밋: $latestCommit" -ForegroundColor Gray
    } else {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Red
        Write-Host "✗ Push 실패!" -ForegroundColor Red
        Write-Host "========================================" -ForegroundColor Red
        Write-Host ""
        Write-Host "오류 로그:" -ForegroundColor Yellow
        Write-Host $pushOutput -ForegroundColor Red
        Write-Host ""
        
        # 인증 오류 확인
        if ($pushOutput -match "authentication|credential|token|PAT|permission denied") {
            Write-Host "========================================" -ForegroundColor Yellow
            Write-Host "GitHub 인증 오류 감지!" -ForegroundColor Yellow
            Write-Host "========================================" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "해결 방법:" -ForegroundColor Cyan
            Write-Host "1. GitHub Personal Access Token (PAT) 발급:" -ForegroundColor White
            Write-Host "   - https://github.com/settings/tokens 접속" -ForegroundColor Gray
            Write-Host "   - 'Generate new token (classic)' 클릭" -ForegroundColor Gray
            Write-Host "   - 'repo' 권한 선택" -ForegroundColor Gray
            Write-Host "   - 토큰 생성 후 복사" -ForegroundColor Gray
            Write-Host ""
            Write-Host "2. Git Credential 설정:" -ForegroundColor White
            Write-Host "   git config --global credential.helper wincred" -ForegroundColor Gray
            Write-Host ""
            Write-Host "3. 또는 GitHub CLI 사용:" -ForegroundColor White
            Write-Host "   gh auth login" -ForegroundColor Gray
            Write-Host ""
        }
        exit 1
    }
} catch {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "✗ Push 중 예외 발생!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "오류: $_" -ForegroundColor Red
    Write-Host ""
    exit 1
}

# 8. 완료
Write-Host ""
Write-Host "[8/8] 모든 작업 완료!" -ForegroundColor Green
Write-Host ""
Write-Host "GitHub 저장소 확인:" -ForegroundColor Cyan
Write-Host "https://github.com/Christina0922/No-Procrastination-App" -ForegroundColor Blue
Write-Host ""

