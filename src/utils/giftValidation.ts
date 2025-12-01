/**
 * 기프티콘 교환 시스템 검증 유틸리티
 * 전체 동작 흐름을 검증하는 함수들
 */

import { validatePoints, type Reward } from '../api/gift';

// GiftHistory는 더 이상 사용되지 않으므로 빈 배열로 처리
type GiftHistory = {
  date: string;
  productName: string;
  productId: string;
  phone: string;
  usedPoints: number;
  status: 'SUCCESS' | 'FAILED';
};

const getGiftHistory = (): GiftHistory[] => {
  try {
    const existing = localStorage.getItem('giftHistory');
    return existing ? JSON.parse(existing) : [];
  } catch {
    return [];
  }
};

// Reward를 GiftProduct로 사용 (타입 별칭)
type GiftProduct = Reward;

/**
 * 포인트 차감 검증
 * @param userPoints 사용자 보유 포인트
 * @param productPrice 상품 가격
 * @returns 검증 결과
 */
export const validatePointDeduction = (
  userPoints: number,
  productPrice: number
): { valid: boolean; message: string } => {
  if (userPoints < 0) {
    return { valid: false, message: '보유 포인트가 음수일 수 없습니다.' };
  }

  if (productPrice <= 0) {
    return { valid: false, message: '상품 가격이 0보다 커야 합니다.' };
  }

  if (!validatePoints(userPoints, productPrice)) {
    return {
      valid: false,
      message: `포인트가 부족합니다. (필요: ${productPrice}P, 보유: ${userPoints}P)`
    };
  }

  return { valid: true, message: '포인트 차감 가능' };
};

/**
 * 전화번호 형식 검증
 * @param phone 전화번호
 * @returns 검증 결과
 */
export const validatePhoneNumber = (phone: string): { valid: boolean; message: string } => {
  if (!phone || phone.trim() === '') {
    return { valid: false, message: '전화번호를 입력해주세요.' };
  }

  const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
  const cleanPhone = phone.replace(/-/g, '');

  if (!phoneRegex.test(cleanPhone)) {
    return {
      valid: false,
      message: '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)'
    };
  }

  return { valid: true, message: '전화번호 형식 올바름' };
};

/**
 * 상품 정보 검증
 * @param product 상품 정보
 * @returns 검증 결과
 */
export const validateProduct = (product: GiftProduct | null): { valid: boolean; message: string } => {
  if (!product) {
    return { valid: false, message: '상품을 선택해주세요.' };
  }

  if (!product.id || product.id.trim() === '') {
    return { valid: false, message: '상품 ID가 없습니다.' };
  }

  if (!product.name || product.name.trim() === '') {
    return { valid: false, message: '상품명이 없습니다.' };
  }

  if (product.points <= 0) {
    return { valid: false, message: '상품 포인트가 0보다 커야 합니다.' };
  }

  return { valid: true, message: '상품 정보 올바름' };
};

/**
 * 전체 교환 프로세스 검증
 * @param userPoints 사용자 보유 포인트
 * @param product 상품 정보
 * @param phone 전화번호
 * @returns 검증 결과
 */
export const validateExchangeProcess = (
  userPoints: number,
  product: GiftProduct | null,
  phone: string
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // 상품 검증
  const productValidation = validateProduct(product);
  if (!productValidation.valid) {
    errors.push(productValidation.message);
  }

  // 포인트 검증
  if (product) {
    const pointValidation = validatePointDeduction(userPoints, product.points);
    if (!pointValidation.valid) {
      errors.push(pointValidation.message);
    }
  }

  // 전화번호 검증
  const phoneValidation = validatePhoneNumber(phone);
  if (!phoneValidation.valid) {
    errors.push(phoneValidation.message);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * 교환 내역 무결성 검증
 * @returns 검증 결과
 */
export const validateGiftHistory = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const history = getGiftHistory();

  history.forEach((item, index) => {
    if (!item.date) {
      errors.push(`내역 ${index + 1}: 날짜가 없습니다.`);
    }

    if (!item.productName || item.productName.trim() === '') {
      errors.push(`내역 ${index + 1}: 상품명이 없습니다.`);
    }

    if (!item.productId || item.productId.trim() === '') {
      errors.push(`내역 ${index + 1}: 상품 ID가 없습니다.`);
    }

    if (!item.phone || item.phone.trim() === '') {
      errors.push(`내역 ${index + 1}: 전화번호가 없습니다.`);
    }

    if (item.usedPoints <= 0) {
      errors.push(`내역 ${index + 1}: 사용 포인트가 0보다 커야 합니다.`);
    }

    if (item.status !== 'SUCCESS' && item.status !== 'FAILED') {
      errors.push(`내역 ${index + 1}: 상태가 올바르지 않습니다. (${item.status})`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * 포인트 시스템 무결성 검증
 * @returns 검증 결과
 */
export const validatePointsSystem = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // localStorage에서 userPoints 가져오기
  try {
    const savedPoints = localStorage.getItem('userPoints');
    const userPoints = savedPoints ? Number(savedPoints) : 0;
    
    if (isNaN(userPoints)) {
      errors.push('사용자 포인트가 유효한 숫자가 아닙니다.');
    }
    
    if (userPoints < 0) {
      errors.push('총 포인트가 음수입니다. 시스템 오류 가능성이 있습니다.');
    }
  } catch (error) {
    errors.push('포인트 시스템 검증 중 오류 발생');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * 전체 시스템 검증 (통합)
 * @returns 검증 결과
 */
export const validateGiftSystem = (): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 교환 내역 검증
  const historyValidation = validateGiftHistory();
  if (!historyValidation.valid) {
    errors.push(...historyValidation.errors);
  }

  // 포인트 시스템 검증
  const pointsValidation = validatePointsSystem();
  if (!pointsValidation.valid) {
    errors.push(...pointsValidation.errors);
  }

  // 경고: 교환 내역이 많으면 성능 이슈 가능성
  const history = getGiftHistory();
  if (history.length > 1000) {
    warnings.push('교환 내역이 1000개를 초과했습니다. 성능 저하가 발생할 수 있습니다.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

