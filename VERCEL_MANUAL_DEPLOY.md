# Vercel 수동 재배포 가이드

## 🔄 Vercel에서 수동으로 재배포하는 방법

### 방법 1: Deployments 탭에서 재배포

1. **Vercel 대시보드 접속**
   - https://vercel.com 접속
   - 로그인 (GitHub 계정)

2. **프로젝트 선택**
   - "no-procrastination-app" 프로젝트 클릭

3. **Deployments 탭 열기**
   - 상단 메뉴에서 "Deployments" 클릭

4. **최신 배포 찾기**
   - 가장 위에 있는 배포 확인
   - 커밋 메시지: "Add: GitHub 자동 Push 스크립트 및 가이드 문서 추가"

5. **재배포 실행**
   - 배포 카드 오른쪽 상단의 "..." (세 점) 메뉴 클릭
   - "Redeploy" 선택
   - 확인 대화상자에서 "Redeploy" 클릭

### 방법 2: Git 연결에서 재배포

1. **Settings 메뉴**
   - 프로젝트 페이지에서 "Settings" 클릭

2. **Git 섹션**
   - 왼쪽 메뉴에서 "Git" 클릭

3. **재배포 버튼**
   - "Redeploy" 또는 "Trigger Deployment" 버튼 클릭

### 방법 3: GitHub에서 Webhook 트리거

1. **GitHub 저장소 접속**
   - https://github.com/Christina0922/No-Procrastination-App

2. **최신 커밋 확인**
   - 커밋 메시지가 "Add: GitHub 자동 Push 스크립트 및 가이드 문서 추가"인지 확인

3. **빈 커밋 푸시 (강제 트리거)**
   ```bash
   cd "D:\No Procrastination App"
   git commit --allow-empty -m "Trigger Vercel deployment"
   git push origin main
   ```

## ⏱️ 배포 시간

- **빌드 시간**: 약 2-3분
- **배포 시간**: 약 1-2분
- **총 소요 시간**: 약 3-5분

## ✅ 배포 완료 확인

1. **Vercel 대시보드**
   - Deployments 탭에서 상태가 "Ready" (초록색)로 변경되면 완료

2. **배포 URL 접속**
   - https://no-procrastination-app.vercel.app
   - 페이지가 정상적으로 열리면 완료

3. **새 기능 확인**
   - `git_auto_push.ps1` 파일이 있는지 확인
   - `GIT_PUSH_GUIDE.md` 파일이 있는지 확인
   - README.md에 "최근 업데이트" 섹션이 있는지 확인

## 🚨 문제 해결

### Vercel이 최신 커밋을 감지하지 못할 때

1. **GitHub 연결 확인**
   - Vercel Settings → Git
   - GitHub 저장소가 올바르게 연결되어 있는지 확인

2. **Webhook 확인**
   - GitHub 저장소 → Settings → Webhooks
   - Vercel webhook이 활성화되어 있는지 확인

3. **수동 재배포**
   - 위의 "방법 1" 또는 "방법 2" 사용

### 빌드 에러가 발생할 때

1. **Build Logs 확인**
   - 실패한 배포 클릭
   - "Build Logs" 탭 확인
   - 에러 메시지 확인

2. **로컬에서 빌드 테스트**
   ```bash
   cd "D:\No Procrastination App"
   npm run build
   ```
   - 로컬 빌드가 성공하면 Vercel에서도 성공할 가능성이 높음

