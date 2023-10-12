import styled from 'styled-components/macro';
import Link from 'components/atoms/Link';
import Form from 'components/molecules/Form';

export const SubTitle = styled.span`
  color: var(--light-gray);
  margin-bottom: 40px;
  display: block;
  @media (min-width: 768px) {
    margin-bottom: 80px;
  }
`;

export const LoginHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  padding: 30px;
  @media (min-width: 768px) {
    padding: 40px 80px;
  }
`;

export const FormHolder = styled.div`
  width: 100%;
`;

export const StyledForm = styled(Form)`
  text-align: left;
  max-width: 500px;
  margin: 0 auto;
`;

export const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  color: var(--light-gray);
  &:hover {
    i {
      transform: translateX(-5px);
    }
  }
  i {
    color: var(--primary);
    transition: transform 0.3s linear;
  }
`;
