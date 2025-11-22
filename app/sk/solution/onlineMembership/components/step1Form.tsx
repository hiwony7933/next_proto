import React from "react";
import MzButton from "@/app/common/components/atom/mzButton";
import MzInputText from "@/app/common/components/atom/mzInputText";
import MzTextArea from "@/app/common/components/atom/mzTextArea";
import { MzCheckBox } from "@/app/common/components/atom/mzCheckBox";
import AddressSearch from "@/app/common/components/molecule/addressSearch";
import useBreakpoint from "@/hooks/useBreakpoint";
import S from "../page.module.scss";

interface Step1FormProps {
  // 폼 상태
  name: string;
  setName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  idNumber: string;
  setIdNumber: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  addressDetail: string;
  setAddressDetail: (value: string) => void;
  installDate: string;
  setInstallDate: (value: string) => void;
  request: string;
  setRequest: (value: string) => void;

  // 약관 동의 상태
  allRequiredAgreed: boolean;
  handleAllRequiredChange: (checked: boolean) => void;
  required1: boolean;
  setRequired1: (value: boolean) => void;
  required2: boolean;
  setRequired2: (value: boolean) => void;
  required3: boolean;
  setRequired3: (value: boolean) => void;
  required4: boolean;
  setRequired4: (value: boolean) => void;
  required5: boolean;
  setRequired5: (value: boolean) => void;

  allOptionalAgreed: boolean;
  handleAllOptionalChange: (checked: boolean) => void;
  optional1: boolean;
  setOptional1: (value: boolean) => void;
  optional2: boolean;
  setOptional2: (value: boolean) => void;

  showError: boolean;
  onSubmit: () => void;
}

