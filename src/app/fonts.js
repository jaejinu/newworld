import localFont from 'next/font/local';
// import { Noto_Serif_KR, Spectral, Nanum_Brush_Script, Poppins, } from 'next/font/google';

// pretendard
export const pretendard = localFont({
  src: [
    {
      path: '../../public/fonts/Pretendard/woff2/Pretendard-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard/woff2/Pretendard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard/woff2/Pretendard-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard/woff2/Pretendard-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard/woff2/Pretendard-Bold.woff2',
      weight: '700',
      style: 'normal',
    }
  ],
  variable: '--font-pretendard',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
});

// Spectral
export const spectral = localFont({
  src: [
    {
      path: '../../public/fonts/Spectral/spectral-v15-latin-regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-spectral',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
});

// Poppins
export const poppins = localFont({
  src: [   
    // weight 400
    {
        path: '../../public/fonts/Poppins/poppins-v24-latin-regular.woff2',
        weight: '700',
        style: 'normal',
    },
    // weight 700
    {
      path: '../../public/fonts/Poppins/poppins-v24-latin-700.woff2',
      weight: '700',
      style: 'normal',
    },
    {
        path: '../../public/fonts/Poppins/poppins-v24-latin-700italic.woff2',
        weight: '700',
        style: 'italic',
    },
  ],
  variable: '--font-poppins',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
});
