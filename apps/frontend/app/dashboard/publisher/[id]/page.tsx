import { EditAdSlot } from './components/edit-ad-slot';
interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAdSlotPage({ params }: Props) {
  const { id } = await params;

  return <EditAdSlot id={id} />;
}
