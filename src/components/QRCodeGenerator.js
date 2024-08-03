// client/src/components/DoctorPortal/QRCodeGenerator.js
import React from 'react';
import QRCode from 'qrcode.react';

const QRCodeGenerator = ({ value }) => {
  return <QRCode value={value} />;
};

export default QRCodeGenerator;
