/*
    메뉴 구조 정리
*/
export const menuStructure = [
    {
        name: '홈',
        id: 'home',
        url: '/',
    },
    {
    name: '눈 이야기',
    id: 'eye-story',    
    url: '/eye-story/deep-eye-stories',
    depth2: [
          {
            name: '눈 속 가장 깊은 이야기',
            id : 'deep-eye-stories',
            url : '/eye-story/deep-eye-stories',
          },
          {
            name: '조용히 시야를 훔치는 병',
            id : 'silent-vision-thief',
            url : '/eye-story/silent-vision-thief',
          },
          {
            name: '흐려진 세상을 다시 선명하게',
            id : 'restore-clarity',
            url : '/eye-story/restore-clarity',
          },
          {
            name: '안경 벗는 순간의 기술',
            id : 'glasses-free-tech',
            url : '/eye-story/glasses-free-tech',
          },
          {
            name: '멀어지는 세상, 가까이 보기',
            id : 'distant-world-close-view',
            url : '/eye-story/distant-world-close-view',
          },
          {
            name: '눈 건강 리포트',
            id : 'eye-health-report',
            url : '/eye-story/eye-health-report',
          }
      ]
    },
    {
      name: '의료진 스토리',
      id: 'medical-team-stories',    
      url: '/medical-team-stories'
    },
    {
      name: '멤버 스토리',
      id: 'member-stories',
      url: '/member-stories'
    },
    {
      name: '고객 스토리',
      id: 'patient-stories',
      url: '/patient-stories',
    },
    {
      name: '센터 소식',
      id: 'center-news',
      url: '/center-news'
    }
  ];