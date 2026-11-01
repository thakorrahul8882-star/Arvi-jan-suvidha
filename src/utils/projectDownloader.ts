import JSZip from 'jszip';
import sourceFiles from './sourceFiles.json';

export const downloadProjectZip = async () => {
  const zip = new JSZip();

  // Add all files into the zip
  for (const [filePath, content] of Object.entries(sourceFiles)) {
    zip.file(filePath, content as string);
  }

  // Generate zip as a Blob
  const blob = await zip.generateAsync({ type: 'blob' });

  // Create download link
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Jan_Seva_CSC_Portal_Code_${new Date().toISOString().split('T')[0]}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
