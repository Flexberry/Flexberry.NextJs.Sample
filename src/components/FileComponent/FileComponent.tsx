import React, { useRef, useState } from 'react';
import { Box, Typography, IconButton, styled } from '@mui/material';
import Icon from '@mui/material/Icon';

const DropZone = styled(Box)(({ theme }) => ({
  border: `1px dashed ${theme.palette.primary.main}`,
  borderRadius: 8,
  padding: theme.spacing(1),
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: theme.palette.background.paper,
  transition: 'background-color 0.3s ease',
  width: '458.67px',
  height: '34px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontFamily: 'Lato, sans-serif',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const MAX_FILE_SIZE = 104857600;

const FileComponent: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const selectedFile = files[0];

    if (selectedFile.size > MAX_FILE_SIZE) {
      alert('Максимальный размер файла — 100 МБ');
      return;
    }
    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDownload = () => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box fontFamily="Lato, sans-serif">
      <DropZone
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        sx={{ borderColor: dragOver ? 'primary.dark' : 'primary.main' }}
      >
        {!file ? (
          <Typography variant="body2" color="textSecondary" sx={{ fontFamily: 'Lato, sans-serif' }}>
            Перетащите файл или кликните для выбора
          </Typography>
        ) : (
          <>
            <Typography
              variant="body2"
              sx={{ wordBreak: 'break-all', fontFamily: 'Lato, sans-serif' }}
            >
              {file.name}
            </Typography>
            <Box display="flex" alignItems="center">
              <IconButton title="Просмотр" size="small">
                <Icon className="icon-eye" sx={{ fontSize: 24 }} />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
                title="Скачать"
                size="small"
              >
                <Icon className="icon-download" />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                title="Очистить"
                size="small"
              >
                <Icon className="icon-close" />
              </IconButton>
            </Box>
          </>
        )}
      </DropZone>
      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={(e) => handleFileSelect(e.target.files)}
      />
    </Box>
  );
};

export default FileComponent;
