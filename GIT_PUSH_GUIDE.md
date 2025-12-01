# GitHub 자동 Push 가이드

## 📌 자동 Push 스크립트 사용법

프로젝트 루트에 `git_auto_push.ps1` 스크립트가 생성되었습니다.
이 스크립트는 다음 작업을 자동으로 수행합니다:

### 실행 방법

```powershell
cd "D:\No Procrastination App"
.\git_auto_push.ps1
```

또는 PowerShell에서:

```powershell
powershell -ExecutionPolicy Bypass -File "D:\No Procrastination App\git_auto_push.ps1"
```

### 스크립트가 수행하는 작업

1. ✅ **Git 연결 상태 확인**
   - Remote origin 존재 여부 확인
   - 브랜치 이름(main/master) 확인
   - GitHub 인증 오류(PAT 만료) 여부 확인

2. ✅ **Remote origin 자동 연결**
   - 없으면 `https://github.com/Christina0922/No-Procrastination-App.git` 연결
   - 있으면 URL 확인 및 업데이트

3. ✅ **Main 브랜치 설정**
   - 현재 브랜치를 main으로 전환
   - main 브랜치가 없으면 생성

4. ✅ **변경사항 스테이징**
   - `git add .` 실행
   - 변경된 파일 목록 표시

5. ✅ **커밋 생성**
   - 메시지: "Update: 최신 기능 수정 및 미루기 방지 앱 개선"

6. ✅ **GitHub로 Push**
   - `git push -u origin main` 실행
   - Push 성공 여부 확인

7. ✅ **Push 로그 출력**
   - 'Successfully pushed to GitHub' 문구 확인
   - 최신 커밋 정보 표시

8. ✅ **인증 오류 처리**
   - GitHub 인증 오류 감지 시 해결 방법 안내
   - PAT 발급 방법 제공

### 수동 실행 (스크립트 없이)

```powershell
cd "D:\No Procrastination App"

# 1. Git 연결 상태 확인
git remote -v
git branch --show-current

# 2. Remote origin 설정 (없는 경우)
git remote add origin https://github.com/Christina0922/No-Procrastination-App.git

# 3. Main 브랜치로 전환
git checkout main

# 4. 변경사항 추가
git add .

# 5. 커밋
git commit -m "Update: 최신 기능 수정 및 미루기 방지 앱 개선"

# 6. Push
git push -u origin main
```

### GitHub 인증 오류 해결

만약 Push 시 인증 오류가 발생하면:

1. **Personal Access Token (PAT) 발급**
   - https://github.com/settings/tokens 접속
   - 'Generate new token (classic)' 클릭
   - 'repo' 권한 선택
   - 토큰 생성 후 복사

2. **Git Credential 설정**
   ```powershell
   git config --global credential.helper wincred
   ```

3. **또는 GitHub CLI 사용**
   ```powershell
   gh auth login
   ```

### 확인 방법

Push 완료 후:

1. **GitHub에서 확인**
   - https://github.com/Christina0922/No-Procrastination-App
   - 최신 커밋 메시지 확인

2. **로컬에서 확인**
   ```powershell
   git log -1 --oneline
   git status
   ```

## 📝 참고사항

- 스크립트는 프로젝트 루트에 저장되어 있습니다
- 실행 전에 변경사항이 있는지 확인하세요
- 인증 오류 발생 시 위의 해결 방법을 참고하세요

