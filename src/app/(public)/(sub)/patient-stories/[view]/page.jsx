import ViewDetail from '@/components/board/view/ViewDetail';

export default async function PatientStoriesView({ params }) {
  const { view } = await params;
  return <ViewDetail categorySlug="patient-stories" viewSlug={decodeURIComponent(view)} />;
}
