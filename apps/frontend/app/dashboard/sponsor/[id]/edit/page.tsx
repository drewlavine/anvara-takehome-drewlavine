import { EditCampaign } from './components/edit-campaign';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCampaignPage({ params }: Props) {
  const { id } = await params;

  return <EditCampaign id={id} />;
}
