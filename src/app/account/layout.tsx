import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account Settings - Tool Vault',
  description: 'Manage your Tool Vault account settings, security preferences, and usage statistics.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
