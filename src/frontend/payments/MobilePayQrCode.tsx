import React from "react";
import { generateMobilePayAppLink, generateMobilePayWebLink } from "../../common/mobilePay";
import qr from "qrcode";
import { styled } from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const Title = styled.span`
  font-size: 16px;
  font-weight: 500;
`;

interface Props {
  amount: number;
  phone: string;
}

export function MobilePayQrCode({ amount, phone }: Props) {
  const link = generateMobilePayWebLink({
    amount,
    phone,
  });

  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (!ref.current) {
      return;
    }

    qr.toCanvas(ref.current, link, {
      margin: 2,
      scale: 4,
      errorCorrectionLevel: "M",
    });
  }, [link]);

  return (
    <Container>
      <Title>MobilePay {phone}</Title>
      <canvas ref={ref} />
    </Container>
  );
}
