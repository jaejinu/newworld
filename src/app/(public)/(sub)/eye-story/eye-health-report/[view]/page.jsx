import ViewDetail from '@/components/board/view/ViewDetail';

export default async function EyeHealthReportView({ params }) {
  const { view } = await params;
  return <ViewDetail categorySlug="eye-health-report" viewSlug={decodeURIComponent(view)} />;
}
