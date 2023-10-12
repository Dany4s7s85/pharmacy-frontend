import React from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';
import Skeleton from 'react-loading-skeleton';
import PlastkLogo from 'assets/images/logo-p.svg';
import {
  PageLoaderWrapper,
  PageLoader,
  ComponentLoader,
  Logo,
  BtnLoader,
  LoaderWrap,
  BlurBackground,
  ComponentLoaderHolder,
  ViewLoader,
} from './Loaders.styles';

function Loaders({ pageLoader, viewLoader, notificationLoader, buttonLoader, height, loading, children }) {
  return (
    <>
      {pageLoader && (
        <PageLoaderWrapper>
          <PageLoader>
            <Logo src={PlastkLogo} />
          </PageLoader>
        </PageLoaderWrapper>
      )}
      {loading ? (
        <ComponentLoaderHolder height={height}>
          <BlurBackground />
          <LoaderWrap>
            <ComponentLoader />
          </LoaderWrap>
          {children}
        </ComponentLoaderHolder>
      ) : (
        <>{children}</>
      )}
      {viewLoader && (
        <div
          css={`
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 50px 25px;
            gap: 30px;
          `}>
          <ViewLoader>
            <svg viewBox="0 0 80 80">
              <circle id="test" cx="40" cy="40" r="32" />
            </svg>
          </ViewLoader>
          <ViewLoader className="triangle">
            <svg viewBox="0 0 86 80">
              <polygon points="43 8 79 72 7 72" />
            </svg>
          </ViewLoader>
          <ViewLoader>
            <svg viewBox="0 0 80 80">
              <rect x="8" y="8" width="64" height="64" />
            </svg>
          </ViewLoader>
        </div>
      )}
      {buttonLoader && (
        <BtnLoader>
          <svg
            viewBox="0 0 1024 1024"
            focusable="false"
            data-icon="loading"
            width="1em"
            height="1em"
            fill="#000"
            aria-hidden="true">
            <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z" />
          </svg>
        </BtnLoader>
      )}
      {notificationLoader && (
        <div
          css={`
            display: flex;
            flex-direction: column;
          `}>
          <Skeleton
            count={1}
            width={150}
            height={15}
            css={`
              border-radius: 10px;
            `}
          />
          <Skeleton
            count={1}
            width={130}
            height={15}
            css={`
              border-radius: 10px;
            `}
          />
          <Skeleton
            count={1}
            width={280}
            height={15}
            css={`
              border-radius: 10px;
            `}
          />
          <Skeleton
            count={1}
            width={150}
            height={15}
            css={`
              border-radius: 10px;
            `}
          />
        </div>
      )}
    </>
  );
}

export default Loaders;
