## TL;DR (2025-09-28 • i18n 구조화 반영)
- 목표: 라이브러리 없이 **가벼운 i18n**으로 KOR/ENG 동시 지원.
- 상태: Codex가 **섹션별 카피 객체( hero / features / explainer / preview / metrics / pricing / waitlist / stories / founder / community / footer )**와 **metric/preview 헬퍼**를 추가했고, 페이지가 이 구조에서 문자열을 **단일 소스**로 가져오도록 리팩터링됨.
- 효과: 언어 토글 시 **전 섹션 카피가 일관 교체**(배너/특징 카드/지표/설명/모달/대기열/요금/후기/창업자/커뮤니티/푸터). 잔존 한국어 aria/에러 문자열도 다국어로 정리됨.
- 참고: 이 번역 업데이트 **이전** 상태는 GitHub에 한 차례 커밋되어 있음(롤백/비교 가능).

## PARAMS
- locales: ["ko","en"]
- locale source: UI 토글 상태(추정) — URL/Cookie 연동 필요 여부 미정
- copy source: `contentCopy`(섹션 키 기반), `metricsMap`, `previewMap` 등 헬퍼 테이블
- hero layout: max-w 65ch, 중앙 정렬 유지, CTA 그라디언트 버튼

## CHANGES (이번 리팩터링 요지)
- 카피 단일화: 모든 UI 문구를 **하나의 구조화된 객체**로 집약(영/한 동시 보관).
- 바인딩 일원화: 페이지/섹션들이 **구조체→t() 또는 selector**로 카피 주입.
- 아이콘/요금 카드: 매핑 테이블 기반으로 간소화, 하드코딩 제거.
- 접근성: 남은 한국어 aria 라벨 및 에러 텍스트를 **영/한 병렬**로 정리.

## TODO (다음 태스크)
- [ ] **QA**: KOR/ENG 토글 시 전 섹션 카피가 빠짐없이 교체되는지 확인(배너/모달/폼 오류/aria 포함).
- [ ] **누락 키 점검**: placeholder(미번역) 키 목록 수집 → 번역 보완.
- [ ] **토글 지속성**: `?lang=` 파라미터 및 `cookie(lang)` 저장(새로고침/딥링크 유지).
- [ ] **<html lang>**: 레이아웃에서 현재 로케일 반영(`lang="ko|en"`).
- [ ] **SEO/오탐 제거**: 중복 DOM(슬라이더/SSR), 빈 카드 조건부 렌더링 재확인.
- [ ] **A11y**: role/aria-selected/aria-controls 일관화, 포커스 순서 검수.
- [ ] **E2E sanity**: waitlist 폼(입력/검증/동의) 양언어 라벨·에러 메시지 확인.
- [ ] **성능**: 초기 번들 내 카피 객체 크기 점검(코드 분할 또는 섹션별 로드 고려).

## RISKS
- 섹션별 카피 키 불일치로 **빈 텍스트** 발생 가능 → 빌드/런타임 검사 필요.
- 토글 상태가 URL/쿠키와 **동기화**되지 않으면 새로고침 시 언어 리셋.
- SSR/CSR 경계에서 **문구 깜빡임(FOUC)** 가능 → 초기 로케일 결정 로직 고도화 필요.

## ACCEPTANCE (다음 머지 기준)
- 언어 토글 시 **모든 섹션** 텍스트/aria/버튼/에러가 일관 교체.
- 새로고침·딥링크에서도 선택 언어 유지(`?lang`, cookie).
- 빈 카드/중복 렌더 없음(특히 Explainer/Stories).
- Lighthouse A11y ≥ 98, Contrast AA 이상.

## REFS
- code: @src/app/page.tsx (섹션별 카피 주입/토글), @src/app/layout.tsx (언어 토글), @src/components/* (카드/모달)
- data: contentCopy / metrics & preview helpers (파일 경로는 리포 구조에 따름)
- prior commit: 번역 업데이트 **이전 커밋**이 GitHub에 존재(롤백/비교 시 사용)

## CHANGELOG
- 2025-09-28: i18n 구조화(카피 단일 소스), 매핑 테이블 도입, 잔존 한국어 시스템 문구 정리.
- 2025-09-28 이전: 디자인 정리(히어로 중앙, CTA 그라데이션, 브릿지 보드 제거) 커밋 1회 GitHub 반영.


# TL;DR
- 목표: Canvas 톤을 유지한 채 히어로 섹션만 간결·중앙 정렬로 정리.
- 상태: 히어로 텍스트 중앙 정렬, 최대폭 65ch, 줄바꿈 유지(whitespace-pre-line).
- 버튼: 메인 CTA는 linear-gradient(135deg, var(--primary), var(--accent)) 적용.
- 배경: 히어로에 샌드 톤(radial) 그라데이션 레이어 적용(시인성 ↑).
- 범위: 구조/로직 변경 최소화(디자인 요소만), 브릿지 보드는 히어로에서 제거.

# PARAMS
- hero.maxWidth: 65ch
- hero.textAlign: center
- hero.lineHeight: 1.7 (필요 시 `leading-relaxed`)
- cta.gradient: "linear-gradient(135deg, var(--primary), var(--accent))"
- brand.tokens: { --primary: #6b7b61, --accent: #d65353, --sand: #efe7dd, --ink: #2f2a26 }

# TODO (next task)
- [ ] “제품 미리보기” 버튼 추가(히어로 하단, aria-haspopup="dialog", aria-controls="product-preview-modal")
- [ ] 모달 구현: 탭 A=브릿지 보드, 탭 B=제품 설명 (키보드 포커스 트랩, ESC/백드롭 닫기, 70vh 스크롤)
- [ ] bridgeboard.md / product-desc.md 플레이스홀더 생성 및 렌더(react-markdown 또는 대체)
- [ ] 헤더/내비 hover/active 상태 캔버스 톤으로 보정
- [ ] 반응형 QA(모바일 중앙 정렬, 간격/폭 확인)

# REFS
- code: @src/app/page.tsx  (히어로 컨테이너/CTA/배경)
- styles: @src/app/globals.css, @tailwind.config.ts
- copy: 히어로 카피(줄바꿈 포함) 유지:  
