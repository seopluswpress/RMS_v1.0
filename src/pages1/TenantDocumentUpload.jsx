import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default function TenantDocumentUpload({ formData, onBack, onComplete, setError }) {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    setUploading(true);
    setError(null);
    // TODO: implement actual upload logic (API call)
    setTimeout(() => {
      setUploading(false);
      message.success('Documents uploaded successfully');
      onComplete();
    }, 1200);
  };

  return (
    <div>
      <Upload
        fileList={fileList}
        onChange={({ fileList }) => setFileList(fileList)}
        beforeUpload={() => false}
        multiple
        accept=".pdf,.jpg,.jpeg,.png"
      >
        <Button icon={<UploadOutlined />}>Select Documents</Button>
      </Upload>
      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <Button onClick={onBack}>Back</Button>
        <Button type="primary" onClick={handleUpload} loading={uploading} disabled={fileList.length === 0}>
          Submit Application
        </Button>
      </div>
    </div>
  );
}
