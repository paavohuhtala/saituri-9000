import { styled } from "styled-components";
import { gray } from "../theme";

export const ViewContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;

  margin-top: 32px;
  margin-bottom: 32px;
  width: 100%;
`;

export const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 16px;
  flex-wrap: wrap;
`;

export const ViewTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  line-height: 40px;
  color: ${gray.x100};
`;

export const ViewSubtitle = styled.h2`
  font-size: 24px;
  font-weight: 500;
  line-height: 32px;
  color: ${gray.x100};
`;

export const InlineForm = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  max-width: 100%;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  width: 100%;
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
`;

export const FormLabel = styled.label`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: ${gray.x100};
`;

export const FormConstant = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: ${gray.x100};
`;
