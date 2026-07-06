export const wedding = {
  groom: {
    name: '조해창',
    father: '조수현',
    mother: '김보영',
    account: { bank: '국민은행', number: '021902-04-127492', holder: '조해창' },
  },
  bride: {
    name: '홍민지',
    father: '홍영권',
    mother: '김계열',
    account: { bank: '국민은행', number: '032902-04-260074', holder: '홍민지' },
  },
  date: {
    iso: '2026-10-03T17:00:00+09:00',
    endIso: '2026-10-03T19:00:00+09:00',
    display: '2026.10.03 SAT 5PM',
    dayLabel: '2026년 10월 3일 토요일 오후 5시',
  },
  venue: {
    name: '고려대학교 교우회관',
    address: '서울 성북구 종암로 13',
    addressDetail: '(종암동 29-26)',
    lat: 37.5893,
    lng: 127.0329,
    subway: '6호선 고려대역 2번 출구 → 도보 5~7분 직진 (스타벅스 종암DT점 인근)',
    car: '내비 "종암로 13" 검색 · 건물 내 주차장 400대 이상',
  },
  url: 'https://hong-minji.github.io/wedding/',
} as const
