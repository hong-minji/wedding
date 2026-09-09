export const wedding = {
  groom: {
    name: '조해창',
    father: '조수현',
    mother: '김보영',
    accounts: [
      { role: '신랑', bank: '국민은행', number: '021902-04-127492', holder: '조해창' },
      { role: '아버지', bank: '신한은행', number: '110-176-145414', holder: '조수현' },
      { role: '어머니', bank: '농협', number: '461-12-175661', holder: '김보영' },
    ],
  },
  bride: {
    name: '홍민지',
    father: '홍영권',
    mother: '김계열',
    accounts: [
      { role: '신부', bank: '국민은행', number: '032902-04-260074', holder: '홍민지' },
    ],
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
    lat: 37.59203956244611,
    lng: 127.03567611313565,
    subway: '6호선 고려대역 2번 출구 → 도보 5~7분 직진 (스타벅스 종암DT점 인근)',
    car: '내비 "종암로 13" 검색 · 건물 앞 주차장 · 2시간 무료주차',
    bus: '당진제일교회 · 서가앤쿡 당진점 앞 · 오후 1시 30분',
    kakaoMapLink: 'https://kko.to/K4_3N5rgKD',
    naverMapLink: 'https://naver.me/51ujvFKA',
  },
  url: 'https://hong-minji.github.io/wedding/',
} as const
