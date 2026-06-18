import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Device from "expo-device";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Button, Text } from "@/components/ui";
import { icons } from "@/constants/icons";
import { FaceScanMask } from "@/features/artisan-onboarding/components/face-scan-mask";
import { useOnboardingDraft } from "@/features/artisan-onboarding";
import { pickVerificationDocument } from "@/features/artisan-onboarding/services/verification-doc.service";
import { routes } from "@/lib/routes";

type ScanPhase = "loading" | "scanning" | "aligned" | "error" | "simulator";

const isSimulator = __DEV__ && !Device.isDevice;

/** In-app face scan with live camera preview — Figma 325:4327 / 325:4951 */
export default function ArtisanOnboardingFaceScan() {
  const { patchDraft } = useOnboardingDraft();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [phase, setPhase] = useState<ScanPhase>("loading");
  const [hint, setHint] = useState("Center your face in the circle");
  const [error, setError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    if (isSimulator) {
      setPhase("simulator");
      setHint("Use a photo to test on the simulator");
      return;
    }

    async function ensurePermission() {
      if (permission?.granted) {
        setPhase("scanning");
        return;
      }

      const result = await requestPermission();
      if (result.granted) {
        setPhase("scanning");
        return;
      }

      setPhase("error");
      setError("Camera permission is required for face verification.");
    }

    if (permission !== null) {
      void ensurePermission();
    }
  }, [permission, requestPermission]);

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || !cameraReady || isCapturing || phase !== "scanning") {
      return;
    }

    setIsCapturing(true);
    setError(null);

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (!photo?.uri) {
        setPhase("error");
        setError("Could not capture photo. Try again.");
        return;
      }

      patchDraft({ facePhotoUri: photo.uri });
      setPhase("aligned");
      setHint("Perfect!");
    } catch {
      setPhase("error");
      setError("Could not capture photo. Try again.");
    } finally {
      setIsCapturing(false);
    }
  }, [cameraReady, isCapturing, patchDraft, phase]);

  async function handleSimulatorPick() {
    setError(null);
    const result = await pickVerificationDocument();
    if (result.error) {
      setError(result.error);
      return;
    }
    if (!result.uri) return;

    patchDraft({ facePhotoUri: result.uri });
    setPhase("aligned");
    setHint("Perfect!");
  }

  function handleRetry() {
    setPhase(isSimulator ? "simulator" : "scanning");
    setError(null);
    setHint(isSimulator ? "Use a photo to test on the simulator" : "Center your face in the circle");
    setCameraReady(false);
  }

  const showCamera = phase === "scanning" || phase === "aligned";

  return (
    <View className="flex-1 bg-black">
      {showCamera ? (
        <CameraView
          ref={cameraRef}
          facing="front"
          style={StyleSheet.absoluteFill}
          onCameraReady={() => setCameraReady(true)}
        />
      ) : null}

      {showCamera ? <FaceScanMask /> : null}

      {!showCamera && phase !== "loading" ? (
        <View className="absolute inset-0 bg-black/70" />
      ) : null}

      <View className="flex-1 px-5 pb-10 pt-4" pointerEvents="box-none">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          className="h-10 w-10 justify-center"
        >
          <Image
            source={icons.arrowLeft}
            style={{ width: 24, height: 24, tintColor: "#ffffff" }}
            contentFit="contain"
          />
        </Pressable>

        <Text className="mt-2 text-center font-medium text-2xl text-white">
          Place your face in the circle
        </Text>

        {phase === "loading" ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#ffffff" />
          </View>
        ) : null}

        {phase === "simulator" ? (
          <View className="flex-1 items-center justify-center">
            <View
              className="h-[350px] w-[350px] items-center justify-center rounded-full border-2 border-dashed"
              style={{ borderColor: "#ffffff" }}
            >
              <Text className="px-6 text-center text-base text-white/80">
                Camera preview is unavailable on the simulator
              </Text>
            </View>
          </View>
        ) : null}

        {showCamera ? <View className="flex-1" pointerEvents="none" /> : null}

        <Text className="text-center font-medium text-base text-white">{hint}</Text>

        {error ? <Text className="mt-3 text-center text-sm text-danger">{error}</Text> : null}

        {phase === "scanning" ? (
          <Button
            title={isCapturing ? "Capturing…" : "Capture"}
            onPress={() => void handleCapture()}
            disabled={!cameraReady || isCapturing}
            className="mt-10"
          />
        ) : null}

        {phase === "simulator" ? (
          <Button title="Choose photo" onPress={() => void handleSimulatorPick()} className="mt-10" />
        ) : null}

        {phase === "aligned" ? (
          <Button
            title="Next"
            onPress={() => router.replace(routes.artisanOnboarding.faceSuccess)}
            className="mt-10"
          />
        ) : null}

        {phase === "error" ? (
          <Button title="Try again" onPress={handleRetry} className="mt-10" />
        ) : null}
      </View>
    </View>
  );
}
