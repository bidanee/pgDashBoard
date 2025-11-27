# PG Dashboard

결제/가맹점 관련 데이터를 시각화하는 대시보드 화면 페이지입니다.

---

##  실행 방법

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

---

## 기술 스택

| 구분 | 사용 기술 |
|------|------------|
| Frontend | React 18 + TypeScript |
| 상태관리 | Zustand |
| UI | TailwindCSS |
| icon | heroicons |
| 차트 | Chart.js + react-chartjs-2 |
| 라우팅 | React Router |
| HTTP Client | Axios |

---

##  폴더 구조

```
src/
 ├─ api/                # axios 클라이언트 및 API 함수
 ├─ components/         # 공용 컴포넌트
 ├─ pages/              # 라우트별 페이지
 ├─ store/              # Zustand 전역 상태
 ├─ types/              # 타입 정의
 ├─ utils/              # 날짜/금액 포맷터 등 유틸 함수
 └─ App.tsx             # 전체 레이아웃
```

---

##  주요 기능

-  **대시보드** : 거래 통계 카드(총 금액·건수·성공률), 최근 거래 내역, 월별/주별/일별 거래 추이 라인 차트, 정산요약
-  **거래 내역** : 필터링 / 정렬 / 페이지네이션
-  **가맹점 관리** : 목록 + 상세 페이지
-  **공통 코드 관리** : Zustand Store + 캐싱
-  **기타 기능** : 정산 페이지

---

## 전역 상태 관리 (공통코드 캐싱)

```ts
const { loadCommonCodes } = useCodeStore();
useEffect(() => {
  loadCommonCodes();
}, []);
```

---

##  디자인 및 스타일 가이드

이 프로젝트는 **TailwindCSS**를 기반으로 직접 디자인되었습니다.  
별도의 상용/오픈소스 템플릿은 사용하지 않았습니다.

###  디자인 의도 및 UI/UX 포인트
- 단순하고 직관적인 **대시보드형 관리자 화면** 구성  
- Tailwind의 유틸리티 클래스를 활용하여 빠른 스타일링
- 주요 색상(gray, blue)을 사용해 정보 계층과 시각적 포커스 강조

---

이 프로젝트는 과제용으로 제작되었습니다.
