"use client";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";

const qrboxFunction = function (viewfinderWidth, viewfinderHeight) {
  const minEdgePercentage = 0.7;
  const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
  const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
  return {
    width: qrboxSize,
    height: qrboxSize,
  };
};

export default function QrScanner() {
  const router = useRouter();

  const handleQrCodeSuccess = (qrCodeMessage) => {
    console.log(qrCodeMessage);
  };

  const handleQrCodeError = (errorMessage) => {
    console.log("error scanning qr code");
  };

  const startScanning = () => {
    const scanner = new Html5Qrcode("reader");
    scanner.start(
      { facingMode: "environment" },
      { qrbox: qrboxFunction, fps: 30 },
      handleQrCodeSuccess,
      handleQrCodeError
    );
  };

  const stopScanning = () => {
    Html5Qrcode.getCameras().then((cameras) => {
      if (cameras && cameras.length > 0) {
        const scanner = new Html5Qrcode("reader");
        scanner.stop().then(() => {
          console.log("Scanner stopped");
        });
      }
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataURL = e.target.result;
        const scanner = new Html5Qrcode("reader");
        scanner
          .scanFileV2(file, true)
          .then((qrCodeMessage) => handleQrCodeSuccess(qrCodeMessage))
          .catch((errorMessage) => handleQrCodeError(errorMessage));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.scanner_container}>
      <div id="reader" className={styles.scanner}></div>
      <div>
        <button onClick={startScanning}>Scan Live</button>
        <button onClick={stopScanning}>Stop Scanning</button>
        <input type="file" accept="image/*" onChange={handleFileUpload} />
      </div>
    </div>
  );
}
