import React, { useState, useEffect, useRef } from "react";
import MicRecorder from "mic-recorder-to-mp3";
import {
  Button,
  Upload,
  Typography,
  Space,
  Tooltip,
  message,
  Card,
  Progress,
  Tag,
} from "antd";
import {
  UploadOutlined,
  AudioOutlined,
  StopOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SoundOutlined,
} from "@ant-design/icons";

const { Paragraph, Text } = Typography;
const recorder = new MicRecorder({ bitRate: 128 });

const SpeakingRenderer = ({
  question,
  initialAnswer = null,
  onAnswerChange,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaBlob, setMediaBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [uploading, setUploading] = useState(false);
  const mediaRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (initialAnswer) {
      if (typeof initialAnswer === "string") {
        setMediaUrl(initialAnswer);
        setMediaBlob(null);
      } else if (initialAnswer instanceof File) {
        setMediaUrl(URL.createObjectURL(initialAnswer));
        setMediaBlob(initialAnswer);
      }
    }
  }, [initialAnswer]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setRecordingTime(0);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const uploadMediaToServer = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload-media", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      setUploading(false);
      return data.fileUrl;
    } catch (error) {
      setUploading(false);
      message.error("Failed to upload file to server.");
      console.error(error);
      return null;
    }
  };

  const startRecording = () => {
    recorder
      .start()
      .then(() => {
        setIsRecording(true);
        setRecordingTime(0);
        message.success("🎤 Recording started");
      })
      .catch((err) => {
        console.error(err);
        message.error(
          "Failed to start recording. Please check microphone permissions."
        );
      });
  };

  const stopRecording = () => {
    recorder
      .stop()
      .getMp3()
      .then(async ([buffer, blob]) => {
        const file = new File(buffer, "recording.mp3", {
          type: blob.type,
          lastModified: Date.now(),
        });

        const uploadedUrl = await uploadMediaToServer(file);
        if (uploadedUrl) {
          setMediaUrl(uploadedUrl);
          setMediaBlob(null);
          if (onAnswerChange) {
            onAnswerChange(question.id, uploadedUrl);
          }
          message.success("✅ Recording uploaded successfully");
        }
        setIsRecording(false);
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to stop recording");
        setIsRecording(false);
      });
  };

  // ✅ FIX: Sửa lỗi upload
  const handleUpload = async (file) => {
    console.log("📤 Uploading file:", file);

    if (!file) {
      message.error("No file selected");
      return;
    }

    const uploadedUrl = await uploadMediaToServer(file);
    if (uploadedUrl) {
      setMediaUrl(uploadedUrl);
      setMediaBlob(null);
      if (onAnswerChange) {
        onAnswerChange(question.id, uploadedUrl);
      }
      message.success("📁 File uploaded successfully");
    }
  };

  const handleDeleteMedia = () => {
    setMediaUrl(null);
    setMediaBlob(null);
    setCurrentTime(0);
    setDuration(0);
    if (onAnswerChange) {
      onAnswerChange(question.id, null);
    }
    message.info("Media removed");
  };

  const togglePlayPause = () => {
    if (mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seekBackward = () => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = Math.max(
        0,
        mediaRef.current.currentTime - 10
      );
    }
  };

  const seekForward = () => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = Math.min(
        mediaRef.current.duration,
        mediaRef.current.currentTime + 10
      );
    }
  };

  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime);
      setDuration(mediaRef.current.duration);
    }
  };

  const handleMediaEnded = () => {
    setIsPlaying(false);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isVideo = (url) => {
    if (!url) return false;
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi"];
    const urlLower = url.toLowerCase();
    return videoExtensions.some((ext) => urlLower.includes(ext));
  };

  // ✅ Debug: Check video loading
  const handleVideoError = (e) => {
    console.error("❌ Video load error:", e);
    console.error("Video src:", mediaUrl);
    message.error("Failed to load video. Check console for details.");
  };

  const handleVideoLoad = () => {
    console.log("✅ Video loaded successfully:", mediaUrl);
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

          .speaking-container {
            font-family: 'Inter', sans-serif;
          }

          .question-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 24px;
            color: white;
            box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
          }

          .question-content {
            font-size: 16px;
            line-height: 1.8;
          }

          .question-content * {
            color: white !important;
          }

          .control-card {
            background: white;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            margin-bottom: 24px;
          }

          .recording-indicator {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
            border-radius: 12px;
            color: white;
            animation: pulse 2s ease-in-out infinite;
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }

          .recording-dot {
            width: 12px;
            height: 12px;
            background: white;
            border-radius: 50%;
            animation: blink 1s ease-in-out infinite;
          }

          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }

          .media-player {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          }

          .custom-audio-controls {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-top: 16px;
          }

          .play-button {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          }

          .play-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
          }

          .progress-bar {
            flex: 1;
            height: 8px;
            background: rgba(0, 0, 0, 0.1);
            border-radius: 4px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
          }

          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            border-radius: 4px;
            transition: width 0.1s ease;
          }

          .time-display {
            font-size: 14px;
            font-weight: 600;
            color: #4a5568;
            min-width: 80px;
            text-align: center;
          }
        `}
      </style>

      <div className="speaking-container">
        {/* Question Card */}
        <div className="question-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <SoundOutlined style={{ fontSize: "24px" }} />
            <Text strong style={{ fontSize: "18px", color: "white" }}>
              Speaking Question
            </Text>
          </div>
          <div
            className="question-content"
            dangerouslySetInnerHTML={{ __html: question.question_text }}
          />
        </div>

        {/* Control Card */}
        <div className="control-card">
          {isRecording && (
            <div
              className="recording-indicator"
              style={{ marginBottom: "16px" }}
            >
              <div className="recording-dot"></div>
              <Text strong style={{ fontSize: "16px", color: "white" }}>
                Recording... {formatTime(recordingTime)}
              </Text>
            </div>
          )}

          <Space size="middle" wrap>
            {!isRecording ? (
              <Button
                type="primary"
                icon={<AudioOutlined />}
                onClick={startRecording}
                size="large"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  borderRadius: "10px",
                  height: "48px",
                  paddingLeft: "24px",
                  paddingRight: "24px",
                  fontWeight: 600,
                }}
              >
                Start Recording
              </Button>
            ) : (
              <Button
                danger
                icon={<StopOutlined />}
                onClick={stopRecording}
                size="large"
                style={{
                  borderRadius: "10px",
                  height: "48px",
                  paddingLeft: "24px",
                  paddingRight: "24px",
                  fontWeight: 600,
                }}
              >
                Stop Recording
              </Button>
            )}

            <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                handleUpload(file);
                return false; // ✅ FIX: Prevent auto upload
              }}
              accept="audio/*,video/*"
              disabled={uploading || isRecording}
            >
              <Button
                icon={<UploadOutlined />}
                size="large"
                loading={uploading}
                disabled={isRecording}
                style={{
                  borderRadius: "10px",
                  height: "48px",
                  paddingLeft: "24px",
                  paddingRight: "24px",
                  fontWeight: 600,
                }}
              >
                {uploading ? "Uploading..." : "Upload File"}
              </Button>
            </Upload>

            {mediaUrl && (
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleDeleteMedia}
                size="large"
                style={{
                  borderRadius: "10px",
                  height: "48px",
                  paddingLeft: "24px",
                  paddingRight: "24px",
                  fontWeight: 600,
                }}
              >
                Remove
              </Button>
            )}
          </Space>

          {mediaUrl && (
            <div style={{ marginTop: "16px" }}>
              <Tag
                color="success"
                style={{ fontSize: "13px", padding: "4px 12px" }}
              >
                ✅ Media Ready
              </Tag>
            </div>
          )}
        </div>

        {/* Media Player */}
        {mediaUrl && (
          <div className="media-player">
            {isVideo(mediaUrl) ? (
              <div>
                <video
                  ref={mediaRef}
                  src={mediaUrl}
                  style={{
                    width: "100%",
                    maxHeight: "480px",
                    borderRadius: "12px",
                    backgroundColor: "#000",
                  }}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleMediaEnded}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onError={handleVideoError}
                  onLoadedData={handleVideoLoad}
                  preload="metadata"
                  playsInline
                >
                  <source src={mediaUrl} type="video/mp4" />
                  <source src={mediaUrl} type="video/webm" />
                  <source src={mediaUrl} type="video/ogg" />
                  Your browser does not support the video tag.
                </video>

                {/* Custom Video Controls */}
                <div className="custom-audio-controls">
                  <button className="play-button" onClick={togglePlayPause}>
                    {isPlaying ? (
                      <PauseCircleOutlined style={{ fontSize: "28px" }} />
                    ) : (
                      <PlayCircleOutlined style={{ fontSize: "28px" }} />
                    )}
                  </button>

                  <div
                    className="progress-bar"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const percent = (e.clientX - rect.left) / rect.width;
                      if (mediaRef.current) {
                        mediaRef.current.currentTime = percent * duration;
                      }
                    }}
                  >
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(currentTime / duration) * 100 || 0}%`,
                      }}
                    />
                  </div>

                  <div className="time-display">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>

                {/* Video Info */}
                <div style={{ marginTop: "12px" }}>
                  <Tag color="blue" icon={<PlayCircleOutlined />}>
                    Video File
                  </Tag>
                </div>
              </div>
            ) : (
              <>
                <audio
                  ref={mediaRef}
                  src={mediaUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleMediaEnded}
                  style={{ display: "none" }}
                />

                {/* Custom Audio Controls */}
                <div className="custom-audio-controls">
                  <button className="play-button" onClick={togglePlayPause}>
                    {isPlaying ? (
                      <PauseCircleOutlined style={{ fontSize: "28px" }} />
                    ) : (
                      <PlayCircleOutlined style={{ fontSize: "28px" }} />
                    )}
                  </button>

                  <div
                    className="progress-bar"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const percent = (e.clientX - rect.left) / rect.width;
                      if (mediaRef.current) {
                        mediaRef.current.currentTime = percent * duration;
                      }
                    }}
                  >
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(currentTime / duration) * 100 || 0}%`,
                      }}
                    />
                  </div>

                  <div className="time-display">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>
              </>
            )}

            {/* Seek Controls */}
            <Space style={{ marginTop: "16px" }} size="middle">
              <Tooltip title="Rewind 10 seconds">
                <Button
                  icon={<StepBackwardOutlined />}
                  onClick={seekBackward}
                  style={{ borderRadius: "8px" }}
                >
                  -10s
                </Button>
              </Tooltip>
              <Tooltip title="Forward 10 seconds">
                <Button
                  icon={<StepForwardOutlined />}
                  onClick={seekForward}
                  style={{ borderRadius: "8px" }}
                >
                  +10s
                </Button>
              </Tooltip>
            </Space>
          </div>
        )}
      </div>
    </>
  );
};

export default SpeakingRenderer;
