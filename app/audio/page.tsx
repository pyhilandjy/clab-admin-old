"use client";
import React from "react";
import ReactDOM from "react-dom/client";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

const ExampleComponent = () => {
  const recorderControls = useAudioRecorder();
  const addAudioElement = (blob: any) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
  };

  return (
    <div>
      <AudioRecorder
        onRecordingComplete={addAudioElement}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }}
        downloadOnSavePress={true}
        downloadFileExtension="webm"
      />
      <button onClick={recorderControls.stopRecording}>Stop recording</button>
    </div>
  );
};

export default ExampleComponent;
