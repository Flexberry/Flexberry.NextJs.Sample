  'use client';

  import { Container } from '@mui/material';
  import FileComponent from '@/components/FileComponent/FileComponent';
  import { useRouter } from 'next/navigation';

  export default function FileComponentPage() {
    const router = useRouter();

    return (
      <Container>
        <FileComponent />
      </Container>
    );
  }
