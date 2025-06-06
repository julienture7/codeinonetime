
import MainLayout from '../../components/layouts/main-layout'; // Corrected relative path
import React from 'react';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}