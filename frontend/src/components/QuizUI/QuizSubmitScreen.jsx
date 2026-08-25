import React from "react";
import { Card, Typography, Result } from "antd";

const { Title, Paragraph, Text } = Typography;

const QuizSubmitScreen = ({ score, message }) => {
  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: "16px" }}>
      <Card
        bordered
        style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
      >
        <Result
          status="success"
          title={<Title level={3}> Quiz Complete!</Title>}
          subTitle={
            <div style={{ marginTop: 16 }}>
              <Paragraph>
                <div dangerouslySetInnerHTML={{ __html: message }} />
              </Paragraph>
              {score !== null && (
                <Text strong style={{ fontSize: "1.25rem", color: "#52c41a" }}>
                   Your Score: {score}%
                </Text>
              )}
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default QuizSubmitScreen;
