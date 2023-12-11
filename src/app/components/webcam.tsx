/* eslint-disable jsx-a11y/alt-text */
"use client";
import { useRef, useState} from "react";
import Webcam, { WebcamProps } from "react-webcam";
import styles from "./styles.css"; // Import the CSS file
import { Box, Container, Center, Flex} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

interface WebcamComponentProps {}

const WebcamComponent: React.FC<WebcamComponentProps> = () => {
  const webcamRef = useRef<Webcam | null>(null);
  const router = useRouter();
  const [mirrored, setMirrored] = useState<boolean>(false);

  const capture = (): void => {
    if (webcamRef.current) {
      const imageSrc: string | undefined = webcamRef.current.getScreenshot();

      if (imageSrc) {
        rotateImage(imageSrc, 90, (image) => {
          localStorage.setItem("myPhoto", image);
          router.push("/photo");
        });
      }
    }
  };

  const rotateImage = (
    imageBase64: string,
    rotation: number,
    cb: (image: string) => void
  ): void => {
    const img = new Image();
    img.src = imageBase64;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(img, 0, 0);
        cb(canvas.toDataURL("image/jpeg"));
      }
    };
  };

  const videoConstraints: WebcamProps["videoConstraints"] = {
    width: 720,
    height: 720,
    facingMode: "user",
  };

  const imageCameraStyle = {
    position: "absolute" as const,
    bottom: "10%" as const,
  };

  return (
    <Container>
      <Box
        maxW="sm"
        mt={{ base: "0px", md: "10px", lg: "10px" }}
        height={{ base: "100%", md: "50%", lg: "25%" }}
        width={{ base: "600px", md: "50%", lg: "25%" }}
        borderWidth={{ base: "0px", md: "1px", lg: "1px" }}
        bg="teal.400"
        justifyContent="center"
        overflow="hidden"
        borderRadius="lg"
        rounded={{ base: "none", md: "24", lg: "24" }}
      >
        <Flex direction="column" background="white">
          <Center>
            {/* Webcam Component */}
            <Webcam
              audio={false}
              height={720}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={720}
              videoConstraints={videoConstraints}
              mirrored={mirrored}
            />
            {/* Overlay Image */}
            <img
              src="/Identité.png"
              alt="Overlay"
              width={720}
              height={720}
              className={`position-absolute ${styles.overlayImage}`}
            />
            <img
              src="/camera.svg"
              width="70px"
              height="70px"
              alt="Logo"
              style={imageCameraStyle}
              onClick={capture}
            />
          </Center>
        </Flex>
      </Box>
    </Container>
  );
};

export default WebcamComponent;
