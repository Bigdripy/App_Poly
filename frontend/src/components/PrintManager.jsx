import React, { useState } from "react";
import { Upload, Button, message, Space, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { Text } = Typography;

const PrintManager = () => {
  const [fileList, setFileList] = useState([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    fileList.forEach((file) => formData.append("pdfs", file.originFileObj));

    try {
      const response = await axios.post("http://localhost:3001/merge-pdf", formData);
      message.success("PDF fusionné !");
      setMergedPdfUrl(response.data.url);
    } catch (error) {
      message.error("Erreur de fusion !");
    }
  };

  return (
    <div>
      <h2>Gestion des impressions</h2>
      <Upload
        multiple
        beforeUpload={() => false}
        fileList={fileList}
        onChange={({ fileList }) => setFileList(fileList)}
      >
        <Button icon={<UploadOutlined />}>Sélectionner des PDFs</Button>
      </Upload>
      <Space style={{ marginTop: 16 }}>
        <Button type="primary" onClick={handleUpload} disabled={!fileList.length}>
          Fusionner les PDFs
        </Button>
        {mergedPdfUrl && (
          <Text type="success">
            <a href={mergedPdfUrl} target="_blank" rel="noopener noreferrer">
              Voir le PDF fusionné
            </a>
          </Text>
        )}
      </Space>
    </div>
  );
};

export default PrintManager;
