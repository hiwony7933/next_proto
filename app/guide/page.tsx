'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import './assets/home.scss';
import '@/styles/common.scss';
import { MenuList as commonMenu } from './menu/commonHomeMenu';
import { MenuList as mobileMenu } from './menu/mobileHomeMenu';
import { MenuList as desktopMenu } from './menu/desktopHomeMenu';
import { MenuList as adminMenu } from './menu/adminHomeMenu';

type Depth03Item = {
  sub03Code?: string;
  SubMenuName: string;
  LinkUrl: string;
  flag?: string;
};

type Depth02Item = {
  sub02Code?: string;
  SubMenuName: string;
  LinkUrl?: string;
  flag?: string;
  Depth03?: Depth03Item[];
};

type MenuItem = {
  Depth01: string;
  MenuName: string;
  LinkUrl?: string;
  flag?: string;
  Depth02: Depth02Item[];
};

interface MenuItemProps {
  menuName: string;
  linkUrl?: string;
  flag?: string;
  depth: number;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  onLinkClick?: (url: string) => void;
  className?: string;
}

const MenuItemComponent: React.FC<MenuItemProps> = ({
  menuName,
  linkUrl,
  flag,
  depth,
  onClick,
  onLinkClick,
  className,
}) => {
  const menuClass = `menu${depth}`;
  const finalClassName = className ? `${menuClass} ${className}` : menuClass;

  const renderStatus = () => {
    if (flag === 'Confirm') {
      return <em className="status">(완료)</em>;
    }
    if (flag === 'Design') {
      return <em className="status">(진행중)</em>;
    }
    return null;
  };

  if (linkUrl && linkUrl.length > 0) {
    return (
      <a
        href={linkUrl}
        onClick={(e) => {
          e.preventDefault();
          onLinkClick?.(linkUrl);
          onClick?.(e);
        }}
        className={finalClassName}
        target="ContFrame"
      >
        <span dangerouslySetInnerHTML={{ __html: menuName }} />
        {renderStatus()}
      </a>
    );
  }

  return (
    <div className={finalClassName} onClick={onClick}>
      <span dangerouslySetInnerHTML={{ __html: menuName }} />
      {renderStatus()}
    </div>
  );
};

const Iframe: React.FC<React.IframeHTMLAttributes<HTMLIFrameElement>> = (props) => (
  <iframe {...props} />
);

export default function Page() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  const [iframeUrl, setIframeUrl] = useState('');
  const [activeMenu, setActiveMenu] = useState<'admin' | 'common' | 'desktop' | 'mobile'>('admin');
  const [isHide, setIsHide] = useState(false);

  const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
    if (!status) return items;

    return items
      .map((item) => ({
        ...item,
        Depth02: item.Depth02.filter((d2) => !status || d2.flag === status)
          .map((d2) => ({
            ...d2,
            Depth03: d2.Depth03?.filter((d3) => !status || d3.flag === status),
          }))
          .filter((d2) => !status || (d2.Depth03 && d2.Depth03.length > 0)),
      }))
      .filter(
        (item) => !status || item.flag === status || (item.Depth02 && item.Depth02.length > 0),
      );
  };

  let menuData: MenuItem[];
  switch (activeMenu) {
    case 'common':
      menuData = commonMenu;
      break;
    case 'desktop':
      menuData = desktopMenu;
      break;
    case 'mobile':
      menuData = mobileMenu;
      break;
    case 'admin':
    default:
      menuData = adminMenu;
  }

  const filteredMenuItems = filterMenuItems(menuData);

  useEffect(() => {
    if (status === 'Confirm' && (!filteredMenuItems || filteredMenuItems.length === 0)) {
      setIframeUrl('/notice');
    }
  }, [status, filteredMenuItems]);

  const handleMenuClick = (menuType: 'admin' | 'common' | 'desktop' | 'mobile') => {
    setActiveMenu(menuType);
    setIframeUrl('');
  };

  const handleClick = (depth: number, e: React.MouseEvent<HTMLElement>) => {
    switch (depth) {
      case 1:
        document.querySelectorAll(`.list > li`).forEach((el) => {
          if (el !== e.currentTarget.parentElement) {
            el.classList.remove('active');
          }
        });
        break;
      case 2:
      case 3:
        document.querySelectorAll(`.sub > li`).forEach((el) => {
          if (el !== e.currentTarget.parentElement) {
            el.classList.remove('active');
          }
        });
        break;
    }
    e.currentTarget.parentElement?.classList.toggle('active');
  };

  const handleCloseGuideLnb = () => {
    setIsHide((prev) => !prev);
  };

  return (
    <>
      <div id="header" className={'guideH'}>
        <ul className={'util'}>
          <li className={activeMenu === 'admin' ? 'active' : ''}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick('admin');
              }}
            >
              Admin LIST
            </a>
          </li>
        </ul>
      </div>

      <div className={`publishingList${isHide ? ' hide' : ''}`}>
        <div className={'lnb'}>
          <ul className={'list'}>
            {filteredMenuItems.map((MenuList, index) => (
              <li key={`MenuList_${index}`}>
                <MenuItemComponent
                  menuName={MenuList.MenuName}
                  linkUrl={MenuList.LinkUrl}
                  flag={MenuList.flag}
                  depth={1}
                  onClick={(e) => handleClick(1, e)}
                  onLinkClick={(url) => setIframeUrl(url)}
                />

                <ul className={'sub02'}>
                  {MenuList.Depth02.map((Depth02, index) => (
                    <li key={`Depth02_${index}`}>
                      {Depth02.LinkUrl !== '' && (
                        <MenuItemComponent
                          menuName={Depth02.SubMenuName}
                          linkUrl={Depth02.LinkUrl}
                          flag={Depth02.flag}
                          depth={2}
                          onLinkClick={(url) => setIframeUrl(url)}
                        />
                      )}

                      {Depth02.LinkUrl === '' && (
                        <>
                          <MenuItemComponent
                            menuName={Depth02.SubMenuName}
                            flag={Depth02.flag}
                            depth={2}
                            onClick={(e) => handleClick(2, e)}
                          />
                          <ul className={'sub03'}>
                            {Depth02.Depth03?.map((Depth03, index) => (
                              <li
                                key={`Depth03_${index}`}
                                className={Depth03.flag === 'Design' ? 'underline' : ''}
                              >
                                <MenuItemComponent
                                  menuName={Depth03.SubMenuName}
                                  linkUrl={Depth03.LinkUrl}
                                  flag={Depth03.flag}
                                  depth={3}
                                  onLinkClick={(url) => setIframeUrl(url)}
                                />
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${activeMenu === 'mobile' ? 'containerMc' : 'containerPc'}`}>
          {iframeUrl && (
            <Iframe
              src={iframeUrl}
              id="ContFrame"
              name="ContFrame"
              title="ContFrame"
              className={'iframe'}
            />
          )}
          <div className="goTo">
            <a href={iframeUrl} target="_blank" className="goToBtn">
              새창으로
            </a>
            <button type="button" onClick={handleCloseGuideLnb}>
              {isHide ? '가이드 보기' : '가이드 숨김'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
