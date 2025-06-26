
import { GlobalWorkerOptions, version } from 'pdfjs-dist';

// Use Vite's asset handling to get the correct URL for the worker file
GlobalWorkerOptions.workerSrc = new URL('../assets/pdf.worker.min.js', import.meta.url).toString();

export { GlobalWorkerOptions, version };