export default function Step1Form({
  name,
  setName,
  phone,
  setPhone,
  idNumber,
  setIdNumber,
  email,
  setEmail,
  address,
  setAddress,
  addressDetail,
  setAddressDetail,
  installDate,
  setInstallDate,
  request,
  setRequest,
  allRequiredAgreed,
  handleAllRequiredChange,
  required1,
  setRequired1,
  required2,
  setRequired2,
  required3,
  setRequired3,
  required4,
  setRequired4,
  required5,
  setRequired5,
  allOptionalAgreed,
  handleAllOptionalChange,
  optional1,
  setOptional1,
  optional2,
  setOptional2,
  showError,
  onSubmit,
}: Step1FormProps) {
  const { isMobile } = useBreakpoint();

  return (
    <div className="form__container">
      <div className={S.auth__section}>
        <MzButton
          size="Large"
          fill="white"
          onClick={() => console.log("본인 인증")}
        >
          본인 인증하기
        </MzButton>
      </div>

      {/* 가입자정보 */}
      <div className="form__wrap">
        <span className="form__title">
          가입자정보
          <span className={S.section__subtitle}>
            본인 정보를 확인해 주세요.
          </span>
        </span>

        <div className="form__row row mb-none">
          <div className={`col-${isMobile ? 12 : 6}`}>
            <label className="form__label required" htmlFor="name">
              이름
            </label>
            <MzInputText
              type="text"
              id="name"
              value={name}
              placeholder="본인인증 후 자동 입력됩니다."
              onChange={(e) => setName(e.target.value)}
              disabled
              errorText="이름을 입력해주세요."
              showError={showError && !name.trim()}
            />
          </div>
          <div className={`col-${isMobile ? 12 : 6}`}>
            <label className="form__label required" htmlFor="phone">
              휴대폰번호
            </label>
            <MzInputText
              type="text"
              id="phone"
              value={phone}
              placeholder="본인인증 후 자동 입력됩니다."
              onChange={(e) => setPhone(e.target.value)}
              disabled
              errorText="휴대폰번호를 입력해주세요."
              showError={showError && !phone.trim()}
            />
          </div>
        </div>

        <div className="form__process row">
          <div className={`col-${isMobile ? 12 : 6}`}>
            <label className="form__label required" htmlFor="idNumber">
              주민등록번호
            </label>
            <MzInputText
              type="text"
              id="idNumber"
              value={idNumber}
              placeholder="주민등록번호를 입력해 주세요."
              onChange={(e) => setIdNumber(e.target.value)}
              errorText="주민등록번호를 입력해주세요."
              showError={showError && !idNumber.trim()}
            />
          </div>
          <div className={`col-${isMobile ? 12 : 6}`}>
            <label className="form__label required" htmlFor="email">
              이메일
            </label>
            <MzInputText
              type="email"
              id="email"
              value={email}
              placeholder="이메일을 입력해 주세요."
              onChange={(e) => setEmail(e.target.value)}
              errorText="이메일을 입력해주세요."
              showError={showError && !email.trim()}
            />
          </div>
        </div>

        <div className="form__process row">
          <div className={`col-12`}>
            <label className="form__label required" htmlFor="address">
              주소
            </label>
            <AddressSearch />
          </div>
        </div>
      </div>

      {/* 요청사항 */}
      <div className="form__wrap">
        <p className="form__title">요청사항</p>

        <div className="form__row">
          <label className="form__label" htmlFor="installDate">
            설치 희망일자
          </label>
          <MzInputText
            type="date"
            id="installDate"
            value={installDate}
            placeholder="YYYY-MM-DD"
            onChange={(e) => setInstallDate(e.target.value)}
          />
          <div className={S.install__notice}>
            <p>- 선택하신 설치희망일과 실제 설치일은 다를 수 있습니다.</p>
            <p>
              - 당일/주말/공휴일은 설치가 어렵습니다. 자세한 사항은 사이버가드
              기술지원팀 1599-8315으로 문의해주시길 바랍니다.
            </p>
          </div>
        </div>

        <div className="">
          <label className="form__label" htmlFor="request">
            요청사항
          </label>
          <MzTextArea
            type="normal"
            value={request}
            onChange={(e) =>
              setRequest(typeof e === "string" ? e : e.target.value)
            }
            placeholder="내용을 입력해주세요."
            height="260px"
            resize="none"
          />
        </div>
      </div>

      {/* 필수 약관 */}
      <div className={S.agreement__section}>
        <div className={S.agreement__header}>
          <MzCheckBox
            type="checkbox"
            id="allRequiredAgreed"
            shape="round"
            checked={allRequiredAgreed}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleAllRequiredChange(e.target.checked)
            }
            className={S.agreement__checkbox}
          >
            <span>필수 약관에 모두 동의합니다</span>
          </MzCheckBox>
        </div>
        <div className={S.agreement__divider} />

        <div className={S.agreement__list}>
          <div className={S.agreement__item}>
            <MzCheckBox
              type="checkbox"
              id="required1"
              shape="round"
              checked={required1}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRequired1(e.target.checked)
              }
              className={S.agreement__checkbox}
            >
              <span className={S.required}>[필수]</span>
              <span>
                본인은 구독 전 사이버가드 주요 약관 및 내용을 충분히 이해하고
                확인하였습니다
              </span>
            </MzCheckBox>
            <button type="button" className={S.view__button}>
              보기
            </button>
          </div>

          <div className={S.agreement__item}>
            <MzCheckBox
              type="checkbox"
              id="required2"
              shape="round"
              checked={required2}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRequired2(e.target.checked)
              }
              className={S.agreement__checkbox}
            >
              <span className={S.required}>[필수]</span>
              <span>만 14세 이상입니다</span>
            </MzCheckBox>
            <button type="button" className={S.view__button}>
              보기
            </button>
          </div>

          <div className={S.agreement__item}>
            <MzCheckBox
              type="checkbox"
              id="required3"
              shape="round"
              checked={required3}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRequired3(e.target.checked)
              }
              className={S.agreement__checkbox}
            >
              <span className={S.required}>[필수]</span>
              <span>사이버가드 구독 주요 약관 동의</span>
            </MzCheckBox>
            <button type="button" className={S.view__button}>
              보기
            </button>
          </div>

          <div className={S.agreement__item}>
            <MzCheckBox
              type="checkbox"
              id="required4"
              shape="round"
              checked={required4}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRequired4(e.target.checked)
              }
              className={S.agreement__checkbox}
            >
              <span className={S.required}>[필수]</span>
              <span>개인정보 수집 · 이용에 동의</span>
            </MzCheckBox>
            <button type="button" className={S.view__button}>
              보기
            </button>
          </div>

          <div className={S.agreement__item}>
            <MzCheckBox
              type="checkbox"
              id="required5"
              shape="round"
              checked={required5}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRequired5(e.target.checked)
              }
            >
              <span className={S.required}>[필수]</span>
              <span>고유식별정보 수집 · 이용에 동의</span>
            </MzCheckBox>
            <button type="button" className={S.view__button}>
              보기
            </button>
          </div>
        </div>
      </div>

      {/* 선택 약관 */}
      <div className={S.agreement__section}>
        <div className={S.agreement__header}>
          <MzCheckBox
            type="checkbox"
            id="allOptionalAgreed"
            shape="round"
            checked={allOptionalAgreed}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleAllOptionalChange(e.target.checked)
            }
            className={S.agreement__checkbox}
          >
            <span>선택 약관에 모두 동의합니다</span>
          </MzCheckBox>
        </div>
        <div className={S.agreement__divider} />

        <div className={S.agreement__list}>
          <div className={S.agreement__item}>
            <MzCheckBox
              type="checkbox"
              id="optional1"
              shape="round"
              checked={optional1}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setOptional1(e.target.checked)
              }
              className={S.agreement__checkbox}
            >
              <span className={S.optional}>[선택]</span>
              <span>마케팅 정보 제공을 위한 개인정보 수집 · 이용에 동의</span>
            </MzCheckBox>
            <button type="button" className={S.view__button}>
              보기
            </button>
          </div>

          <div className={S.agreement__item}>
            <MzCheckBox
              type="checkbox"
              id="optional2"
              shape="round"
              checked={optional2}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setOptional2(e.target.checked)
              }
              className={S.agreement__checkbox}
            >
              <span className={S.optional}>[선택]</span>
              <span>마케팅 정보 수신에 동의</span>
            </MzCheckBox>
            <button type="button" className={S.view__button}>
              보기
            </button>
          </div>
        </div>
      </div>

      <div className="form__bottom">
        <MzButton size="Large" cta fill="black" onClick={onSubmit}>
          동의하고 구독 신청하기
        </MzButton>
      </div>
    </div>
  );
}
