/**
 * 기프티콘 API 연동 모듈
 * 현재는 Mock API로 구현되어 있으며, 실제 API 연동 시 .env 설정으로 전환 가능합니다.
 */

export interface GiftProduct {
  id: string;
  name: string;
  points: number;
  imageUrl?: string;
  description?: string;
}

export interface GiftHistory {
  date: string;
  productName: string;
  productId: string;
  phone: string;
  usedPoints: number;
  status: 'SUCCESS' | 'FAILED';
}

export interface SendGiftResponse {
  success: boolean;
  message: string;
  transactionId?: string;
}

/**
 * 앱에 표시할 상품권 목록을 가져오는 함수
 * @returns 상품권 목록 배열
 */
export const getGiftProducts = async (): Promise<GiftProduct[]> => {
  // Mock API - 실제 API 연동 시 아래 주석 처리하고 실제 API 호출로 변경
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'starbucks-americano',
          name: '스타벅스 아메리카노',
          points: 100,
          imageUrl: 'https://via.placeholder.com/150x150?text=Starbucks',
          description: '스타벅스 아메리카노 Tall 사이즈'
        },
        {
          id: 'gs25-3000',
          name: 'GS25 3,000원권',
          points: 120,
          imageUrl: 'https://via.placeholder.com/150x150?text=GS25',
          description: 'GS25 편의점에서 사용 가능한 3,000원 상품권'
        },
        {
          id: 'cu-3000',
          name: 'CU 3,000원권',
          points: 120,
          imageUrl: 'https://via.placeholder.com/150x150?text=CU',
          description: 'CU 편의점에서 사용 가능한 3,000원 상품권'
        },
        {
          id: 'ediya-latte',
          name: '이디야 카페라떼',
          points: 90,
          imageUrl: 'https://via.placeholder.com/150x150?text=Ediya',
          description: '이디야 커피 카페라떼 Regular 사이즈'
        }
      ]);
    }, 300); // API 호출 시뮬레이션 딜레이
  });

  // 실제 API 연동 시 아래 코드 사용
  /*
  try {
    const apiUrl = import.meta.env.VITE_GIFT_API_URL || '';
    const apiKey = import.meta.env.VITE_GIFT_API_KEY || '';
    
    if (!apiUrl || !apiKey) {
      throw new Error('API 설정이 없습니다. .env 파일을 확인하세요.');
    }

    const response = await fetch(`${apiUrl}/products`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('상품 목록 조회 실패:', error);
    throw error;
  }
  */
};

/**
 * 실제 기프티콘을 발송하는 API 호출 함수
 * @param phone 전화번호
 * @param productId 상품 ID
 * @returns 발송 결과
 */
export const sendGift = async (phone: string, productId: string): Promise<SendGiftResponse> => {
  // 전화번호 유효성 검사
  const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
  const cleanPhone = phone.replace(/-/g, '');
  
  if (!phoneRegex.test(cleanPhone)) {
    throw new Error('올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)');
  }

  // Mock API - 실제 API 연동 시 아래 주석 처리하고 실제 API 호출로 변경
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 90% 성공률로 시뮬레이션
      if (Math.random() > 0.1) {
        resolve({
          success: true,
          message: '기프티콘 발송이 완료되었습니다.',
          transactionId: `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
        });
      } else {
        reject(new Error('기프티콘 발송에 실패했습니다. 잠시 후 다시 시도해주세요.'));
      }
    }, 1000); // 1초 딜레이
  });

  // 실제 API 연동 시 아래 코드 사용
  /*
  try {
    const apiUrl = import.meta.env.VITE_GIFT_API_URL || '';
    const apiKey = import.meta.env.VITE_GIFT_API_KEY || '';
    
    if (!apiUrl || !apiKey) {
      throw new Error('API 설정이 없습니다. .env 파일을 확인하세요.');
    }

    const response = await fetch(`${apiUrl}/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: cleanPhone,
        productId: productId
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API 호출 실패: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || '기프티콘 발송이 완료되었습니다.',
      transactionId: data.transactionId
    };
  } catch (error) {
    console.error('기프티콘 발송 실패:', error);
    throw error;
  }
  */
};

/**
 * 포인트 부족 여부 검사 함수
 * @param userPoints 사용자 보유 포인트
 * @param neededPoints 필요 포인트
 * @returns 포인트가 충분하면 true, 부족하면 false
 */
export const validatePoints = (userPoints: number, neededPoints: number): boolean => {
  return userPoints >= neededPoints;
};

/**
 * giftHistory를 localStorage에 저장하는 함수
 */
export const saveGiftHistory = (history: GiftHistory): void => {
  try {
    const existing = localStorage.getItem('giftHistory');
    const historyList: GiftHistory[] = existing ? JSON.parse(existing) : [];
    historyList.push(history);
    localStorage.setItem('giftHistory', JSON.stringify(historyList));
  } catch (error) {
    console.error('giftHistory 저장 실패:', error);
  }
};

/**
 * giftHistory를 localStorage에서 가져오는 함수
 */
export const getGiftHistory = (): GiftHistory[] => {
  try {
    const existing = localStorage.getItem('giftHistory');
    return existing ? JSON.parse(existing) : [];
  } catch (error) {
    console.error('giftHistory 조회 실패:', error);
    return [];
  }
};

