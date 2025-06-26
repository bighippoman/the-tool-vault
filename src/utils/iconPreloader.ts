
// Critical icons that should be preloaded immediately
const CRITICAL_TOOL_IDS = [
  'json-formatter',
  'password-generator',
  'color-converter',
  'word-counter',
  'qr-generator',
  'base64',
  'url-encoder',
  'markdown-editor'
];

export const preloadCriticalIcons = () => {
  CRITICAL_TOOL_IDS.forEach(toolId => {
    const iconPath = getIconPath(toolId);
    if (iconPath.startsWith('/uploads/')) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = iconPath;
      document.head.appendChild(link);
    }
  });
};

export const getIconPath = (toolId: string): string => {
  const uploadedIconMap: Record<string, string> = {
    'ai-image-generator': '/uploads/34f1793c-8ecc-417b-a862-0f7a954e7183.png',
    'content-optimizer': '/uploads/9fb74039-7e87-4df9-b9e5-3a68d7f80a95.png',
    'social-media-caption-generator': '/uploads/9b80b4df-1067-4ae7-aafd-4717d5c667fa.png',
    'math-problem-solver': '/uploads/65b32f6a-3a23-4dd6-870f-f0997a380d86.png',
    'citation-generator': '/uploads/9f6ca4fc-3dae-4fbc-bed1-b74847179d8c.png',
    'study-planner': '/uploads/33b78671-a3c7-46ff-ba88-2094c5046433.png',
    'vocabulary-builder': '/uploads/4c6d90b1-28d5-4401-b841-7a54a3c81960.png',
    'formula-reference': '/uploads/f5c6dc8f-95c0-4491-9bfa-7bf56fd32ddf.png',
    'pdf-compressor': '/uploads/de30c45d-f328-457f-89e8-a8142071ccd5.png',
    'stock-analysis-calculator': '/uploads/b8f01a16-a642-48e6-a550-981a8db1ef78.png',
    'loan-calculator': '/uploads/00e06a74-6330-4834-9769-298bc035d4eb.png',
    'mortgage-affordability-calculator': '/uploads/c691f825-043e-4097-b1fd-82fe8e9af05d.png',
    'debt-payoff-calculator': '/uploads/8ece25d8-2638-4a34-befd-ea98fd258afc.png',
    'investment-calculator': '/uploads/0198d955-4903-4ee1-a6b9-def45ce33503.png',
    'budget-planner': '/uploads/f634f307-7a6f-444a-ab0d-1f57afb3d6a0.png',
    'emergency-fund-calculator': '/uploads/765a12ee-a965-45d5-be6a-67a889445a4b.png',
    'salary-negotiation-calculator': '/uploads/65e5348e-c472-4a5e-b168-79e163485568.png',
    'options-profit-calculator': '/uploads/0c444b7a-3653-4954-8138-bc9deacb0bb4.png',
    'retirement-calculator': '/uploads/6a48f9c5-44cf-4a79-baf6-4f8dd6a64e52.png',
    'terms-analyzer': '/uploads/22388370-9503-470e-8ff1-3bdcb90cd848.png',
    'image-compressor': '/uploads/8456c5ea-1c4a-40f7-89bb-164ed14475a2.png',
    'breakeven-calculator': '/uploads/4889f1ba-8b7d-40da-8395-5b3a0ee447ee.png',
    'profit-loss-calculator': '/uploads/2f130bd3-a334-413c-bf43-1e1064b08a15.png',
    'revenue-growth-calculator': '/uploads/3cb97e7e-fb8a-4397-b6bc-3bcf26ed4813.png',
    'savings-goal-calculator': '/uploads/542ed317-54c6-4a2d-a609-d15ae507cd6b.png',
    'financial-goal-tracker': '/uploads/d8178cbe-a89d-4662-9f32-be673e05adeb.png',
    'debt-reduction-planner': '/uploads/a405ddde-3210-46e9-846d-bb87d6e3d32a.png',
    'mortgage-calculator': '/uploads/eeef2059-55f0-4165-8744-54c844544562.png',
    'file-uploader': '/uploads/c8cf0bef-b950-4c09-a73e-2ef1d0fcc7a3.png',
    'image-resizer': '/uploads/34d58469-c97d-4a52-953a-b1934fa16d87.png',
    'email-subject-tester': '/uploads/66130455-a8af-47cf-b47f-ce48aca3f9c7.png',
    'social-media-post-generator': '/uploads/d8dac622-0f33-454e-ba1e-84078d2dc3f9.png',
    'meta-tag-generator': '/uploads/de5d2e48-fd1e-4f50-a16c-31eb14b12ad9.png',
    'landing-page-analyzer': '/uploads/d6293be7-a850-499d-987e-fe6f85a4f2a1.png',
    'email-signature-generator': '/uploads/cfc2900c-545c-42b6-9170-28fb42f686f0.png',
    'case-converter': '/uploads/b1c0fbb4-5f5b-4ed4-8c57-0f3556b1550d.png',
    'cron-generator': '/uploads/191944e7-ee0d-4e2c-a192-e0cfd17e84b9.png',
    'jwt-decoder': '/uploads/c481f3f9-bda7-4bd9-92d5-48bc22eedb3b.png',
    'sql-formatter': '/uploads/88972735-4e42-469f-a73a-618f8a9b5174.png',
    'uuid-generator': '/uploads/8bda236c-7d54-46ec-94d6-3ab735172908.png',
    'timestamp-converter': '/uploads/c72eb504-dcfa-4f1d-aaca-1632fa60cc69.png',
    'json-formatter': '/uploads/bfc4b95c-fbe9-4bf9-a146-5ec50760c9a5.png',
    'regex-tester': '/uploads/fe0829bb-f5cb-42ba-b57b-8f95dfb76b18.png',
    'lorem-generator': '/uploads/c308ff8e-e38f-4b65-9299-ffa485dadb43.png',
    'diff-checker': '/uploads/c855400f-01c3-4839-85ec-63c606521c8f.png',
    'hash-generator': '/uploads/25dba91f-7acf-4e6e-aba4-66f70f964f12.png',
    'password-generator': '/uploads/f04209b3-3969-4742-8aaf-5156e2829d1a.png',
    'html-entity': '/uploads/a3c0f337-045d-46dc-a78a-4369ac9246e6.png',
    'qr-generator': '/uploads/c0b40195-a084-4338-88d8-c216de0ce318.png',
    'unit-converter': '/uploads/6c35762c-c616-46e5-988e-a1fef160a321.png',
    'base64': '/uploads/372d6c8c-df61-4c11-9c15-bc5b7ac219ce.png',
    'url-encoder': '/uploads/b65a1486-8193-41f6-b59b-0406b043a117.png',
    'markdown-editor': '/uploads/db2f082d-849d-4062-bbd0-1d20de902e40.png',
    'css-minifier': '/uploads/22369bb2-50a9-46c5-857f-e32a80f35f66.png',
    'js-minifier': '/uploads/22369bb2-50a9-46c5-857f-e32a80f35f66.png',
    'word-counter': '/uploads/c4ce4d9a-13e4-4631-bfc5-64e48541394c.png',
    'color-converter': '/uploads/0715ece4-4379-49e0-b181-8242d23c45d6.png',
    'gradient-generator': '/uploads/0715ece4-4379-49e0-b181-8242d23c45d6.png',
    'brand-color-palette-generator': '/uploads/0715ece4-4379-49e0-b181-8242d23c45d6.png',
    'favicon-generator': '/uploads/2e1e1d5c-0d54-49d8-9178-6ca7c09962ac.png',
    'utm-builder': '/uploads/ea393038-1e05-44a6-b02d-4cab17970f09.png'
  };

  return uploadedIconMap[toolId] || `/tool-icons/${toolId}-icon.png`;
};
