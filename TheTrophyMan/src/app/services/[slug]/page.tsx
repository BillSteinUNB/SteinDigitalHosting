// Service Detail Page - Simplified for Demo
// Redirects to main services page since individual service pages require Sanity

import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Service Details',
  description: 'Custom trophies and awards services in Oromocto, NB',
};

export default function ServicePage() {
  // Redirect to services page for demo
  redirect('/services');
}
