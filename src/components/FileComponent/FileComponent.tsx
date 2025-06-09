import React, { useRef, useState } from 'react';
import { Box, Typography, IconButton, Button, styled } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';


const DropZone = styled(Box)(({ theme }) => ({
  border: `1px dashed ${theme.palette.primary.main}`,
  borderRadius: 8,
  padding: theme.spacing(2),
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: theme.palette.background.paper,
  transition: 'background-color 0.3s ease',
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
    <Box>
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
          <Typography variant="body1" color="textSecondary">
            Перетащите файл или кликните для выбора
          </Typography>
        ) : (
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
              {file.name}
            </Typography>
            <Box>
              <IconButton>
                <VisibilityIcon />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
                title="Скачать"
              >
                <DownloadIcon />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                title="Очистить"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
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
