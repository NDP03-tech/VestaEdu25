import React from "react";
import { Card, Typography, Button } from "antd";

const { Title, Paragraph } = Typography;

const QuizStartScreen = ({ instruction, onStart }) => {
  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: "16px" }}>
      <Card
        bordered
        style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
      >
        <Typography style={{ textAlign: "center" }}>
          <Title level={3}> Instructions</Title>
          <Paragraph>
            <div
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: instruction }}
            />
          </Paragraph>
        </Typography>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Button
            type="primary"
            size="large"
            onClick={onStart}
            style={{ borderRadius: 8 }}
          >
             Start Quiz
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default QuizStartScreen;
