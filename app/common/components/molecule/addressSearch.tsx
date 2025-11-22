import React, { useState } from "react";
import MzInputText from "../atom/mzInputText";
import MzButton from "../atom/mzButton";
import useBreakpoint from "@/hooks/useBreakpoint";

export default function AddressSearch() {
  const { isMobile } = useBreakpoint();
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [showError, setShowError] = useState(true);

  const handleAddressSearch = () => {
    console.log("addressSearch");
  };

  return (
    <div className="row">
      <div className={`col-${isMobile ? 12 : 6} row`}>
        <MzInputText
          type="text"
          id="address"
          value={address}
          placeholder="주소를 입력해주세요."
          onChange={(e) => setAddress(e.target.value)}
          errorText="주소를 입력해주세요."
          showError={showError && !address.trim()}
          className={`col-${isMobile ? 7 : 9}`}
        />
        <MzButton
          size="Form"
          fill="black"
          className={`col-${isMobile ? 5 : 3}`}
        >
          주소검색
        </MzButton>
      </div>
      <div className={`col-${isMobile ? 12 : 6}`}>
        <MzInputText
          type="text"
          id="addressDetail"
          value={addressDetail}
          placeholder="상세주소를 입력해주세요."
          onChange={(e) => setAddressDetail(e.target.value)}
        />
      </div>
    </div>
  );
}
