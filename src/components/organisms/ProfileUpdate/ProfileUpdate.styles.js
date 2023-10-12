import styled from 'styled-components/macro';

export const ProfileBlock = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Head = styled.div`
  border-bottom: 1px solid #eee;
  padding: 15px 30px;
`;

export const Holder = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  background: var(--white);
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.07), 0 4px 8px rgba(0, 0, 0, 0.07),
    0 8px 16px rgba(0, 0, 0, 0.07), 0 16px 32px rgba(0, 0, 0, 0.07), 0 32px 64px rgba(0, 0, 0, 0.07);
`;

export const BtnHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-top: 1px solid #eee;
  padding: 20px 30px;
`;

export const FormHolder = styled.div`
  border-bottom: 1px solid #eee;
  padding: 20px 30px;
`;

export const ResetOtpHolder = styled.div`
  padding: 20px 30px;
`;

export const Banner = styled.div`
  min-height: 200px;
  background: linear-gradient(to right, #085078, #85d8ce);
  margin: -20px -20px -46px;
  h2 {
    color: var(--white);
    padding-left: 20px;
    padding-top: 80px;
  }
`;
