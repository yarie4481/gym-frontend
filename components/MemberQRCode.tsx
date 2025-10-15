// // components/MemberQRCode.tsx (Optional - for generating member QR codes)
// "use client";

// import React from "react";
// import QRCode from "qrcode.react"; // You'll need to install this package

// interface MemberQRCodeProps {
//   memberId: string;
//   memberName: string;
// }

// const MemberQRCode: React.FC<MemberQRCodeProps> = ({
//   memberId,
//   memberName,
// }) => {
//   const qrValue = JSON.stringify({
//     member_id: memberId,
//     type: "attendance",
//     timestamp: new Date().toISOString(),
//   });

//   const downloadQRCode = () => {
//     const canvas = document.getElementById("qr-code") as HTMLCanvasElement;
//     if (canvas) {
//       const pngUrl = canvas.toDataURL("image/png");
//       const downloadLink = document.createElement("a");
//       downloadLink.href = pngUrl;
//       downloadLink.download = `member-${memberId}-qrcode.png`;
//       document.body.appendChild(downloadLink);
//       downloadLink.click();
//       document.body.removeChild(downloadLink);
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg p-6 border border-cyan-200 shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-900 mb-4">
//         Member QR Code
//       </h3>
//       <div className="text-center">
//         <div className="bg-white p-4 rounded-lg border border-gray-300 inline-block">
//           <QRCode
//             id="qr-code"
//             value={qrValue}
//             size={200}
//             level="H"
//             includeMargin
//           />
//         </div>
//         <p className="text-sm text-gray-600 mt-2">{memberName}</p>
//         <p className="text-xs text-gray-500">
//           Member ID: {memberId.slice(0, 8)}...
//         </p>
//         <button
//           onClick={downloadQRCode}
//           className="mt-4 px-4 py-2 text-sm font-medium text-cyan-600 bg-cyan-50 border border-cyan-200 rounded-lg hover:bg-cyan-100 transition-colors"
//         >
//           Download QR Code
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MemberQRCode;
