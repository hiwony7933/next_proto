/**
 * 공통 주소 컴포넌트(MzAddress)는 UI + 상태 관리만 책임
 * MzAddress는 주소 입력 UI 및 내부 상태 관리만 담당.
 * 벨리데이션은 **폼 전체 흐름(Formik, React Hook Form 등 포함)**이나 비즈니스 로직의 일부이기 때문에 부모가 담당하는 게 자연스러움.
 */
import React, { useState, useEffect } from 'react';
import MzButton from '../ui/mzButton';
import MzInputText from './mzInputText';
import { MzModal } from '../ui/mzModal';
import Postcode from 'react-daum-postcode';
import styles from './mzAddress.module.scss';

interface MzAddressProps {
  value: string;
  onChange: (value: string) => void;
}

const MzAddress: React.FC<MzAddressProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [zipcode, setZipcode] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  // 주소 선택 완료 시 처리
  const handleComplete = (data: any) => {
    setZipcode(data.zonecode);
    setAddress(data.address);
    setOpen(false);
  };

  // 값이 바뀔 때마다 부모에게 전체 주소 전달
  useEffect(() => {
    onChange(`${zipcode} ${address} ${detailAddress}`);
  }, [zipcode, address, detailAddress]);

  return (
    <div className={styles.addressContainer}>
      <span className={styles.code}>
        <MzInputText
          className={styles.code}
          type="text"
          placeholder="우편번호"
          value={zipcode}
          readOnly
        />
        <MzButton type="button" onClick={() => setOpen(true)}>
          우편번호찾기
        </MzButton>
      </span>
      <span className={styles.address}>
        <MzInputText
          className={styles.first}
          type="text"
          placeholder="주소 입력"
          value={address}
          readOnly
        />
      </span>

      <span className={styles.address}>
        <MzInputText
          className={styles.detail}
          type="text"
          placeholder="상세주소"
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
        />
      </span>

      <MzModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="우편번호 검색"
        isBottom={true}
        hasFloating={true}
        showCloseBottom={true}
      >
        <div className="modalPostcode">
          <Postcode
            style={{ width: '100%', height: '100%' }}
            onComplete={handleComplete}
            autoClose={false}
          />
        </div>
      </MzModal>
    </div>
  );
};

export default MzAddress;
