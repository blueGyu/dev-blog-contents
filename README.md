# 게시글 썸네일 자동 생성

GitHub Push 이벤트 발생 시, 게시글의 썸네일 자동 생성 기능이 포함된 블로그 콘텐츠 레포지토리입니다.

## 🚀 기능

- **자동 썸네일 생성**: `.mdx` 또는 `.md` 파일 변경 시 자동 생성
- **GitHub Actions 연동**: 푸시 이벤트 기반 자동 실행
- **로컬 실행 지원**: 로컬 환경에서도 썸네일 생성 가능

## 📁 프로젝트 구조

```
├── .github/
│    └── workflows/
│        └── thumbnail-generator.yml  # GitHub Actions 워크플로우
├── fonts/                            # 썸네일 생성에 사용되는 폰트
├── scripts/
│   └── enerate-thumbnails.js         # 썸네일 생성 스크립트
├── src/                              # 게시글 디렉토리
│   └── some-category/
│       └── some-slug/
│           ├── article.mdx
│           └── thumbnail.png
├── .gitignore
├── package.json
└── package-lock.json
```

## 🛠️ 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 로컬에서 썸네일 생성

```bash
# 모든 MDX/MD 파일에 대해 썸네일 생성
npm run generate-thumbnails

# 또는 직접 스크립트 실행
node scripts/generate-thumbnails.js

# 특정 파일에 대해서만 썸네일 생성
node scripts/generate-thumbnails.js src/contents/category/slug/test.mdx
```

## ⚙️ GitHub Actions 설정

`.github/workflows/thumbnail-generator.yml` 파일이 포함되어 있습니다.
해당 워크플로우는 다음 조건에서 동작합니다:

- `src/**/*.mdx, src/**/*.md` 파일이 추가/수정될 때
- satori로 HTML → SVG 변환 후 resvg-js로 PNG 렌더링
- 썸네일은 마크다운 파일과 같은 디렉토리에 저장

🔒 PERSONAL_TOKEN을 secrets에 등록해야 합니다. (권한: contents: write)

## 📝 게시글 작성 예시

게시글은 `src` 디렉토리 아래에 MDX 또는 MD 형식으로 작성합니다.

**예시 (test.mdx):**

```mdx
---
title: "게시글 제목"
description: "게시글 요약"
date: "2025-07-18"
tags: ["test", "contents"]
thumbnail: "./path/your/thumbnail.png"
---

## 소제목 1

소제목 내용...
```

## 🖼️ 썸네일 디자인

- 크기: 1200x630px (OG 최적화)
- 배경: 보라 계열 그라데이션
- 포함 요소: title
- 형식: .png (고화질)

디자인 커스터마이징은 scripts/generate-thumbnails.js 내 [satori](https://github.com/vercel/satori)
설정 수정.

## 🔄 자동 동작

| 이벤트                          | 동작                     |
| ------------------------------- | ------------------------ |
| `.mdx`/`.md` 파일 **추가/수정** | 썸네일 생성 후 자동 커밋 |

## 📦 주요 의존성

- satori: HTML to SVG 변환
- resvg-js: SVG to PNG 렌더링

## 🔧 문제 해결

### 썸네일이 생성되지 않는 경우

- MDX/MD 파일에 `title` 필드가 있는지 확인
- 파일 경로가 `src` 아래에 있는지 확인
- GitHub Actions 로그 확인

### 로컬 실행 오류

- Node.js 18 이상 설치 확인
- npm install 수행 여부 확인
- 폰트 파일 누락 여부 확인

## 📄 라이선스

MIT License
