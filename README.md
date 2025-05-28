## Obsidian 로컬 이미지 플러그인 상세 설계 문서

**문서 버전:** 1.0
**최종 수정일:** 2025년 5월 28일

**목차**

1.  [프로젝트 개요](https://www.google.com/search?q=%231-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EA%B0%9C%EC%9A%94)
    1.1. [플러그인명](https://www.google.com/search?q=%2311-%ED%94%8C%EB%9F%AC%EA%B7%B8%EC%9D%B8%EB%AA%85)
    1.2. [설명](https://www.google.com/search?q=%2312-%EC%84%A4%EB%AA%85)
    1.3. [제작자](https://www.google.com/search?q=%2313-%EC%A0%9C%EC%9E%91%EC%9E%90)
    1.4. [목표 및 목적](https://www.google.com/search?q=%2314-%EB%AA%A9%ED%91%9C-%EB%B0%8F-%EB%AA%A9%EC%A0%81)
2.  [주요 기능](https://www.google.com/search?q=%232-%EC%A3%BC%EC%9A%94-%EA%B8%B0%EB%8A%A5)
3.  [기술 스택 및 빌드 환경](https://www.google.com/search?q=%233-%EA%B8%B0%EC%88%A0-%EC%8A%A4%ED%83%9D-%EB%B0%8F-%EB%B9%8C%EB%93%9C-%ED%99%98%EA%B2%BD)
    3.1. [프로그래밍 언어](https://www.google.com/search?q=%2331-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D-%EC%96%B8%EC%96%B4)
    3.2. [주요 라이브러리 및 프레임워크](https://www.google.com/search?q=%2332-%EC%A3%BC%EC%9A%94-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC-%EB%B0%8F-%ED%94%84%EB%A0%88%EC%9E%84%EC%9B%8C%ED%81%AC)
    3.3. [빌드 도구](https://www.google.com/search?q=%2333-%EB%B9%8C%EB%93%9C-%EB%8F%84%EA%B5%AC)
    3.4. [개발 의존성](https://www.google.com/search?q=%2334-%EA%B0%9C%EB%B0%9C-%EC%9D%98%EC%A1%B4%EC%84%B1)
4.  [코드 아키텍처 및 구조](https://www.google.com/search?q=%234-%EC%BD%94%EB%93%9C-%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98-%EB%B0%8F-%EA%B5%AC%EC%A1%B0)
    4.1. [디렉토리 구조 (예상)](https://www.google.com/search?q=%2341-%EB%94%94%EB%A0%89%ED%86%A0%EB%A6%AC-%EA%B5%AC%EC%A1%B0-%EC%98%88%EC%83%81)
    4.2. [주요 파일 설명](https://www.google.com/search?q=%2342-%EC%A3%BC%EC%9A%94-%ED%8C%8C%EC%9D%BC-%EC%84%A4%EB%AA%85)
    4.2.1. [`src/main.ts`](https://www.google.com/search?q=%23421-srcmaints)
    4.2.2. [`src/config.ts`](https://www.google.com/search?q=%23422-srcconfigts)
    4.2.3. [`src/contentProcessor.ts`](https://www.google.com/search?q=%23423-srccontentprocessorts)
    4.2.4. [`src/utils.ts`](https://www.google.com/search?q=%23424-srcutilsts)
    4.2.5. [`manifest.json`](https://www.google.com/search?q=%23425-manifestjson)
    4.2.6. [`package.json`](https://www.google.com/search?q=%23426-packagejson)
    4.2.7. [`tsconfig.json`](https://www.google.com/search?q=%23427-tsconfigjson)
    4.2.8. [`esbuild.config.mjs`](https://www.google.com/search?q=%23428-esbuildconfigmjs)
5.  [상세 기능 명세](https://www.google.com/search?q=%235-%EC%83%81%EC%84%B8-%EA%B8%B0%EB%8A%A5-%EB%AA%85%EC%84%B8)
    5.1. [플러그인 초기화 및 UI 등록 (main.ts)](https://www.google.com/search?q=%2351-%ED%94%8C%EB%9F%AC%EA%B7%B8%EC%9D%B8-%EC%B4%88%EA%B8%B0%ED%99%94-%EB%B0%8F-ui-%EB%93%B1%EB%A1%9D-maints)
    5.2. [설정 관리 (config.ts, main.ts)](https://www.google.com/search?q=%2352-%EC%84%A4%EC%A0%95-%EA%B4%80%EB%A6%AC-configts-maints)
    5.3. [콘텐츠 처리 (contentProcessor.ts)](https://www.google.com/search?q=%2353-%EC%BD%98%ED%85%90%EC%B8%A0-%EC%B2%98%EB%A6%AC-contentprocessorts)
    5.4. [유틸리티 함수 (utils.ts)](https://www.google.com/search?q=%2354-%EC%9C%A0%ED%8B%B8%EB%A6%AC%ED%8B%B0-%ED%95%A8%EC%88%98-utilsts)
6.  [워크플로우](https://www.google.com/search?q=%236-%EC%9B%8C%ED%81%AC%ED%94%8C%EB%A1%9C%EC%9A%B0)
7.  [에러 처리 및 알림](https://www.google.com/search?q=%237-%EC%97%90%EB%9F%AC-%EC%B2%98%EB%A6%AC-%EB%B0%8F-%EC%95%8C%EB%A6%BC)
8.  [빌드 및 개발](https://www.google.com/search?q=%238-%EB%B9%8C%EB%93%9C-%EB%B0%8F-%EA%B0%9C%EB%B0%9C)
    8.1. [개발 모드](https://www.google.com/search?q=%2381-%EA%B0%9C%EB%B0%9C-%EB%AA%A8%EB%93%9C)
    8.2. [프로덕션 빌드](https://www.google.com/search?q=%2382-%ED%94%84%EB%A1%9C%EB%8D%95%EC%85%98-%EB%B9%8C%EB%93%9C)
9.  [구현을 위한 제언](https://www.google.com/search?q=%239-%EA%B5%AC%ED%98%84%EC%9D%84-%EC%9C%84%ED%95%9C-%EC%A0%9C%EC%96%B8)

---

### 1\. 프로젝트 개요

#### 1.1. 플러그인명

-   **공식 명칭 (manifest.json):** Local Images
-   **패키지명 (package.json):** obsidian-local-images-modernized

#### 1.2. 설명

-   **manifest.json:** "Downloads external images in the current note to your vault and updates links." (현재 노트의 외부 이미지를 로컬 저장소(vault)로 다운로드하고 링크를 업데이트합니다.)
-   **package.json:** "Modernized Obsidian plugin to download local images." (로컬 이미지 다운로드를 위한 현대화된 Obsidian 플러그인입니다.)

#### 1.3. 제작자

-   JaewonE (GitHub: [https://github.com/jaewonE](https://www.google.com/url?sa=E&source=gmail&q=https://github.com/jaewonE))

#### 1.4. 목표 및 목적

이 플러그인의 주요 목표는 Obsidian 사용자가 노트에 포함된 외부 호스팅 이미지를 자신의 로컬 Obsidian 저장소(Vault)로 쉽게 다운로드하고, 해당 이미지 링크를 로컬 경로로 자동 업데이트하여 콘텐츠의 영속성과 오프라인 접근성을 보장하는 것입니다. 이를 통해 외부 서버의 문제나 인터넷 연결 부재 시에도 이미지 유실 없이 노트를 관리할 수 있도록 지원합니다. "modernized"라는 키워드는 기존 유사 기능 플러그인의 개선 또는 최신 Obsidian API 및 개발 관행을 적용했음을 시사합니다.

### 2\. 주요 기능

1.  **외부 이미지 자동 감지:** 현재 활성화된 마크다운 노트에서 외부 URL(HTTP, HTTPS)을 사용하는 이미지 태그 (`![]()` 및 잠재적으로 `<img>`)를 식별합니다.
2.  **선택적 이미지 다운로드:** 식별된 외부 이미지를 사용자의 로컬 Vault 내 지정된 폴더로 다운로드합니다.
3.  **링크 자동 변환:** 원본 외부 이미지 링크를 다운로드된 로컬 파일에 대한 상대 경로 또는 절대 경로의 마크다운 링크로 자동 수정합니다.
4.  **사용자 설정:** 이미지 저장 폴더, 파일명 명명 규칙, 중복 파일 처리 방식 등 사용자가 플러그인 동작을 제어할 수 있는 설정 옵션을 제공합니다.
5.  **알림 기능:** 이미지 처리 결과(성공, 실패, 처리된 이미지 수 등)를 사용자에게 Obsidian 알림(Notice)으로 표시합니다.
6.  **명령어 및 UI 제공:**
    -   리본 아이콘을 통한 빠른 실행 기능 제공.
    -   명령어 팔레트를 통한 기능 실행 지원.

### 3\. 기술 스택 및 빌드 환경

#### 3.1. 프로그래밍 언어

-   **TypeScript:** JavaScript의 상위 집합으로, 정적 타이핑을 지원하여 코드 안정성과 유지보수성을 높입니다. (`tsconfig.json` 및 `*.ts` 파일 존재)

#### 3.2. 주요 라이브러리 및 프레임워크

-   **Obsidian API:** 플러그인 개발을 위한 핵심 API. (`obsidian` 패키지 의존성)
    -   `Plugin`, `App`, `Editor`, `MarkdownView`, `Vault`, `Notice`, `Setting`, `PluginSettingTab`, `requestUrl` 등 Obsidian의 다양한 클래스와 메서드를 활용합니다.

#### 3.3. 빌드 도구

-   **esbuild:** 매우 빠른 JavaScript 및 TypeScript 번들러 겸 미니파이어. (`esbuild.config.mjs`, `package.json`의 빌드 스크립트)

#### 3.4. 개발 의존성 (`package.json` devDependencies)

-   `@types/node`: Node.js 타입 정의
-   `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`: TypeScript 코드 린팅 및 스타일 검사
-   `builtin-modules`: Node.js 내장 모듈 목록 (esbuild에서 external 처리용)
-   `esbuild`: JavaScript/TypeScript 번들러
-   `obsidian`: Obsidian API 타입 정의 및 개발 지원
-   `tslib`: TypeScript 헬퍼 라이브러리
-   `typescript`: TypeScript 컴파일러

### 4\. 코드 아키텍처 및 구조

#### 4.1. 디렉토리 구조 (예상)

```
obsidian-local-images-modernized/
├── .vscode/              # VSCode 설정 (선택 사항)
├── node_modules/         # NPM 패키지
├── src/                  # 소스 코드 디렉토리
│   ├── main.ts           # 플러그인 진입점 및 주요 로직
│   ├── config.ts         # 설정 UI 및 데이터 관리
│   ├── contentProcessor.ts # 마크다운 내용 분석 및 이미지 처리
│   └── utils.ts          # 보조 함수 및 유틸리티
├── .eslintignore         # ESLint 예외 설정
├── .eslintrc.js          # ESLint 설정
├── .gitignore            # Git 무시 파일 목록
├── esbuild.config.mjs    # esbuild 빌드 설정
├── manifest.json         # Obsidian 플러그인 메타데이터
├── package.json          # NPM 패키지 정보 및 스크립트
├── tsconfig.json         # TypeScript 컴파일러 설정
└── main.js               # 빌드 결과물 (Obsidian이 로드하는 파일)
```

#### 4.2. 주요 파일 설명

##### 4.2.1. `src/main.ts`

-   **역할:** 플러그인의 메인 진입점입니다. Obsidian `Plugin` 클래스를 상속받아 플러그인의 생명주기(로드, 언로드)를 관리합니다.
-   **주요 구현 내용 (예상):**
    -   `LocalImagesPlugin` 클래스 정의 (extends `Plugin`).
    -   `settings`: `LocalImagesSettings` 타입의 플러그인 설정을 저장하는 속성.
    -   `onload()`: 플러그인 로드 시 실행되는 메서드.
        -   설정 로드 (`loadSettings()`).
        -   리본 아이콘 추가 (`this.addRibbonIcon()`): 'image-down' (가칭) 아이콘, "Download images in current note" 툴팁, 클릭 시 `processActiveLeaf()` 실행.
        -   명령어 추가 (`this.addCommand()`):
            -   ID: `download-images-current-note`
            -   Name: `Download images in current note`
            -   `editorCallback`: 현재 열린 편집기의 내용을 처리하는 `processActiveLeaf()` 실행.
        -   설정 탭 추가 (`this.addSettingTab(new LocalImagesSettingTab(this.app, this))`).
    -   `onunload()`: 플러그인 언로드 시 정리 작업 수행 (필요시).
    -   `loadSettings()`: `this.loadData()`를 사용하여 저장된 설정을 불러오고, `DEFAULT_SETTINGS`와 병합.
    -   `saveSettings()`: `this.saveData()`를 사용하여 현재 설정을 저장.
    -   `processActiveLeaf(leaf?: WorkspaceLeaf)`: 현재 활성화된 마크다운 뷰/에디터를 가져와 `ContentProcessor`를 통해 이미지 처리 로직을 실행하는 핵심 함수.

##### 4.2.2. `src/config.ts`

-   **역할:** 플러그인 설정의 데이터 구조 정의 및 설정 UI를 담당합니다.
-   **주요 구현 내용 (예상):**
    -   `LocalImagesSettings` 인터페이스 정의:
        -   `imageSubfolder`: `string` (기본값: "assets/images") - 이미지가 저장될 Vault 내 하위 폴더 경로.
        -   `filenameTemplate`: `string` (기본값: "{imageName}\_{timestamp}") - 다운로드될 이미지 파일의 이름 형식. (예: `{imageName}`, `{noteName}_{imageName}`, `{timestamp}`).
        -   `overwriteExisting`: `boolean` (기본값: `false`) - 동일한 이름의 파일이 있을 경우 덮어쓸지 여부.
        -   `showNotifications`: `boolean` (기본값: `true`) - 처리 결과 알림 표시 여부.
        -   `useRelativePaths`: `boolean` (기본값: `true`) - 생성되는 링크를 상대 경로로 할지 여부.
        -   `handleDuplicateNames`: `'overwrite' | 'rename' | 'skip'` (기본값: `'rename'`) - 중복 파일명 처리 방식.
    -   `DEFAULT_SETTINGS`: `LocalImagesSettings` 타입의 객체로, 기본 설정값을 가집니다.
    -   `LocalImagesSettingTab` 클래스 정의 (extends `PluginSettingTab`):
        -   `display()`: `Setting` 컴포넌트를 사용하여 설정 UI를 구성. 각 설정 항목(텍스트 입력, 토글 등)을 만들고, 변경 시 `plugin.settings` 업데이트 및 `plugin.saveSettings()` 호출.

##### 4.2.3. `src/contentProcessor.ts`

-   **역할:** 마크다운 콘텐츠를 분석하여 외부 이미지를 찾아 다운로드하고, 링크를 수정하는 핵심 로직을 수행합니다.
-   **주요 구현 내용 (예상):**
    -   `ContentProcessor` 클래스 정의:
        -   생성자: `App`, `Vault`, `LocalImagesSettings`를 인자로 받아 멤버 변수로 저장.
        -   `processMarkdown(markdown: string, currentNoteFile: TFile): Promise<{markdown: string, processedCount: number, failedCount: number}>`:
            -   정규표현식 (예: `EXTERNAL_IMAGE_MARKDOWN_REGEX = /!\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g`, `EXTERNAL_IMAGE_HTML_REGEX = /<img.*?src=["'](https?:\/\/[^"']+)["'].*?>/g`)을 사용하여 마크다운 및 HTML 형식의 외부 이미지 URL을 찾습니다.
            -   찾아낸 각 URL에 대해 다음을 수행:
                -   URL 유효성 검사 (이미 로컬 URL이거나 지원하지 않는 프로토콜인지 확인).
                -   `utils.generateFilename()`을 호출하여 새 파일명 생성.
                -   `utils.ensureFolderExists()`를 호출하여 설정된 이미지 저장 폴더가 없으면 생성.
                -   로컬 저장 경로 완전하게 구성 (`Vault 기본 경로 + settings.imageSubfolder + 새 파일명`).
                -   파일 중복 처리: `settings.overwriteExisting` 및 `settings.handleDuplicateNames` 설정에 따라 처리 (덮어쓰기, 이름 변경하여 저장, 건너뛰기). 이름 변경 시 `_1`, `_2` 등을 추가. Obsidian API `this.app.vault.adapter.exists(path)`로 파일 존재 여부 확인.
                -   `utils.downloadImage()`를 호출하여 이미지 데이터(ArrayBuffer) 다운로드.
                -   `this.app.vault.createBinary(localPath, imageData)`를 사용하여 Vault에 이미지 파일 저장.
                -   성공적으로 저장되면, `this.app.fileManager.generateMarkdownLink(downloadedFile, currentNoteFile.path, imageAltText)` 또는 유사한 로직을 사용하여 새 로컬 링크 (상대/절대 경로) 생성.
                -   원본 마크다운 문자열에서 외부 이미지 링크를 새 로컬 링크로 교체.
            -   처리된 이미지 수, 실패한 이미지 수를 포함한 결과 객체와 수정된 마크다운 문자열을 반환.

##### 4.2.4. `src/utils.ts`

-   **역할:** 프로젝트 전반에서 사용되는 보조 함수 및 유틸리티 함수들을 모아놓은 모듈입니다.
-   **주요 구현 내용 (예상):**
    -   `isExternalUrl(url: string): boolean`: 주어진 URL이 외부 HTTP/HTTPS URL인지 판별. (Obsidian 내부 URL `app://`, `obsidian://` 등은 제외).
    -   `sanitizeFileName(name: string): string`: 파일명으로 사용할 수 없는 특수문자를 제거하거나 대체. (예: `/[<>:"/\\|?*]+/g` -\> `_`).
    -   `generateFilename(url: string, noteName: string, originalImageName: string, settings: LocalImagesSettings): Promise<{filename: string, extension: string}>`:
        -   URL에서 원본 파일명 및 확장자 추출 (예: `URL.pathname.split('/').pop()`).
        -   `settings.filenameTemplate`에 따라 최종 파일명 조합. 템플릿 변수 (`{imageName}`, `{noteName}`, `{timestamp}`, `{random}`) 등을 지원.
        -   타임스탬프 생성: `Date.now()` 또는 `moment().format(...)`.
    -   `downloadImage(url: string): Promise<ArrayBuffer>`: `this.app.requestUrl({ url: url, method: 'GET' })`을 사용하여 이미지를 비동기적으로 다운로드하고 `ArrayBuffer`로 반환. HTTP 에러 처리(4xx, 5xx).
    -   `ensureFolderExists(folderPath: string, vault: Vault): Promise<void>`: `vault.createFolder(folderPath)`를 사용하되, 이미 폴더가 존재하는 경우 에러를 발생시키지 않도록 처리. `vault.getAbstractFileByPath(folderPath)`로 먼저 확인.
    -   `findExternalImageUrls(markdown: string): {url: string, originalMatch: string, altText?: string, type: 'markdown' | 'html'}[]`: `contentProcessor`에서 사용할 정규식을 포함하거나, 해당 정규식을 사용하여 이미지 정보를 추출하는 함수.
    -   `generateLocalPath(filenameWithExt: string, settings: LocalImagesSettings, vaultBasePath: string): string`: Vault 기본 경로, 설정된 하위 폴더, 파일명을 조합하여 전체 로컬 저장 경로 생성.

##### 4.2.5. `manifest.json`

-   **역할:** Obsidian 플러그인의 필수 메타데이터를 정의합니다. 플러그인 ID, 이름, 버전, 최소 Obsidian 버전, 설명, 제작자 정보 등을 포함합니다.
-   **내용:**
    ```json
    {
    	"id": "obsidian-local-images",
    	"name": "Local Images",
    	"version": "1.0.0",
    	"minAppVersion": "0.15.0",
    	"description": "Downloads external images in the current note to your vault and updates links.",
    	"author": "JaewonE",
    	"authorUrl": "https://github.com/jaewonE",
    	"isDesktopOnly": false
    }
    ```

##### 4.2.6. `package.json`

-   **역할:** Node.js 프로젝트의 메타데이터 및 의존성 관리, 스크립트 실행을 담당합니다.
-   **주요 내용:**
    -   `name`: `obsidian-local-images-modernized`
    -   `version`: `1.0.0`
    -   `description`: `Modernized Obsidian plugin to download local images.`
    -   `main`: `src/main.js` (실제로는 빌드 후 `main.js`를 가리키지만, 개발 중 편의상 이렇게 설정했을 수 있음. 최종 빌드 파일은 루트에 `main.js`로 생성됨)
    -   `scripts`:
        -   `dev`: `node esbuild.config.mjs` (개발 모드로 esbuild 실행, watch 기능 포함)
        -   `build`: `tsc -noEmit -skipLibCheck && node esbuild.config.mjs production` (타입 체크 후 프로덕션 모드로 esbuild 실행)
        -   `version`: `node version-bump.mjs && git add manifest.json versions.json` (버전 업데이트 스크립트, `versions.json`은 Obsidian 플러그인 배포 시 사용)
    -   `author`: `JaewonE`
    -   `license`: `MIT`
    -   `devDependencies`: 위에 기술된 개발 의존성 목록

##### 4.2.7. `tsconfig.json`

-   **역할:** TypeScript 컴파일러의 옵션을 설정합니다.
-   **주요 설정:**
    -   `compilerOptions`:
        -   `module`: `ESNext` (최신 ES 모듈 시스템 사용)
        -   `target`: `ES2021` (컴파일 대상 JavaScript 버전)
        -   `strict`: `true` (모든 엄격한 타입 검사 옵션 활성화)
        -   `noImplicitAny`: `true` (암시적 `any` 타입 금지)
        -   `moduleResolution`: `node` (Node.js 방식의 모듈 해석)
        -   `lib`: `["DOM", "ES2021"]` (사용 가능한 내장 라이브러리 타입 정의)
        -   `types`: `["node", "obsidian"]` (참조할 추가 타입 정의 패키지)
        -   `inlineSourceMap`: `true`, `inlineSources`: `true` (개발 시 디버깅을 위한 소스맵 설정)
    -   `include`: `["**/*.ts"]` (컴파일 대상 파일 범위)

##### 4.2.8. `esbuild.config.mjs`

-   **역할:** esbuild를 사용한 번들링 및 빌드 프로세스를 설정합니다.
-   **주요 설정:**
    -   `entryPoints`: `["src/main.ts"]` (빌드 시작점)
    -   `bundle`: `true` (모든 의존성을 단일 파일로 합침)
    -   `external`: `["obsidian", "electron", "@codemirror/...", ...builtins]` (번들에 포함하지 않을 외부 모듈. Obsidian 환경에서 제공되거나 Node.js 내장 모듈)
    -   `format`: `cjs` (CommonJS 모듈 형식으로 출력, Obsidian 플러그인은 이 형식을 사용)
    -   `target`: `es2018` (출력될 JavaScript 버전, `tsconfig.json`의 target과 다를 수 있으나 호환성 고려)
    -   `outfile`: `main.js` (최종 번들 파일명)
    -   `sourcemap`: `prod ? false : "inline"` (프로덕션 빌드 시 소스맵 제외, 개발 시 인라인 소스맵 포함)
    -   `minify`: `prod` (프로덕션 빌드 시 코드 최소화)
    -   `banner`: 빌드된 파일 상단에 추가될 주석 (라이선스, 빌드 정보 등)
    -   `prod` 변수를 통해 개발 모드와 프로덕션 모드 구분.
    -   개발 모드에서는 `context.watch()`로 파일 변경 감지 및 자동 리빌드, 프로덕션 모드에서는 `context.rebuild()`로 단일 빌드 후 종료.

### 5\. 상세 기능 명세

#### 5.1. 플러그인 초기화 및 UI 등록 (`main.ts`)

-   **`LocalImagesPlugin.onload()`**

    1.  `loadSettings()`를 호출하여 저장된 설정을 로드하고, 없으면 `DEFAULT_SETTINGS`를 사용.
    2.  `this.addRibbonIcon(iconName, tooltip, callback)`:
        -   `iconName`: 'image-down' (또는 Obsidian에서 제공하는 적절한 아이콘 ID).
        -   `tooltip`: "Download images in current note" (또는 유사한 설명).
        -   `callback`: `this.processActiveLeaf.bind(this)`를 호출.
    3.  `this.addCommand(commandDefinition)`:
        -   `id`: 'download-images-current-note'
        -   `name`: 'Download images in current note'
        -   `editorCallback: (editor: Editor, view: MarkdownView) => { this.processActiveLeaf(view.leaf); }` (활성 에디터가 있을 때만 실행).
    4.  `this.addSettingTab(new LocalImagesSettingTab(this.app, this))`를 호출하여 설정 탭 등록.

-   **`LocalImagesPlugin.processActiveLeaf(leaf?: WorkspaceLeaf)`**

    1.  `leaf`가 제공되지 않으면 `this.app.workspace.getActiveViewOfType(MarkdownView)`를 통해 현재 활성화된 마크다운 뷰를 가져옴.
    2.  뷰가 없거나 마크다운 뷰가 아니면 "No active Markdown view found." 알림 표시 후 종료.
    3.  `ContentProcessor` 인스턴스 생성: `new ContentProcessor(this.app, this.app.vault, this.settings)`.
    4.  현재 노트 파일 가져오기: `view.file`.
    5.  에디터 내용 가져오기: `editor.getValue()`.
    6.  `contentProcessor.processMarkdown(editorContent, currentNoteFile)` 호출.
    7.  성공 시:
        -   반환된 수정된 마크다운으로 에디터 내용 업데이트: `editor.setValue(result.markdown)`.
        -   "Successfully processed X images. Y images failed." 알림 표시 (설정에 따라).
    8.  실패 시 (예외 발생):
        -   "Error processing images: [error message]" 알림 표시.

#### 5.2. 설정 관리 (`config.ts`, `main.ts`)

-   **`LocalImagesSettings` 인터페이스:**

    -   `imageSubfolder: string`
    -   `filenameTemplate: string`
    -   `overwriteExisting: boolean`
    -   `showNotifications: boolean`
    -   `useRelativePaths: boolean`
    -   `handleDuplicateNames: 'overwrite' | 'rename' | 'skip'`

-   **`DEFAULT_SETTINGS: LocalImagesSettings`:**

    -   `imageSubfolder: "assets/images"`
    -   `filenameTemplate: "{imageName}_{timestamp}"`
    -   `overwriteExisting: false`
    -   `showNotifications: true`
    -   `useRelativePaths: true`
    -   `handleDuplicateNames: 'rename'`

-   **`LocalImagesPlugin.loadSettings()`:**

    -   `this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());`

-   **`LocalImagesPlugin.saveSettings()`:**

    -   `await this.saveData(this.settings);`

-   **`LocalImagesSettingTab.display()`:**

    -   컨테이너 엘리먼트 (`containerEl`)를 비움.
    -   **Image Subfolder 설정:**
        -   `new Setting(containerEl)`
            -   `.setName("Image subfolder")`
            -   `.setDesc("Folder inside your vault to save downloaded images. Example: assets/images")`
            -   `.addText(text => text.setPlaceholder("assets/images").setValue(this.plugin.settings.imageSubfolder).onChange(async value => { this.plugin.settings.imageSubfolder = value; await this.plugin.saveSettings(); }))`
    -   **Filename Template 설정:**
        -   `new Setting(containerEl)`
            -   `.setName("Filename template")`
            -   `.setDesc("Template for downloaded image filenames. Available placeholders: {imageName}, {noteName}, {timestamp}, {randomString}.")`
            -   `.addText(text => text.setPlaceholder("{imageName}_{timestamp}").setValue(this.plugin.settings.filenameTemplate).onChange(async value => { this.plugin.settings.filenameTemplate = value; await this.plugin.saveSettings(); }))`
    -   **Use Relative Paths 설정:**
        -   `new Setting(containerEl)`
            -   `.setName("Use relative paths")`
            -   `.setDesc("Use relative paths for image links instead of absolute paths.")`
            -   `.addToggle(toggle => toggle.setValue(this.plugin.settings.useRelativePaths).onChange(async value => { this.plugin.settings.useRelativePaths = value; await this.plugin.saveSettings(); }))`
    -   **Handle Duplicate Names 설정:**
        -   `new Setting(containerEl)`
            -   `.setName("Handle duplicate filenames")`
            -   `.setDesc("How to handle images if a file with the same name already exists.")`
            -   `.addDropdown(dropdown => dropdown .addOption('rename', 'Rename (add a number suffix)') .addOption('overwrite', 'Overwrite existing file') .addOption('skip', 'Skip downloading this image') .setValue(this.plugin.settings.handleDuplicateNames) .onChange(async (value: 'overwrite' | 'rename' | 'skip') => { this.plugin.settings.handleDuplicateNames = value; await this.plugin.saveSettings(); }))`
    -   **(Legacy) Overwrite Existing 설정 (handleDuplicateNames가 'overwrite' 와 같음):**
        -   `new Setting(containerEl)`
            -   `.setName("Overwrite existing files")`
            -   `.setDesc("If enabled, existing files with the same name will be overwritten. Superseded by 'Handle duplicate filenames' if set to 'overwrite'.")`
            -   `.addToggle(toggle => toggle.setValue(this.plugin.settings.overwriteExisting).onChange(async value => { this.plugin.settings.overwriteExisting = value; await this.plugin.saveSettings(); }))` (UI에서 이 옵션은 `handleDuplicateNames` 설정에 따라 비활성화되거나 숨겨질 수 있음)
    -   **Show Notifications 설정:**
        -   `new Setting(containerEl)`
            -   `.setName("Show notifications")`
            -   `.setDesc("Show success or error notifications after processing.")`
            -   `.addToggle(toggle => toggle.setValue(this.plugin.settings.showNotifications).onChange(async value => { this.plugin.settings.showNotifications = value; await this.plugin.saveSettings(); }))`

#### 5.3. 콘텐츠 처리 (`contentProcessor.ts`)

-   **`ContentProcessor.constructor(app: App, vault: Vault, settings: LocalImagesSettings)`**

    -   `this.app = app; this.vault = vault; this.settings = settings;`

-   **`ContentProcessor.processMarkdown(markdown: string, currentNoteFile: TFile): Promise<{markdown: string, processedCount: number, failedCount: number}>`**

    1.  `processedCount = 0`, `failedCount = 0`.
    2.  `let newMarkdown = markdown;`
    3.  외부 이미지 URL 패턴 정의 (Markdown `![]()` 및 HTML `<img>`):
        -   `const mdImageRegex = /!\[(?<alt>.*?)\]\((?<url>https?:\/\/[^\s)]+)\)/g;`
        -   `const htmlImageRegex = /<img.*?src=["'](?<url>https?:\/\/[^"']+)["'].*?(alt=["'](?<alt>.*?)["'])?.*?>/gi;`
    4.  **Markdown 이미지 처리:**
        -   `for (const match of markdown.matchAll(mdImageRegex)) { ... }`
        -   `originalLink = match[0]`, `altText = match.groups.alt`, `url = match.groups.url`.
        -   `await this._processSingleImage(url, altText, currentNoteFile, originalLink, newMarkdown)` 결과를 `newMarkdown`에 반영하고 카운터 업데이트.
    5.  **HTML 이미지 처리 (필요시, 기본은 Markdown 우선):**
        -   `for (const match of newMarkdown.matchAll(htmlImageRegex)) { ... }`
        -   `originalLink = match[0]`, `url = match.groups.url`, `altText = match.groups.alt || ''`.
        -   `await this._processSingleImage(url, altText, currentNoteFile, originalLink, newMarkdown)` 결과를 `newMarkdown`에 반영하고 카운터 업데이트.
    6.  `return { markdown: newMarkdown, processedCount, failedCount };`

-   **`ContentProcessor._processSingleImage(url: string, altText: string, currentNoteFile: TFile, originalMatch: string, currentMarkdown: string): Promise<{newMarkdown: string, success: boolean}>` (내부 헬퍼 메서드)**

    1.  `if (!Utils.isExternalUrl(url)) return { newMarkdown: currentMarkdown, success: false };` (이미 로컬이거나 처리 대상 아니면 스킵)
    2.  `try { ... } catch (error) { ... }`
    3.  **파일명 생성:**
        -   `originalImageName = Utils.extractFilenameFromUrl(url);`
        -   `noteName = currentNoteFile.basename;`
        -   `const { filename, extension } = await Utils.generateFilename(url, noteName, originalImageName, this.settings);`
        -   `let finalFilename = Utils.sanitizeFileName(filename) + '.' + extension;`
    4.  **저장 경로 생성:**
        -   `await Utils.ensureFolderExists(this.settings.imageSubfolder, this.vault);`
        -   `let localImagePath = normalizePath(this.settings.imageSubfolder + "/" + finalFilename);`
    5.  **중복 파일 처리:**
        -   `fileExists = await this.vault.adapter.exists(localImagePath);`
        -   `if (fileExists)`:
            -   `if (this.settings.handleDuplicateNames === 'skip' || (this.settings.handleDuplicateNames !== 'overwrite' && this.settings.overwriteExisting === false && this.settings.handleDuplicateNames !== 'rename')) { return { newMarkdown: currentMarkdown, success: false }; }` // skip 로직
            -   `if (this.settings.handleDuplicateNames === 'overwrite' || this.settings.overwriteExisting === true) { /* 덮어쓰기 진행 */ }`
            -   `else if (this.settings.handleDuplicateNames === 'rename') { ... }` // 이름 변경 로직 (예: `_1`, `_2` 추가)
                -   루프를 돌며 `finalFilename = Utils.sanitizeFileName(filename) + `\_${counter}` + '.' + extension;`
                -   `localImagePath = normalizePath(this.settings.imageSubfolder + "/" + finalFilename);`
                -   `fileExists = await this.vault.adapter.exists(localImagePath);`
    6.  **이미지 다운로드 및 저장:**
        -   `const imageData = await Utils.downloadImage(url, this.app);`
        -   `const downloadedFile = await this.vault.createBinary(localImagePath, imageData);`
    7.  **링크 생성 및 교체:**
        -   `const newLink = this.app.fileManager.generateMarkdownLink(downloadedFile, currentNoteFile.path, altText, this.settings.useRelativePaths ? undefined : downloadedFile.path);`
        -   `newMarkdown = currentMarkdown.replace(originalMatch, newLink);`
        -   `return { newMarkdown, success: true };`
    8.  **에러 처리:**
        -   `console.error("Failed to process image:", url, error);`
        -   `if (this.settings.showNotifications) new Notice(...);`
        -   `return { newMarkdown: currentMarkdown, success: false };`

#### 5.4. 유틸리티 함수 (`utils.ts`)

-   **`export function isExternalUrl(url: string): boolean`**
    -   `return /^https?:\/\//i.test(url);`
-   **`export function sanitizeFileName(name: string): string`**
    -   `return name.replace(/[<>:"/\\|?*[\]\n\r\t]/g, '_').replace(/\s+/g, '_');`
-   **`export function extractFilenameFromUrl(url: string): string`**
    -   `const parts = new URL(url).pathname.split('/');`
    -   `const lastSegment = parts.pop() || 'image';`
    -   `return lastSegment.split('.')[0];` // 확장자 제외한 이름
-   **`export async function generateFilename(url: string, noteName: string, originalImageName: string, settings: LocalImagesSettings): Promise<{filename: string, extension: string}>`**
    1.  URL에서 확장자 추출: `const extension = new URL(url).pathname.split('.').pop()?.toLowerCase() || 'png';`
    2.  `let baseName = settings.filenameTemplate;`
    3.  `baseName = baseName.replace("{imageName}", originalImageName || "image");`
    4.  `baseName = baseName.replace("{noteName}", noteName || "note");`
    5.  `baseName = baseName.replace("{timestamp}", Date.now().toString());`
    6.  `baseName = baseName.replace("{randomString}", Math.random().toString(36).substring(2, 8));`
    7.  `return { filename: baseName, extension };`
-   **`export async function downloadImage(url: string, app: App): Promise<ArrayBuffer>`**
    1.  `const response = await app.requestUrl({ url, method: "GET" });`
    2.  `if (response.status !== 200) throw new Error(\`Failed to download: ${response.status}\`);\`
    3.  `return response.arrayBuffer;`
-   **`export async function ensureFolderExists(folderPath: string, vault: Vault): Promise<void>`**
    1.  `if (!folderPath || folderPath === "/") return;`
    2.  `const normalizedPath = normalizePath(folderPath);`
    3.  `const folder = vault.getAbstractFileByPath(normalizedPath);`
    4.  `if (!folder) { await vault.createFolder(normalizedPath); }`
    5.  `else if (!(folder instanceof TFolder)) { throw new Error(\`Path exists but is not a folder: ${normalizedPath}\`); }\`

### 6\. 워크플로우

1.  **사용자 액션:**
    -   리본 메뉴의 "Local Images" 아이콘 클릭.
    -   명령어 팔레트(Ctrl/Cmd+P)에서 "Local Images: Download images in current note" 명령어 실행.
2.  **플러그인 실행 (`processActiveLeaf`):**
    -   현재 활성화된 마크다운 노트와 에디터 확인.
    -   `ContentProcessor` 인스턴스화 (현재 설정값 주입).
3.  **이미지 처리 (`ContentProcessor.processMarkdown`):**
    -   노트의 전체 마크다운 내용을 스캔하여 외부 이미지 URL(Markdown, HTML) 목록 추출.
    -   각 외부 이미지 URL에 대해:
        -   URL 유효성 검사.
        -   설정된 `filenameTemplate`에 따라 새 파일명 생성.
        -   설정된 `imageSubfolder` 경로 확인 및 필요시 생성.
        -   파일명 중복 검사 (`handleDuplicateNames`, `overwriteExisting` 설정에 따라 처리).
        -   이미지 다운로드.
        -   Vault 내 지정된 경로에 이미지 파일 저장.
        -   노트 내 원본 외부 이미지 링크를 새로 저장된 로컬 이미지 링크로 교체 (`useRelativePaths` 설정에 따라 상대/절대 경로).
4.  **결과 반영 및 알림:**
    -   수정된 마크다운 내용으로 에디터 업데이트.
    -   `showNotifications` 설정이 켜져 있으면, 처리 결과 (성공/실패 이미지 수)를 Obsidian `Notice`로 표시.

### 7\. 에러 처리 및 알림

-   **네트워크 오류:** 이미지 다운로드 실패 시 (404, 500, 타임아웃 등), 해당 이미지는 건너뛰고 다음 이미지 처리. 실패한 URL과 함께 알림.
-   **파일 시스템 오류:** 폴더 생성 실패, 파일 저장 실패 시 알림 표시.
-   **잘못된 URL 형식:** 처리할 수 없는 URL 형식은 건너뜀.
-   **권한 문제:** 파일 시스템 접근 권한 문제 발생 시 Obsidian 자체 에러 또는 플러그인 에러 알림.
-   **알림:**
    -   "No active markdown editor found."
    -   "Processing images..." (시작 알림, 선택 사항)
    -   "Successfully downloaded and linked X images. Y images failed." (처리 완료 알림)
    -   "Failed to download [URL]: [Error reason]" (개별 이미지 실패 알림)
    -   "Image subfolder '[folder]' created." (폴더 생성 알림, 선택 사항)
    -   "File '[filename]' already exists. [Skipped/Renamed/Overwritten] based on settings." (중복 파일 처리 알림, 선택 사항)
    -   모든 알림은 `settings.showNotifications`가 true일 때만 표시.

### 8\. 빌드 및 개발

#### 8.1. 개발 모드

-   명령어: `npm run dev` 또는 `yarn dev`
-   `esbuild.config.mjs`에 정의된 대로 `esbuild`가 watch 모드로 실행됩니다.
-   `src/` 디렉토리 내의 TypeScript 파일 변경 시 자동으로 `main.js` (및 소스맵) 리빌드.
-   Obsidian 개발자 모드에서 플러그인을 리로드하여 변경 사항 확인.

#### 8.2. 프로덕션 빌드

-   명령어: `npm run build` 또는 `yarn build`
-   `tsc -noEmit -skipLibCheck`로 타입 체크 우선 실행.
-   `esbuild.config.mjs production` 실행하여 프로덕션용 `main.js` 빌드 (최소화 적용, 소스맵 제외).
-   릴리즈를 위해 `manifest.json`과 함께 압축하여 배포.

### 9\. 구현을 위한 제언

-   **비동기 처리:** 이미지 다운로드 및 파일 I/O는 모두 비동기(`async/await`)로 처리하여 Obsidian UI가 멈추는 것을 방지합니다. `Promise.allSettled` 등을 사용하여 여러 이미지를 병렬로 처리하고 각 결과(성공/실패)를 수집하는 것을 고려할 수 있습니다.
-   **정규 표현식 최적화:** 이미지 URL을 찾는 정규 표현식은 복잡한 마크다운/HTML 구조에서도 정확하고 효율적으로 동작하도록 테스트하고 최적화해야 합니다.
-   **설정 유효성 검사:** 사용자가 입력하는 설정값(예: 폴더 경로)에 대한 기본적인 유효성 검사를 추가할 수 있습니다.
-   **Obsidian API 활용:** 파일 시스템 접근, 알림, 설정 UI 등은 최대한 Obsidian에서 제공하는 API를 활용하여 일관성과 안정성을 높입니다.
-   **상태 관리:** 여러 이미지를 처리할 때 진행 상태나 개별 이미지의 성공/실패 상태를 명확히 관리하여 사용자에게 정확한 피드백을 제공합니다.
-   **이미지 형식 지원:** 다양한 이미지 형식(JPEG, PNG, GIF, WEBP, SVG 등)을 고려하고, Content-Type 헤더를 통해 확장자를 유추하거나 기본 확장자를 설정하는 방안을 고려합니다.
-   **Data URI 스킴 이미지:** `data:` 스킴으로 임베드된 이미지는 현재 설계에서는 외부 이미지로 간주하지 않으므로 처리 대상이 아닙니다. 필요하다면 별도 기능으로 추가 고려할 수 있습니다.
-   **이미지 압축/최적화:** 다운로드 시 이미지 최적화(예: WebP로 변환 또는 압축) 기능은 이 플러그인의 핵심 범위를 벗어날 수 있지만, 향후 확장 기능으로 고려 가능합니다.
