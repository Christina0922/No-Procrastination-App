import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRewards } from '../hooks/useRewards';
import { formatDate } from '../utils/timeUtils';
import { addExchangeHistory, type ExchangeHistory } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';
import RewardExchangeHistory from '../components/RewardExchangeHistory';
import AdBanner from '../components/AdBanner';
import CoupangRandomLink from '../components/CoupangRandomLink';
import { getGiftProducts, sendGift, validatePoints, saveGiftHistory, type GiftProduct } from '../api/gift';

const RewardPage: React.FC = () => {
  const navigate = useNavigate();
  const { rewards, totalPoints, getTodayRewards, deductPoints } = useRewards();
  const todayRewards = getTodayRewards();
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [giftProducts, setGiftProducts] = useState<GiftProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<GiftProduct | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // 상품권 목록 로드
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await getGiftProducts();
        setGiftProducts(products);
      } catch (error) {
        console.error('상품 목록 로드 실패:', error);
      }
    };
    loadProducts();
  }, []);

  // 기존 상품권 목록 (하위 호환성 유지)
  const availableRewards = giftProducts.length > 0 ? giftProducts.map(p => ({
    name: p.name,
    points: p.points,
    id: p.id,
    imageUrl: p.imageUrl,
    description: p.description
  })) : [
    { name: '스타벅스 아메리카노', points: 100, id: 'starbucks-americano' },
    { name: '편의점 상품권 5천원', points: 200, id: 'convenience-5000' },
    { name: '영화관람권', points: 300, id: 'movie-ticket' },
    { name: '온라인 쇼핑몰 1만원권', points: 500, id: 'shopping-10000' }
  ];

  const handleExchangeClick = (product: GiftProduct | { name: string; points: number; id: string }) => {
    if (!validatePoints(totalPoints, product.points)) {
      alert(`포인트가 부족합니다. (필요: ${product.points}P, 보유: ${totalPoints}P)`);
      return;
    }

    // 전화번호 입력 모달 표시
    setSelectedProduct(product as GiftProduct);
    setPhoneNumber('');
    setShowPhoneModal(true);
  };

  const handlePhoneSubmit = async () => {
    if (!selectedProduct) return;

    // 전화번호 유효성 검사
    const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
    const cleanPhone = phoneNumber.replace(/-/g, '');
    
    if (!phoneRegex.test(cleanPhone)) {
      alert('올바른 전화번호 형식이 아닙니다.\n예: 010-1234-5678');
      return;
    }

    setLoading(true);
    try {
      // 기프티콘 발송 API 호출
      const result = await sendGift(phoneNumber, selectedProduct.id);
      
      if (result.success) {
        // 포인트 차감
        const deducted = deductPoints(selectedProduct.points);
        if (!deducted) {
          throw new Error('포인트 차감에 실패했습니다.');
        }

        // 교환 내역 저장 (기존 ExchangeHistory)
        const exchange: ExchangeHistory = {
          id: uuidv4(),
          rewardName: selectedProduct.name,
          pointsUsed: selectedProduct.points,
          exchangedAt: new Date().toISOString(),
          status: 'completed'
        };
        addExchangeHistory(exchange);

        // giftHistory 저장
        saveGiftHistory({
          date: new Date().toISOString(),
          productName: selectedProduct.name,
          productId: selectedProduct.id,
          phone: phoneNumber,
          usedPoints: selectedProduct.points,
          status: 'SUCCESS'
        });

        // 성공 모달 표시
        setSuccessMessage(`${selectedProduct.name} 기프티콘이 발송되었습니다!`);
        setShowPhoneModal(false);
        setShowSuccessModal(true);
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
        }, 3000);
      }
    } catch (error) {
      // 실패 시 giftHistory에 FAILED로 저장
      if (selectedProduct) {
        saveGiftHistory({
          date: new Date().toISOString(),
          productName: selectedProduct.name,
          productId: selectedProduct.id,
          phone: phoneNumber,
          usedPoints: selectedProduct.points,
          status: 'FAILED'
        });
      }

      alert(`기프티콘 발송 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
      setSelectedProduct(null);
      setPhoneNumber('');
    }
  };

  // 기존 handleExchange 함수 (하위 호환성 유지)
  const handleExchange = (rewardName: string, pointsRequired: number) => {
    if (totalPoints < pointsRequired) {
      alert(`포인트가 부족합니다. (필요: ${pointsRequired}P, 보유: ${totalPoints}P)`);
      return;
    }

    const exchange: ExchangeHistory = {
      id: uuidv4(),
      rewardName,
      pointsUsed: pointsRequired,
      exchangedAt: new Date().toISOString(),
      status: 'pending'
    };

    addExchangeHistory(exchange);
    setShowExchangeModal(false);
    alert(`교환 신청이 완료되었습니다!\n${rewardName} (${pointsRequired}P 사용)`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '28px', color: '#333' }}>보상 내역</h1>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196f3',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          홈으로
        </button>
      </div>

      {/* 현재 보유 포인트 강조 표시 */}
      <div
        style={{
          padding: '24px',
          backgroundColor: '#fff3cd',
          borderRadius: '12px',
          marginBottom: '24px',
          textAlign: 'center',
          border: '2px solid #ffc107'
        }}
      >
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>현재 보유 포인트</div>
        <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#ff6b6b' }}>
          {totalPoints} P
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>오늘 획득한 포인트</h2>
        {todayRewards.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
            오늘 획득한 포인트가 없습니다.
          </p>
        ) : (
          <div>
            {todayRewards.map((reward) => (
              <div
                key={reward.id}
                style={{
                  padding: '16px',
                  marginBottom: '12px',
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                    +{reward.amount} 포인트
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {formatDate(reward.date)}
                  </div>
                </div>
                <div style={{ fontSize: '24px' }}>🎉</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>전체 보상 내역</h2>
        {rewards.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
            보상 내역이 없습니다.
          </p>
        ) : (
          <div>
            {rewards.slice().reverse().map((reward) => (
              <div
                key={reward.id}
                style={{
                  padding: '16px',
                  marginBottom: '12px',
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                    {reward.amount > 0 ? '+' : ''}{reward.amount} 포인트
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {formatDate(reward.date)}
                  </div>
                </div>
                <div style={{ fontSize: '24px' }}>{reward.amount > 0 ? '🎉' : '💸'}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 교환 내역 */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', margin: 0 }}>교환 내역</h2>
          <button
            onClick={() => navigate('/gift-history')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#9c27b0',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            교환 내역 보기
          </button>
        </div>
        <RewardExchangeHistory />
      </div>

      <button
        onClick={() => setShowExchangeModal(true)}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: '#4caf50',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginBottom: '12px'
        }}
      >
        포인트로 상품권 받기
      </button>

      {/* 쿠팡 파트너스 랜덤 링크 */}
      <CoupangRandomLink />

      {/* Google AdSense 광고 */}
      <AdBanner slot="REWARD_01" />

      {/* 교환 모달 */}
      {showExchangeModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowExchangeModal(false)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '32px',
              borderRadius: '16px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0, marginBottom: '24px', color: 'var(--text-primary)' }}>상품권 교환</h2>
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>보유 포인트</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196f3' }}>
                {totalPoints} P
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {availableRewards.map((reward) => {
                const canExchange = validatePoints(totalPoints, reward.points);
                const pointsNeeded = reward.points - totalPoints;
                const pointsDifference = totalPoints - reward.points;
                const product = giftProducts.find(p => p.id === reward.id) || reward;
                
                return (
                  <div
                    key={reward.id}
                    style={{
                      padding: '16px',
                      border: `2px solid ${canExchange ? '#4caf50' : '#ddd'}`,
                      borderRadius: '8px',
                      backgroundColor: canExchange ? '#f1f8e9' : '#f5f5f5',
                      display: 'flex',
                      gap: '12px',
                      flexWrap: 'wrap'
                    }}
                  >
                    {/* 상품 이미지 */}
                    {product.imageUrl && (
                      <div style={{ width: '80px', height: '80px', flexShrink: 0 }}>
                        <img
                          src={product.imageUrl}
                          alt={reward.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            backgroundColor: '#f0f0f0'
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px', color: 'var(--text-primary)' }}>
                        {reward.name}
                      </div>
                      {product.description && (
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                          {product.description}
                        </div>
                      )}
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                        필요 포인트: <strong>{reward.points}P</strong>
                      </div>
                      {canExchange ? (
                        <div style={{ fontSize: '12px', color: '#4caf50', fontWeight: 'bold' }}>
                          교환 후 남은 포인트: {pointsDifference}P
                        </div>
                      ) : (
                        <div style={{ fontSize: '12px', color: '#f44336', fontWeight: 'bold' }}>
                          {pointsNeeded}P 부족합니다
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <button
                        onClick={() => handleExchangeClick(product as GiftProduct)}
                        disabled={!canExchange || loading}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: canExchange ? '#4caf50' : '#ccc',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: canExchange && !loading ? 'pointer' : 'not-allowed',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          minWidth: '100px',
                          opacity: loading ? 0.6 : 1
                        }}
                      >
                        {loading ? '처리 중...' : canExchange ? '교환하기' : '교환 불가'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setShowExchangeModal(false)}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#f44336',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 전화번호 입력 모달 */}
      {showPhoneModal && selectedProduct && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1001
          }}
          onClick={() => !loading && setShowPhoneModal(false)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '32px',
              borderRadius: '16px',
              maxWidth: '400px',
              width: '90%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0, marginBottom: '16px', color: 'var(--text-primary)' }}>
              기프티콘 발송
            </h2>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                상품: <strong>{selectedProduct.name}</strong>
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                사용 포인트: <strong>{selectedProduct.points}P</strong>
              </div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-primary)' }}>
                전화번호를 입력하세요
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  let value = e.target.value.replace(/[^0-9-]/g, '');
                  // 자동 하이픈 추가
                  if (value.length > 3 && value[3] !== '-') {
                    value = value.slice(0, 3) + '-' + value.slice(3);
                  }
                  if (value.length > 8 && value[8] !== '-') {
                    value = value.slice(0, 8) + '-' + value.slice(8, 12);
                  }
                  setPhoneNumber(value);
                }}
                placeholder="010-1234-5678"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  backgroundColor: '#fff',
                  color: '#333'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handlePhoneSubmit}
                disabled={loading || !phoneNumber}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: loading ? '#ccc' : '#4caf50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: loading || !phoneNumber ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? '발송 중...' : '발송하기'}
              </button>
              <button
                onClick={() => {
                  setShowPhoneModal(false);
                  setPhoneNumber('');
                  setSelectedProduct(null);
                }}
                disabled={loading}
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#f44336',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 성공 모달 */}
      {showSuccessModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1002
          }}
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '32px',
              borderRadius: '16px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ marginTop: 0, marginBottom: '16px', color: 'var(--text-primary)' }}>
              기프티콘 발송 완료!
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              {successMessage}
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                setShowExchangeModal(false);
              }}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#4caf50',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* Confetti 애니메이션 */}
      {showConfetti && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 1003,
            overflow: 'hidden'
          }}
        >
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: '-10px',
                fontSize: '20px',
                animation: `confettiFall ${2 + Math.random() * 2}s linear forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
                opacity: 0.8
              }}
            >
              {['🎉', '🎊', '✨', '⭐', '💫'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default RewardPage;
